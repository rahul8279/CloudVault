import { useEffect, useId, useRef, useState } from "react";
import type { FormEvent } from "react";
import type { CloudDirectory, CreateFolderResult } from "../../types/directory.types";

type RenameFolderModalProps = {
  directory: CloudDirectory | null;
  onClose: () => void;
  onRename: (directoryId: string, newName: string) => CreateFolderResult;
};

function RenameFolderDialog({ directory, onClose, onRename }: Omit<RenameFolderModalProps, "directory"> & { directory: CloudDirectory }) {
  const [name, setName] = useState<string>(directory.name);
  const [error, setError] = useState<string>("");
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const inputId = useId();
  const hintId = useId();
  const errorId = useId();
  const trimmedName = name.trim();
  const isValid = trimmedName.length > 0 && trimmedName.length <= 100;

  useEffect(() => {
    const dialog = dialogRef.current;
    dialog?.showModal();
    return () => dialog?.close();
  }, []);

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    if (!isValid) return;

    const result = onRename(directory.id, trimmedName);
    if (result.success) {
      onClose();
    } else {
      setError(result.error);
    }
  }

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      className="m-auto w-full max-w-md rounded-xl border border-gray-200 bg-white p-6 text-gray-900 shadow-xl backdrop:bg-black/40"
    >
      <h2 id={titleId} className="text-lg font-semibold">Rename folder</h2>
      <form onSubmit={handleSubmit} className="mt-6 space-y-5">
        <div>
          <label htmlFor={inputId} className="mb-2 block text-sm font-medium">Folder name</label>
          <input
            id={inputId}
            type="text"
            value={name}
            onChange={(event) => {
              setName(event.target.value);
              setError("");
            }}
            maxLength={100}
            required
            autoFocus
            aria-invalid={Boolean(error)}
            aria-describedby={error ? `${hintId} ${errorId}` : hintId}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
          />
          <p id={hintId} className="mt-2 text-xs text-gray-500">Enter a name of up to 100 characters. Spaces alone are not allowed.</p>
          {error && <p id={errorId} role="alert" className="mt-2 text-sm text-red-600">{error}</p>}
        </div>
        <div className="flex justify-end gap-3">
          <button type="button" onClick={onClose} className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-50 focus-visible:outline-2 focus-visible:outline-blue-600">
            Cancel
          </button>
          <button type="submit" disabled={!isValid} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:cursor-not-allowed disabled:opacity-50">
            Rename Folder
          </button>
        </div>
      </form>
    </dialog>
  );
}

function RenameFolderModal({ directory, onClose, onRename }: RenameFolderModalProps) {
  return directory ? (
    <RenameFolderDialog key={directory.id} directory={directory} onClose={onClose} onRename={onRename} />
  ) : null;
}

export default RenameFolderModal;
