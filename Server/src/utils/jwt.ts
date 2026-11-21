
import { SignJWT, jwtVerify } from "jose";
import { env } from "../config/env.js";
import { AppError } from "./app-error.js";

const secretKey = Buffer.from(env.JWT_SECRET, "hex");

const ISSUER = "cloudvault-api";
const AUDIENCE = "cloudvault-client";

// Generate access token
export async function signAccessToken(
  userId: string
): Promise<string> {
  return new SignJWT({})
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(userId)
    .setIssuedAt()
    .setIssuer(ISSUER)
    .setAudience(AUDIENCE)
    .setExpirationTime(env.JWT_EXPIRES_IN)
    .sign(secretKey);
}

// Verify access token
export async function verifyAccessToken(
  token: string
): Promise<string> {
  try {
    const { payload } = await jwtVerify(token, secretKey, {
      algorithms: ["HS256"],
      issuer: ISSUER,
      audience: AUDIENCE,
    });

    if (!payload.sub) {
      throw new Error("Missing user ID");
    }

    return payload.sub;
  } catch {
    throw new AppError(401, "Invalid or expired token");
  }
}
