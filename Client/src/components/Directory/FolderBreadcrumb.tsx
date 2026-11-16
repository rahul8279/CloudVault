import type { CloudDirectory } from "../../types/directory.types";

type FolderBreadcrumbProps = {
  path: CloudDirectory[];
  onNavigate: (directoryId: string | null) => void;
};

function FolderBreadcrumb({ path, onNavigate }: FolderBreadcrumbProps) {
  return (
    <nav aria-label="Folder breadcrumb">
      <ol className="flex flex-wrap items-center gap-2 text-sm">
        <li>
          <button
            type="button"
            onClick={() => onNavigate(null)}
            aria-current={path.length === 0 ? "page" : undefined}
            className="rounded px-1 py-1 font-medium text-blue-700 hover:underline focus-visible:outline-2 focus-visible:outline-blue-600"
          >
            My Files
          </button>
        </li>
        {path.map((directory, index) => (
          <li key={directory.id} className="flex min-w-0 items-center gap-2">
            <span aria-hidden="true" className="text-gray-400">/</span>
            <button
              type="button"
              onClick={() => onNavigate(directory.id)}
              aria-current={index === path.length - 1 ? "page" : undefined}
              className="wrap-break-word rounded px-1 py-1 text-blue-700 hover:underline focus-visible:outline-2 focus-visible:outline-blue-600 aria-[current=page]:font-semibold aria-[current=page]:text-gray-900"
            >
              {directory.name}
            </button>
          </li>
        ))}
      </ol>
    </nav>
  );
}

export default FolderBreadcrumb;
