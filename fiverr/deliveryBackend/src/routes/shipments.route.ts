import express from "express";
import {
  handleCreateNewShipment,
  handleInitialHomePageLoad,
  handleGetSingleShipment,
} from "../controllers/shipment.controller";
import checkLogin from "../utils/checkLogin";

const router = express.Router();

router.get("/", (req, res) => {
  console.log("holla");
  res.json({ data: "Good" });
});

router.post("/create", checkLogin, handleCreateNewShipment);
router.get("/home", checkLogin, handleInitialHomePageLoad);
router.get("/:id", checkLogin, handleGetSingleShipment);

export default router;
