"use strict";

const logger = require("../utils/logger");
const { AppError } = require("../utils/AppError");

function normalizeError(error) {
  if (error instanceof AppError) return error;
  if (error?.name === "CastError") {
    return new AppError("Invalid resource identifier.", 400, "INVALID_ID");
  }
  if (error?.code === 11000) {
    return new AppError("A record with those details already exists.", 409, "DUPLICATE_RECORD");
  }
  if (error?.name === "ValidationError") {
    return new AppError("Request validation failed.", 400, "VALIDATION_ERROR");
  }
  if (["MongoNetworkError", "MongoServerSelectionError", "MongooseServerSelectionError"].includes(error?.name)) {
    return new AppError("We are having trouble reaching our servers. Please try again.", 503, "SERVICE_UNAVAILABLE");
  }
  if (error?.name === "TokenExpiredError") {
    return new AppError("Authentication token has expired.", 401, "TOKEN_EXPIRED");
  }
  if (error?.name === "JsonWebTokenError") {
    return new AppError("Invalid authentication token.", 401, "INVALID_TOKEN");
  }
  if (error?.type === "entity.too.large") {
    return new AppError("Request body is too large.", 413, "PAYLOAD_TOO_LARGE");
  }
  if (error?.type === "entity.parse.failed") {
    return new AppError("Malformed request body.", 400, "INVALID_JSON");
  }
  return new AppError("An unexpected error occurred.", 500, "INTERNAL_ERROR");
}

module.exports = (error, req, res, next) => {
  if (res.headersSent) return next(error);
  const normalized = normalizeError(error);

  logger.error("Request failed", {
    code: normalized.code,
    statusCode: normalized.statusCode,
    method: req.method,
    path: req.path,
    requestId: req.id,
    ...(normalized.statusCode >= 500 && {
      errorName: error.name,
      errorCode: error.code,
    }),
  });

  const response = {
    status: normalized.statusCode < 500 ? "fail" : "error",
    code: normalized.code,
    message: normalized.message,
    ...(req.id && { requestId: req.id }),
  };
  if (normalized.details) response.details = normalized.details;
  if (process.env.ENVIRONMENT !== "production" && error.stack) response.stack = error.stack;
  return res.status(normalized.statusCode).json(response);
};
