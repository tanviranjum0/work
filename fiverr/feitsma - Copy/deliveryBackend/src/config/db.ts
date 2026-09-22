import mongoose from "mongoose";

const connectDB = async (mongoURL: string): Promise<void> => {
  try {
    await mongoose.connect(mongoURL, {
      // Optional but recommended configs
      autoIndex: true,
    });

    console.log("MongoDB connected successfully");
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("MongoDB connection error:", error.message);
    } else {
      console.error("MongoDB connection error:", error);
    }

    // Better: throw instead of killing process
    throw new Error("Failed to connect to MongoDB");
  }
};

export default connectDB;
