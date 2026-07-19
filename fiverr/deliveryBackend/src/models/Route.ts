import mongoose from "mongoose";
import { shipmentSchema } from "./Shipment.js";

export interface RouteDocument {
  OwnerRef: mongoose.Types.ObjectId;
  _id: mongoose.Types.ObjectId;
  vehicleCapacity: number;
  deliveryShift: string;
  shipmentType: string;
  shipments: [typeof shipmentSchema];
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
    shipmentType: {
      type: String,
      required: true,
    },
    vehicleCapacity: {
      type: Number,
      required: true,
    },
    shipments: {
      type: [shipmentSchema],
      required: true,
    },
  },
  { timestamps: true },
);

const Route = mongoose.model<RouteDocument>("Route", routeSchema);
export default Route;
