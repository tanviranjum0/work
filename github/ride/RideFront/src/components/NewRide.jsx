/* eslint-disable react/prop-types */
import { MapPinMinus, MapPinPlus, PhoneCall, SendHorizontal } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import Button from "./Button";

const splitAddress = (address = "") => {
  const [title, ...rest] = address.split(", ");
  return { title: title || address, subtitle: rest.join(", ") };
};

function Place({ icon, label, address }) {
  const { title, subtitle } = splitAddress(address);
  return (
    <div className="booking-trip-location">
      {icon}
      <div>
        <span className="booking-trip-label">{label}</span>
        <strong>{title}</strong>
        {subtitle && <span>{subtitle}</span>}
      </div>
    </div>
  );
}

function NewRide({
  rideData,
  otp,
  setOtp,
  showBtn,
  showPanel,
  setShowPanel,
  showPreviousPanel,
  loading,
  acceptRide,
  endRide,
  verifyOTP,
  error,
}) {
  const ignoreRide = () => {
    setShowPanel(false);
    showPreviousPanel(true);
  };
  const firstName = rideData?.user?.fullname?.firstname || "";
  const lastName = rideData?.user?.fullname?.lastname || "";
  const km = ((Number(rideData?.distance) || 0) / 1000).toFixed(1);

  const heading =
    showBtn === "accept" ? "New ride request" : showBtn === "otp" ? "Head to pickup" : "Trip in progress";
  const eyebrow = showBtn === "accept" ? "INCOMING" : showBtn === "otp" ? "STEP 1 OF 2" : "STEP 2 OF 2";

  return (
    <AnimatePresence>
      {showPanel && (
        <motion.section
          key="ride-request"
          className="booking-panel captain-ride-panel"
          aria-labelledby="captain-ride-title"
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 22 }}
          transition={{ duration: 0.24, ease: "easeOut" }}
        >
          <div className="booking-panel-heading">
            <div>
              <span className="booking-eyebrow">{eyebrow}</span>
              <h1 id="captain-ride-title">{heading}</h1>
            </div>
          </div>

          <div className="captain-rider">
            <div>
              <span className="captain-avatar" aria-hidden="true">
                {firstName[0]}
                {lastName[0]}
              </span>
              <div className="captain-rider-name">
                <strong>
                  {firstName} {lastName}
                </strong>
                <span>{rideData?.user?.phone || rideData?.user?.email}</span>
              </div>
            </div>
            <div className="captain-fare">
              <strong>${rideData?.fare}</strong>
              <span>{km} km · cash</span>
            </div>
          </div>

          {showBtn !== "accept" && (
            <div className="booking-driver-actions" style={{ marginTop: 12 }}>
              <Button
                type="link"
                path={`/captain/chat/${rideData?._id}`}
                title="Message rider"
                icon={<SendHorizontal size={17} />}
                classes="booking-secondary-button"
              />
              {rideData?.user?.phone && (
                <a
                  className="booking-call-button"
                  href={`tel:${rideData.user.phone}`}
                  aria-label={`Call ${firstName || "rider"}`}
                >
                  <PhoneCall size={18} />
                </a>
              )}
            </div>
          )}

          <div className="booking-trip-summary">
            <Place icon={<MapPinMinus size={18} aria-hidden="true" />} label="PICKUP" address={rideData?.pickup} />
            <Place icon={<MapPinPlus size={18} aria-hidden="true" />} label="DROP-OFF" address={rideData?.destination} />
          </div>

          {showBtn === "accept" ? (
            <div className="captain-actions">
              <Button title="Ignore" loading={false} fun={ignoreRide} classes="captain-ghost-button" />
              <Button title="Accept ride" fun={acceptRide} loading={loading} classes="booking-primary-button" />
            </div>
          ) : showBtn === "otp" ? (
            <>
              <input
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                placeholder="••••••"
                aria-label="Rider's 6 digit pickup code"
                className="captain-otp-input"
              />
              {error && <p className="booking-error" role="alert">{error}</p>}
              <Button
                title="Start trip"
                loading={loading}
                fun={verifyOTP}
                disabled={otp.length !== 6}
                classes="booking-primary-button"
              />
              <p className="booking-footnote">Ask the rider for their 6 digit pickup code.</p>
            </>
          ) : (
            <Button
              title="End ride"
              fun={endRide}
              loading={loading}
              classes="booking-primary-button captain-end-button"
            />
          )}
        </motion.section>
      )}
    </AnimatePresence>
  );
}

export default NewRide;
