import mongoose from "mongoose";

export interface UserDocument {
  save: any;
  username: string;
  email: string;
  password: string;
  avatar?: object;
}

const userSchema = new mongoose.Schema<UserDocument>(
  {
    fullName: {
      type: String,
      required: true,
      unique: true,
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
    avatar: {
      type: Object,
    },
  },
  { timestamps: true },
);

const User = mongoose.model<UserDocument>("User", userSchema);
export default User;
