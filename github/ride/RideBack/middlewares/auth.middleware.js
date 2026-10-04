const blacklistTokenModel = require("../models/blacklistToken.model");
const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model");
const captainModel = require("../models/captain.model");
const catchAsync = require("../utils/catchAsync");
const { UnauthorizedError } = require("../utils/AppError");

function extractToken(req) {
  const authorization = req.get("authorization");
  if (authorization) {
    const match = /^Bearer ([^\s]+)$/i.exec(authorization);
    return match?.[1] || null;
  }
  return req.cookies?.token || null;
}

const authenticate = (expectedType) => catchAsync(async (req, res, next) => {
  const token = extractToken(req);
  if (!token) throw new UnauthorizedError("Authentication is required.", "NO_TOKEN");

  const decoded = jwt.verify(token, process.env.JWT_SECRET, {
    algorithms: ["HS256"],
    issuer: process.env.JWT_ISSUER || "rideback-api",
    audience: process.env.JWT_AUDIENCE || "rideback-client",
  });
  if (
    !decoded ||
    typeof decoded === "string" ||
    decoded.purpose !== "access" ||
    decoded.userType !== expectedType
  ) {
    throw new UnauthorizedError("Invalid credentials.", "INVALID_ROLE");
  }

  const revoked = await blacklistTokenModel.exists({ token });
  if (revoked) throw new UnauthorizedError("Authentication is no longer valid.", "TOKEN_REVOKED");

  const Model = expectedType === "user" ? userModel : captainModel;
  const account = await Model.findById(decoded.id).select("-__v +tokenVersion").lean();
  if (!account) throw new UnauthorizedError("Invalid credentials.", "ACCOUNT_UNAVAILABLE");
  if ((decoded.version || 0) !== (account.tokenVersion || 0)) {
    throw new UnauthorizedError("Authentication is no longer valid.", "TOKEN_REVOKED");
  }

  req.authToken = token;
  req.authUserId = account._id;
  req.userType = expectedType;
  const { tokenVersion, ...safeAccount } = account;
  if (safeAccount.rides) safeAccount.rides = safeAccount.rides.slice(-50);
  if (expectedType === "user") req.user = safeAccount;
  else req.captain = safeAccount;
  return next();
});

module.exports.authUser = authenticate("user");
module.exports.authCaptain = authenticate("captain");
module.exports.authAny = catchAsync(async (req, res, next) => {
  const token = extractToken(req);
  if (!token) throw new UnauthorizedError("Authentication is required.", "NO_TOKEN");
  const decoded = jwt.verify(token, process.env.JWT_SECRET, {
    algorithms: ["HS256"],
    issuer: process.env.JWT_ISSUER || "rideback-api",
    audience: process.env.JWT_AUDIENCE || "rideback-client",
  });
  if (
    !decoded ||
    typeof decoded === "string" ||
    decoded.purpose !== "access" ||
    !["user", "captain"].includes(decoded.userType)
  ) {
    throw new UnauthorizedError("Invalid credentials.", "INVALID_ROLE");
  }
  const revoked = await blacklistTokenModel.exists({ token });
  if (revoked) throw new UnauthorizedError("Authentication is no longer valid.", "TOKEN_REVOKED");
  const Model = decoded.userType === "user" ? userModel : captainModel;
  const account = await Model.findById(decoded.id).select("-__v +tokenVersion").lean();
  if (!account) throw new UnauthorizedError("Invalid credentials.", "ACCOUNT_UNAVAILABLE");
  if ((decoded.version || 0) !== (account.tokenVersion || 0)) {
    throw new UnauthorizedError("Authentication is no longer valid.", "TOKEN_REVOKED");
  }
  req.authToken = token;
  req.authUserId = account._id;
  req.userType = decoded.userType;
  const { tokenVersion, ...safeAccount } = account;
  if (safeAccount.rides) safeAccount.rides = safeAccount.rides.slice(-50);
  if (decoded.userType === "user") req.user = safeAccount;
  else req.captain = safeAccount;
  return next();
});
