/* eslint-disable react/prop-types */
import { motion } from "framer-motion";
import {
  ArrowLeft,
  CreditCard,
  MapPinMinus,
  MapPinPlus,
  PhoneCall,
  SendHorizontal,
  ShieldCheck,
} from "lucide-react";
import Button from "./Button";

function RideDetails({
  pickupLocation,
  destinationLocation,
  selectedVehicle,
  fare,
  setShowPanel,
  showPreviousPanel,
  createRide,
  cancelRide,
  loading,
  rideCreated,
  confirmedRideData,
  errorMessage,
}) {
  const driverName = [
    confirmedRideData?.captain?.fullname?.firstname,
    confirmedRideData?.captain?.fullname?.lastname,
  ]
    .filter(Boolean)
    .join(" ");
  const vehicleImage =
    selectedVehicle === "car" ? "/car.png" : `/${selectedVehicle}.webp`;

  const goBack = () => {
    setShowPanel(false);
    showPreviousPanel(true);
  };

  return (
    <motion.section
      className="booking-panel booking-details-panel"
      aria-labelledby="ride-details-title"
      initial={{ opacity: 0, y: 22 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 22 }}
      transition={{ duration: 0.24, ease: "easeOut" }}
    >
      {!rideCreated && !confirmedRideData && (
        <button className="booking-back-button" type="button" onClick={goBack}>
          <ArrowLeft size={17} />
          Change ride
        </button>
      )}
      <div className="booking-panel-heading">
        <div>
          <span className="booking-eyebrow">
            {confirmedRideData ? "DRIVER MATCHED" : rideCreated ? "REQUEST SENT" : "ONE LAST LOOK"}
          </span>
          <h1 id="ride-details-title">
            {confirmedRideData
              ? "Your ride is on its way"
              : rideCreated
                ? "Finding your driver"
                : "Review your ride"}
          </h1>
        </div>
        {!rideCreated && !confirmedRideData && (
          <span className="booking-step">03 <span>/ 03</span></span>
        )}
      </div>

      {rideCreated && !confirmedRideData && (
        <div className="booking-searching-status" role="status" aria-live="polite">
          <span className="booking-searching-indicator" aria-hidden="true" />
          <span>Matching you with a nearby driver</span>
        </div>
      )}

      {confirmedRideData?._id && (
        <div className="booking-driver-card">
          <img src={vehicleImage} alt="" />
          <div className="booking-driver-copy">
            <strong>{driverName || "Your driver"}</strong>
            <span>
              {confirmedRideData?.captain?.vehicle?.color}{" "}
              {confirmedRideData?.captain?.vehicle?.type}
            </span>
            <span className="booking-license-plate">
              {confirmedRideData?.captain?.vehicle?.number || "Vehicle details"}
            </span>
          </div>
          {confirmedRideData?.otp && (
            <div className="booking-otp" aria-label={`Pickup code ${confirmedRideData.otp}`}>
              <span>Pickup code</span>
              <strong>{confirmedRideData.otp}</strong>
            </div>
          )}
        </div>
      )}

      {confirmedRideData?._id && (
        <div className="booking-driver-actions">
          <Button
            type="link"
            path={`/user/chat/${confirmedRideData._id}`}
            title="Message driver"
            icon={<SendHorizontal size={17} />}
            classes="booking-secondary-button"
          />
          {confirmedRideData?.captain?.phone && (
            <a
              className="booking-call-button"
              href={`tel:${confirmedRideData.captain.phone}`}
              aria-label={`Call ${driverName || "your driver"}`}
            >
              <PhoneCall size={18} />
            </a>
          )}
        </div>
      )}

      <div className="booking-trip-summary">
        <div className="booking-trip-location">
          <MapPinMinus size={18} aria-hidden="true" />
          <div>
            <span className="booking-trip-label">PICKUP</span>
            <strong>{pickupLocation.split(", ")[0] || pickupLocation}</strong>
            <span>{pickupLocation.split(", ").slice(1).join(", ")}</span>
          </div>
        </div>
        <div className="booking-trip-location">
          <MapPinPlus size={18} aria-hidden="true" />
          <div>
            <span className="booking-trip-label">DROP-OFF</span>
            <strong>{destinationLocation.split(", ")[0] || destinationLocation}</strong>
            <span>{destinationLocation.split(", ").slice(1).join(", ")}</span>
          </div>
        </div>
        <div className="booking-trip-payment">
          <span className="booking-trip-payment-icon"><CreditCard size={17} /></span>
          <span>
            <span className="booking-trip-label">TOTAL · CASH</span>
            <strong>${fare[selectedVehicle] ?? "—"}</strong>
          </span>
          <ShieldCheck size={17} aria-label="Secure ride" />
        </div>
      </div>

      {errorMessage && <p className="booking-error" role="alert">{errorMessage}</p>}

      {rideCreated || confirmedRideData ? (
        <Button
          title="Cancel ride"
          loading={loading}
          classes="booking-cancel-button"
          fun={cancelRide}
        />
      ) : (
        <Button
          title="Confirm ride"
          loading={loading}
          loadingMessage="Requesting ride..."
          classes="booking-primary-button"
          fun={createRide}
        />
      )}
      {!rideCreated && !confirmedRideData && (
        <p className="booking-footnote">Your driver details will appear here as soon as you’re matched.</p>
      )}
    </motion.section>
  );
}

export default RideDetails;
