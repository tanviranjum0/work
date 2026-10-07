"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");

process.env.JWT_SECRET = process.env.JWT_SECRET || "test-secret-test-secret-test-secret-123";
process.env.OTP_HASH_SECRET = process.env.OTP_HASH_SECRET || "otp-secret-otp-secret-otp-secret-123";

const twoFactor = require("../services/twoFactor.service");
const rideService = require("../services/ride.service");

test("TOTP matches the RFC 6238 SHA-1 vector", () => {
  // Secret "12345678901234567890", time step 1 -> 94287082 (8 digits), so 287082 at 6 digits.
  assert.equal(twoFactor.hotp("GEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQ", 1), "287082");
});

test("TOTP accepts the current code once and rejects a replay or a wrong code", () => {
  const secret = twoFactor.generateSecret();
  const step = twoFactor.currentStep();
  const code = twoFactor.hotp(secret, step);
  assert.equal(twoFactor.verifyTotp(secret, code), step);
  assert.equal(twoFactor.verifyTotp(secret, code, { lastUsedStep: step }), null);
  assert.equal(twoFactor.verifyTotp(secret, "000000"), null);
  assert.equal(twoFactor.verifyTotp(secret, "12345"), null);
});

test("TOTP tolerates one step of clock drift but not more", () => {
  const secret = twoFactor.generateSecret();
  const now = Date.now();
  const previous = twoFactor.hotp(secret, twoFactor.currentStep(now) - 1);
  const old = twoFactor.hotp(secret, twoFactor.currentStep(now) - 3);
  assert.ok(twoFactor.verifyTotp(secret, previous, { now }));
  assert.equal(twoFactor.verifyTotp(secret, old, { now }), null);
});

test("stored 2FA secrets round-trip through encryption and are not plain text", () => {
  const secret = twoFactor.generateSecret();
  const stored = twoFactor.encryptSecret(secret);
  assert.ok(!stored.includes(secret));
  assert.equal(twoFactor.decryptSecret(stored), secret);
});

test("recovery codes hash consistently regardless of formatting", () => {
  const [code] = twoFactor.generateRecoveryCodes(1);
  assert.match(code, /^[a-z0-9]{4}-[a-z0-9]{4}$/);
  assert.equal(twoFactor.hashRecoveryCode(code), twoFactor.hashRecoveryCode(code.toUpperCase().replace("-", " ")));
});

test("pickup code is derived from the ride id and is always 6 digits", () => {
  const id = "65f0c0ffee00000000000001";
  assert.match(rideService.deriveOtp(id), /^\d{6}$/);
  assert.equal(rideService.deriveOtp(id), rideService.deriveOtp(id));
  assert.notEqual(rideService.deriveOtp(id), rideService.deriveOtp("65f0c0ffee00000000000002"));
});

test("riders see their pickup code, captains never do, and phone numbers stay hidden until accepted", () => {
  const id = "65f0c0ffee00000000000001";
  const otp = rideService.deriveOtp(id);
  const base = {
    _id: id,
    status: "pending",
    pickup: "A",
    destination: "B",
    fare: 5,
    vehicle: "car",
    createdAt: new Date(),
    otpHash: rideService.hashOtp(otp),
    user: { _id: "u1", fullname: { firstname: "Rae" }, phone: "1111111111" },
  };
  assert.equal(rideService.toClientRide(base, "user").otp, otp);
  assert.equal(rideService.toClientRide(base, "captain").otp, undefined);
  assert.equal(rideService.toClientRide(base, "captain").user.phone, undefined);

  const accepted = { ...base, status: "accepted", captain: { _id: "c1", fullname: { firstname: "Cy" }, phone: "2222222222" } };
  assert.equal(rideService.toClientRide(accepted, "captain").user.phone, "1111111111");
  assert.equal(rideService.toClientRide(accepted, "user").captain.phone, "2222222222");

  const ongoing = { ...accepted, status: "ongoing" };
  assert.equal(rideService.toClientRide(ongoing, "user").otp, undefined);
});

test("great-circle distance is sensible", () => {
  const km = rideService.distanceKm({ ltd: 28.6139, lng: 77.209 }, { ltd: 28.6129, lng: 77.2295 });
  assert.ok(km > 1.8 && km < 2.2, `got ${km}`);
});
