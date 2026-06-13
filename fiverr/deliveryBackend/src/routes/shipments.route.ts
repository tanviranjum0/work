import express from "express";
import { handleCreateNewShipment } from "../controllers/shipment.controller";
import checkLogin from "../utils/checkLogin";

const router = express.Router();

router.get("/", (req, res) => {
  console.log("holla");
  res.json({ data: "Good" });
});

router.post("/create", checkLogin, handleCreateNewShipment);

export default router;
