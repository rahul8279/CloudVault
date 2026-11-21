
import { isObjectIdOrHexString } from "mongoose";
import User from "./user.model.js";
import { AppError } from "../../utils/app-error.js";

export async function getUserById(userId: string) {
  // 1. Check user ID format
  if (!isObjectIdOrHexString(userId)) {
    throw new AppError(401, "Authentication required");
  }

  // 2. Find user in MongoDB
  const user = await User.findById(userId)
    .select("name email");

  // 3. Check whether user still exists
  if (!user) {
    throw new AppError(401, "Authentication required");
  }

  // 4. Return safe user information
  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
  };
}
