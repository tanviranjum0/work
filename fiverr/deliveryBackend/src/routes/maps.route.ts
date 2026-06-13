import express from "express";
import { getAutoCompleteSuggestions } from "../controllers/map.controller";
import checkLogin from "../utils/checkLogin";

const router = express.Router();

router.get("/", checkLogin, (req, res) => {
  res.json({ data: "Good" });
});

router.get("/get-suggestions", getAutoCompleteSuggestions);

export default router;
