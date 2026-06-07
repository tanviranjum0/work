import jwt, { SignOptions } from "jsonwebtoken";
import { Response } from "express";

interface JwtPayload {
  userId: string;
}

export const generateToken = (userId: string, res: Response): string => {
  const payload: JwtPayload = { userId };

  const options: SignOptions = {
    expiresIn: "30d",
  };

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not defined");
  }

  const token = jwt.sign(payload, secret, options);

  res.cookie("jwt", token, {
    httpOnly: true, // ✅ prevents XSS
    sameSite: "strict", // ✅ protects against CSRF
    secure: true, // ✅ flexible
    maxAge: 30 * 24 * 60 * 60 * 1000, // 1 month in milliseconds
    signed: true, // Cryptographically sign the cookie securely
  });

  return token;
};
