
import { z } from "zod";

export const listFilesQuerySchema = z.object({
  folderId: z
    .string()
    .regex(
      /^[0-9a-fA-F]{24}$/,
      "Invalid folder ID"
    )
    .optional(),

  page: z.coerce
    .number()
    .int()
    .min(1)
    .default(1),

  limit: z.coerce
    .number()
    .int()
    .min(1)
    .max(100)
    .default(20),
});

export type ListFilesQuery = z.infer<
  typeof listFilesQuerySchema
>;
