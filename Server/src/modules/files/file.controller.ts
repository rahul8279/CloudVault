
import type { RequestHandler } from "express";
import { z } from "zod";
import { listFiles, uploadFile } from "./file.service.js";
import { AppError } from "../../utils/app-error.js";
import { listFilesQuerySchema } from "./file.validation.js";

const uploadFileBodySchema = z.object({
  folderId: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid folder ID")
    .optional(),
});

export const uploadFileController: RequestHandler = async (
  req,
  res
) => {
  // 1. Get authenticated user
  const userId = req.authUserId;

  if (!userId) {
    throw new AppError(401, "Authentication required");
  }

  // 2. Check if file is provided
  const file = req.file;

  if (!file) {
    throw new AppError(400, "File is required");
  }

  // 3. Validate multipart form fields
  const result = uploadFileBodySchema.safeParse(req.body);

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

  // 4. Call file upload service
  const uploadedFile = await uploadFile({
    userId,
    file,
    folderId: result.data.folderId,
  });

  // 5. Return response
  res.setHeader("Cache-Control", "no-store");

  res.status(201).json({
    success: true,
    message: "File uploaded successfully",
    data: uploadedFile,
  });
};

export const listFilesController: RequestHandler = async (
  req,
  res
) => {
  // 1. Read authenticated user
  const userId = req.authUserId;

  if (!userId) {
    throw new AppError(401, "Authentication required");
  }

  // 2. Validate query parameters
  const parsed = listFilesQuerySchema.safeParse(
    req.query
  );

  if (!parsed.success) {
    res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: parsed.error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      })),
    });
    return;
  }

  // 3. Call service
  const result = await listFiles(
    userId,
    parsed.data
  );

  // 4. Send response
  res.setHeader("Cache-Control", "no-store");

  res.status(200).json({
    success: true,
    message: "Files retrieved successfully",
    data: result,
  });
};