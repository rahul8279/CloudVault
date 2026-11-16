import { useState } from "react";
import { useStorage } from "../../hooks/useStorage";
import RenameFolderModal from "../../components/Directory/RenameFolderModal";
import { Link, useNavigate, useParams } from "react-router";
import FolderCard from "../../components/Directory/FolderCard";
import FolderBreadcrumb from "../../components/Directory/FolderBreadcrumb";
import { getDirectoryPath } from "../../utils/getDirectoryPath";
import RecentFileRow from "../../components/Dashboard/RecentFileRow";
import CreateFolderModal from "../../components/Directory/CreateFolderModal";
import type { DirectoryOperationResult } from "../../types/directory.types";

function DirectoryPage() {
  const { directories: directoryList, files, createFolder, renameFolder } = useStorage();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [renamingDirectoryId, setRenamingDirectoryId] = useState<string | null>(null);
  const renamingDirectory = directoryList.find((directory) => directory.id === renamingDirectoryId) ?? null;
  const { directoryId } = useParams<{ directoryId: string }>();
  const currentDirectoryId: string | null = directoryId ?? null;
  const navigate = useNavigate();

  function navigateToDirectory(id: string | null): void {
    navigate(id === null ? "/app/files" : `/app/files/${encodeURIComponent(id)}`);
  }

  function handleCreateFolder(folderName: string): DirectoryOperationResult {
    return createFolder(folderName, currentDirectoryId);
  }

  if (
    currentDirectoryId !== null &&
    !directoryList.some((directory) => directory.id === currentDirectoryId)
  ) {
    return (
      <section className="space-y-3 rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-gray-900">Folder not found</h2>
        <p className="text-sm text-gray-600">This folder does not exist.</p>
        <Link to="/app/files" className="inline-block text-sm font-medium text-blue-700 hover:underline">
          Return to My Files
        </Link>
      </section>
    );
  }

  const visibleDirectories = directoryList.filter(
    (directory) => directory.parentDirectoryId === currentDirectoryId,
  );
  const directoryPath = getDirectoryPath(directoryList, currentDirectoryId);
  const visibleFiles = files.filter(
    (file) => file.parentDirectoryId === currentDirectoryId,
  );
  const isEmpty = visibleDirectories.length === 0 && visibleFiles.length === 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <FolderBreadcrumb path={directoryPath} onNavigate={navigateToDirectory} />
        <button
          type="button"
          onClick={() => setIsCreateModalOpen(true)}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        >
          New Folder
        </button>
      </div>

      <CreateFolderModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={handleCreateFolder}
      />
      <RenameFolderModal
        directory={renamingDirectory}
        onClose={() => setRenamingDirectoryId(null)}
        onRename={renameFolder}
      />

      <section aria-labelledby="folders-title">
        <div className="mb-4 flex items-center justify-between gap-4">
          <h2 id="folders-title" className="text-lg font-semibold text-gray-900">Folders</h2>
          <p className="text-sm text-gray-500">
            {visibleDirectories.length} {visibleDirectories.length === 1 ? "folder" : "folders"}
          </p>
        </div>

        {visibleDirectories.length > 0 && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {visibleDirectories.map((directory) => (
              <FolderCard
                key={directory.id}
                directory={directory}
                onOpen={navigateToDirectory}
                onRename={setRenamingDirectoryId}
              />
            ))}
          </div>
        )}
      </section>

      <section aria-labelledby="files-title">
        <div className="mb-4 flex items-center justify-between gap-4">
          <h2 id="files-title" className="text-lg font-semibold text-gray-900">Files</h2>
          <p className="text-sm text-gray-500">
            {visibleFiles.length} {visibleFiles.length === 1 ? "file" : "files"}
          </p>
        </div>

        {visibleFiles.length > 0 ? (
          <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
            <table className="w-full text-sm">
              <caption className="sr-only">Files in the current directory</caption>
              <thead className="bg-gray-50 text-left text-xs text-gray-500">
                <tr>
                  <th scope="col" className="px-6 py-3 font-medium">Name</th>
                  <th scope="col" className="px-6 py-3 font-medium">Size</th>
                  <th scope="col" className="px-6 py-3 font-medium">Last updated</th>
                </tr>
              </thead>
              <tbody>
                {visibleFiles.map((file) => <RecentFileRow key={file.id} file={file} />)}
              </tbody>
            </table>
          </div>
        ) : !isEmpty ? (
          <p className="text-sm text-gray-600">No files in this folder yet.</p>
        ) : null}
      </section>

      {isEmpty && (
        <p className="rounded-xl border border-gray-200 bg-white p-6 text-sm text-gray-600">
          This folder is empty. There are no files or folders here yet. Use the breadcrumbs to return to a parent folder.
        </p>
      )}
    </div>
  );
}

export default DirectoryPage;
