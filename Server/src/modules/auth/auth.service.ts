
import * as argon2 from "argon2";
import User from "../users/user.model.js";
import type {
  RegisterInput,
  LoginInput,
} from "./auth.validation.js";
import { AppError } from "../../utils/app-error.js";
import { signAccessToken } from "../../utils/jwt.js";

// REGISTER USER
export async function registerUser(input: RegisterInput) {
  const existingUser = await User.exists({
    email: input.email,
  });

  if (existingUser) {
    throw new AppError(409, "Email already registered");
  }

  const passwordHash = await argon2.hash(input.password, {
    type: argon2.argon2id,
  });

  try {
    const user = await User.create({
      name: input.name,
      email: input.email,
      passwordHash,
    });

    return {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
    };
  } catch (error) {
    if (
      error instanceof Error &&
      "code" in error &&
      error.code === 11000
    ) {
      throw new AppError(409, "Email already registered");
    }

    throw error;
  }
}

// LOGIN USER
export async function loginUser(input: LoginInput) {
  // 1. Find user by email
  const user = await User.findOne({
    email: input.email,
  }).select("+passwordHash");

  // 2. Check user exists
  if (!user || !user.passwordHash) {
    throw new AppError(401, "Invalid email or password");
  }

  // 3. Verify password
  const isPasswordValid = await argon2.verify(
    user.passwordHash,
    input.password
  );

  if (!isPasswordValid) {
    throw new AppError(401, "Invalid email or password");
  }

  // 4. Generate JWT access token
  const accessToken = await signAccessToken(
    user._id.toString()
  );

  // 5. Return safe user information and token
  return {
    user: {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
    },
    accessToken,
  };
}