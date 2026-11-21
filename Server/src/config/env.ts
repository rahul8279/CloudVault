import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  PORT: z.coerce.number().int().min(1).max(65535),

  NODE_ENV: z.enum([
    "development",
    "production",
    "test"
  ]),
});

const result = envSchema.safeParse(process.env);

if (!result.success) {
  console.error("Invalid environment configuration");
  console.error(z.prettifyError(result.error));
  process.exit(1);
}

export const env = result.data;