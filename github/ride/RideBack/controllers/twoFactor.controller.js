"use strict";

const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const twoFactor = require("../services/twoFactor.service");
const { issueSession } = require("../services/authSession.service");
const {
  AppError,
  BadRequestError,
  ConflictError,
  UnauthorizedError,
} = require("../utils/AppError");

const MAX_FAILED_ATTEMPTS = 5;
const LOCK_MINUTES = 15;
const SELECT_SECRETS =
  "+tokenVersion +twoFactor.secret +twoFactor.lastUsedStep +twoFactor.failedAttempts +twoFactor.lockedUntil +twoFactor.recoveryCodes";

const jwtOptions = () => ({
  algorithm: "HS256",
  issuer: process.env.JWT_ISSUER || "rideback-api",
  audience: process.env.JWT_AUDIENCE || "rideback-client",
});

function signPurposeToken(account, userType, purpose, expiresIn) {
  return jwt.sign({ id: account._id, userType, purpose }, process.env.JWT_SECRET, {
    ...jwtOptions(),
    expiresIn,
  });
}

function readPurposeToken(token, userType, purpose) {
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET, {
      algorithms: ["HS256"],
      issuer: jwtOptions().issuer,
      audience: jwtOptions().audience,
    });
    if (payload.purpose !== purpose || payload.userType !== userType) throw new Error("wrong purpose");
    return payload;
  } catch (error) {
    const expired = error.name === "TokenExpiredError";
    throw new UnauthorizedError(
      expired
        ? "This step timed out. Please start again."
        : "This verification step is no longer valid. Please start again.",
      expired ? "TWO_FACTOR_SESSION_EXPIRED" : "TWO_FACTOR_SESSION_INVALID",
    );
  }
}

module.exports = function createTwoFactor({ Model, userType, serialize }) {
  const payloadKey = userType === "user" ? "user" : "captain";

  // Generates a fresh secret and returns what the client needs to show a QR code.
  async function beginEnrollment(account) {
    const secret = twoFactor.generateSecret();
    account.twoFactor.enabled = false;
    account.twoFactor.secret = twoFactor.encryptSecret(secret);
    account.twoFactor.lastUsedStep = 0;
    account.twoFactor.failedAttempts = 0;
    account.twoFactor.lockedUntil = undefined;
    await account.save();
    return {
      enrollmentToken: signPurposeToken(account, userType, "2fa-enroll", "15m"),
      setup: {
        secret,
        otpauthUri: twoFactor.otpauthUri(secret, account.email),
        accountName: account.email,
      },
    };
  }

  function startChallenge(account) {
    return {
      requiresTwoFactor: true,
      challengeToken: signPurposeToken(account, userType, "2fa-challenge", "5m"),
    };
  }

  function assertNotLocked(account) {
    const lockedUntil = account.twoFactor?.lockedUntil;
    if (lockedUntil && lockedUntil > new Date()) {
      const minutes = Math.ceil((lockedUntil - Date.now()) / 60000);
      throw new AppError(
        `Too many incorrect codes. Try again in ${minutes} minute${minutes === 1 ? "" : "s"}.`,
        429,
        "TWO_FACTOR_LOCKED",
      );
    }
  }

  async function registerFailure(account) {
    const failures = (account.twoFactor.failedAttempts || 0) + 1;
    account.twoFactor.failedAttempts = failures >= MAX_FAILED_ATTEMPTS ? 0 : failures;
    if (failures >= MAX_FAILED_ATTEMPTS) {
      account.twoFactor.lockedUntil = new Date(Date.now() + LOCK_MINUTES * 60_000);
    }
    await account.save();
    throw new UnauthorizedError(
      "That code is not right. Check your authenticator app and try again.",
      "INVALID_TWO_FACTOR_CODE",
    );
  }

  // Accepts either an authenticator code or an unused recovery code.
  async function verifySecondFactor(account, { code, recoveryCode }) {
    assertNotLocked(account);
    if (!account.twoFactor?.secret) {
      throw new ConflictError("Two-factor authentication is not set up for this account.", "TWO_FACTOR_NOT_SET_UP");
    }

    if (recoveryCode) {
      const hash = twoFactor.hashRecoveryCode(recoveryCode);
      const entry = account.twoFactor.recoveryCodes?.find((item) => item.hash === hash && !item.usedAt);
      if (!entry) return registerFailure(account);
      entry.usedAt = new Date();
      account.twoFactor.failedAttempts = 0;
      await account.save();
      return { usedRecoveryCode: true };
    }

    const step = twoFactor.verifyTotp(twoFactor.decryptSecret(account.twoFactor.secret), code, {
      lastUsedStep: account.twoFactor.lastUsedStep || 0,
    });
    if (!step) return registerFailure(account);
    account.twoFactor.lastUsedStep = step;
    account.twoFactor.failedAttempts = 0;
    account.twoFactor.lockedUntil = undefined;
    await account.save();
    return { usedRecoveryCode: false };
  }

  const activate = asyncHandler(async (req, res) => {
    const { enrollmentToken, code } = req.body;
    const payload = readPurposeToken(enrollmentToken, userType, "2fa-enroll");
    const account = await Model.findById(payload.id).select(SELECT_SECRETS);
    if (!account) {
      throw new UnauthorizedError("Account not found. Please sign up again.", "ACCOUNT_UNAVAILABLE");
    }
    if (account.twoFactor?.enabled) {
      throw new ConflictError("Two-factor authentication is already on for this account.", "TWO_FACTOR_ALREADY_ENABLED");
    }

    await verifySecondFactor(account, { code });

    const recoveryCodes = twoFactor.generateRecoveryCodes();
    account.twoFactor.enabled = true;
    account.twoFactor.enabledAt = new Date();
    account.twoFactor.recoveryCodes = recoveryCodes.map((item) => ({ hash: twoFactor.hashRecoveryCode(item) }));
    const wasPending = account.registrationStatus === "pending_2fa";
    account.registrationStatus = "active";
    await account.save();

    const token = await issueSession(account, userType, res);
    return res.status(wasPending ? 201 : 200).json({
      message: wasPending ? "Account created" : "Two-factor authentication is on",
      token,
      [payloadKey]: serialize(account),
      recoveryCodes,
    });
  });

  const completeLogin = asyncHandler(async (req, res) => {
    const { challengeToken, code, recoveryCode } = req.body;
    if (!code && !recoveryCode) {
      throw new BadRequestError("Enter the 6-digit code from your authenticator app.", "CODE_REQUIRED");
    }
    const payload = readPurposeToken(challengeToken, userType, "2fa-challenge");
    const account = await Model.findById(payload.id).select(SELECT_SECRETS);
    if (!account || account.registrationStatus === "pending_2fa") {
      throw new UnauthorizedError("Account is unavailable.", "ACCOUNT_UNAVAILABLE");
    }

    const result = await verifySecondFactor(account, { code, recoveryCode });
    const token = await issueSession(account, userType, res);
    const remaining = account.twoFactor.recoveryCodes?.filter((item) => !item.usedAt).length ?? 0;
    return res.status(200).json({
      message: "Logged in successfully",
      token,
      [payloadKey]: serialize(account),
      ...(result.usedRecoveryCode && { recoveryCodesRemaining: remaining }),
    });
  });

  // Lets an already signed-in account (created before 2FA existed) turn it on.
  const setup = asyncHandler(async (req, res) => {
    const account = await Model.findById(req.authUserId).select(SELECT_SECRETS);
    if (account.twoFactor?.enabled) {
      throw new ConflictError("Two-factor authentication is already on for this account.", "TWO_FACTOR_ALREADY_ENABLED");
    }
    return res.status(200).json(await beginEnrollment(account));
  });

  return { beginEnrollment, startChallenge, activate, completeLogin, setup };
};
