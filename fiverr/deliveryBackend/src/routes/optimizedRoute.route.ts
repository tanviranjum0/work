import express from "express";
import { handleInitialOptimizedRoute } from "../controllers/optimizedRoute.controller.js";
const router = express.Router();
router.get("/initial", handleInitialOptimizedRoute);
export default router;
