import mongoose from "mongoose";

export interface ShipmentDocument {
  _id: mongoose.Types.ObjectId;
  save?: any;
  OwnerRef: mongoose.Types.ObjectId;
  clientName: string;
  clientPhoneNumber: number;
  pickupAddress: string;
  deliveryAddress: string;
  vehicleType: string;
  boxQuantity: number;
  driverAllocated: boolean;
  deliveryShift: string;
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
      required: true,
    },
    deliveryAddress: {
      type: String,
      required: true,
    },
    vehicleType: {
      type: String,
      default: "car",
    },
    boxQuantity: {
      type: Number,
      required: true,
    },
    driverAllocated: {
      type: Boolean,
      default: false,
    },
    deliveryShift: {
      type: String,
      enum: ["morning", "afternoon", "evening"],
      default: "morning",
    },
  },
  { timestamps: true },
);

const Shipment = mongoose.model<ShipmentDocument>("Shipment", shipmentSchema);
export default Shipment;
