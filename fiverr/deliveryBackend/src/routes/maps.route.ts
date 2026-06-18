import express from "express";
import { getAutoCompleteSuggestions } from "../controllers/map.controller.js";
import checkLogin from "../utils/checkLogin.js";

const router = express.Router();

router.get("/", checkLogin, (req, res) => {
  res.json({ data: "Good" });
});

router.get("/get-suggestions", getAutoCompleteSuggestions);

export default router;
