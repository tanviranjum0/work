import { useRef } from "react";
import {
  ArrowLeft,
  ArrowUpDown,
  Banknote,
  Clock,
  History,
  Home,
  LocateFixed,
  MapPin,
  Navigation,
  Route,
  Search,
  Star,
  Users,
  X,
} from "lucide-react";
import { Badge, Banner, Button, Spinner } from "../ui";
import usePlaceSuggestions from "../../hooks/usePlaceSuggestions";
import useTick from "../../hooks/useTick";
import { VEHICLES, formatDistance, formatDuration, money, splitAddress } from "../../utils/format";
import "./ride.css";

/* ------------------------------------------------------------------ trip legs */

export function TripLegs({ pickup, destination }) {
  const a = splitAddress(pickup);
  const b = splitAddress(destination);
  return (
    <div className="trip-legs">
      <div className="trip-leg">
        <span className="trip-leg-mark" aria-hidden="true" />
        <div className="trip-leg-text">
          <span>Pickup</span>
          <strong>{a.title}</strong>
          {a.subtitle && <small>{a.subtitle}</small>}
        </div>
      </div>
      <div className="trip-leg trip-leg--destination">
        <span className="trip-leg-mark" aria-hidden="true" />
        <div className="trip-leg-text">
          <span>Drop-off</span>
          <strong>{b.title}</strong>
          {b.subtitle && <small>{b.subtitle}</small>}
        </div>
      </div>
    </div>
  );
}

/* --------------------------------------------------------------- place search */

function SuggestionRow({ icon, text, onPick }) {
  const { title, subtitle } = splitAddress(text);
  return (
    <button type="button" className="suggestion" onMouseDown={(event) => event.preventDefault()} onClick={() => onPick(text)}>
      <span className="suggestion-icon">{icon}</span>
      <span className="suggestion-text">
        <strong>{title}</strong>
        {subtitle && <span>{subtitle}</span>}
      </span>
    </button>
  );
}

export function PlaceSearchBody({
  firstName,
  pickup,
  destination,
  setPickup,
  setDestination,
  active,
  setActive,
  error,
  notice,
  locating,
  onLocate,
  onSwap,
  onPicked,
  savedPlaces = [],
  recents = [],
}) {
  const destinationRef = useRef(null);
  const query = active === "pickup" ? pickup : destination;
  const { items, loading, error: suggestError, clear } = usePlaceSuggestions(query, { enabled: true });
  const showSuggestions = items.length > 0;

  const choose = (text) => {
    if (active === "pickup") {
      setPickup(text);
      clear();
      setActive("destination");
      destinationRef.current?.focus();
    } else {
      setDestination(text);
      clear();
    }
    onPicked?.(active, text);
  };

  // A saved place fills whichever field has focus (destination by default).
  const pickSaved = (place) => {
    if (active === "pickup") return choose(place.address);
    setDestination(place.address);
    clear();
    onPicked?.("destination", place.address);
  };

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  return (
    <>
      <div>
        <span className="sheet-eyebrow">
          {greeting}
          {firstName ? `, ${firstName}` : ""}
        </span>
        <h1 className="sheet-title">Where to?</h1>
      </div>

      <div className="place-fields" role="group" aria-label="Trip locations">
        <span className="place-dot place-dot--pickup" aria-hidden="true" />
        <span className="place-dot place-dot--destination" aria-hidden="true" />
        <button type="button" className="place-swap" onClick={onSwap} aria-label="Swap pickup and destination">
          <ArrowUpDown size={16} />
        </button>
        <div className="place-input-wrap">
          <input
            className="place-input"
            aria-label="Pickup location"
            placeholder="Pickup location"
            autoComplete="off"
            value={pickup}
            onFocus={() => setActive("pickup")}
            onChange={(event) => setPickup(event.target.value)}
          />
          <button type="button" className="place-input-action" onClick={onLocate} aria-label="Use my current location" disabled={locating}>
            {locating ? <Spinner size={18} /> : <LocateFixed size={19} />}
          </button>
        </div>
        <div className="place-input-wrap">
          <input
            ref={destinationRef}
            className="place-input"
            aria-label="Destination"
            placeholder="Where are you going?"
            autoComplete="off"
            value={destination}
            onFocus={() => setActive("destination")}
            onChange={(event) => setDestination(event.target.value)}
          />
          {destination && (
            <button type="button" className="place-input-action" onClick={() => setDestination("")} aria-label="Clear destination">
              <X size={18} />
            </button>
          )}
        </div>
      </div>

      {error && <Banner tone="danger">{error}</Banner>}
      {!error && notice && <Banner tone="info">{notice}</Banner>}

      {showSuggestions ? (
        <div className="suggestions" role="listbox" aria-label="Suggestions">
          {items.map((text) => (
            <SuggestionRow key={text} icon={<MapPin size={18} />} text={text} onPick={choose} />
          ))}
        </div>
      ) : (
        <>
          {loading && (
            <p className="qr-hint" role="status" style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <Spinner size={14} /> Searching places
            </p>
          )}
          {suggestError && <p className="qr-hint">{suggestError}</p>}

          {savedPlaces.length > 0 && (
            <div style={{ display: "grid", gap: 8 }}>
              <span className="section-label">Saved places</span>
              <div className="chip-row">
                {savedPlaces.map((place) => (
                  <button key={place.label} type="button" className="qr-chip" onClick={() => pickSaved(place)}>
                    {/home/i.test(place.label) ? <Home size={15} /> : <Star size={15} />}
                    {place.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {recents.length > 0 && !destination && (
            <div style={{ display: "grid", gap: 4 }}>
              <span className="section-label">Recent</span>
              <div className="suggestions">
                {recents.map((text) => (
                  <SuggestionRow key={text} icon={<History size={18} />} text={text} onPick={(value) => {
                    setActive("destination");
                    setDestination(value);
                    onPicked?.("destination", value);
                  }} />
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
}

export function PlaceSearchFooter({ onSubmit, loading, disabled }) {
  return (
    <Button onClick={onSubmit} loading={loading} loadingText="Finding rides" disabled={disabled} icon={<Search size={18} />}>
      See ride options
    </Button>
  );
}

/* ------------------------------------------------------------- vehicle options */

export function VehicleOptionsBody({ destination, quote, fare, selected, onSelect, onBack, error }) {
  const minutes = quote?.duration?.value ? Math.round(quote.duration.value / 60) : null;
  const cheapest = Object.entries(fare || {}).sort((a, b) => a[1] - b[1])[0]?.[0];

  return (
    <>
      <button type="button" className="sheet-back" onClick={onBack}>
        <ArrowLeft size={17} /> Edit trip
      </button>
      <div>
        <span className="sheet-eyebrow">Choose a ride</span>
        <h1 className="sheet-title">Pick your QuickRide</h1>
      </div>

      <div className="trip-summary-chip">
        <Route size={18} aria-hidden="true" />
        <span className="qr-truncate" style={{ flex: 1 }}>
          {splitAddress(destination).title}
        </span>
        <span style={{ color: "var(--ink-500)", whiteSpace: "nowrap" }}>
          {formatDistance(quote?.distance?.value)} · {formatDuration(quote?.duration?.value)}
        </span>
      </div>

      {error && <Banner tone="danger">{error}</Banner>}

      <div className="vehicle-list" role="radiogroup" aria-label="Ride type">
        {Object.entries(VEHICLES).map(([type, vehicle]) => (
          <button
            key={type}
            type="button"
            role="radio"
            aria-checked={selected === type}
            className="vehicle-card"
            onClick={() => onSelect(type)}
          >
            <span className="vehicle-image">
              <img src={vehicle.image} alt="" width="76" height="56" loading="lazy" decoding="async" />
            </span>
            <span className="vehicle-copy">
              <span className="vehicle-name">
                {vehicle.name}
                {type === cheapest && <Badge>Best value</Badge>}
                {type === "bike" && cheapest !== "bike" && <Badge tone="info">Fastest</Badge>}
              </span>
              <span className="vehicle-meta" style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <Users size={12} aria-hidden="true" /> {vehicle.seats}
                {minutes != null && (
                  <>
                    <Clock size={12} aria-hidden="true" style={{ marginLeft: 4 }} /> {minutes} min trip
                  </>
                )}
              </span>
              <span className="vehicle-meta">{vehicle.tagline}</span>
            </span>
            <span className="vehicle-price">
              <strong>{money(fare?.[type])}</strong>
              <span>total</span>
            </span>
          </button>
        ))}
      </div>

      <div className="pay-row">
        <Banknote size={18} aria-hidden="true" />
        <span>Pay the driver in cash</span>
        <span>Default</span>
      </div>
      <p className="qr-hint">Upfront price. The fare is fixed once you book, even if traffic changes.</p>
    </>
  );
}

/* -------------------------------------------------------------------- searching */

export function SearchingBody({ ride }) {
  const now = useTick(1000);
  const expires = ride.expiresAt ? new Date(ride.expiresAt).getTime() : null;
  const total = expires ? Math.max(1, expires - new Date(ride.createdAt).getTime()) : 1;
  const left = expires ? Math.max(0, expires - now) : 0;

  return (
    <>
      <div className="radar" aria-hidden="true">
        <span className="radar-core">
          <Navigation size={26} />
        </span>
      </div>
      <div style={{ textAlign: "center" }}>
        <h1 className="sheet-title" role="status" aria-live="polite">
          Finding your driver
        </h1>
        <p className="sheet-sub">
          Contacting {VEHICLES[ride.vehicle]?.name || "drivers"} near you. This usually takes under a minute.
        </p>
      </div>
      {expires && (
        <div className="meter" role="progressbar" aria-label="Time left to find a driver" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round((left / total) * 100)}>
          <span style={{ width: `${(left / total) * 100}%` }} />
        </div>
      )}
      <TripLegs pickup={ride.pickup} destination={ride.destination} />
      <div className="receipt-rows">
        <div className="receipt-row">
          <span>Fare</span>
          <strong>{money(ride.fare)} · cash</strong>
        </div>
      </div>
    </>
  );
}

// Re-exported so screens import everything ride-related from one place.
export { MapPin };
