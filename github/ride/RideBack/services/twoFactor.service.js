"use strict";

// Time-based one-time passwords (RFC 6238) for authenticator apps, plus single-use
// recovery codes. No third-party dependency: SHA-1 HMAC, 30 s steps, 6 digits.
const crypto = require("node:crypto");

const BASE32 = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
const STEP_SECONDS = 30;
const DIGITS = 6;
const ISSUER = "QuickRide";

function base32Encode(buffer) {
  let bits = 0;
  let value = 0;
  let out = "";
  for (const byte of buffer) {
    value = (value << 8) | byte;
    bits += 8;
    while (bits >= 5) {
      out += BASE32[(value >>> (bits - 5)) & 31];
      bits -= 5;
    }
  }
  if (bits > 0) out += BASE32[(value << (5 - bits)) & 31];
  return out;
}

function base32Decode(text) {
  let bits = 0;
  let value = 0;
  const bytes = [];
  for (const char of text.replace(/=+$/, "").toUpperCase()) {
    const index = BASE32.indexOf(char);
    if (index === -1) throw new Error("Invalid base32 secret.");
    value = (value << 5) | index;
    bits += 5;
    if (bits >= 8) {
      bytes.push((value >>> (bits - 8)) & 255);
      bits -= 8;
    }
  }
  return Buffer.from(bytes);
}

function generateSecret() {
  return base32Encode(crypto.randomBytes(20));
}

function hotp(secretBase32, counter) {
  const message = Buffer.alloc(8);
  message.writeBigUInt64BE(BigInt(counter));
  const digest = crypto.createHmac("sha1", base32Decode(secretBase32)).update(message).digest();
  const offset = digest[digest.length - 1] & 15;
  const binary =
    ((digest[offset] & 127) << 24) |
    (digest[offset + 1] << 16) |
    (digest[offset + 2] << 8) |
    digest[offset + 3];
  return String(binary % 10 ** DIGITS).padStart(DIGITS, "0");
}

const currentStep = (now = Date.now()) => Math.floor(now / 1000 / STEP_SECONDS);

// Returns the matched time step (so the caller can reject a replay of the same code) or null.
// Accepts one step either side to tolerate clock drift between phone and server.
function verifyTotp(secretBase32, code, { now = Date.now(), lastUsedStep = 0, window = 1 } = {}) {
  if (typeof code !== "string" || !/^\d{6}$/.test(code)) return null;
  const step = currentStep(now);
  const submitted = Buffer.from(code);
  for (let offset = -window; offset <= window; offset += 1) {
    const candidateStep = step + offset;
    if (candidateStep <= lastUsedStep) continue;
    const expected = Buffer.from(hotp(secretBase32, candidateStep));
    if (crypto.timingSafeEqual(expected, submitted)) return candidateStep;
  }
  return null;
}

function otpauthUri(secret, accountName) {
  const label = encodeURIComponent(`${ISSUER}:${accountName}`);
  const params = new URLSearchParams({
    secret,
    issuer: ISSUER,
    algorithm: "SHA1",
    digits: String(DIGITS),
    period: String(STEP_SECONDS),
  });
  return `otpauth://totp/${label}?${params.toString()}`;
}

// The TOTP secret is stored encrypted so a database leak alone cannot mint valid codes.
function encryptionKey() {
  const material = process.env.TWO_FACTOR_KEY || process.env.JWT_SECRET;
  return crypto.createHash("sha256").update(`quickride:2fa:${material}`).digest();
}

function encryptSecret(secret) {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", encryptionKey(), iv);
  const encrypted = Buffer.concat([cipher.update(secret, "utf8"), cipher.final()]);
  return [iv, cipher.getAuthTag(), encrypted].map((part) => part.toString("base64")).join(".");
}

function decryptSecret(stored) {
  const [iv, tag, encrypted] = stored.split(".").map((part) => Buffer.from(part, "base64"));
  const decipher = crypto.createDecipheriv("aes-256-gcm", encryptionKey(), iv);
  decipher.setAuthTag(tag);
  return Buffer.concat([decipher.update(encrypted), decipher.final()]).toString("utf8");
}

const RECOVERY_ALPHABET = "abcdefghjkmnpqrstuvwxyz23456789";

function generateRecoveryCodes(count = 8) {
  return Array.from({ length: count }, () => {
    const raw = Array.from(crypto.randomBytes(8), (b) => RECOVERY_ALPHABET[b % RECOVERY_ALPHABET.length]);
    return `${raw.slice(0, 4).join("")}-${raw.slice(4).join("")}`;
  });
}

function normalizeRecoveryCode(code) {
  return String(code || "").toLowerCase().replace(/[^a-z0-9]/g, "");
}

function hashRecoveryCode(code) {
  return crypto
    .createHmac("sha256", process.env.OTP_HASH_SECRET || process.env.JWT_SECRET)
    .update(normalizeRecoveryCode(code))
    .digest("hex");
}

module.exports = {
  generateSecret,
  verifyTotp,
  currentStep,
  otpauthUri,
  encryptSecret,
  decryptSecret,
  generateRecoveryCodes,
  hashRecoveryCode,
  normalizeRecoveryCode,
  hotp,
  base32Decode,
};
