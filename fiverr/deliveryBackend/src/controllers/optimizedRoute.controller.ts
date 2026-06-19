import { Request, Response } from "express";
import Shipment, { ShipmentDocument } from "../models/Shipment.js";

export const handleOptimizedRoute = async (
  req: Request & { userId?: string },
  res: Response,
) => {
  const { deliveryShift, shipmentType, vehicleCapacity } = req.body;
  if (!deliveryShift || !shipmentType || !vehicleCapacity) {
    return res.status(400).json({ message: "All input fields are required" });
  }

  const shipments = await Shipment.find({
    OwnerRef: req.userId,
    deliveryShift,
    shipmentType,
  })
    .sort({ _id: 1 })
    .limit(10);
  res.json(shipments);
};

export const handleInitialOptimizedRoute = async (
  req: Request & { userId?: string },
  res: Response,
) => {
  try {
    const shipments = await Shipment.find({ OwnerRef: req.userId }).sort({
      _id: 1,
    });

    res.status(200).json(shipments);
  } catch (err) {
    res.status(400).json(err);
  }
};

export const handleStartOptimizeRoute = async (
  req: Request & { userId?: string },
  res: Response,
) => {
  if (!Array.isArray(req.body))
    return res.status(400).json({ message: "Invalid results" });

  try {
    await Promise.all(
      req.body.map((shipment: ShipmentDocument) =>
        Shipment.updateOne(
          { _id: shipment._id, OwnerRef: req.userId },
          { $set: { status: "in_transit" } },
        ),
      ),
    );
    res.sendStatus(200);
  } catch (err) {
    res.status(500).json(err);
  }
};
