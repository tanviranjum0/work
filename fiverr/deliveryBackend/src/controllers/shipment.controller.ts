import { Request, Response } from "express";
import Shipment from "../models/Shipment.js";
import {
  getAddressCoordinate,
  getDistanceTime,
} from "../services/map.service.js";
interface UserRequest extends Request {
  userId?: string;
}

export const handleCreateNewShipment = async (
  req: UserRequest,
  res: Response,
) => {
  try {
    const {
      deliveryAddress,
      boxQuantity,
      clientName,
      shipmentType,
      clientPhoneNumber,
      deliveryShift,
      note,
    } = req.body;

    if (
      !deliveryAddress ||
      boxQuantity === undefined ||
      boxQuantity === null ||
      !clientName ||
      !shipmentType ||
      !clientPhoneNumber ||
      !deliveryShift ||
      !note
    ) {
      return res.status(400).json({
        message: "All informations are required",
      });
    }
    const deliverySelected = await getAddressCoordinate(deliveryAddress);

    req.body.OwnerRef = req.userId;
    const shipment = await Shipment.create({
      ...req.body,
      OwnerRef: req.userId,
      deliverySelected,
    });
    return res.status(201).json({ message: "Success", shipment });
  } catch (err: any) {
    console.log(err.message);
    res.status(400).json({ message: "Something went wrong" });
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
    const shipment = await Shipment.findById(req.params.id);
    if (!shipment) {
      return res.status(400).json({ message: "No shipment found." });
    }
    if (shipment?.OwnerRef.toString() !== req.userId) {
      return res
        .status(400)
        .json({ message: "You are not authorized to access this shipment." });
    }

    const distanceData = await getDistanceTime(
      "Izaäk Enschedéweg 50, 2031 CS Haarlem, Netherlands",
      shipment.deliveryAddress,
    );
    const { OwnerRef, ...shipmentResponse } = shipment.toObject();
    return res.status(200).json({ ...shipmentResponse, distanceData });
  } catch (error) {
    res.status(400).json("There is a problem in shipment fetch");
  }
};

export const handleGetInitialShipments = async (
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
  try {
    const shipmentId =
      typeof req.params.id === "string" ? req.params.id : undefined;

    if (!shipmentId) {
      return res.status(400).json({ message: "Shipment id is required." });
    }

    const result = await Shipment.deleteOne({
      OwnerRef: req.userId,
      _id: shipmentId,
    });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Shipment not found" });
    } else {
      return res.status(200).json({ message: "Success" });
    }
  } catch (error) {
    res.status(400).json("There is a in deleting shipment");
  }
};

export const handleShipmentStatusUpdate = async (
  req: UserRequest,
  res: Response,
) => {
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
    res.status(400).json("Theres is a in deleting shipment");
  }
};

export const handleLoadMoreShipments = async (
  req: UserRequest,
  res: Response,
) => {
  try {
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
    return res.status(200).json({ message: "Success", shipments });
  } catch (error) {
    res.status(400).json("There is a problem in shipment fetch");
  }
};

export const handleShipmentUpdate = async (req: UserRequest, res: Response) => {
  try {
    const shipment = await Shipment.findById(req.body._id);
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
      {
        $set: {
          pickupAddress: req.body.pickupAddress,
          deliveryAddress: req.body.deliveryAddress,
          deliverySelected: req.body.deliverySelected,
          boxQuantity: req.body.boxQuantity,
          clientName: req.body.clientName,
          clientPhoneNumber: req.body.cellPhoneNumber,
          deliveryShift: req.body.deliveryShift,
          shipmentType: req.body.shipmentType,
          note: req.body.note,
        },
      },
      { returnDocument: "after", runValidators: true },
    );
    if (!updatedShipment)
      return res.status(200).json({ message: "Something went wrong" });

    return res.status(200).json({ message: "Success", ...updatedShipment });
  } catch (error) {
    res.status(400).json("There is a in deleting shipment");
  }
};
