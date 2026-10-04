"use strict";

const { validationResult } = require("express-validator");
const { BadRequestError } = require("../utils/AppError");

module.exports = (req, res, next) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    const error = new BadRequestError("Request validation failed.", "VALIDATION_ERROR");
    error.details = result.array().map(({ path, param, msg }) => ({
      field: path || param,
      message: msg,
    }));
    return next(error);
  }
  return next();
};
