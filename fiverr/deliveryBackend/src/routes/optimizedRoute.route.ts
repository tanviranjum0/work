import express from "express";
import {
  handleInitialOptimizedRoute,
  handleOptimizedRoute,
  handleSingleRoute,
  handleStartOptimizeRoute,
  handleCreateNewOptimizedRoute,
} from "../controllers/optimizedRoute.controller.js";
import checkLogin from "../utils/checkLogin.js";
const router = express.Router();
router.get("/initial", checkLogin, handleInitialOptimizedRoute);
router.get("/:id", checkLogin, handleSingleRoute);
router.post("/optimized", checkLogin, handleOptimizedRoute);
router.post("/start", checkLogin, handleStartOptimizeRoute);
router.post("/create", checkLogin, handleCreateNewOptimizedRoute);
export default router;
