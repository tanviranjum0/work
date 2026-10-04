"use strict";

const mongoose = require("mongoose");
const logger = require("../utils/logger");

async function connectDatabase() {
  const environment = process.env.ENVIRONMENT || "development";
  const uri =
    environment === "production"
      ? process.env.MONGODB_PROD_URL
      : process.env.MONGODB_DEV_URL;

  if (!uri) throw new Error(`MongoDB URI is not configured for ${environment}.`);

  mongoose.set("strictQuery", true);
  await mongoose.connect(uri, {
    maxPoolSize: Number(process.env.MONGODB_MAX_POOL_SIZE) || 20,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
  });
  logger.info("MongoDB connected", { environment });
}

async function disconnectDatabase() {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
    logger.info("MongoDB disconnected");
  }
}

mongoose.connection.on("disconnected", () => logger.warn("MongoDB disconnected unexpectedly"));
mongoose.connection.on("reconnected", () => logger.info("MongoDB reconnected"));

module.exports = { connectDatabase, disconnectDatabase, mongoose };
