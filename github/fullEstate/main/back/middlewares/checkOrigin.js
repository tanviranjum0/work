const isProduction = process.env.NODE_ENV === "production";
const defaultOrigins = isProduction
  ? ["https://rt-estate.vercel.app"]
  : ["http://localhost:5173", "http://localhost:4000", "http://localhost:3010"];
const configuredOrigins = [
  ...defaultOrigins,
  process.env.FRONTEND_ORIGIN,
  ...(process.env.CORS_ORIGINS || "").split(","),
].filter(Boolean);

const allowedOrigins = new Set(configuredOrigins.map((origin) => origin.trim()));

const checkOrigin = (req, res, next) => {
  const origin = req.get("Origin");
  if (origin && allowedOrigins.has(origin)) return next();
  return res.status(403).json({ message: "Request origin is missing or is not allowed." });
};

module.exports = { allowedOrigins, checkOrigin };
