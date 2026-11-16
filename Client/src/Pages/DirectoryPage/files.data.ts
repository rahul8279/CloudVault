import type { CloudFile } from "../../types/file.types";

export const files: CloudFile[] = [
  {
    id: "file-welcome",
    name: "Welcome.pdf",
    size: 1_258_291,
    mimeType: "application/pdf",
    createdAt: "2026-11-10T09:00:00.000Z",
    updatedAt: "2026-11-14T09:00:00.000Z",
    isStarred: false,
    deletedAt: null,
    parentDirectoryId: null,
  },
  {
    id: "file-project-plan",
    name: "Project Plan.pdf",
    size: 2_516_582,
    mimeType: "application/pdf",
    createdAt: "2026-11-11T09:00:00.000Z",
    updatedAt: "2026-11-14T10:00:00.000Z",
    isStarred: true,
    deletedAt: null,
    parentDirectoryId: "dir-projects",
  },
  {
    id: "file-react-readme",
    name: "README.md",
    size: 2_048,
    mimeType: "text/markdown",
    createdAt: "2026-11-12T09:00:00.000Z",
    updatedAt: "2026-11-14T11:00:00.000Z",
    isStarred: false,
    deletedAt: null,
    parentDirectoryId: "dir-react-app",
  },
];
