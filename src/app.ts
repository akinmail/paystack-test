import express from "express";

const cors = require("cors");
const AWS = require("aws-sdk");
const dotenv = require("dotenv");
const multer = require("multer");


import { indexRouter } from "./routes";


import { PrismaClient } from '@prisma/client'
export const prisma = new PrismaClient()

const multerUpload = multer();
dotenv.config();

export const app = express();

app.use(cors());

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
  region: process.env.AWS_REGION,
});

export const s3 = new AWS.S3();
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.use("/", indexRouter);
