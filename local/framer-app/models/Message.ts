import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    image: {
      type: String,
    },
    service: {
      type: String,
      required: true,
      enum: ["Consulting", "Website", "Animation", "Backend"],
      default: "Consulting",
    },
    budget: {
      type: String,
      required: true,
      enum: ["0k", "10k", "50k"],
      default: "0k",
    },
  },
  {
    timestamps: true,
  }
);

const Message =
  mongoose.models.Message || mongoose.model("Message", messageSchema);
export default Message;
