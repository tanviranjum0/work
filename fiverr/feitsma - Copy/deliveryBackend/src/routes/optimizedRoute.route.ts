import express, { RequestHandler } from "express";
import {
  handleGetInitialOptimizedRoutes,
  handleOptimizedRoute,
  handleSingleRoute,
  handleDeleteRoute,
  handleCompleteRoute,
  handleStartOptimizeRoute,
  handleCreateNewOptimizedRoute,
  handleGetInitialDataForGetRoute,
} from "../controllers/optimizedRoute.controller.js";
import checkLogin from "../utils/checkLogin.js";
import { calculateSequentialShipmentTimingsHandler } from "../services/sequentialtraveltiming.service.js";

const router = express.Router();

router.get("/all", checkLogin, handleGetInitialOptimizedRoutes);
router.get("/initial", checkLogin, handleGetInitialDataForGetRoute);
router.get("/:id", checkLogin, handleSingleRoute);
router.post("/times", checkLogin, calculateSequentialShipmentTimingsHandler);
router.post("/optimized", checkLogin, handleOptimizedRoute);
router.post("/start", checkLogin, handleStartOptimizeRoute);
router.post(
  "/create",
  checkLogin,
  handleCreateNewOptimizedRoute as unknown as RequestHandler,
);
router.post("/complete/:id", checkLogin, handleCompleteRoute);
router.delete(
  "/delete/:id",
  checkLogin,
  handleDeleteRoute as unknown as RequestHandler,
);

export default router;
