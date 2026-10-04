/* eslint-disable react/prop-types */
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Users } from "lucide-react";

const vehicles = [
  {
    name: "QuickRide",
    description: "Everyday comfort",
    type: "car",
    image: "/car.png",
    seats: 4,
  },
  {
    name: "QuickBike",
    description: "Beat the traffic",
    type: "bike",
    image: "/bike.webp",
    seats: 1,
  },
  {
    name: "QuickAuto",
    description: "A little more room",
    type: "auto",
    image: "/auto.webp",
    seats: 3,
  },
];

function SelectVehicle({
  selectedVehicle,
  onSelectVehicle,
  setShowPanel,
  showPreviousPanel,
  showNextPanel,
  fare,
}) {
  const goBack = () => {
    setShowPanel(false);
    showPreviousPanel(true);
  };

  return (
    <motion.section
      className="booking-panel booking-options-panel"
      aria-labelledby="vehicle-panel-title"
      initial={{ opacity: 0, y: 22 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 22 }}
      transition={{ duration: 0.24, ease: "easeOut" }}
    >
      <button className="booking-back-button" type="button" onClick={goBack}>
        <ArrowLeft size={17} />
        Edit locations
      </button>
      <div className="booking-panel-heading">
        <div>
          <span className="booking-eyebrow">A RIDE FOR EVERY KIND OF DAY</span>
          <h1 id="vehicle-panel-title">Choose your ride</h1>
        </div>
        <span className="booking-step">02 <span>/ 03</span></span>
      </div>
      <div className="booking-vehicle-list">
        {vehicles.map((vehicle) => (
          <button
            key={vehicle.type}
            type="button"
            className={`booking-vehicle-card${selectedVehicle === vehicle.type ? " is-selected" : ""}`}
            aria-label={`${vehicle.name}, $${fare[vehicle.type] ?? 0}, ${vehicle.seats} seats`}
            onClick={() => {
              onSelectVehicle(vehicle.type);
              setShowPanel(false);
              showNextPanel(true);
            }}
          >
            <span className="booking-vehicle-image">
              <img src={vehicle.image} alt="" />
            </span>
            <span className="booking-vehicle-copy">
              <span className="booking-vehicle-name">{vehicle.name}</span>
              <span className="booking-vehicle-description">{vehicle.description}</span>
              <span className="booking-vehicle-meta">
                <span><Users size={13} /> {vehicle.seats} seats</span>
              </span>
            </span>
            <span className="booking-vehicle-price">
              <strong>${fare[vehicle.type] ?? "—"}</strong>
              <span>total</span>
              <ArrowRight size={17} />
            </span>
          </button>
        ))}
      </div>
      <p className="booking-footnote">Prices include your full trip fare.</p>
    </motion.section>
  );
}

export default SelectVehicle;
