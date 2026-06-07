import mongoose from "mongoose";

export interface UserDocument {
  _id: mongoose.Types.ObjectId;
  save?: any;
  fullName: string;
  email: string;
  password: string;
  isVerified?: boolean;
  twoFaCode?: number;
}

const userSchema = new mongoose.Schema<UserDocument>(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    twoFaCode: {
      type: Number,
    },
  },
  { timestamps: true },
);

const User = mongoose.model<UserDocument>("User", userSchema);
export default User;
