import { CarFront, Check, Clock, Navigation, Radio, Star, X } from "lucide-react";
import { Avatar, Badge, Banner, OtpInput, Stars, fullNameOf } from "../ui";
import { TripLegs } from "./RidePanels";
import useTick from "../../hooks/useTick";
import { VEHICLES, formatDistance, formatDuration, money } from "../../utils/format";
import "./ride.css";

/* ------------------------------------------------------------------ dashboard */

export function DashboardBody({ captain, online, onToggle, toggling, earnings, offers, onOpenOffer, locationError, loadingEarnings }) {
  const vehicle = captain?.vehicle;
  return (
    <>
      <div>
        <span className="sheet-eyebrow">Driver</span>
        <h1 className="sheet-title">{online ? "You are online" : "You are offline"}</h1>
      </div>

      <div className={`online-card ${online ? "is-online" : ""}`}>
        <div className="online-card-body">
          <strong>{online ? "Accepting rides" : "Go online to get requests"}</strong>
          <span>{online ? "Stay on this screen to receive requests." : "Riders nearby cannot see you yet."}</span>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={online}
          aria-label="Online status"
          className="qr-switch"
          disabled={toggling}
          onClick={onToggle}
        />
      </div>

      {locationError && <Banner tone="warning">{locationError}</Banner>}

      <div className="earnings-hero">
        <span>Today</span>
        <strong>{loadingEarnings ? "—" : money(earnings?.today)}</strong>
        <span>
          {earnings?.todayTrips ?? 0} trip{earnings?.todayTrips === 1 ? "" : "s"} · this week {money(earnings?.week)}
        </span>
      </div>

      <div className="qr-stats">
        <div className="qr-stat">
          <strong>{earnings?.completed ?? "—"}</strong>
          <span>Completed</span>
        </div>
        <div className="qr-stat">
          <strong>{earnings?.distanceKm ?? "—"}</strong>
          <span>Km driven</span>
        </div>
        <div className="qr-stat">
          <strong>{captain?.rating?.count ? captain.rating.avg.toFixed(1) : "New"}</strong>
          <span>Rating</span>
        </div>
      </div>

      {online && (
        <div style={{ display: "grid", gap: 8 }}>
          <span className="section-label">Open requests nearby</span>
          {offers.length === 0 ? (
            <div className="qr-card qr-card--flat" style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <Radio size={20} color="var(--brand-600)" aria-hidden="true" />
              <span style={{ fontSize: "var(--text-sm)", color: "var(--ink-600)" }}>
                Waiting for requests. New rides appear here instantly.
              </span>
            </div>
          ) : (
            offers.map((offer) => (
              <button key={offer._id} type="button" className="request-row" onClick={() => onOpenOffer(offer)}>
                <span className="qr-list-item-icon">
                  <Navigation size={18} aria-hidden="true" />
                </span>
                <span style={{ display: "grid", flex: 1, minWidth: 0 }}>
                  <strong className="qr-truncate">{offer.pickup.split(", ")[0]}</strong>
                  <span className="qr-hint">
                    {offer.pickupDistanceKm != null ? `${offer.pickupDistanceKm} km away · ` : ""}
                    {formatDistance(offer.distance)}
                  </span>
                </span>
                <strong>{money(offer.fare)}</strong>
              </button>
            ))
          )}
        </div>
      )}

      {vehicle && (
        <div className="qr-card qr-card--flat person-card">
          <span className="qr-list-item-icon">
            <CarFront size={19} aria-hidden="true" />
          </span>
          <div className="person-card-body">
            <strong style={{ fontSize: "var(--text-base)" }}>
              {vehicle.color} {VEHICLES[vehicle.type]?.name || vehicle.type}
            </strong>
            <span className="qr-hint">{vehicle.capacity} seats</span>
          </div>
          <span className="qr-plate">{vehicle.number}</span>
        </div>
      )}
    </>
  );
}

/* ---------------------------------------------------------------------- offer */

function Countdown({ expiresAt }) {
  const now = useTick(500);
  const end = expiresAt ? new Date(expiresAt).getTime() : null;
  if (!end) return null;
  const total = 150_000;
  const left = Math.max(0, end - now);
  const seconds = Math.ceil(left / 1000);
  const radius = 22;
  const circumference = 2 * Math.PI * radius;
  return (
    <span className="offer-ring" role="timer" aria-label={`${seconds} seconds left to accept`}>
      <svg viewBox="0 0 52 52" aria-hidden="true">
        <circle cx="26" cy="26" r={radius} fill="none" stroke="var(--line)" strokeWidth="4" />
        <circle
          cx="26"
          cy="26"
          r={radius}
          fill="none"
          stroke="var(--brand-500)"
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - Math.min(1, left / total))}
        />
      </svg>
      <strong>{seconds > 99 ? "99+" : seconds}</strong>
    </span>
  );
}

export function OfferBody({ offer, eta }) {
  return (
    <>
      <div className="sheet-head">
        <div>
          <span className="sheet-eyebrow">New ride request</span>
          <div className="offer-fare">{money(offer.fare)}</div>
          <span className="sheet-sub">
            {formatDistance(offer.distance)} · {formatDuration(offer.duration)} · cash
          </span>
        </div>
        <Countdown expiresAt={offer.expiresAt} />
      </div>

      <div className="person-card">
        <Avatar fullname={offer.user?.fullname} />
        <div className="person-card-body">
          <strong style={{ fontSize: "var(--text-base)" }}>{fullNameOf(offer.user?.fullname) || "Rider"}</strong>
          <div className="person-card-meta">
            <Stars rating={offer.user?.rating} />
            {offer.pickupDistanceKm != null && (
              <Badge tone="neutral" icon={<Clock size={12} />}>
                {offer.pickupDistanceKm} km to pickup{eta ? ` · ${formatDuration(eta)}` : ""}
              </Badge>
            )}
          </div>
        </div>
      </div>
      <TripLegs pickup={offer.pickup} destination={offer.destination} />
    </>
  );
}

/* ----------------------------------------------------------------------- trip */

export function PickupBody({ ride }) {
  return (
    <>
      <div>
        <span className="sheet-eyebrow">Pickup</span>
        <p className="sheet-sub">When the rider is with you, enter the 6-digit code from their app to start the trip.</p>
      </div>
      <TripLegs pickup={ride.pickup} destination={ride.destination} />
    </>
  );
}

// Pinned in the sheet footer so the main task (starting the trip) is always on screen.
export function PickupCodeEntry({ otp, setOtp, error, onSubmit }) {
  return (
    <div style={{ display: "grid", gap: 8 }}>
      <span className="qr-label" style={{ textAlign: "center" }}>
        Rider pickup code
      </span>
      <OtpInput value={otp} onChange={setOtp} onComplete={onSubmit} invalid={Boolean(error)} autoFocus={false} label="Rider pickup code" />
      {error && (
        <p className="qr-error" role="alert" style={{ justifyContent: "center" }}>
          {error}
        </p>
      )}
    </div>
  );
}

export function RatingChip({ rating }) {
  return (
    <span className="qr-badge qr-badge--neutral">
      <Star size={12} /> {rating?.count ? rating.avg.toFixed(1) : "New"}
    </span>
  );
}

export { Check, X };
