import type { ErrorRequestHandler } from "express";
import { AppError } from "../utils/app-error.js";
import { MulterError } from "multer";

export const errorHandler: ErrorRequestHandler = (
  err,
  req,
  res,
  next
) => {
  if (res.headersSent) {
    return next(err);
  }

  if (err instanceof MulterError) {
  const statusCode = err.code === "LIMIT_FILE_SIZE" ? 413 : 400;

  res.status(statusCode).json({
    success: false,
    message:
      err.code === "LIMIT_FILE_SIZE"
        ? "File exceeds the 5 MB upload limit"
        : "Invalid file upload",
  });
  return;
}

  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
    return;
  }

  console.error("Unexpected application error:", err);

  res.status(500).json({
    success: false,
    message: "Internal server error",
  });
};