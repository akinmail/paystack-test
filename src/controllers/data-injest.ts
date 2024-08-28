import { Request, Response } from "express";
import { s3, prisma } from "../app";
import csv from "csv-parser";
import { Readable } from "stream";
import fileProcessingQueue from "../queues/queue";
import { BinDataFromCSV } from "../types/types";

const BATCH_SIZE = Number(process.env.BATCH_SIZE) || 1000;

export function getAWSObject(fileName: string): Readable {
  const params = {
    Bucket: process.env.S3_BUCKET,
    Key: fileName,
  };
  return s3.getObject(params).createReadStream();
}


export const startUpload = async (req: Request, res: Response): Promise<void> => {
    const { fileName, fileType } = req.body;
  
    const params = {
      Bucket: process.env.S3_BUCKET,
      Key: fileName,
      ContentType: fileType,
    };
  
    try {
      const upload = await s3.createMultipartUpload(params).promise();
      console.log({ upload });
      res.send({ uploadId: upload.UploadId });
    } catch (error) {
      res.send(error);
    }
};

export const uploadPart = async (req: Request, res: Response): Promise<void> => {
    const { fileName, partNumber, uploadId, fileChunk } = req.body;
  
    const params = {
      Bucket: process.env.S3_BUCKET,
      Key: fileName,
      PartNumber: partNumber,
      UploadId: uploadId,
      Body: Buffer.from(fileChunk, "base64"),
    };
  
    try {
      const uploadParts = await s3.uploadPart(params).promise();
      console.log({ uploadParts });
      res.send({ ETag: uploadParts.ETag})
    } catch (error) {
      res.send(error);
    }
};

export const completeUpload = async (req: Request, res: Response): Promise<void> => {
    const { fileName, uploadId, parts } = req.body;
  
    const params = {
      Bucket: process.env.S3_BUCKET,
      Key: fileName,
      UploadId: uploadId,
      MultipartUpload: {
        Parts: parts,
      },
    };
  
    try {
      const complete = await s3.completeMultipartUpload(params).promise();
      console.log({ complete });

      // queue a job to process the file
      await fileProcessingQueue.add({ fileName });

      res.send({ fileUrl: complete.Location });
    } catch (error) {
      res.send(error);
    }
};

export async function processData(fileName: string): Promise<void> {

  try {
      // Fetch file from S3
      const s3Stream = getAWSObject(fileName);

      await new Promise<void>((resolve, reject) => {
          const results: BinDataFromCSV[] = [];

          // Read the CSV data from the S3 stream
          s3Stream
              .pipe(csv())
              .on("data", async (data: BinDataFromCSV) => {
                  results.push(data);

                  // If the batch size is reached, process the batch
                  if (results.length >= BATCH_SIZE) {
                      // Pause the stream
                      s3Stream.pause();

                      const batch = results.splice(0, BATCH_SIZE);

                      try {
                          await processBatch(batch);
                          // Resume the stream after processing the batch
                          s3Stream.resume();
                      } catch (error) {
                          console.error("Error processing batch:", error);
                          reject(error);
                      }
                  }
              })
              .on("end", async () => {
                  // Process any remaining data in the batch
                  if (results.length > 0) {
                      try {
                          await processBatch(results);
                      } catch (error) {
                          console.error("Error processing final batch:", error);
                          reject(error);
                      }
                  }
                  resolve();
              })
              .on("error", (error: any) => {
                  console.error("Error reading CSV file from S3:", error);
                  reject(error);
              });
      });
  } catch (error) {
      console.error("Error fetching file from S3:", error);
      throw error;
  }
}

export async function processBatch(batch: BinDataFromCSV[]): Promise<void> {
  const upserts = batch.map(row => {
      const {
          bin,
          scheme,
          brand,
          type,
          country,
          bank_name: bankName,
          bank_url: bankUrl,
          bank_phone: bankPhone,
          bank_city: bankCity,
      } = row;

      return prisma.bin.upsert({
          where: { bin },
          update: {
              scheme,
              brand,
              type,
              country,
              bankName,
              bankUrl,
              bankPhone,
              bankCity,
              updatedAt: new Date(),
          },
          create: {
              bin,
              scheme,
              brand,
              type,
              country,
              bankName,
              bankUrl,
              bankPhone,
              bankCity,
          },
      });
  });

  // Perform all upserts in parallel using Prisma's transaction
  try {
      await prisma.$transaction(upserts);
      console.log(`Processed batch of ${upserts.length} records.`);
  } catch (error) {
      console.error("Error processing batch:", error);
      throw error;
  }
}
