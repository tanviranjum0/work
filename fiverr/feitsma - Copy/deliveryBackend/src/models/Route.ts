import mongoose from "mongoose";
import { ShipmentDocument, shipmentSchema } from "./Shipment.js";

export interface RouteDocument {
  OwnerRef: mongoose.Types.ObjectId;
  _id: mongoose.Types.ObjectId;
  vehicleCapacity: number;
  deliveryShift: string;
  routeNumber: string;
  status: string;
  totalBoxes: number;
  shipments: ShipmentDocument[];
  initialLoad: number;
  maxVehicleLoad: number;
  totalDistance: number;
  depotVisitCount: number;
  feasible: boolean;
}

const routeSchema = new mongoose.Schema<RouteDocument>(
  {
    OwnerRef: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    deliveryShift: {
      type: String,
      required: true,
    },

    vehicleCapacity: {
      type: Number,
      required: true,
    },
    totalBoxes: {
      type: Number,
      required: true,
    },
    routeNumber: {
      type: String,
    },
    // store references to Shipment documents
    shipments: {
      type: [shipmentSchema],
      required: true,
    },
    status: {
      type: String,
      enum: ["scheduled", "active", "completed", "cancelled"],
      default: "scheduled",
    },
    initialLoad: {
      type: Number,
    },
    maxVehicleLoad: {
      type: Number,
    },
    totalDistance: {
      type: Number,
    },
    depotVisitCount: {
      type: Number,
    },
    feasible: {
      type: Boolean,
    },
  },
  { timestamps: true },
);

const Route = mongoose.model<RouteDocument>("Route", routeSchema);
export default Route;
