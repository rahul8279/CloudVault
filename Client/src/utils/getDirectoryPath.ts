import type { CloudDirectory } from "../types/directory.types";

export function getDirectoryPath(
  directories: CloudDirectory[],
  currentDirectoryId: string | null,
): CloudDirectory[] {
  const path: CloudDirectory[] = [];
  const visited = new Set<string>();
  let directoryId = currentDirectoryId;

  while (directoryId !== null) {
    if (visited.has(directoryId)) break;
    visited.add(directoryId);

    const directory = directories.find((item) => item.id === directoryId);
    if (!directory) break;

    path.push(directory);
    directoryId = directory.parentDirectoryId;
  }

  return path.reverse();
}
