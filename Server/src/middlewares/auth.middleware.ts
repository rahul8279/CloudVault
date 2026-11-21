
import type { RequestHandler } from "express";
import { verifyAccessToken } from "../utils/jwt.js";
import { AppError } from "../utils/app-error.js";

export const requireAuth: RequestHandler = async (
  req,
  _res,
  next
) => {
  // 1. Read Authorization header
  const authHeader = req.get("authorization");

  // 2. Check Bearer token format
  const match = authHeader?.match(/^Bearer ([^\s]+)$/i);
  const token = match?.[1];

  if (!token) {
    throw new AppError(401, "Authentication required");
  }

  // 3. Verify JWT and extract user ID
  const userId = await verifyAccessToken(token);

  // 4. Attach authenticated user ID
  req.authUserId = userId;

  // 5. Continue to the protected route
  next();
};
