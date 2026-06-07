import express from "express";
import {
  signup,
  login2FAVerification,
  login,
  send2FASignupCode,
  resend2FALoginCode,
} from "../controllers/auth.controller";

const router = express.Router();
//signup
router.post("/send-2fa-code", send2FASignupCode);
router.post("/signup-verify-2fa-code", signup);
router.post("/resend-2fa-code", resend2FALoginCode);
//login
router.post("/login", login);
router.post("/login-verify-2fa", login2FAVerification);
export default router;
