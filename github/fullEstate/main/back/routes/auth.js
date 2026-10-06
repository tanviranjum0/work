const {
  signup,
  login,
  signOut,
  checkIfAlreadyLoggedIn,
} = require("../handlers/auth");
const { uploadAvatar } = require("../handlers/upload");
const { rateLimit } = require("express-rate-limit");
const { checkOrigin } = require("../middlewares/checkOrigin");
const uploadImage = require("../middlewares/uploadImage");
const express = require("express");

const router = express.Router();
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  skipSuccessfulRequests: true,
  handler: (_req, res) =>
    res.status(429).json({ message: "Too many attempts. Please try again later." }),
});
const avatarUploadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 6,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  handler: (_req, res) =>
    res.status(429).json({ message: "Too many image uploads. Please try again later." }),
});

router.get("/check-login", checkIfAlreadyLoggedIn);
router.post("/upload-avatar", checkOrigin, avatarUploadLimiter, uploadImage.single("file"), uploadAvatar);
router.post("/signup", checkOrigin, authLimiter, signup);
router.post("/login", checkOrigin, authLimiter, login);
router.post("/signout", checkOrigin, signOut);

module.exports = router;
