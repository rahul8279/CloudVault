
import { randomUUID } from "node:crypto";

export function generateStorageKey(
  userId: string
): string {
  const fileId = randomUUID();

  return `users/${userId}/files/${fileId}`;
}
