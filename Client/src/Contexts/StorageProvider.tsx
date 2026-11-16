import { useState } from "react";
import type { ReactNode } from "react";
import { StorageContext } from "./StorageContext";
import { directories as mockDirectories } from "../Pages/DirectoryPage/directories.data";
import { files as mockFiles } from "../Pages/DirectoryPage/files.data";
import type { CloudDirectory, DirectoryOperationResult } from "../types/directory.types";
import type { CloudFile } from "../types/file.types";

type StorageProviderProps = {
  children: ReactNode;
};

function StorageProvider({ children }: StorageProviderProps) {
  const [directoryList, setDirectoryList] = useState<CloudDirectory[]>(mockDirectories);
  const [fileList] = useState<CloudFile[]>(mockFiles);

  function createFolder(folderName: string, parentDirectoryId: string | null): DirectoryOperationResult {
    const trimmedName = folderName.trim();
    if (trimmedName.length === 0 || trimmedName.length > 100) {
      return { success: false, error: "Enter a folder name between 1 and 100 characters." };
    }

    if (
      parentDirectoryId !== null &&
      !directoryList.some((directory) => directory.id === parentDirectoryId && directory.deletedAt === null)
    ) {
      return { success: false, error: "The parent folder does not exist or is in Trash." };
    }

    const normalizedName = trimmedName.toLocaleLowerCase();
    const alreadyExists = directoryList.some(
      (directory) =>
        directory.parentDirectoryId === parentDirectoryId &&
        directory.name.trim().toLocaleLowerCase() === normalizedName,
    );
    if (alreadyExists) {
      return { success: false, error: "A folder with this name already exists here." };
    }

    const timestamp = new Date().toISOString();
    const newDirectory: CloudDirectory = {
      id: crypto.randomUUID(),
      name: trimmedName,
      parentDirectoryId: parentDirectoryId,
      createdAt: timestamp,
      updatedAt: timestamp,
      isStarred: false,
      deletedAt: null,
    };

    setDirectoryList((previousDirectories) => [...previousDirectories, newDirectory]);
    return { success: true };
  }

  function renameFolder(directoryId: string, newName: string): DirectoryOperationResult {
    const selectedDirectory = directoryList.find((directory) => directory.id === directoryId);
    if (!selectedDirectory) {
      return { success: false, error: "This folder no longer exists." };
    }
    if (selectedDirectory.deletedAt !== null) {
      return { success: false, error: "Cannot rename a folder in Trash." };
    }

    const trimmedName = newName.trim();
    if (trimmedName.length === 0 || trimmedName.length > 100) {
      return { success: false, error: "Enter a folder name between 1 and 100 characters." };
    }

    const normalizedName = trimmedName.toLocaleLowerCase();
    const alreadyExists = directoryList.some(
      (directory) =>
        directory.id !== directoryId &&
        directory.parentDirectoryId === selectedDirectory.parentDirectoryId &&
        directory.name.trim().toLocaleLowerCase() === normalizedName,
    );
    if (alreadyExists) {
      return { success: false, error: "A folder with this name already exists here." };
    }

    const timestamp = new Date().toISOString();
    setDirectoryList((previousDirectories) =>
      previousDirectories.map((directory) =>
        directory.id === directoryId
          ? { ...directory, name: trimmedName, updatedAt: timestamp }
          : directory,
      ),
    );
    return { success: true };
  }

  return (
    <StorageContext.Provider
      value={{
        directories: directoryList,
        files: fileList,
        createFolder,
        renameFolder,
      }}
    >
      {children}
    </StorageContext.Provider>
  );
}

export default StorageProvider;
