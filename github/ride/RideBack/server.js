require("dotenv").config();
const express = require("express");
const helmet = require("helmet");
const { createServer } = require("node:http");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const socket = require("./socket");
const { connectDatabase, disconnectDatabase, mongoose } = require("./config/db");
const { connectRedis, disconnectRedis, getRedisClient } = require("./config/redis");
const { getAllowedOrigins } = require("./config/security");
const { startJobQueue, closeJobQueue } = require("./services/jobQueue.service");
const { globalLimiter, authLimiter, verificationLimiter, rideCreationLimiter, mapLimiter, refreshLimiter } = require("./middlewares/rateLimiter.middleware");
const requestSafety = require("./middlewares/requestSafety.middleware");
const errorHandler = require("./middlewares/errorHandler.middleware");
const logger = require("./utils/logger");
const userRoutes = require("./routes/user.routes");
const captainRoutes = require("./routes/captain.routes");
const mapsRoutes = require("./routes/maps.routes");
const rideRoutes = require("./routes/ride.routes");
const mailRoutes = require("./routes/mail.routes");
const PORT = process.env.PORT || 4000;
const app = express();
const server = createServer(app);

function validateRuntimeConfig() {
  if (!["development", "production"].includes(process.env.ENVIRONMENT || "development")) {
    throw new Error("ENVIRONMENT must be development or production.");
  }
  if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET must be configured.");
  if (process.env.ENVIRONMENT === "production" && process.env.JWT_SECRET.length < 32) {
    throw new Error("JWT_SECRET must be at least 32 characters in production.");
  }
  if (process.env.ENVIRONMENT === "production") {
    for (const key of [
      "GOOGLE_MAPS_API",
      "RESEND_API",
      "RESEND_EMAIL_FROM",
      "CLIENT_URL",
      "OTP_HASH_SECRET",
    ]) {
      if (!process.env[key]) throw new Error(`${key} must be configured in production.`);
    }
    if (process.env.OTP_HASH_SECRET.length < 32) {
      throw new Error("OTP_HASH_SECRET must be at least 32 characters in production.");
    }
  }
  if (
    process.env.TRUST_PROXY &&
    (!Number.isInteger(Number(process.env.TRUST_PROXY)) || Number(process.env.TRUST_PROXY) < 0)
  ) {
    throw new Error("TRUST_PROXY must be a non-negative integer hop count.");
  }
  if (
    process.env.BACKGROUND_JOB_CONCURRENCY &&
    (!Number.isInteger(Number(process.env.BACKGROUND_JOB_CONCURRENCY)) ||
      Number(process.env.BACKGROUND_JOB_CONCURRENCY) < 1 ||
      Number(process.env.BACKGROUND_JOB_CONCURRENCY) > 100)
  ) {
    throw new Error("BACKGROUND_JOB_CONCURRENCY must be an integer from 1 to 100.");
  }
}

app.disable("x-powered-by");
if (process.env.TRUST_PROXY) app.set("trust proxy", Number(process.env.TRUST_PROXY));
app.use(helmet());
// Container health probe; registered before request logging and rate limiting.
app.get("/healthz", (req, res) => {
  const healthy =
    mongoose.connection.readyState === 1 &&
    (!process.env.REDIS_URL || Boolean(getRedisClient()?.isReady));
  res.status(healthy ? 200 : 503).json({ status: healthy ? "ok" : "unavailable" });
});
app.use(cors({
  origin(origin, callback) {
    if (!origin || getAllowedOrigins().includes(origin)) return callback(null, true);
    return callback(null, false);
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  maxAge: 600,
}));
app.use(cookieParser());
app.use(express.json({ limit: "16kb", strict: true }));
app.use(express.urlencoded({ extended: false, limit: "16kb", parameterLimit: 100 }));
app.use(requestSafety);
app.use(morgan(":method :status :response-time ms"));

app.use(globalLimiter);

app.get("/", (req, res) => {
  res.json("Hello, World!");
});

app.use("/user", userRoutes({ authLimiter, verificationLimiter }));
app.use("/captain", captainRoutes({ authLimiter, verificationLimiter }));
app.use("/map", mapLimiter, mapsRoutes);
app.use("/ride", rideRoutes({ rideCreationLimiter, verificationLimiter }));
app.use("/mail", verificationLimiter, mailRoutes);
app.post("/auth/refresh", refreshLimiter, require("./controllers/auth.controller").refresh);
app.use((req, res, next) => next(new (require("./utils/AppError").NotFoundError)("Route not found.")));
app.use(errorHandler);

async function start() {
  validateRuntimeConfig();
  const origins = getAllowedOrigins();
  if (process.env.CLIENT_URL && !origins.includes(new URL(process.env.CLIENT_URL).origin)) {
    throw new Error("CLIENT_URL must use an origin listed in FRONTEND_ORIGINS.");
  }
  await connectDatabase();
  await connectRedis();
  await startJobQueue();
  await socket.initializeSocket(server, origins);
  await new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(PORT, resolve);
  });
  logger.info("HTTP server listening", { port: PORT });

  let shuttingDown = false;
  const shutdown = async (signal, fatalError) => {
    if (shuttingDown) return;
    shuttingDown = true;
    logger[fatalError ? "error" : "info"](`Shutting down (${signal})`, fatalError ? { name: fatalError.name, code: fatalError.code } : {});
    const timeout = setTimeout(() => process.exit(fatalError ? 1 : 0), 10_000);
    timeout.unref();
    try {
      await closeJobQueue();
      await socket.closeSocket();
      await disconnectDatabase();
      await disconnectRedis();
      process.exit(fatalError ? 1 : 0);
    } catch (error) {
      logger.error("Graceful shutdown failed", { message: error.message });
      process.exit(1);
    }
  };
  process.once("SIGINT", () => shutdown("SIGINT"));
  process.once("SIGTERM", () => shutdown("SIGTERM"));
  process.once("unhandledRejection", (reason) =>
    shutdown("unhandledRejection", reason instanceof Error ? reason : new Error(String(reason))),
  );
  process.once("uncaughtException", (error) => shutdown("uncaughtException", error));
}

if (require.main === module) {
  start().catch((error) => {
    logger.error("Server startup failed", { name: error.name, code: error.code });
    Promise.allSettled([closeJobQueue(), disconnectDatabase(), disconnectRedis()]).finally(() => {
      process.exit(1);
    });
  });
}

module.exports = { app, server, start };
