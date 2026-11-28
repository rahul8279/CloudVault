import { isObjectIdOrHexString, Types } from "mongoose";
import Folder from "./folder.model.js";
import User from "../users/user.model.js";
import type {
  CreateFolderInput,
  ListFoldersQuery,
  MoveFolderInput,
  RenameFolderInput,
} from "./folder.validation.js";
import { AppError } from "../../utils/app-error.js";
import File from "../files/file.model.js";

export async function createFolder(userId: string, input: CreateFolderInput) {
  // 1. Validate the authenticated user ID
  if (!isObjectIdOrHexString(userId)) {
    throw new AppError(401, "Authentication required");
  }

  const ownerId = new Types.ObjectId(userId);

  // 2. Confirm the user still exists
  const userExists = await User.exists({ _id: ownerId });

  if (!userExists) {
    throw new AppError(401, "Authentication required");
  }

  // 3. Root folders have no parent
  let parentId: Types.ObjectId | null = null;

  // 4. Verify parent folder ownership
  if (input.parentId != null) {
    if (!isObjectIdOrHexString(input.parentId)) {
      throw new AppError(400, "Invalid parent folder ID");
    }

    parentId = new Types.ObjectId(input.parentId);

    const parentFolder = await Folder.findOne({
      _id: parentId,
      ownerId,
    });

    if (!parentFolder) {
      throw new AppError(404, "Parent folder not found");
    }
  }

  // 5. Create folder
  try {
    const folder = await Folder.create({
      name: input.name,
      ownerId,
      parentId,
    });

    // 6. Return safe folder information
    return {
      id: folder._id.toString(),
      name: folder.name,
      ownerId: folder.ownerId.toString(),
      parentId: folder.parentId?.toString() ?? null,
      createdAt: folder.createdAt,
      updatedAt: folder.updatedAt,
    };
  } catch (error) {
    if (error instanceof Error && "code" in error && error.code === 11000) {
      throw new AppError(409, "Folder name already exists");
    }

    throw error;
  }
}

export async function listFolders(userId: string, query: ListFoldersQuery) {
  // 1. Validate authenticated user ID
  if (!isObjectIdOrHexString(userId)) {
    throw new AppError(401, "Authentication required");
  }

  const ownerId = new Types.ObjectId(userId);

  // 2. Check that the user still exists
  const userExists = await User.exists({
    _id: ownerId,
  });

  if (!userExists) {
    throw new AppError(401, "Authentication required");
  }

  // 3. Default to the root folder
  let parentId: Types.ObjectId | null = null;

  // 4. Validate the requested parent folder
  if (query.parentId !== undefined) {
    if (!isObjectIdOrHexString(query.parentId)) {
      throw new AppError(400, "Invalid parent folder ID");
    }

    parentId = new Types.ObjectId(query.parentId);

    const parentFolder = await Folder.findOne({
      _id: parentId,
      ownerId,
    });

    if (!parentFolder) {
      throw new AppError(404, "Parent folder not found");
    }
  }

  // 5. Fetch direct children of the requested parent
  const folders = await Folder.find({
    ownerId,
    parentId,
  })
    .sort({ name: 1, _id: 1 })
    .lean();

  // 6. Return safe folder data
  return folders.map((folder) => ({
    id: folder._id.toString(),
    name: folder.name,
    ownerId: folder.ownerId.toString(),
    parentId: folder.parentId?.toString() ?? null,
    createdAt: folder.createdAt,
    updatedAt: folder.updatedAt,
  }));
}

export async function getFolderById(userId: string, folderId: string) {
  // 1. Validate authenticated user ID
  if (!isObjectIdOrHexString(userId)) {
    throw new AppError(401, "Authentication required");
  }

  // 2. Validate folder ID
  if (!isObjectIdOrHexString(folderId)) {
    throw new AppError(400, "Invalid folder ID");
  }

  // 3. Check user still exists
  const userExists = await User.exists({
    _id: userId,
  });

  if (!userExists) {
    throw new AppError(401, "Authentication required");
  }

  // 4. Find the folder owned by this user
  const folder = await Folder.findOne({
    _id: folderId,
    ownerId: userId,
  }).lean();

  if (!folder) {
    throw new AppError(404, "Folder not found");
  }

  // 5. Return safe folder data
  return {
    id: folder._id.toString(),
    name: folder.name,
    ownerId: folder.ownerId.toString(),
    parentId: folder.parentId?.toString() ?? null,
    createdAt: folder.createdAt,
    updatedAt: folder.updatedAt,
  };
}

export async function renameFolder(
  userId: string,
  folderId: string,
  input: RenameFolderInput,
) {
  // 1. Validate authenticated user ID
  if (!isObjectIdOrHexString(userId)) {
    throw new AppError(401, "Authentication required");
  }

  // 2. Validate folder ID
  if (!isObjectIdOrHexString(folderId)) {
    throw new AppError(400, "Invalid folder ID");
  }

  // 3. Confirm user still exists
  const userExists = await User.exists({
    _id: userId,
  });

  if (!userExists) {
    throw new AppError(401, "Authentication required");
  }

  // 4. Find folder belonging to authenticated user
  const folder = await Folder.findOne({
    _id: folderId,
    ownerId: userId,
  });

  if (!folder) {
    throw new AppError(404, "Folder not found");
  }

  // 5. Avoid unnecessary database updates
  if (folder.name === input.name) {
    return {
      id: folder._id.toString(),
      name: folder.name,
      parentId: folder.parentId?.toString() ?? null,
      updatedAt: folder.updatedAt,
    };
  }

  // 6. Update folder name
  try {
    const updatedFolder = await Folder.findOneAndUpdate(
      {
        _id: folderId,
        ownerId: userId,
      },
      {
        $set: { name: input.name },
      },
      {
        returnDocument: "after",
        runValidators: true,
      },
    );

    if (!updatedFolder) {
      throw new AppError(404, "Folder not found");
    }

    return {
      id: updatedFolder._id.toString(),
      name: updatedFolder.name,
      parentId: updatedFolder.parentId?.toString() ?? null,
      updatedAt: updatedFolder.updatedAt,
    };
  } catch (error) {
    // MongoDB unique index violation
    if (error instanceof Error && "code" in error && error.code === 11000) {
      throw new AppError(409, "Folder name already exists");
    }

    throw error;
  }
}

export async function moveFolder(
  userId: string,
  folderId: string,
  input: MoveFolderInput,
) {
  // 1. Validate IDs
  if (!isObjectIdOrHexString(userId)) {
    throw new AppError(401, "Authentication required");
  }

  if (!isObjectIdOrHexString(folderId)) {
    throw new AppError(400, "Invalid folder ID");
  }

  const ownerId = new Types.ObjectId(userId);

  // 2. Check authenticated user exists
  const userExists = await User.exists({ _id: ownerId });

  if (!userExists) {
    throw new AppError(401, "Authentication required");
  }

  // 3. Find the source folder
  const folder = await Folder.findOne({
    _id: folderId,
    ownerId,
  });

  if (!folder) {
    throw new AppError(404, "Folder not found");
  }

  // 4. Determine destination
  const newParentId = input.parentId
    ? new Types.ObjectId(input.parentId)
    : null;

  // 5. Moving to the existing parent is a no-op
  const currentParent = folder.parentId?.toString() ?? null;
  const destination = newParentId?.toString() ?? null;

  if (currentParent === destination) {
    return {
      id: folder._id.toString(),
      name: folder.name,
      parentId: currentParent,
      updatedAt: folder.updatedAt,
    };
  }

  // 6. Check destination ownership and cycles
  const visited = new Set<string>();
  let cursor = newParentId;

  while (cursor !== null) {
    const currentId = cursor.toString();

    if (currentId === folder._id.toString()) {
      throw new AppError(
        400,
        "Cannot move a folder into itself or its descendant",
      );
    }

    if (visited.has(currentId)) {
      throw new AppError(409, "Invalid folder hierarchy");
    }

    visited.add(currentId);

    const parent = await Folder.findOne({
      _id: cursor,
      ownerId,
    }).select("parentId");

    if (!parent) {
      throw new AppError(404, "Destination folder not found");
    }

    cursor = parent.parentId;
  }

  // 7. Update only the parentId
  try {
    const updatedFolder = await Folder.findOneAndUpdate(
      {
        _id: folder._id,
        ownerId,
        parentId: folder.parentId,
      },
      {
        $set: { parentId: newParentId },
      },
      {
        returnDocument: "after",
        runValidators: true,
      },
    );

    if (!updatedFolder) {
      throw new AppError(409, "Folder changed during move. Please retry");
    }

    return {
      id: updatedFolder._id.toString(),
      name: updatedFolder.name,
      parentId: updatedFolder.parentId?.toString() ?? null,
      updatedAt: updatedFolder.updatedAt,
    };
  } catch (error) {
    if (error instanceof Error && "code" in error && error.code === 11000) {
      throw new AppError(409, "Folder name already exists at destination");
    }

    throw error;
  }
}

export async function deleteFolder(
  userId: string,
  folderId: string,
): Promise<void> {
  // 1. Validate authenticated user ID
  if (!isObjectIdOrHexString(userId)) {
    throw new AppError(401, "Authentication required");
  }

  // 2. Validate folder ID
  if (!isObjectIdOrHexString(folderId)) {
    throw new AppError(400, "Invalid folder ID");
  }

  const ownerId = new Types.ObjectId(userId);

  // 3. Check user exists
  const userExists = await User.exists({
    _id: ownerId,
  });

  if (!userExists) {
    throw new AppError(401, "Authentication required");
  }

  // 4. Find folder belonging to this user
  const folder = await Folder.findOne({
    _id: folderId,
    ownerId,
  });

  if (!folder) {
    throw new AppError(404, "Folder not found");
  }

  // 5. Check whether the folder contains child folders
  const hasChildren = await Folder.exists({
    parentId: folder._id,
    ownerId,
  });

  if (hasChildren) {
    throw new AppError(409, "Cannot delete a folder containing subfolders");
  }

  const hasFiles = await File.exists({
    folderId: folder._id,
    ownerId,
  });

  if (hasFiles) {
    throw new AppError(409, "Cannot delete a folder containing files");
  }

  // 6. Delete folder
  const result = await Folder.deleteOne({
    _id: folder._id,
    ownerId,
  });

  if (result.deletedCount !== 1) {
    throw new AppError(404, "Folder not found");
  }
}
