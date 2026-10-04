"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
process.env.JWT_SECRET = process.env.JWT_SECRET || "local-test-secret-for-import-check-only";
const jwt = require("jsonwebtoken");
const crypto = require("node:crypto");
const userModel = require("../models/user.model");
const captainModel = require("../models/captain.model");
const rideModel = require("../models/ride.model");
const rideService = require("../services/ride.service");
const { fillTemplate } = require("../templates/mail.template");
const requestSafety = require("../middlewares/requestSafety.middleware");
const { BadRequestError, ForbiddenError } = require("../utils/AppError");

function checkRequest({ body = {}, method = "GET", path = "/", headers = {}, cookies = {} }) {
  let result;
  requestSafety(
    {
      body,
      method,
      path,
      cookies,
      get: (name) => headers[name.toLowerCase()],
    },
    {},
    (error) => {
      result = error;
    },
  );
  return result;
}

test("rejects MongoDB operator and dotted input keys", () => {
  assert.ok(checkRequest({ body: { filter: { "$where": "true" } } }) instanceof BadRequestError);
  assert.ok(checkRequest({ body: { "profile.name": "Rider" } }) instanceof BadRequestError);
});

test("requires an allowlisted origin for cookie-authenticated writes", () => {
  process.env.FRONTEND_ORIGINS = "https://rideback.example";
  assert.ok(
    checkRequest({
      method: "POST",
      cookies: { token: "access" },
      headers: {},
    }) instanceof ForbiddenError,
  );
  assert.equal(
    checkRequest({
      method: "POST",
      cookies: { token: "access" },
      headers: { origin: "https://rideback.example" },
    }),
    undefined,
  );
  assert.equal(
    checkRequest({
      method: "POST",
      cookies: { token: "access" },
      headers: {
        origin: "https://attacker.example",
        authorization: "Bearer valid-access",
      },
    }),
    undefined,
  );
});

test("permits cookie-authenticated safe reads without an Origin header", () => {
  assert.equal(
    checkRequest({ method: "GET", cookies: { token: "access" } }),
    undefined,
  );
});

test("access JWTs are HS256, role-scoped, and expire after 15 minutes", () => {
  for (const [Model, userType] of [
    [userModel, "user"],
    [captainModel, "captain"],
  ]) {
    const token = new Model().generateAuthToken();
    const decoded = jwt.verify(token, process.env.JWT_SECRET, {
      algorithms: ["HS256"],
      issuer: "rideback-api",
      audience: "rideback-client",
    });
    assert.equal(jwt.decode(token, { complete: true }).header.alg, "HS256");
    assert.equal(decoded.userType, userType);
    assert.equal(decoded.exp - decoded.iat, 15 * 60);
  }
});

test("driver matching and ride history queries have supporting indexes", () => {
  assert.ok(captainModel.schema.indexes().some(([fields]) => fields.location === "2dsphere"));
  assert.ok(rideModel.schema.indexes().some(([fields]) => fields.user && fields.status));
  assert.ok(rideModel.schema.indexes().some(([fields]) => fields.captain && fields.status));
});

test("driver registration can precede location updates and OTPs are keyed hashes", () => {
  const captain = new captainModel({
    fullname: { firstname: "Jamie", lastname: "Rider" },
    email: "jamie@example.com",
    password: "long-enough-test-password",
    vehicle: { color: "Blue", number: "ABC-123", capacity: 4, type: "car" },
  });
  assert.equal(captain.validateSync(), undefined);
  assert.equal(captain.location, undefined);

  process.env.OTP_HASH_SECRET = "local-otp-hash-secret-for-test-only-32";
  const otpHash = rideService.hashOtp("123456");
  assert.equal(
    otpHash,
    crypto.createHmac("sha256", process.env.OTP_HASH_SECRET).update("123456").digest("hex"),
  );
  assert.notEqual(otpHash, "123456");
});

test("email template escapes user-provided HTML and blocks unsafe links", () => {
  const html = fillTemplate({
    title: "Welcome",
    name: '<img src=x onerror="alert(1)">',
    message: "Verify your account",
    cta_link: "javascript:alert(1)",
    cta_text: "Verify",
  });
  assert.ok(html.includes("&lt;img src=x onerror=&quot;alert(1)&quot;&gt;"));
  assert.ok(html.includes('href="#"'));
  assert.ok(!html.includes("<img src=x"));
});

test("active Express middleware sets security headers and enforces body safety", async () => {
  process.env.ENVIRONMENT = "development";
  process.env.FRONTEND_ORIGINS = "http://localhost:3000";
  process.env.JWT_SECRET = "local-test-secret-for-import-check-only";
  const { app } = require("../server");
  const server = app.listen(0);
  await new Promise((resolve) => server.once("listening", resolve));
  const origin = `http://127.0.0.1:${server.address().port}`;

  try {
    const healthResponse = await fetch(`${origin}/`, {
      headers: { Origin: "http://localhost:3000" },
    });
    assert.equal(healthResponse.status, 200);
    assert.equal(healthResponse.headers.get("x-content-type-options"), "nosniff");
    assert.equal(
      healthResponse.headers.get("access-control-allow-origin"),
      "http://localhost:3000",
    );

    const refreshResponse = await fetch(`${origin}/auth/refresh`, {
      method: "POST",
      headers: { Origin: "http://localhost:3000" },
    });
    assert.equal(refreshResponse.status, 401);
    assert.equal((await refreshResponse.json()).code, "NO_REFRESH_TOKEN");

    const csrfResponse = await fetch(`${origin}/auth/refresh`, {
      method: "POST",
      headers: {
        Origin: "http://attacker.example",
        Cookie: "refreshToken=invalid",
      },
    });
    assert.equal(csrfResponse.status, 403);
    assert.equal((await csrfResponse.json()).code, "CSRF_REJECTED");

    const unsafeResponse = await fetch(`${origin}/missing`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Origin: "http://localhost:3000",
      },
      body: JSON.stringify({ "$where": "true" }),
    });
    assert.equal(unsafeResponse.status, 400);
    assert.equal((await unsafeResponse.json()).code, "INVALID_INPUT");

    const largeBodyResponse = await fetch(`${origin}/missing`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Origin: "http://localhost:3000",
      },
      body: JSON.stringify({ content: "x".repeat(17_000) }),
    });
    assert.equal(largeBodyResponse.status, 413);
  } finally {
    server.closeAllConnections();
    await new Promise((resolve, reject) =>
      server.close((error) => (error ? reject(error) : resolve())),
    );
  }
});
