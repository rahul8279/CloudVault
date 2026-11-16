import type { CloudDirectory } from "../../types/directory.types";

type FolderCardProps = {
  directory: CloudDirectory;
  onOpen: (directoryId: string) => void;
  onRename: (directoryId: string) => void;
};

function FolderCard({ directory, onOpen, onRename }: FolderCardProps) {
  return (
    <div className="min-w-0 rounded-xl border border-gray-200 bg-white p-2">
      <button
      type="button"
      onClick={() => onOpen(directory.id)}
      className="flex w-full min-w-0 items-center gap-3 rounded-lg p-3 text-left hover:bg-blue-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
    >
      <svg className="shrink-0 text-blue-500" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" aria-hidden="true">
        <path d="M3 7V5a1 1 0 0 1 1-1h5l2 3h9a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V7Z" />
      </svg>
      <span className="wrap-break-word font-medium text-gray-900">{directory.name}</span>
    </button>
      <button
        type="button"
        onClick={() => onRename(directory.id)}
        aria-label={`Rename ${directory.name}`}
        className="mt-1 rounded-lg px-3 py-2 text-sm font-medium text-blue-700 hover:bg-blue-50 focus-visible:outline-2 focus-visible:outline-blue-600"
      >
        Rename
      </button>
    </div>
  );
}

export default FolderCard;
