import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  PORT: z.coerce.number().int().min(1).max(65535),
  MONGODB_URI: z.string().min(1, "MongoDB URI is required"),
  CLIENT_ORIGIN: z.url(),
JWT_SECRET: z.string().regex(
  /^[0-9a-fA-F]{64}$/,
  "JWT_SECRET must be a 64-character hexadecimal secret"
),

JWT_EXPIRES_IN: z.literal("15m"),
  NODE_ENV: z.enum([
    "development",
    "production",
    "test"
  ]),
  AWS_REGION: z.string().min(1, "AWS region is required"),

S3_BUCKET: z.string().min(3, "S3 bucket name is required"),
});

const result = envSchema.safeParse(process.env);

if (!result.success) {
  console.error("Invalid environment configuration");
  console.error(z.prettifyError(result.error));
  process.exit(1);
}

export const env = result.data;