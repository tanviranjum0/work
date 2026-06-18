import { Request, Response } from "express";
import Shipment from "../models/Shipment.js";

export const handleInitialOptimizedRoute = async (
  req: Request,
  res: Response,
) => {
  const shipments = await Shipment.find({});
  res.json(shipments);
};
