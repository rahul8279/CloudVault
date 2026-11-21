
import { z } from "zod";

export const createFolderSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Folder name is required")
    .max(100, "Folder name must not exceed 100 characters"),

  parentId: z
    .string()
    .regex(
      /^[0-9a-fA-F]{24}$/,
      "Invalid parent folder ID"
    )
    .nullable()
    .optional(),
});

export type CreateFolderInput = z.infer<typeof createFolderSchema>;

export const listFoldersQuerySchema = z.object({
  parentId: z
    .string()
    .regex(
      /^[0-9a-fA-F]{24}$/,
      "Invalid parent folder ID"
    )
    .optional(),
});

export type ListFoldersQuery = z.infer<
  typeof listFoldersQuerySchema
>;

export const renameFolderSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Folder name is required")
    .max(100, "Folder name cannot exceed 100 characters"),
});

export type RenameFolderInput = z.infer<
  typeof renameFolderSchema
>;


export const moveFolderSchema = z.object({
  parentId: z
    .string()
    .regex(
      /^[0-9a-fA-F]{24}$/,
      "Invalid destination folder ID"
    )
    .nullable(),
});

export type MoveFolderInput = z.infer<
  typeof moveFolderSchema
>;
