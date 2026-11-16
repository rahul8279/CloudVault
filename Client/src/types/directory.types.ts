export interface CloudDirectory {
  id: string;
  name: string;
  parentDirectoryId: string | null;
  createdAt: string;
  updatedAt: string;
  isStarred: boolean;
  deletedAt: string | null;
}
export type DirectoryOperationResult =
  | { success: true }
  | { success: false; error: string };

// Keep existing modal and page contracts compatible during migration.
export type CreateFolderResult = DirectoryOperationResult;

