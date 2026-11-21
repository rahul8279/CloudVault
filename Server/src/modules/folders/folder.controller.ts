
import type { RequestHandler } from "express";
import { createFolderSchema, listFoldersQuerySchema, moveFolderSchema, renameFolderSchema } from "./folder.validation.js";
import { createFolder, deleteFolder, getFolderById, listFolders, moveFolder, renameFolder } from "./folder.service.js";
import { AppError } from "../../utils/app-error.js";

export const createFolderController: RequestHandler = async (
  req,
  res
) => {
  // 1. Get authenticated user ID
  const userId = req.authUserId;

  if (!userId) {
    throw new AppError(401, "Authentication required");
  }

  // 2. Validate incoming data
  const result = createFolderSchema.safeParse(req.body);

  if (!result.success) {
    res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: result.error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      })),
    });
    return;
  }

  // 3. Call folder service
  const folder = await createFolder(userId, result.data);

  // 4. Send response
  res.status(201).json({
    success: true,
    message: "Folder created successfully",
    data: folder,
  });
};


export const listFoldersController: RequestHandler = async (
  req,
  res
) => {
  // 1. Get authenticated user ID
  const userId = req.authUserId;

  if (!userId) {
    throw new AppError(401, "Authentication required");
  }

  // 2. Validate query parameters
  const result = listFoldersQuerySchema.safeParse(
    req.query
  );

  if (!result.success) {
    res.status(400).json({
      success: false,
      message: "Invalid query parameters",
      errors: result.error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      })),
    });
    return;
  }

  // 3. Call service
  const folders = await listFolders(
    userId,
    result.data
  );

  // 4. Return folders
  res.setHeader("Cache-Control", "no-store");

  res.status(200).json({
    success: true,
    message: "Folders fetched successfully",
    data: folders,
  });
};


export const getFolderByIdController: RequestHandler<{
  folderId: string;
}> = async (req, res) => {
  const userId = req.authUserId;

  if (!userId) {
    throw new AppError(401, "Authentication required");
  }

  const { folderId } = req.params;

  const folder = await getFolderById(userId, folderId);

  res.setHeader("Cache-Control", "no-store");

  res.status(200).json({
    success: true,
    message: "Folder fetched successfully",
    data: folder,
  });
};


export const renameFolderController: RequestHandler<{
  folderId: string;
}> = async (req, res) => {
  // 1. Get authenticated user
  const userId = req.authUserId;

  if (!userId) {
    throw new AppError(401, "Authentication required");
  }

  // 2. Get folder ID from URL
  const { folderId } = req.params;

  // 3. Validate request body
  const result = renameFolderSchema.safeParse(req.body);

  if (!result.success) {
    res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: result.error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      })),
    });
    return;
  }

  // 4. Call service
  const folder = await renameFolder(
    userId,
    folderId,
    result.data
  );

  // 5. Return updated folder
  res.status(200).json({
    success: true,
    message: "Folder renamed successfully",
    data: folder,
  });
};


export const moveFolderController: RequestHandler<{
  folderId: string;
}> = async (req, res) => {
  // 1. Get authenticated user ID
  const userId = req.authUserId;

  if (!userId) {
    throw new AppError(401, "Authentication required");
  }

  // 2. Get folder ID from URL
  const { folderId } = req.params;

  // 3. Validate destination
  const result = moveFolderSchema.safeParse(req.body);

  if (!result.success) {
    res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: result.error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      })),
    });
    return;
  }

  // 4. Call service
  const folder = await moveFolder(
    userId,
    folderId,
    result.data
  );

  // 5. Return updated folder
  res.status(200).json({
    success: true,
    message: "Folder moved successfully",
    data: folder,
  });
};


export const deleteFolderController: RequestHandler<{
  folderId: string;
}> = async (req, res) => {
  // 1. Get authenticated user ID
  const userId = req.authUserId;

  if (!userId) {
    throw new AppError(401, "Authentication required");
  }

  // 2. Get folder ID from URL
  const { folderId } = req.params;

  // 3. Call delete folder service
  await deleteFolder(userId, folderId);

  // 4. Return success without response body
  res.status(204).send();
};
