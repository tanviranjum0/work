"use strict";

const { BadRequestError, ForbiddenError } = require("../utils/AppError");
const { getAllowedOrigins } = require("../config/security");

const forbiddenKeys = new Set(["__proto__", "prototype", "constructor"]);
const unsafeMethods = new Set(["POST", "PUT", "PATCH", "DELETE"]);

function containsUnsafeKey(value) {
  if (Array.isArray(value)) return value.some(containsUnsafeKey);
  if (!value || typeof value !== "object") return false;
  return Object.entries(value).some(([key, nested]) =>
    key.startsWith("$") ||
    key.includes(".") ||
    forbiddenKeys.has(key) ||
    containsUnsafeKey(nested),
  );
}

module.exports = (req, res, next) => {
  if (containsUnsafeKey(req.body)) {
    return next(new BadRequestError("Request contains unsupported fields.", "INVALID_INPUT"));
  }

  const bearerAuthenticated = /^Bearer\s+\S+$/i.test(req.get("authorization") || "");
  const accessCookieAuthenticated = Boolean(req.cookies?.token) && !bearerAuthenticated;
  const refreshCookieAuthenticated =
    req.path === "/auth/refresh" && Boolean(req.cookies?.refreshToken);
  if ((accessCookieAuthenticated || refreshCookieAuthenticated) && unsafeMethods.has(req.method)) {
    const origin = req.get("origin");
    if (!origin || !getAllowedOrigins().includes(origin)) {
      return next(new ForbiddenError("Request origin is not allowed.", "CSRF_REJECTED"));
    }
  }
  return next();
};
