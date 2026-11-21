
import { Schema, model, Types } from "mongoose";

// 1. TypeScript interface
export interface IFile {
  name: string;
  ownerId: Types.ObjectId;
  folderId: Types.ObjectId | null;
  storageKey: string;
  mimeType: string;
  sizeBytes: number;
  status: "pending" | "ready" | "failed";
  createdAt: Date;
  updatedAt: Date;
}

// 2. Mongoose schema
const fileSchema = new Schema<IFile>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 255,
    },

    ownerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    folderId: {
      type: Schema.Types.ObjectId,
      ref: "Folder",
      default: null,
    },

    storageKey: {
      type: String,
      required: true,
      unique: true,
    },

    mimeType: {
      type: String,
      required: true,
    },

    sizeBytes: {
      type: Number,
      required: true,
      min: 0,
    },

    status: {
      type: String,
      enum: ["pending", "ready", "failed"],
      default: "pending",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// 3. Index for listing files within folders
fileSchema.index({
  ownerId: 1,
  folderId: 1,
});

// 4. Create and export model
const File = model<IFile>("File", fileSchema);

export default File;
