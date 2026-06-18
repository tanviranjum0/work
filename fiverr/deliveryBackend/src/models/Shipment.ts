import mongoose from "mongoose";

export interface ShipmentDocument {
  _id: mongoose.Types.ObjectId;
  save?: any;
  OwnerRef: mongoose.Types.ObjectId;
  clientName: string;
  clientPhoneNumber: number;
  pickupAddress: string;
  deliveryAddress: string;
  boxQuantity: number;
  driverAllocated: boolean;
  deliveryShift: string;
  shipmentType: string;
  status: string;
  note: string;
}

const shipmentSchema = new mongoose.Schema<ShipmentDocument>(
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
    pickupAddress: {
      type: String,
      default: "Izaäk Enschedéweg 50, 2031 CS Haarlem, Netherlands",
    },
    deliveryAddress: {
      type: String,
      required: true,
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
    status: {
      type: String,
      enum: ["transit", "pending", "delivered"],
      default: "pending",
    },
    deliveryShift: {
      type: String,
      enum: ["morning", "afternoon", "evening", "night"],
      default: "morning",
    },
    note: {
      type: String,
    },
  },
  { timestamps: true },
);

const Shipment = mongoose.model<ShipmentDocument>("Shipment", shipmentSchema);
export default Shipment;
