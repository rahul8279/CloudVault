export interface CloudFile {
  id: string;
  name: string;
  size: number;
  mimeType: string;
  createdAt: string;
  updatedAt: string;
  isStarred: boolean;
  parentDirectoryId: string | null;
  deletedAt: string | null;
}
