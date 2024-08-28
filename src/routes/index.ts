import { Router } from "express";
import { healthCheck } from "../controllers";
import { completeUpload, startUpload, uploadPart } from "../controllers/data-injest";

export const indexRouter = Router();

indexRouter.get("/health", healthCheck);

indexRouter.post("/start-upload", function(req, res){
    startUpload
  });
indexRouter.post("/upload-part", function(req, res){
    uploadPart
  });
indexRouter.post("/complete-upload", function(req, res){
    completeUpload
  });

export default indexRouter;
