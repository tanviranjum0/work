import { Request, Response } from "express";
import { Types } from "mongoose";
import Shipment, { ShipmentDocument } from "../models/Shipment.js";
import Route from "../models/Route.js";

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
    const ids: string[] = [];

    req.body.map((s) => {
      ids.push(s._id);
    });
    const data = await Shipment.updateMany(
      { _id: { $in: ids }, OwnerRef: req.userId },
      { $set: { status: "transit" } },
    );
    res.status(200).json({ message: "Success" });
  } catch (err) {
    res.status(500).json(err);
  }
};

export const handleCreateNewOptimizedRoute = async (
  req: Request & { userId?: string },
  res: Response,
) => {
  const { deliveryShift, shipmentType, vehicleCapacity, shipments } = req.body;
  if (!deliveryShift || !shipmentType || !vehicleCapacity || !shipments) {
    res.status(400).json({ message: "All input fields are required" });
  }
  try {
    const ids: Types.ObjectId[] = [];

    shipments.map((s: ShipmentDocument) => {
      delete s.createdAt;
      delete s.updatedAt;
      s.status = "transit";
      ids.push(s._id);
    });
    await Shipment.updateMany(
      { _id: { $in: ids }, OwnerRef: req.userId },
      { $set: { status: "transit" } },
    );
    const route = await Route.create({
      OwnerRef: req.userId,
      shipments,
      deliveryShift,
      shipmentType,
      vehicleCapacity,
    });
    if (route) {
      res.status(200).json({ message: "Success", route });
    } else {
      res.status(400).json({ message: "Somehting went wrong" });
    }
  } catch (err) {
    res.status(500).json({ Error: err });
  }
};

export const handleSingleRoute = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    if (id) {
      const route = await Route.findById(id);
      if (!route) {
        res.status(400).json({ message: "No Route found" });
      } else {
        res.status(200).json(route);
      }
    }
  } catch (err) {
    res.status(400).json({ message: "Something went wrong" });
  }
};
