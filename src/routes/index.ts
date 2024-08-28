import { Router } from "express";
import { healthCheck } from "../controllers";
import { completeUpload, startUpload, uploadPart } from "../controllers/data-injest";

export const indexRouter = Router();

indexRouter.get("/health", healthCheck);

indexRouter.get("/start-upload", startUpload);
indexRouter.get("/upload-part", uploadPart);
indexRouter.get("/complete-upload", completeUpload);
