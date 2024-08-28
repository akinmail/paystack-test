import fileProcessingQueue from './queue';
import { processData } from './../controllers/data-injest';

fileProcessingQueue.process(async (job) => {
    const { fileName } = job.data;

    console.log(`Processing file: ${fileName}`);

    try {
        await processData(fileName);
        console.log(`File processed successfully: ${fileName}`);
    } catch (error) {
        console.error(`Error processing file ${fileName}:`, error);
        throw error; 
    }
});

console.log('Worker is running and listening for file processing jobs...');
