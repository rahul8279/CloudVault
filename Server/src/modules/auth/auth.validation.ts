
import { z } from "zod";

export const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must contain at least 2 characters")
    .max(80, "Name must not exceed 80 characters"),

  email: z
    .string()
    .trim()
    .toLowerCase()
    .pipe(z.email("Please enter a valid email address")),

  password: z
    .string()
    .min(12, "Password must contain at least 12 characters")
    .max(128, "Password must not exceed 128 characters"),
});

export type RegisterInput = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email:z.
  string().
  trim().
  toLowerCase().
  pipe(z.email("Please enter a valid email address")),
   password: z
    .string()
    .min(1, "Password is required")
    .max(128, "Password must not exceed 128 characters"),
});

export type LoginInput = z.infer<typeof loginSchema>;