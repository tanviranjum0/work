import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  CheckCircle2,
  Copy,
  MessageCircle,
  Phone,
  PhoneCall,
  RefreshCcw,
  Share2,
  ShieldAlert,
  ShieldCheck,
  XCircle,
} from "lucide-react";
import api, { getApiErrorMessage } from "../../utils/api";
import { Avatar, Banner, Button, Dialog, Plate, StarRating, Stars, Textarea, fullNameOf, useToast } from "../ui";
import { TripLegs } from "./RidePanels";
import { VEHICLES, formatDate, formatDistance, formatDuration, formatTime, money } from "../../utils/format";
import "./ride.css";

const EMERGENCY_NUMBER = import.meta.env.VITE_EMERGENCY_NUMBER || "112";

/* ----------------------------------------------------------------- live trip body */

export function TripBody({ role, ride, phase, etaSeconds, remainingMeters, offline }) {
  const counterpart = role === "user" ? ride.captain : ride.user;
  const name = fullNameOf(counterpart?.fullname) || (role === "user" ? "Your driver" : "Your rider");
  const arrival = etaSeconds != null ? new Date(Date.now() + etaSeconds * 1000) : null;
  const vehicle = ride.captain?.vehicle;
  const done = phase === "ongoing" && ride.distance && remainingMeters != null
    ? Math.min(100, Math.max(0, Math.round((1 - remainingMeters / ride.distance) * 100)))
    : null;

  const headline =
    phase === "ongoing"
      ? role === "user" ? "On your way" : "Trip in progress"
      : role === "user" ? "Your driver is arriving" : "Head to the pickup";

  return (
    <>
      <div className="sheet-head">
        <div>
          <span className="sheet-eyebrow">{headline}</span>
          <div className="eta-hero" aria-live="polite">
            {etaSeconds != null ? (
              <>
                <strong>{formatDuration(etaSeconds)}</strong>
                <span>
                  {phase === "ongoing" ? "to drop-off" : "away"}
                  {arrival && ` · ${formatTime(arrival)}`}
                </span>
              </>
            ) : (
              <strong style={{ fontSize: "var(--text-xl)" }}>Calculating route…</strong>
            )}
          </div>
        </div>
      </div>

      {offline && <Banner tone="warning">Reconnecting to the live map…</Banner>}

      {done != null && (
        <div className="meter" role="progressbar" aria-label="Trip progress" aria-valuemin={0} aria-valuemax={100} aria-valuenow={done}>
          <span style={{ width: `${done}%` }} />
        </div>
      )}

      <div className="person-card">
        <Avatar fullname={counterpart?.fullname} size="lg" />
        <div className="person-card-body">
          <strong>{name}</strong>
          <div className="person-card-meta">
            <Stars rating={counterpart?.rating} />
            {role === "user" && vehicle && (
              <span>
                {vehicle.color} {VEHICLES[vehicle.type]?.name || vehicle.type}
              </span>
            )}
          </div>
        </div>
        {role === "user" && vehicle?.number && <Plate>{vehicle.number}</Plate>}
      </div>

      {role === "user" && phase === "accepted" && ride.otp && (
        <div className="otp-card" aria-label={`Pickup code ${ride.otp.split("").join(" ")}`}>
          <span>
            Tell your driver this code
            <br />
            to start the trip
          </span>
          <strong>{ride.otp}</strong>
        </div>
      )}
    </>
  );
}

export function TripActions({ role, ride, onShare, onSafety }) {
  const counterpart = role === "user" ? ride.captain : ride.user;
  const phone = counterpart?.phone;
  return (
    <div className="action-grid">
      <Link className="action-tile" to={`/${role}/chat/${ride._id}`}>
        <MessageCircle size={22} aria-hidden="true" />
        Message
      </Link>
      {phone ? (
        <a className="action-tile" href={`tel:${phone}`}>
          <Phone size={22} aria-hidden="true" />
          Call
        </a>
      ) : (
        <span className="action-tile" aria-disabled="true" style={{ opacity: 0.5 }}>
          <Phone size={22} aria-hidden="true" />
          Call
        </span>
      )}
      {role === "user" ? (
        <button type="button" className="action-tile" onClick={onShare}>
          <Share2 size={22} aria-hidden="true" />
          Share trip
        </button>
      ) : (
        <button type="button" className="action-tile" onClick={onShare}>
          <Copy size={22} aria-hidden="true" />
          Copy pickup
        </button>
      )}
      <button type="button" className="action-tile action-tile--danger" onClick={onSafety}>
        <ShieldAlert size={22} aria-hidden="true" />
        Safety
      </button>
    </div>
  );
}

export function TripDetails({ ride }) {
  return (
    <>
      <TripLegs pickup={ride.pickup} destination={ride.destination} />
      <div className="receipt-rows">
        <div className="receipt-row">
          <span>Fare</span>
          <strong>{money(ride.fare)} · cash</strong>
        </div>
        <div className="receipt-row">
          <span>Distance</span>
          <strong>{formatDistance(ride.distance)}</strong>
        </div>
      </div>
    </>
  );
}

/* ---------------------------------------------------------------------- sharing */

// Creates (or reuses) the public "follow my trip" link and hands it to the share sheet.
export async function shareTripLink(rideId, toast) {
  try {
    const { data } = await api.post("/ride/share", { rideId });
    const text = "Follow my QuickRide trip live:";
    if (navigator.share) {
      try {
        await navigator.share({ title: "My QuickRide trip", text, url: data.url });
        return;
      } catch (error) {
        if (error?.name === "AbortError") return;
      }
    }
    await navigator.clipboard.writeText(data.url);
    toast.success("Trip link copied. Send it to someone you trust.");
  } catch (error) {
    toast.error(getApiErrorMessage(error, "We could not create a trip link."));
  }
}

/* ----------------------------------------------------------------------- safety */

export function SafetyDialog({ open, onClose, role, ride, position, contacts = [], onShare }) {
  const toast = useToast();
  const [sending, setSending] = useState(false);
  const [raised, setRaised] = useState(false);

  useEffect(() => {
    if (!open) setRaised(false);
  }, [open]);

  const raise = async () => {
    setSending(true);
    try {
      await api.post("/ride/sos", { rideId: ride._id, ...(position && { location: { ltd: position.ltd, lng: position.lng } }) });
      setRaised(true);
    } catch (error) {
      toast.error(getApiErrorMessage(error, "We could not send the alert. Call emergency services now."));
    } finally {
      setSending(false);
    }
  };

  const vehicle = ride?.captain?.vehicle;
  return (
    <Dialog open={open} onClose={onClose} title="Safety toolkit" placement="bottom">
      <div style={{ display: "grid", gap: 10 }}>
        <Button href={`tel:${EMERGENCY_NUMBER}`} variant="danger-solid" icon={<PhoneCall size={18} />}>
          Call emergency services ({EMERGENCY_NUMBER})
        </Button>

        {raised ? (
          <Banner tone="success">
            Alert recorded and the other person has been notified. If you are in danger, call {EMERGENCY_NUMBER} now.
          </Banner>
        ) : (
          <Button variant="danger" icon={<ShieldAlert size={18} />} onClick={raise} loading={sending} loadingText="Sending alert">
            Send a safety alert on this trip
          </Button>
        )}

        {role === "user" && (
          <Button variant="secondary" icon={<Share2 size={18} />} onClick={onShare}>
            Share live trip with someone
          </Button>
        )}

        {contacts.length > 0 && (
          <div style={{ display: "grid", gap: 8 }}>
            <span className="section-label">Your emergency contacts</span>
            {contacts.map((contact) => (
              <a key={contact.phone} className="request-row" href={`tel:${contact.phone}`}>
                <Avatar fullname={{ firstname: contact.name }} size="sm" />
                <span style={{ flex: 1, fontWeight: 600 }}>{contact.name}</span>
                <Phone size={18} color="var(--brand-600)" aria-hidden="true" />
              </a>
            ))}
          </div>
        )}

        {vehicle && (
          <div className="qr-card qr-card--flat" style={{ fontSize: "var(--text-sm)" }}>
            <span className="section-label">Read this to emergency services</span>
            <p style={{ marginTop: 6 }}>
              {vehicle.color} {vehicle.type}, plate <strong>{vehicle.number}</strong>, driver {fullNameOf(ride.captain.fullname)}.
              Pickup: {ride.pickup}.
            </p>
          </div>
        )}

        <Button variant="ghost" onClick={onClose}>
          <ShieldCheck size={18} /> I am okay
        </Button>
      </div>
    </Dialog>
  );
}

/* ----------------------------------------------------------------------- cancel */

const REASONS = {
  user: [
    "My driver is taking too long",
    "I changed my plans",
    "Wrong pickup location",
    "I booked by mistake",
    "Something else",
  ],
  captain: ["The rider is not at the pickup", "The rider asked me to cancel", "A problem with my vehicle", "Something else"],
};

export function CancelDialog({ open, onClose, onConfirm, role, matched, loading }) {
  const [reason, setReason] = useState("");
  useEffect(() => {
    if (open) setReason("");
  }, [open]);

  return (
    <Dialog open={open} onClose={onClose} title="Cancel this ride?" placement="bottom" dismissible={!loading}>
      <p className="qr-dialog-text">
        {role === "captain"
          ? "Cancelling after accepting can lower your acceptance rate. Tell us why."
          : matched
            ? "Your driver is already on the way. Why are you cancelling?"
            : "Why are you cancelling?"}
      </p>
      <div className="cancel-reasons" role="group" aria-label="Cancellation reason">
        {REASONS[role].map((item) => (
          <button key={item} type="button" className="reason" aria-pressed={reason === item} onClick={() => setReason(item)}>
            {item}
          </button>
        ))}
      </div>
      <div className="qr-dialog-actions">
        <Button variant="danger-solid" onClick={() => onConfirm(reason)} loading={loading} loadingText="Cancelling">
          Cancel ride
        </Button>
        <Button variant="secondary" onClick={onClose} disabled={loading}>
          Keep my ride
        </Button>
      </div>
    </Dialog>
  );
}

/* ---------------------------------------------------------------------- summary */

const TAGS = {
  user: ["Great driver", "Clean car", "Safe driving", "Friendly", "Smooth route"],
  captain: ["Polite rider", "On time", "Easy pickup", "Clear directions"],
};

export function SummaryBody({ role, ended, onRebook }) {
  const { ride, outcome, by } = ended;
  const toast = useToast();
  const [stars, setStars] = useState(0);
  const [tags, setTags] = useState([]);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [rated, setRated] = useState(Boolean(role === "user" ? ride?.rating?.byUser : ride?.rating?.byCaptain));

  if (outcome === "cancelled") {
    const system = by === "system";
    const mine = by === role;
    return (
      <div className="summary-hero">
        <span className="summary-icon summary-icon--danger">
          <XCircle size={32} aria-hidden="true" />
        </span>
        <h1 className="sheet-title">
          {mine ? "Ride cancelled" : system ? "No drivers available" : role === "user" ? "Your driver cancelled" : "The rider cancelled"}
        </h1>
        <p className="sheet-sub" style={{ maxWidth: 320 }}>
          {mine
            ? "You will not be charged."
            : system
              ? "Nobody nearby could take this ride right now. Try again in a moment, or pick a different ride type."
              : role === "user"
                ? "Sorry about that. You will not be charged. You can request another driver right away."
                : "This request was cancelled before pickup."}
        </p>
        {!mine && role === "user" && onRebook && (
          <div style={{ width: "100%", marginTop: 6 }}>
            <Button icon={<RefreshCcw size={18} />} onClick={onRebook}>
              Find another driver
            </Button>
          </div>
        )}
      </div>
    );
  }

  const submit = async () => {
    setSubmitting(true);
    try {
      const text = [...tags, comment.trim()].filter(Boolean).join(". ");
      await api.post("/ride/rate", { rideId: ride._id, stars, ...(text && { comment: text.slice(0, 280) }) });
      setRated(true);
      toast.success("Thanks for your feedback.");
    } catch (error) {
      if (error.code === "ALREADY_RATED") setRated(true);
      else toast.error(getApiErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  };

  const other = role === "user" ? ride.captain : ride.user;
  return (
    <>
      <div className="summary-hero">
        <span className="summary-icon">
          <CheckCircle2 size={34} aria-hidden="true" />
        </span>
        <h1 className="sheet-title">{role === "user" ? "You have arrived" : "Trip complete"}</h1>
        <div className="summary-fare">{money(ride.fare)}</div>
        <p className="sheet-sub">{role === "user" ? "Pay your driver in cash" : "Collect cash from the rider"}</p>
      </div>

      <TripLegs pickup={ride.pickup} destination={ride.destination} />
      <div className="receipt-rows">
        <div className="receipt-row">
          <span>Distance</span>
          <strong>{formatDistance(ride.distance)}</strong>
        </div>
        <div className="receipt-row">
          <span>Date</span>
          <strong>
            {formatDate(ride.completedAt || ride.createdAt)} · {formatTime(ride.completedAt || ride.createdAt)}
          </strong>
        </div>
      </div>

      {rated ? (
        <Banner tone="success">Thanks, your rating has been saved.</Banner>
      ) : (
        <div style={{ display: "grid", gap: 12 }}>
          <div style={{ textAlign: "center" }}>
            <strong>How was {role === "user" ? "your trip" : "the rider"}{other?.fullname?.firstname ? ` with ${other.fullname.firstname}` : ""}?</strong>
          </div>
          <StarRating value={stars} onChange={setStars} label="Rate this trip" />
          {stars > 0 && (
            <>
              <div className="chip-row" style={{ flexWrap: "wrap", margin: 0, padding: 0, justifyContent: "center" }}>
                {TAGS[role].map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    className="qr-chip"
                    aria-pressed={tags.includes(tag)}
                    onClick={() => setTags((current) => (current.includes(tag) ? current.filter((item) => item !== tag) : [...current, tag]))}
                  >
                    {tag}
                  </button>
                ))}
              </div>
              <Textarea
                aria-label="Anything else?"
                placeholder="Anything else you would like to add? (optional)"
                maxLength={200}
                value={comment}
                onChange={(event) => setComment(event.target.value)}
              />
              <Button onClick={submit} loading={submitting} loadingText="Saving">
                Submit rating
              </Button>
            </>
          )}
        </div>
      )}
    </>
  );
}
