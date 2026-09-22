import express, { Request, Response, Application, NextFunction } from "express";
import helmet from "helmet";
import { rateLimit } from "express-rate-limit";
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
import path from "path";

dotenv.config();
dns.setServers(["8.8.8.8", "8.8.4.4", "1.1.1.1"]);

const app: Application = express();
const MONGO_URL = process.env.MONGO_URL;

// Connect to Database
connectDB(MONGO_URL || "mongodb://localhost:27017/deliveryDB");


// 1. Trust proxy (must be early)
app.set("trust proxy", 1);

// 2. Security headers
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],

        scriptSrc: [
          "'self'",
          "https://maps.googleapis.com",
          "https://maps.gstatic.com",
        ],

        connectSrc: [
          "'self'",
          "https://maps.googleapis.com",
          "https://maps.gstatic.com",
        ],

        imgSrc: ["'self'", "data:", "blob:", "https:"],

        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],

        fontSrc: ["'self'", "https://fonts.gstatic.com", "data:"],

        frameSrc: ["'self'", "https://www.google.com"],
      },
    },
  }),
);

// 3. CORS (single configuration)
const allowedOrigins =[process.env.FRONTEND_URL || "http://localhost:4000"];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

// 4. Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

app.use("/api/", limiter); // Apply rate limiting only to API routes

// 5. Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 6. Data sanitization & XSS protection (after body parsing)
app.use((req: Request, _res: Response, next: NextFunction) => {
  if (req.body) {
    req.body = mongoSanitize(req.body);
  }
  next();
});
app.use(xss());

// 7. Cookie parsing
app.use(cookieParser(process.env.COOKIE_SECRET));

// STATIC FILES & SPA

const frontendPath = path.join(import.meta.dirname, "../../reactFrontend/dist");

// 8. Static files for built assets
app.use(express.static(path.join(import.meta.dirname, "public")));
app.use(express.static(frontendPath));

// API ROUTES

// 9. API route handlers
app.use("/api/users", userRoutes);
app.use("/api/maps", mapRoutes);
app.use("/api/shipments", shipmentRoutes);
app.use("/api/routes", optimizedRoutes);

// 10. SPA fallback route (catch-all for client-side routing)
// MUST be before error handler and after all other routes
app.get("/{*splat}", (_req: Request, res: Response) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

// ERROR HANDLER

// 11. Global error handler (ALWAYS last)
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  console.error(`[Error] ${statusCode}: ${message}`);

  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

// START SERVER

const PORT = Number(process.env.PORT) || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is safely running on port: ${PORT}`);
});
