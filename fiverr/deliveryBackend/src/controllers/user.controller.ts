import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { Types } from "mongoose";
// import {get2FATemplate} from "../emails/emailTemplates.js";
import { send2FAEmail } from "../emails/emailHandler.js";
// import cloudinary from "../config/cloudinary.js";
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

export const send2FASignupCode = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  const { email, fullName, password } = req.body as {
    email: string;
    fullName: string;
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
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    // Here you would typically send the code via email
    await send2FAEmail(email, code).catch((err) =>
      console.error("Failed to send 2FA email:", err),
    );
    const newUser: UserDocument = await User.create({
      fullName,
      email,
      password: hashedPassword,
      twoFaCode: parseInt(code),
    });

    setTimeout(() => {
      User.findByIdAndUpdate(newUser._id, { twoFaCode: 0 }).catch((err) =>
        console.error("Failed to clear 2FA code:", err),
      );
    }, 60000);

    return res.status(200).json({ message: "Verification code sent" });
  } catch (error: unknown) {
    console.error("Error in send2faSignupCode controller:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const signup = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  const { email, code } = req.body as {
    email: string;
    code: string;
  };

  try {
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }
    if (!code) {
      return res.status(400).json({ message: "2FA code is required" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid user" });
    }

    if (user.twoFaCode != parseInt(code)) {
      return res.status(400).json({ message: "Invalid 2FA code" });
    }
    // 🔥 Convert ObjectId → string
    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      {
        isVerified: true,
        twoFaCode: 0,
      },
      { returnDocument: "after" },
    );

    if (!updatedUser) {
      return res.status(400).json({ message: "Failed to verify user" });
    }

    generateToken(updatedUser, res);

    res.status(201).json({
      message: "User created successfully",
      _id: updatedUser._id,
      fullName: updatedUser.fullName,
      email: updatedUser.email,
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
    if (!user.isVerified) {
      return res
        .status(400)
        .json({ message: "Please verify your email before logging in" });
    }

    generateToken(user, res);

    return res.status(200).json({
      message: "Logged in succesfully!",
      _id: user._id.toString(),
      fullName: user.fullName,
      email: user.email,
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
// export const updateProfile = async (
//   req: AuthRequest,
//   res: Response,
// ): Promise<Response> => {
//   try {
//     const { profilePic } = req.body as { profilePic: string };

//     if (!profilePic) {
//       return res.status(400).json({
//         message: "Profile pic is required",
//       });
//     }

//     if (!req.user) {
//       return res.status(401).json({ message: "Unauthorized" });
//     }

//     const uploadResponse: {
//       secure_url: string;
//     } = await cloudinary.uploader.upload(profilePic);

//     const updatedUser = await User.findByIdAndUpdate(
//       req.user._id,
//       { profilePic: uploadResponse.secure_url },
//       { new: true },
//     );

//     return res.status(200).json(updatedUser);
//   } catch (error: unknown) {
//     console.error("Error in update profile:", error);
//     return res.status(500).json({ message: "Internal server error" });
//   }
// };

export const resend2FALoginCode = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  const { email } = req.body as { email: string };
  try {
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid user" });
    }
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    await User.findByIdAndUpdate(user._id, { twoFaCode: parseInt(code) });
    await send2FAEmail(email, code).catch((err) =>
      console.error("Failed to send 2FA email:", err),
    );

    setTimeout(() => {
      User.findByIdAndUpdate(user._id, { twoFaCode: 0 }).catch((err) =>
        console.error("Failed to clear 2FA code:", err),
      );
    }, 60000);
    return res.status(200).json({ message: "2FA code sent successfully" });
  } catch (error: unknown) {
    console.error("Error in resend 2FA login code:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const login2FAVerification = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  const { email, code } = req.body as {
    email: string;
    code: number;
  };

  try {
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }
    if (!code) {
      return res.status(400).json({ message: "2FA code is required" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid user" });
    }

    if (user.twoFaCode != code) {
      return res.status(400).json({ message: "Invalid 2FA code" });
    }
    // 🔥 Convert ObjectId → string
    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      {
        isVerified: true,
        twoFaCode: 0,
      },
      { returnDocument: "after" },
    );

    if (!updatedUser) {
      return res.status(400).json({ message: "Failed to verify user" });
    }

    generateToken(updatedUser, res);

    res.status(201).json({
      message: "User created successfully",
      _id: updatedUser._id,
      fullName: updatedUser.fullName,
      email: updatedUser.email,
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

export const resetPassword = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  const { email, code, password } = req.body as {
    email: string;
    code: number;
    password: string;
  };
  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }
  if (!code) {
    return res.status(400).json({ message: "2FA code is required" });
  }
  if (!password) {
    return res.status(400).json({ message: "2FA code is required" });
  }
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: "Invalid user" });
  }

  if (user.twoFaCode != parseInt(String(code), 10)) {
    return res.status(400).json({ message: "Invalid 2FA code" });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const updatedUser = await User.findByIdAndUpdate(
    user._id,
    {
      password: hashedPassword,
    },
    { returnDocument: "after" },
  );

  if (!updatedUser) {
    return res.status(400).json({ message: "Failed to reset password" });
  }

  generateToken(updatedUser, res);

  return res.status(201).json({
    message: "Password reset successful",
    _id: updatedUser._id,
    fullName: updatedUser.fullName,
    email: updatedUser.email,
  });
};
