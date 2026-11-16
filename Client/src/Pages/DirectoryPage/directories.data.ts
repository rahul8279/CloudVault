import type { CloudDirectory } from "../../types/directory.types";

export const directories: CloudDirectory[] = [
  {
    id: "dir-documents",
    name: "Documents",
    parentDirectoryId: null,
    createdAt: "2026-11-10T09:00:00.000Z",
    updatedAt: "2026-11-14T09:00:00.000Z",
    isStarred: false,
    deletedAt: null,
  },
  {
    id: "dir-images",
    name: "Images",
    parentDirectoryId: null,
    createdAt: "2026-11-10T09:00:00.000Z",
    updatedAt: "2026-11-13T09:00:00.000Z",
    isStarred: false,
    deletedAt: null,
  },
  {
    id: "dir-projects",
    name: "Projects",
    parentDirectoryId: null,
    createdAt: "2026-11-10T09:00:00.000Z",
    updatedAt: "2026-11-14T10:00:00.000Z",
    isStarred: true,
    deletedAt: null,
  },
  {
    id: "dir-react-app",
    name: "React App",
    parentDirectoryId: "dir-projects",
    createdAt: "2026-11-11T09:00:00.000Z",
    updatedAt: "2026-11-14T10:00:00.000Z",
    isStarred: false,
    deletedAt: null,
  },
];
