import { createContext } from "react";
import type { CloudDirectory, DirectoryOperationResult } from "../types/directory.types";
import type { CloudFile } from "../types/file.types";

export interface StorageContextValue {
  directories: CloudDirectory[];
  files: CloudFile[];
  createFolder: (
    name: string,
    parentDirectoryId: string | null,
  ) => DirectoryOperationResult;
  renameFolder: (
    directoryId: string,
    newName: string,
  ) => DirectoryOperationResult;
}

export const StorageContext = createContext<StorageContextValue | undefined>(undefined);
