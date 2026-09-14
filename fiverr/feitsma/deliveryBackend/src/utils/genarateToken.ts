import jwt, { SignOptions } from "jsonwebtoken";
import { Response } from "express";
import { UserDocument } from "../models/User.js";

export const generateToken = (user: UserDocument, res: Response): string => {
  const options: SignOptions = {
    expiresIn: "30d",
  };

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not defined");
  }

  const token = jwt.sign(
    {
      userId: user._id.toString(),
      email: user.email,
      fullName: user.fullName,
    },
    secret,
    options,
  );

  res.cookie("jwt", token, {
    httpOnly: true, // ✅ prevents XSS
    sameSite: "strict", // ✅ protects against CSRF
    secure: true, // ✅ flexible
    maxAge: 30 * 24 * 60 * 60 * 1000, // 1 month in milliseconds
    signed: true, // Cryptographically sign the cookie securely
    path: "/",
  });

  return token;
};
