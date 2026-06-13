import { Request, Response } from "express";
import Shipment from "../models/Shipment";

interface UserRequest extends Request {
  userId?: string;
}

export const handleCreateNewShipment = async (
  req: UserRequest,
  res: Response,
) => {
  try {
    const {
      pickupAddress,
      pickupSelected,
      deliveryAddress,
      deliverySelected,
      boxQuantity,
      clientName,
      shipmentType,
      clientPhoneNumber,
      deliveryShift,
    } = req.body;

    if (
      !pickupAddress ||
      !pickupSelected ||
      !deliveryAddress ||
      !deliverySelected ||
      !boxQuantity ||
      !clientName ||
      !shipmentType ||
      !clientPhoneNumber ||
      !deliveryShift
    ) {
      res.status(404).json({
        data: "All informations are required",
      });
      return;
    }

    req.body.OwnerRef = req.userId;
    const shipment = await Shipment.create(req.body);
    return res.status(201).json(shipment);
  } catch (err: any) {
    console.log(err.message);
    res.status(400).json({ message: "Something went wrong" });
    throw err;
  }
};
