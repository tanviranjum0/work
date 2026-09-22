import { Request, Response } from "express";
import Shipment from "../models/Shipment.js";
import mongoose from "mongoose";
import {
  getAddressCoordinate,
  getDistanceTime,
} from "../services/map.service.js";
import Route from "../models/Route.js";
import { handleDeleteRoute } from "./optimizedRoute.controller.js";
import { createOptimizedRoute } from "../services/efficientRouteHandler/route.handler.js";
export interface UserRequest extends Request {
  userId: string;
  routeNumber?: string;
  onlyDelete?: boolean;
  deliveryShift?: string;
  vehicleCapacity?: number;
  routeType?: string;
  doNotReturn?: boolean;
  routeToBeDeleted?: mongoose.Types.ObjectId;
}
const DEPOT = {
  lat: parseFloat(process.env.DEPOT_LAT ?? "52.4002"),
  lng: parseFloat(process.env.DEPOT_LNG ?? "4.6417"),
};

export const handleCreateNewShipment = async (
  req: UserRequest,
  res: Response,
  next: () => void,
) => {
  try {
    const {
      deliveryAddress,
      boxQuantity,
      clientName,
      shipmentType,
      clientPhoneNumber,
      deliveryShift,
    } = req.body;

    if (
      !deliveryAddress ||
      boxQuantity === undefined ||
      boxQuantity === null ||
      !clientName ||
      !shipmentType ||
      !clientPhoneNumber ||
      !deliveryShift
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

    if (req.body.routeNumber) {
      const existingRoute = await Route.findOne({
        routeNumber: req.body.routeNumber,
        OwnerRef: req.userId,
      });
      if (existingRoute) {
        req.body = {};
        delete req.params.id;

        req.routeToBeDeleted = existingRoute._id;
        req.onlyDelete = true;
        await handleDeleteRoute(req, res);
        req.body.deliveryShift = existingRoute.deliveryShift;
        req.body.vehicleCapacity = existingRoute.vehicleCapacity.toString();
        req.body.routeType = "number";
        req.body.routeNumber = existingRoute.routeNumber;
        req.doNotReturn = true;
        await createOptimizedRoute(req, res, next);
      }
    }
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
    const pendingCount = await Shipment.countDocuments({
      OwnerRef: req.userId,
      status: "pending",
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
      .sort({ _id: -1 })
      .skip(startIndex)
      .select("-OwnerRef -__v")
      .lean()
      .exec();

    return res.json({
      message: "Success",
      total,
      pendingCount,
      shipments,
    });
  } catch (error) {
    res.status(400).json("There is a problem in shipment fetch");
  }
};

export const handleGetSingleShipment = async (
  req: UserRequest,
  res: Response,
) => {
  try {
    const shipment = await Shipment.findById(req.params.id).lean().exec();
    if (!shipment) {
      return res.status(400).json({ message: "No shipment found." });
    }
    if (shipment?.OwnerRef.toString() !== req.userId) {
      return res
        .status(400)
        .json({ message: "You are not authorized to access this shipment." });
    }

    const distanceData = await getDistanceTime(
      DEPOT,
      shipment.deliverySelected,
    );
    const { OwnerRef, ...shipmentResponse } = shipment;
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
      parseInt(typeof req.query.limit === "string" ? req.query.limit : "") ||
      20;
    const startIndex =
      parseInt(
        typeof req.query.startIndex === "string" ? req.query.startIndex : "",
      ) || 0;

    const shipments = await Shipment.find({
      OwnerRef: req.userId,
    })
      .limit(limit)
      .sort({ _id: -1 })
      .skip(startIndex)
      .select("-OwnerRef -__v")
      .lean()
      .exec();
    return res.json({
      message: "Success",
      total,
      inTransitCount,
      shipments,
    });
  } catch (error) {
    res.status(400).json("There is a problem in shipment fetch");
  }
};

export const handleDeleteOneShipment = async (
  req: UserRequest,
  res: Response,
  next: () => void,
) => {
  try {
    const shipmentId =
      typeof req.params.id === "string" ? req.params.id : undefined;

    if (!shipmentId) {
      return res.status(400).json({ message: "Shipment id is required." });
    }
    const shipment = await Shipment.findById(shipmentId).lean().exec();
    if (!shipment) {
      return res.status(400).json({ message: "Shipment not found." });
    }

    const result = await Shipment.deleteOne({
      OwnerRef: req.userId,
      _id: shipmentId,
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Shipment not found" });
    } else {
      if (shipment.routeNumber) {
        const existingRoute = await Route.findOne({
          routeNumber: shipment.routeNumber,
          OwnerRef: req.userId,
        });
        if (existingRoute) {
          delete req.params.id;
          req.body = {};
          req.routeToBeDeleted = existingRoute._id;
          req.onlyDelete = true;
          await handleDeleteRoute(req, res);
          req.body.deliveryShift = existingRoute.deliveryShift;
          req.body.vehicleCapacity = existingRoute.vehicleCapacity.toString();
          req.body.routeType = "number";
          req.body.routeNumber = existingRoute.routeNumber;
          req.doNotReturn = true;
          await createOptimizedRoute(req, res, next);
        }
      }
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
    const shipmentId = req.body.shipmentId;
    const routeId = req.body.routeId;
    if (!shipmentId) {
      return res.status(400).json({ message: "Shipment id is required." });
    }
    if (!routeId) {
      return res.status(400).json({ message: "Route id is required." });
    }

    const shipment = await Shipment.findById(shipmentId).lean().exec();
    if (!shipment) {
      return res.status(400).json({ message: "Shipment not found." });
    }
    const route = await Route.findById(routeId).lean().exec();
    if (!route) {
      return res.status(400).json({ message: "Route not found." });
    }

    if (shipment.OwnerRef?.toString() !== req.userId) {
      return res
        .status(400)
        .json({ message: "You are not authorized to update this shipment" });
    }
    if (route.OwnerRef?.toString() !== req.userId) {
      return res
        .status(400)
        .json({ message: "You are not authorized to update this route" });
    }

    const updatedShipment = await Shipment.findByIdAndUpdate(shipment._id, {
      $set: { status: req.body.status },
    });
    if (!updatedShipment) {
      return res.status(400).json({ message: "Something went wrong" });
    }
    route.shipments.map((s: any) => {
      if (s._id.toString() == shipment._id.toString()) {
        s.status = "delivered";
      }
    });
    route.status = "active";
    const updatedRoute = await Route.findByIdAndUpdate(routeId, {
      $set: route,
    });
    if (!updatedRoute) {
      return res.status(400).json({ message: "Something went wrong" });
    }

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
      parseInt(typeof req.query.limit === "string" ? req.query.limit : "") ||
      20;
    const startIndex =
      parseInt(
        typeof req.query.startIndex === "string" ? req.query.startIndex : "",
      ) || 0;

    const shipments = await Shipment.find({
      OwnerRef: req.userId,
    })
      .limit(limit)
      .sort({ _id: -1 })
      .skip(startIndex)
      .select("-OwnerRef -__v")
      .lean()
      .exec();
    return res.status(200).json({ message: "Success", shipments });
  } catch (error) {
    res.status(400).json("There is a problem in shipment fetch");
  }
};

export const handleShipmentUpdate = async (
  req: UserRequest,
  res: Response,
  next: () => void,
) => {
  try {
    const shipment = await Shipment.findById(req.body._id).lean().exec();
    if (!shipment) {
      return res.status(400).json({ message: "Shipment not found." });
    }
    if (shipment.OwnerRef?.toString() !== req.userId) {
      return res
        .status(400)
        .json({ message: "you are not authorized to update this shipment" });
    }
    const deliverySelected = await getAddressCoordinate(
      req.body.deliveryAddress,
    );
    let updated: any = {
      pickupAddress: req.body.pickupAddress,
      deliveryAddress: req.body.deliveryAddress,
      deliverySelected,
      boxQuantity: req.body.boxQuantity,
      clientName: req.body.clientName,
      isUrgent: req.body.isUrgent,
      clientPhoneNumber: req.body.cellPhoneNumber,
      deliveryShift: req.body.deliveryShift,
      shipmentType: req.body.shipmentType,
      note: req.body.note,
    };

    if (req.body.routeNumber) {
      updated.routeNumber = req.body.routeNumber;
    }
    const updatedShipment = await Shipment.findByIdAndUpdate(shipment._id, {
      $set: updated,
    });
    if (!updatedShipment) {
      return res.status(200).json({ message: "Something went wrong" });
    }
    if (req.body.routeNumber) {
      const existingRoute = await Route.findOne({
        routeNumber: req.body.routeNumber,
        OwnerRef: req.userId,
      });
      if (existingRoute) {
        req.body = {};
        delete req.params.id;
        req.routeToBeDeleted = existingRoute._id;
        req.onlyDelete = true;
        await handleDeleteRoute(req, res);
        req.body.deliveryShift = existingRoute.deliveryShift;
        req.body.vehicleCapacity = existingRoute.vehicleCapacity.toString();
        req.body.routeType = "number";
        req.body.routeNumber = existingRoute.routeNumber;
        req.doNotReturn = true;
        await createOptimizedRoute(req, res, next);
      }
    }
    return res
      .status(200)
      .json({ message: "Success", shipment: updatedShipment });
  } catch (error) {
    res.status(400).json("There is a updating shipment");
  }
};

export const handleShipmentsSearch = async (req: Request, res: Response) => {
  try {
    const searchTerm =
      typeof req.query.searchTerm === "string" ? req.query.searchTerm : "";
    const searchFilter = {
      clientName: { $regex: searchTerm, $options: "i" },
      clientPhoneNumber: { $regex: searchTerm, $options: "i" },
      pickupAddress: { $regex: searchTerm, $options: "i" },
      deliveryAddress: { $regex: searchTerm, $options: "i" },
      shipmentType: { $regex: searchTerm, $options: "i" },
      status: { $regex: searchTerm, $options: "i" },
      deliveryShift: { $regex: searchTerm, $options: "i" },
      note: { $regex: searchTerm, $options: "i" },
    } as any;
    const shipments = await Shipment.find(searchFilter)
      .limit(10)
      .sort({ _id: -1 })
      .lean()
      .exec();
    return res.status(200).json(shipments);
  } catch (error) {
    return res.status(400).json("There is a searching shipment");
  }
};

export const handleGetSpecificNumberBasedShipments = async (
  req: Request,
  res: Response,
) => {
  const routeNumber =
    typeof req.query.routeNumber === "string"
      ? req.query.routeNumber
      : undefined;
  if (!routeNumber) {
    return res.status(400).json({ message: "Route number is required" });
  }

  const shipments = await Shipment.find({
    routeNumber,
    status: { $nin: ["delivered", "cancelled", "transit", "completed"] },
  })
    .lean()
    .exec();
  return res.status(200).json(shipments);
};

export const handleGetRouteId = async (req: UserRequest, res: Response) => {
  try {
    const { routeNumber } = req.body;
    const searchFilter = {
      OwnerRef: req.userId,
      routeNumber: { $regex: routeNumber, $options: "i" },
      status: "pending",
    };
    const shipments = await Shipment.find(searchFilter).lean().exec();

    let routeIds: string[] = [];
    if (shipments) {
      routeIds = shipments.map((s) => s.routeNumber);
    }
    const uniqueRouteNumbers = routeIds
      .filter((item, index, self) => {
        return self.indexOf(item) === index;
      })
      .slice(0, 5);
    res.status(200).json(uniqueRouteNumbers);
  } catch (err) {
    res.status(400).json({ message: "Something went wrong" });
  }
};
