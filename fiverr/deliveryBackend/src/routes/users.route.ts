import express from "express";
import {
  signup,
  login2FAVerification,
  login,
  logout,
  send2FASignupCode,
  resetPassword,
  resend2FALoginCode,
} from "../controllers/user.controller";

const router = express.Router();
//signup
router.post("/send-2fa-code", send2FASignupCode);
router.post("/signup-verify-2fa-code", signup);
router.post("/resend-2fa-code", resend2FALoginCode);
//login
router.post("/login", login);
router.post("/login-verify-2fa", login2FAVerification);

//log HiOutlineBars3BottomRight
router.post("/logout", logout);

//for got password
router.post("/send-email-forgot-password", resend2FALoginCode);
router.post("/reset-password", resetPassword);
export default router;
