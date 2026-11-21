
import { Schema, model, Types } from "mongoose";

// 1. TypeScript interface
export interface IFolder {
  name: string;
  ownerId: Types.ObjectId;
  parentId: Types.ObjectId | null;
  createdAt: Date;
  updatedAt: Date;
}

// 2. Mongoose schema
const folderSchema = new Schema<IFolder>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 100,
    },

    ownerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    parentId: {
      type: Schema.Types.ObjectId,
      ref: "Folder",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// 3. Indexes for efficient folder queries
folderSchema.index(
  {
    ownerId: 1,
    parentId: 1,
    name: 1,
  },
  {
    unique: true,
  }
);

// 4. Create and export model
const Folder = model<IFolder>("Folder", folderSchema);

export default Folder;
