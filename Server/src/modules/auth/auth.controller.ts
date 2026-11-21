
import type { RequestHandler } from "express";
import {
  registerSchema,
  loginSchema,
} from "./auth.validation.js";
import {
  registerUser,
  loginUser,
} from "./auth.service.js";
import { getUserById } from "../users/user.service.js";
import { AppError } from "../../utils/app-error.js";

// REGISTER CONTROLLER
export const registerController: RequestHandler = async (
  req,
  res
) => {
  const result = registerSchema.safeParse(req.body);

  if (!result.success) {
    res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: result.error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      })),
    });
    return;
  }

  const user = await registerUser(result.data);

  res.status(201).json({
    success: true,
    message: "User registered successfully",
    data: user,
  });
};

// LOGIN CONTROLLER

export const loginController: RequestHandler = async (
  req,
  res
) => {
  const result = loginSchema.safeParse(req.body);

  if (!result.success) {
    res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: result.error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      })),
    });
    return;
  }

  const loginResult = await loginUser(result.data);

  res.setHeader("Cache-Control", "no-store");

  res.status(200).json({
    success: true,
    message: "Login successful",
    data: loginResult,
  });
};

export const getMeController: RequestHandler = async (
  req,
  res
) => {
  const userId = req.authUserId;

  if (!userId) {
    throw new AppError(401, "Authentication required");
  }

  const user = await getUserById(userId);

  res.setHeader("Cache-Control", "no-store");

  res.status(200).json({
    success: true,
    data: user,
  });
};