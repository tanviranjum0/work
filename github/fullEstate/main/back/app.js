require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const cloudinary = require("cloudinary").v2;
const cookieParser = require("cookie-parser");
const path = require("path");
const authRouter = require("./routes/auth");
const userRouter = require("./routes/user");
const listingRouter = require("./routes/listing");
const { allowedOrigins } = require("./middlewares/checkOrigin");

const app = express();
const isProduction = process.env.NODE_ENV === "production";

app.disable("x-powered-by");
if (isProduction) app.set("trust proxy", 1);

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        baseUri: ["'self'"],
        connectSrc: ["'self'"],
        fontSrc: ["'self'", "data:"],
        formAction: ["'self'"],
        frameAncestors: ["'none'"],
        imgSrc: ["'self'", "data:", "blob:", "https://res.cloudinary.com"],
        objectSrc: ["'none'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        upgradeInsecureRequests: isProduction ? [] : null,
      },
    },
  })
);

app.use(
  cors({
    origin(origin, callback) {
      callback(null, !origin || allowedOrigins.has(origin));
    },
    credentials: true,
    methods: ["GET", "POST", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type"],
    maxAge: 600,
  })
);
app.use(express.json({ limit: "32kb" }));
app.use(express.urlencoded({ extended: false, limit: "10kb", parameterLimit: 100 }));
app.use(cookieParser(process.env.COOKIE_SECRET));

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

app.get("/favicon.ico", (_req, res) => {
  res.redirect(308, "/favicon.svg");
});
app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/listing", listingRouter);
app.use("/api", (_req, res) => res.status(404).json({ message: "API route not found." }));

const frontendDist = path.join(__dirname, "../front/dist");
app.use(
  express.static(frontendDist, {
    setHeaders(res, filePath) {
      if (filePath.endsWith("index.html")) {
        res.setHeader("Cache-Control", "no-cache");
      } else if (filePath.includes(path.sep + "assets" + path.sep)) {
        res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
      }
    },
  })
);
app.get("*", (_req, res) => {
  res.setHeader("Cache-Control", "no-cache");
  res.sendFile(path.join(frontendDist, "index.html"));
});

app.use((error, _req, res, _next) => {
  if (res.headersSent) return;
  if (error.type === "entity.too.large") {
    return res.status(413).json({ message: "Request is too large." });
  }
  if (error.code === "LIMIT_FILE_SIZE") {
    return res.status(413).json({ message: "Image files must be 2 MB or smaller." });
  }
  if (error.code && error.code.startsWith("LIMIT_")) {
    return res.status(400).json({ message: "Image upload is invalid." });
  }
  if (error instanceof SyntaxError && error.status === 400 && "body" in error) {
    return res.status(400).json({ message: "Request body is invalid." });
  }
  if (error.status === 400) {
    return res.status(400).json({ message: "Request is invalid." });
  }
  return res.status(error.status >= 400 && error.status < 500 ? error.status : 500)
    .json({ message: "Unable to process the request." });
});

const startServer = async () => {
  const requiredVariables = [
    "MONGO",
    "JWT_SECRET",
    "COOKIE_SECRET",
    "CLOUDINARY_CLOUD_NAME",
    "CLOUDINARY_API_KEY",
    "CLOUDINARY_API_SECRET",
  ];
  const missingVariables = requiredVariables.filter((name) => !process.env[name]);
  const weakSecrets = ["JWT_SECRET", "COOKIE_SECRET"].filter(
    (name) => process.env[name] && Buffer.byteLength(process.env[name], "utf8") < 32
  );
  if (missingVariables.length || weakSecrets.length) {
    const problems = [
      ...missingVariables.map((name) => "missing " + name),
      ...weakSecrets.map((name) => name + " must be at least 32 bytes"),
    ];
    throw new Error("Server configuration is incomplete: " + problems.join(", ") + ".");
  }

  await mongoose.connect(process.env.MONGO);
  const port = Number(process.env.PORT) || 4000;
  app.listen(port, () => {
    console.log("Server listening on port " + port + ".");
  });
};

if (require.main === module) {
  startServer().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}

module.exports = app;
