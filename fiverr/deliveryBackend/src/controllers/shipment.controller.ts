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

export const handleInitialHomePageLoad = async (
  req: UserRequest,
  res: Response,
) => {
  try {
    const total = await Shipment.countDocuments({ OwnerRef: req.userId });
    const inTransitCount = await Shipment.countDocuments({
      OwnerRef: req.userId,
      status: "transit",
    });
    const limit =
      parseInt(typeof req.query.limit === "string" ? req.query.limit : "") || 5;
    const startIndex =
      parseInt(
        typeof req.query.startIndex === "string" ? req.query.startIndex : "",
      ) || 0;

    const shipments = await Shipment.find({
      OwnerRef: req.userId,
    })
      .limit(limit)
      .skip(startIndex)
      .select("-OwnerRef -__v");

    return res.json({ message: "Success", total, inTransitCount, shipments });
  } catch (error) {
    res.status(400).json("There is a problem in shipment fetch");
  }
};

export const handleGetSingleShipment = async (
  req: UserRequest,
  res: Response,
) => {
  try {
    // console.log(req.params.id, req.userId);
    const shipment = await Shipment.findById(req.params.id);
    // console.log("Shipment", shipment);
    if (!shipment) {
      return res.status(400).json({ message: "No shipment found." });
    }
    if (shipment?.OwnerRef.toString() !== req.userId) {
      return res
        .status(400)
        .json({ message: "You are not authorized to access this shipment." });
    }
    shipment.OwnerRef = null;
    return res.status(200).json(shipment);
  } catch (error) {
    res.status(400).json("There is a problem in shipment fetch");
  }
};

export const handleGetShipments = async (req: UserRequest, res: Response) => {
  try {
    const total = await Shipment.countDocuments({ OwnerRef: req.userId });
    const inTransitCount = await Shipment.countDocuments({
      OwnerRef: req.userId,
      status: "transit",
    });
    const limit =
      parseInt(typeof req.query.limit === "string" ? req.query.limit : "") || 9;
    const startIndex =
      parseInt(
        typeof req.query.startIndex === "string" ? req.query.startIndex : "",
      ) || 0;

    const shipments = await Shipment.find({
      OwnerRef: req.userId,
    })
      .limit(limit)
      .skip(startIndex)
      .select("-OwnerRef -__v");
    return res.json({ message: "Success", total, inTransitCount, shipments });
  } catch (error) {
    res.status(400).json("There is a problem in shipment fetch");
  }
};

export const handleDeleteOneShipment = async (
  req: UserRequest,
  res: Response,
) => {
  console.log("Deleting");

  try {
    console.log(req.userId, req.params.id);
    const shipmentId =
      typeof req.params.id === "string" ? req.params.id : undefined;

    if (!shipmentId) {
      return res.status(400).json({ message: "Shipment id is required." });
    }

    await Shipment.deleteOne({
      OwnerRef: req.userId,
      _id: shipmentId,
    });
    return res.status(200).json({ message: "Success" });
  } catch (error) {
    res.status(400).json("There is a in deleting shipment");
  }
};

export const handleShipmentUpdate = async (req: UserRequest, res: Response) => {
  console.log("Updating");
  try {
    const shipmentId =
      typeof req.params.id === "string" ? req.params.id : undefined;

    if (!shipmentId) {
      return res.status(400).json({ message: "Shipment id is required." });
    }

    const shipment = await Shipment.findById(shipmentId);
    if (!shipment) {
      return res.status(400).json({ message: "Shipment not found." });
    }

    if (shipment.OwnerRef?.toString() !== req.userId) {
      return res
        .status(400)
        .json({ message: "you are not authorized to update this shipment" });
    }

    const updatedShipment = await Shipment.findByIdAndUpdate(
      shipment._id,
      { $set: { status: req.body.status } },
      { returnDocument: "after", runValidators: true },
    );
    if (!updatedShipment)
      return res.status(200).json({ message: "Something went wrong" });

    return res.status(200).json({ message: "Success", ...updatedShipment });
  } catch (error) {
    res.status(400).json("There is a in deleting shipment");
  }
};
