
import { Router } from "express";

import { requireAuth } from "../../middlewares/auth.middleware.js";
import { uploadSingleFile } from "../../middlewares/upload.middleware.js";
import { listFilesController, uploadFileController } from "./file.controller.js";

const fileRouter = Router();

// List uploaded files
fileRouter.get(
  "/",
  requireAuth,
  listFilesController
);

fileRouter.post(
  "/upload",
  requireAuth,
  uploadSingleFile,
  uploadFileController
);

export default fileRouter;
