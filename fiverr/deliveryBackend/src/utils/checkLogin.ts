import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import mongoose from "mongoose";

/**
 * Extend Express Request
 */
interface AuthRequest extends Request {
  userId?: string | JwtPayload | mongoose.Types.ObjectId;
}

const checkLogin = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): void => {
  let token: string | undefined;

  // 1. Check signed cookies
  if (req.signedCookies?.jwt) {
    token = req.signedCookies.jwt;
  }

  // 2. Check Authorization header
  else if (req.headers.authorization?.startsWith("Bearer ")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    res.status(401).json({ message: "Unauthorized: No token provided" });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    console.log("Decoded JWT:", decoded);
    req.userId = decoded.userId;
    next(); // ✅ Only called AFTER verification
  } catch (error) {
    res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};

export default checkLogin;
