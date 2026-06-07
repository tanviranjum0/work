import express from "express";
import {
  signup,
  login,
  send2FASignupCode,
  resend2FALoginCode,
} from "../controllers/auth.controller";

const router = express.Router();

router.post("/signup", signup);
router.post("/send-2fa-code", send2FASignupCode);
router.post("/login", login);
router.post("/verify-2fa-code", signup);
router.post("/resend-2fa-code", resend2FALoginCode);

export default router;
