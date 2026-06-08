import express, { Request, Response, Application } from "express";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import mongoSanitize from "mongo-sanitize";
import cors from "cors";
import cookieParser from "cookie-parser";
import { xss } from "express-xss-sanitizer";
import dotenv from "dotenv";
import userRoutes from "./routes/user.route.js";
import connectDB from "./config/db";
import dns from "node:dns";
import checkLogin from "./utils/checkLogin.js";
import { NextFunction } from "express";
dotenv.config();
dns.setServers(["8.8.8.8", "8.8.4.4", "1.1.1.1"]);
const app: Application = express();
const PORT = process.env.PORT || 4000;
const MONGO_URL = process.env.MONGO_URL;
// console.log("MongoDB URL:", MONGO_URL);
connectDB(MONGO_URL || "mongodb://localhost:27017/deliveryApp");
// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Use Helmet to set secure HTTP headers
app.use(helmet());
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  }),
);

app.use((req, _res, next) => {
  req.body = mongoSanitize(req.body);
  next();
});
app.use(xss());
// Limit API requests to stop brute-force or DoS attacks
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per window
});
app.use(limiter);
// Sample Route with strict types
app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Welcome to Express with TypeScript!" });
});
app.get(
  "/api/test",
  checkLogin,
  (req: Request, res: Response, next: NextFunction) => {
    res.json({ message: "You are authenticated and can access this route!" });
  },
);
// User Routes
app.use("/api/users", userRoutes);

// Start Server
app.listen(PORT, () => {
  console.log(`Server is safely running on port: ${PORT}`);
});
