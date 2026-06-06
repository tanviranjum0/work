import jwt, { SignOptions } from "jsonwebtoken";
import { Response } from "express";

interface JwtPayload {
  userId: string;
}

export const generateToken = (userId: string, res: Response): string => {
  const payload: JwtPayload = { userId };

  const options: SignOptions = {
    expiresIn: "7d",
  };

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not defined");
  }

  const token = jwt.sign(payload, secret, options);

  res.cookie("jwt", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true, // ✅ prevents XSS
    sameSite: "strict", // ✅ protects against CSRF
    secure: true, // ✅ flexible
  });

  return token;
};
