"use strict";

function getAllowedOrigins() {
  const configured = process.env.FRONTEND_ORIGINS || process.env.CLIENT_URL;
  if (process.env.ENVIRONMENT === "production" && !configured) {
    throw new Error("FRONTEND_ORIGINS or CLIENT_URL must be configured in production.");
  }

  const origins = (configured || "http://localhost:3000,http://localhost:5173")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean)
    .map((value) => {
      const url = new URL(value);
      if (
        !["http:", "https:"].includes(url.protocol) ||
        (process.env.ENVIRONMENT === "production" && url.protocol !== "https:") ||
        url.username ||
        url.password ||
        url.pathname !== "/" ||
        url.search ||
        url.hash
      ) {
        throw new Error("FRONTEND_ORIGINS entries must be exact HTTP(S) origins.");
      }
      return url.origin;
    });

  if (origins.length === 0) throw new Error("At least one frontend origin must be configured.");
  return [...new Set(origins)];
}

module.exports = { getAllowedOrigins };
