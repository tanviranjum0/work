import express from "express";
import {
  handleInitialOptimizedRoute,
  handleOptimizedRoute,
  handleStartOptimizeRoute,
} from "../controllers/optimizedRoute.controller.js";
import checkLogin from "../utils/checkLogin.js";
const router = express.Router();
router.get("/initial", checkLogin, handleInitialOptimizedRoute);
router.post("/optimized", checkLogin, handleOptimizedRoute);
router.post("/start", checkLogin, handleStartOptimizeRoute);
export default router;
