
import { isObjectIdOrHexString, Types } from "mongoose";
import { basename, extname } from "node:path";
import { fileTypeFromBuffer } from "file-type";

import File from "./file.model.js";
import Folder from "../folders/folder.model.js";
import User from "../users/user.model.js";

import type { ListFilesQuery } from "./file.validation.js";

import { AppError } from "../../utils/app-error.js";
import { generateStorageKey } from "../../utils/storage-key.js";
import { uploadObject } from "./storage.service.js";

// ----------------------------------
// Types
// ----------------------------------

interface UploadFileInput {
    userId: string;
    folderId?: string;
    file: Express.Multer.File;
}

interface ListedFileDocument {
    _id: Types.ObjectId;
    name: string;
    folderId: Types.ObjectId | null;
    mimeType: string;
    sizeBytes: number;
    status: "pending" | "ready" | "failed";
    createdAt: Date;
    updatedAt: Date;
}

// ----------------------------------
// Constants
// ----------------------------------

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const allowedTypes: Record<string, string[]> = {
    "application/pdf": [".pdf"],
    "image/png": [".png"],
    "image/jpeg": [".jpg", ".jpeg"],
};

// ----------------------------------
// Helpers
// ----------------------------------

// Verify authenticated user
async function getOwnerId(
    userId: string
): Promise<Types.ObjectId> {
    if (!isObjectIdOrHexString(userId)) {
        throw new AppError(401, "Authentication required");
    }

    const ownerId = new Types.ObjectId(userId);

    const userExists = await User.exists({
        _id: ownerId,
    });

    if (!userExists) {
        throw new AppError(401, "Authentication required");
    }

    return ownerId;
}

// Validate folder and ownership
async function resolveFolderId(
    ownerId: Types.ObjectId,
    folderId?: string
): Promise<Types.ObjectId | null> {
    // Root folder
    if (folderId === undefined) {
        return null;
    }

    if (!isObjectIdOrHexString(folderId)) {
        throw new AppError(400, "Invalid folder ID");
    }

    const folderObjectId = new Types.ObjectId(folderId);

    const folderExists = await Folder.exists({
        _id: folderObjectId,
        ownerId,
    });

    if (!folderExists) {
        throw new AppError(404, "Folder not found");
    }

    return folderObjectId;
}

// ----------------------------------
// Upload File
// ----------------------------------

export async function uploadFile(
    input: UploadFileInput
) {
    const { userId, file } = input;

    // 1. Authenticate user
    const ownerId = await getOwnerId(userId);

    // 2. Validate file
    if (
        !file ||
        !file.buffer ||
        file.size <= 0 ||
        file.size > MAX_FILE_SIZE ||
        file.buffer.length !== file.size
    ) {
        throw new AppError(400, "Invalid file size");
    }

    // 3. Sanitize filename
    const name = basename(
        file.originalname.replaceAll("\\", "/")
    ).trim();

    if (
        !name ||
        name.length > 255 ||
        /[\x00-\x1F\x7F]/.test(name)
    ) {
        throw new AppError(400, "Invalid filename");
    }

    // 4. Detect actual file type
    const detectedType = await fileTypeFromBuffer(
        file.buffer
    );

    const extension = extname(name).toLowerCase();

    if (
        !detectedType ||
        !allowedTypes[detectedType.mime]?.includes(extension)
    ) {
        throw new AppError(415, "Unsupported file type");
    }

    // 5. Validate destination folder
    const folderId = await resolveFolderId(
        ownerId,
        input.folderId
    );

    // 6. Generate unique S3 key
    const storageKey = generateStorageKey(userId);

    // 7. Create MongoDB metadata
    const fileRecord = await File.create({
        name,
        ownerId,
        folderId,
        storageKey,
        mimeType: detectedType.mime,
        sizeBytes: file.size,
        status: "pending",
    });

    // 8. Upload actual file to S3
    try {
        await uploadObject({
            key: storageKey,
            body: file.buffer,
            contentType: detectedType.mime,
        });
    } catch (error) {
        console.error("S3 upload failed:", error);

        // Best-effort status update
        try {
            await File.updateOne(
                {
                    _id: fileRecord._id,
                    ownerId,
                    status: "pending",
                },
                {
                    $set: { status: "failed" },
                }
            );
        } catch (updateError) {
            console.error(
                "Failed to update upload status:",
                updateError
            );
        }

        throw new AppError(502, "File upload failed");
    }

    // 9. Finalize metadata
    let readyFile;

    try {
        readyFile = await File.findOneAndUpdate(
            {
                _id: fileRecord._id,
                ownerId,
                status: "pending",
            },
            {
                $set: { status: "ready" },
            },
            {
                returnDocument: "after",
                runValidators: true,
            }
        );
    } catch (error) {
        console.error(
            "File metadata finalization failed:",
            error
        );

        throw new AppError(
            503,
            "Unable to confirm file upload"
        );
    }

    if (!readyFile) {
        throw new AppError(
            503,
            "Unable to finalize file metadata"
        );
    }

    // 10. Return safe metadata
    return {
        id: readyFile._id.toString(),
        name: readyFile.name,
        folderId: readyFile.folderId?.toString() ?? null,
        mimeType: readyFile.mimeType,
        sizeBytes: readyFile.sizeBytes,
        status: readyFile.status,
        createdAt: readyFile.createdAt,
        updatedAt: readyFile.updatedAt,
    };
}

// ----------------------------------
// List Files
// ----------------------------------

export async function listFiles(
    userId: string,
    query: ListFilesQuery
) {
    // 1. Authenticate user
    const ownerId = await getOwnerId(userId);

    // 2. Validate folder ownership
    const folderId = await resolveFolderId(
        ownerId,
        query.folderId
    );

    // 3. Build secure query filter
    const filter = {
        ownerId,
        folderId,
        status: "ready" as const,
    };

    // 4. Calculate pagination
    const skip = (query.page - 1) * query.limit;

    // 5. Fetch files and total count
    const [files, total] = await Promise.all([
        File.find(filter)
            .select({
                _id: 1,
                name: 1,
                folderId: 1,
                mimeType: 1,
                sizeBytes: 1,
                status: 1,
                createdAt: 1,
                updatedAt: 1,
            })
            .sort({
                createdAt: -1,
                _id: -1,
            })
            .skip(skip)
            .limit(query.limit)
            .lean<ListedFileDocument[]>()
            .exec(),

        File.countDocuments(filter).exec(),
    ]);

    // 6. Return safe file metadata
    return {
        files: files.map((file) => ({
            id: file._id.toString(),
            name: file.name,
            folderId: file.folderId?.toString() ?? null,
            mimeType: file.mimeType,
            sizeBytes: file.sizeBytes,
            status: file.status,
            createdAt: file.createdAt,
            updatedAt: file.updatedAt,
        })),

        pagination: {
            page: query.page,
            limit: query.limit,
            total,
            totalPages: Math.ceil(
                total / query.limit
            ),
        },
    };
}
