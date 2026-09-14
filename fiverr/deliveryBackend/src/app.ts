import express, { Request, Response, Application } from "express";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import mongoSanitize from "mongo-sanitize";
import cors from "cors";
import cookieParser from "cookie-parser";
import { xss } from "express-xss-sanitizer";
import dotenv from "dotenv";
import userRoutes from "./routes/users.route.js";
import connectDB from "./config/db.js";
import dns from "node:dns";
import mapRoutes from "./routes/maps.route.js";
import optimizedRoutes from "./routes/optimizedRoute.route.js";
import shipmentRoutes from "./routes/shipments.route.js";

dotenv.config();
dns.setServers(["8.8.8.8", "8.8.4.4", "1.1.1.1"]);
const app: Application = express();
const MONGO_URL = process.env.MONGO_URL;
connectDB(MONGO_URL || "mongodb://localhost:27017/deliveryApp");
// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("trust proxy", 1);
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
// User Routes
app.use("/api/users", userRoutes);
app.use("/api/maps", mapRoutes);
app.use("/api/shipments", shipmentRoutes);
app.use("/api/routes", optimizedRoutes);

// Start Server
const PORT = Number(process.env.PORT) || 4000;
app.listen(PORT, () => {
  console.log(`Server is safely running on port: ${PORT}`);
});
