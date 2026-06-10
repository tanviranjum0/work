import express from "express";
import { getAutoCompleteSuggestions } from "../controllers/map.controller";

const router = express.Router();

router.get("/", (req, res) => {
  console.log("holla");
  res.json({ data: "Good" });
});

router.get("/get-suggestions", getAutoCompleteSuggestions);

export default router;
