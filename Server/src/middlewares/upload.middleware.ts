
import multer from "multer";

// Maximum size: 5 MB
const MAX_FILE_SIZE = 5 * 1024 * 1024;

export const uploadSingleFile = multer({
  storage: multer.memoryStorage(),

  limits: {
    fileSize: MAX_FILE_SIZE,
    files: 1,
    fields: 1,
    parts: 2,
  },
}).single("file");
