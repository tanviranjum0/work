import express from "express";
import {
  handleCreateNewShipment,
  handleInitialHomePageLoad,
  handleGetSingleShipment,
  handleGetInitialShipments,
  handleLoadMoreShipments,
  handleDeleteOneShipment,
  handleShipmentStatusUpdate,
  handleShipmentUpdate,
} from "../controllers/shipment.controller.js";
import checkLogin from "../utils/checkLogin.js";

const router = express.Router();

router.get("/more", checkLogin, handleLoadMoreShipments);
router.get("/home", checkLogin, handleInitialHomePageLoad);
router.get("/:id", checkLogin, handleGetSingleShipment);
router.get("/", checkLogin, handleGetInitialShipments);

router.post("/create", checkLogin, handleCreateNewShipment);
router.post("/update", checkLogin, handleShipmentUpdate);

router.patch("/status", checkLogin, handleShipmentStatusUpdate);

router.delete("/:id", checkLogin, handleDeleteOneShipment);

export default router;
