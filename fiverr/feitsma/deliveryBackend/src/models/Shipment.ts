import mongoose from "mongoose";
interface PositionLatLng {
  lat: number;
  lng: number;
}

export interface ShipmentDocument {
  updatedAt: any;
  createdAt: any;
  _id: mongoose.Types.ObjectId;
  save?: any;
  OwnerRef: mongoose.Types.ObjectId;
  isWarehouse?: boolean;
  clientName: string;
  clientPhoneNumber: number;
  pickupAddress: string;
  isUrgent: boolean;
  deliveryAddress: string;
  deliverySelected: PositionLatLng;
  routeNumber: string;
  boxQuantity: number;
  driverAllocated: boolean;
  deliveryShift: string;
  shipmentType: string;
  status: string;
  note: string;
  isFirstStop: boolean;
  travelTimeFromPreviousSeconds: string;
  travelTimeFromPreviousMinutes: string;
  distanceFromPreviousKm: string;
  travelTimeError: string;
}

export const shipmentSchema = new mongoose.Schema<ShipmentDocument>(
  {
    OwnerRef: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    clientName: {
      type: String,
      required: true,
    },
    clientPhoneNumber: {
      type: Number,
      required: true,
    },
    isWarehouse: {
      type: Boolean,
    },
    pickupAddress: {
      type: String,
      default: "Izaäk Enschedéweg 50, 2031 CS Haarlem, Netherlands",
    },
    deliveryAddress: {
      type: String,
      required: true,
    },
    deliverySelected: {
      lat: {
        type: Number,
        required: true,
      },
      lng: {
        type: Number,
        required: true,
      },
    },
    routeNumber: {
      type: String,
    },
    shipmentType: {
      type: String,
      enum: ["collection", "delivery"],
      default: "delivery",
    },
    boxQuantity: {
      type: Number,
      required: true,
    },
    driverAllocated: {
      type: Boolean,
      default: false,
    },
    isUrgent: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["transit", "pending", "delivered", "collected", "completed"],
      default: "pending",
    },
    deliveryShift: {
      type: String,
      enum: [
        "morning",
        "afternoon",
        "evening",
        "night",
        "fullday",
        "undefined",
      ],
      default: "morning",
    },
    isFirstStop: {
      type: Boolean,
    },
    travelTimeFromPreviousSeconds: {
      type: String,
    },
    travelTimeFromPreviousMinutes: {
      type: String,
    },
    distanceFromPreviousKm: {
      type: String,
    },
    travelTimeError: {
      type: String,
    },
    note: {
      type: String,
      default: "No note provided",
    },
  },
  { timestamps: true },
);

const Shipment = mongoose.model<ShipmentDocument>("Shipment", shipmentSchema);
export default Shipment;
