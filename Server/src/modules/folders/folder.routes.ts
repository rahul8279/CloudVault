
import { Router } from "express";
import { requireAuth } from "../../middlewares/auth.middleware.js";

import {
  createFolderController,
  listFoldersController,
  getFolderByIdController,
  renameFolderController,
  moveFolderController,
  deleteFolderController,
} from "./folder.controller.js";

const folderRouter = Router();

// Create folder
folderRouter.post("/", requireAuth, createFolderController);

// List root or nested folders
folderRouter.get("/", requireAuth, listFoldersController);

// Get a specific folder
folderRouter.get(
  "/:folderId",
  requireAuth,
  getFolderByIdController
);

folderRouter.patch(
  "/:folderId",
  requireAuth,
  renameFolderController
);

folderRouter.patch(
  "/:folderId/move",
  requireAuth,
  moveFolderController
);
folderRouter.delete(
  "/:folderId",
  requireAuth,
  deleteFolderController
);

export default folderRouter;
