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
  // console.log(token);
  if (!token) {
    res.status(401).json({ message: "Unauthorized: No token provided" });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    // console.log(decoded);
    req.userId = (decoded as JwtPayload).userId;
    // req.body.userId = (decoded as JwtPayload).userId; // ✅ Add userId to request body for downstream handlers
    next(); // ✅ Only called AFTER verification
  } catch (error) {
    console.log(error);
    res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};

export default checkLogin;
