import Queue from 'bull';  
import Redis from 'ioredis';

const redisConfig = {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
    username: process.env.REDIS_USERNAME || '', // Default to empty string if not set
    password: process.env.REDIS_PASSWORD || '', 
};

const fileProcessingQueue = new Queue('file-processing', { redis: redisConfig });

export default fileProcessingQueue;
