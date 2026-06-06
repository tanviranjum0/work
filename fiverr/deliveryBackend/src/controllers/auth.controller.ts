import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { Types } from "mongoose";

// import { sendWelcomeEmail } from "../emails/emailHandlers.js";
import { generateToken } from "../utils/genarateToken.js";
import User, { UserDocument } from "../models/User.js";

/**
 * Extend Request to include user (from auth middleware)
 */
interface AuthRequest extends Request {
  user?: {
    _id: Types.ObjectId;
  };
}

/**
 * SIGNUP
 */
export const signup = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  const { fullName, email, password } = req.body as {
    fullName: string;
    email: string;
    password: string;
  };

  try {
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters",
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser: UserDocument = new User({
      fullName,
      email,
      password: hashedPassword,
    });

    const savedUser = await newUser.save();

    // 🔥 Convert ObjectId → string
    const userId = savedUser._id.toString();

    generateToken(userId, res);

    res.status(201).json({
      _id: userId,
      fullName: savedUser.fullName,
      email: savedUser.email,
      profilePic: savedUser.profilePic,
    });

    // fire-and-forget email
    // sendWelcomeEmail(savedUser.email, savedUser.fullName, ENV.CLIENT_URL).catch(
    //   (err) => console.error("Failed to send welcome email:", err),
    // );

    return res;
  } catch (error: unknown) {
    console.error("Error in signup controller:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * LOGIN
 */
export const login = async (req: Request, res: Response): Promise<Response> => {
  const { email, password } = req.body as {
    email: string;
    password: string;
  };

  try {
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    generateToken(user._id.toString(), res);

    return res.status(200).json({
      _id: user._id.toString(),
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
    });
  } catch (error: unknown) {
    console.error("Error in login controller:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * LOGOUT
 */
export const logout = (_: Request, res: Response): Response => {
  res.cookie("jwt", "", { maxAge: 0 });
  return res.status(200).json({ message: "Logged out successfully" });
};

/**
 * UPDATE PROFILE
 */
export const updateProfile = async (
  req: AuthRequest,
  res: Response,
): Promise<Response> => {
  try {
    const { profilePic } = req.body as { profilePic: string };

    if (!profilePic) {
      return res.status(400).json({
        message: "Profile pic is required",
      });
    }

    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const uploadResponse: {
      secure_url: string;
    } = await cloudinary.uploader.upload(profilePic);

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { profilePic: uploadResponse.secure_url },
      { new: true },
    );

    return res.status(200).json(updatedUser);
  } catch (error: unknown) {
    console.error("Error in update profile:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
