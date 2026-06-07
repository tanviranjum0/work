import express from "express";
import {
  signup,
  login,
  send2FASignupCode,
} from "../controllers/auth.controller";

const router = express.Router();

router.post("/signup", signup);
router.post("/send-2fa-code", send2FASignupCode);
router.post("/login", login);
router.post("/verify-2fa-code", signup);

export default router;
