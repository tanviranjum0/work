import express from "express";
import {
  handleCreateNewShipment,
  handleInitialHomePageLoad,
  handleGetSingleShipment,
  handleGetShipments,
  handleDeleteOneShipment,
  handleShipmentUpdate,
} from "../controllers/shipment.controller";
import checkLogin from "../utils/checkLogin";

const router = express.Router();

router.post("/create", checkLogin, handleCreateNewShipment);
router.get("/", checkLogin, handleGetShipments);
router.get("/home", checkLogin, handleInitialHomePageLoad);
router.get("/:id", checkLogin, handleGetSingleShipment);
router.delete("/:id", checkLogin, handleDeleteOneShipment);
router.patch("/:id", checkLogin, handleShipmentUpdate);
export default router;
