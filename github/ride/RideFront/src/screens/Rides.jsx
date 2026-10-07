import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { CarFront, ChevronRight, Receipt, RefreshCcw, Star } from "lucide-react";
import api, { getApiErrorMessage } from "../utils/api";
import { ROLES } from "../utils/roles";
import { Badge, Banner, Button, EmptyState, PageShell, Skeleton, Stars, Avatar, fullNameOf } from "../components/ui";
import { TripLegs } from "../components/ride/RidePanels";
import { SummaryBody } from "../components/ride/RideTrip";
import { VEHICLES, formatDate, formatDistance, formatDuration, formatTime, money } from "../utils/format";
import "../components/ride/ride.css";

const STATUS = {
  completed: { label: "Completed", tone: "brand" },
  cancelled: { label: "Cancelled", tone: "danger" },
  ongoing: { label: "In progress", tone: "info" },
  accepted: { label: "Driver assigned", tone: "info" },
  pending: { label: "Searching", tone: "warning" },
};

function bucketOf(date) {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const day = 24 * 60 * 60 * 1000;
  const age = start.getTime() - new Date(date).setHours(0, 0, 0, 0);
  if (age <= 0) return "Today";
  if (age <= day) return "Yesterday";
  if (age <= 7 * day) return "This week";
  return "Earlier";
}

function RideRow({ ride, role }) {
  const status = STATUS[ride.status] || STATUS.pending;
  return (
    <Link to={`/${role}/rides/${ride._id}`} className="qr-card" style={{ display: "grid", gap: 10, textDecoration: "none", color: "inherit" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <span className="qr-list-item-icon">
          <CarFront size={19} aria-hidden="true" />
        </span>
        <div style={{ display: "grid", flex: 1, minWidth: 0 }}>
          <strong className="qr-truncate">{ride.destination.split(", ")[0]}</strong>
          <span className="qr-hint">
            {formatDate(ride.createdAt)} · {formatTime(ride.createdAt)}
          </span>
        </div>
        <div style={{ textAlign: "right" }}>
          <strong style={{ display: "block", fontFamily: "var(--font-display)" }}>{money(ride.fare)}</strong>
          <Badge tone={status.tone}>{status.label}</Badge>
        </div>
        <ChevronRight size={18} color="var(--ink-300)" aria-hidden="true" />
      </div>
    </Link>
  );
}

export function RideHistory({ role }) {
  const config = ROLES[role];
  const [rides, setRides] = useState(null);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");

  const load = () => {
    setError("");
    api
      .get(config.profileEndpoint)
      .then(({ data }) => setRides(data[role].rides || []))
      .catch((err) => setError(getApiErrorMessage(err)));
  };
  useEffect(load, []); // eslint-disable-line react-hooks/exhaustive-deps

  const visible = useMemo(() => {
    const list = (rides || [])
      .filter((ride) => filter === "all" || ride.status === filter)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    const groups = new Map();
    list.forEach((ride) => {
      const key = bucketOf(ride.createdAt);
      groups.set(key, [...(groups.get(key) || []), ride]);
    });
    return [...groups.entries()];
  }, [rides, filter]);

  const completed = (rides || []).filter((ride) => ride.status === "completed");
  const total = completed.reduce((sum, ride) => sum + (ride.fare || 0), 0);

  return (
    <PageShell title={role === "user" ? "Your trips" : "Trip history"} backTo={config.home}>
      {error && (
        <Banner tone="danger" action={<Button auto size="sm" variant="secondary" onClick={load}>Retry</Button>}>
          {error}
        </Banner>
      )}

      {rides && (
        <div className="qr-stats">
          <div className="qr-stat">
            <strong>{completed.length}</strong>
            <span>Trips</span>
          </div>
          <div className="qr-stat">
            <strong>{money(total)}</strong>
            <span>{role === "user" ? "Spent" : "Earned"}</span>
          </div>
          <div className="qr-stat">
            <strong>{formatDistance(completed.reduce((sum, ride) => sum + (ride.distance || 0), 0))}</strong>
            <span>Distance</span>
          </div>
        </div>
      )}

      <div className="chip-row" style={{ margin: 0, padding: 0 }}>
        {[
          ["all", "All"],
          ["completed", "Completed"],
          ["cancelled", "Cancelled"],
        ].map(([value, text]) => (
          <button key={value} type="button" className="qr-chip" aria-pressed={filter === value} onClick={() => setFilter(value)}>
            {text}
          </button>
        ))}
      </div>

      {!rides && !error && (
        <div style={{ display: "grid", gap: 10 }} aria-busy="true" aria-label="Loading trips">
          {[0, 1, 2].map((item) => (
            <div key={item} className="qr-card" style={{ display: "grid", gap: 8 }}>
              <Skeleton height={18} width="60%" />
              <Skeleton height={14} width="40%" />
            </div>
          ))}
        </div>
      )}

      {rides && visible.length === 0 && (
        <EmptyState
          icon={<Receipt size={26} />}
          title={filter === "all" ? "No trips yet" : "Nothing here"}
          action={role === "user" && <Button auto to={config.home}>Book your first ride</Button>}
        >
          {filter === "all" ? "Your completed and cancelled trips will show up here." : "Try a different filter."}
        </EmptyState>
      )}

      {visible.map(([bucket, items]) => (
        <section key={bucket} style={{ display: "grid", gap: 10 }} aria-label={bucket}>
          <span className="section-label">{bucket}</span>
          {items.map((ride) => (
            <RideRow key={ride._id} ride={ride} role={role} />
          ))}
        </section>
      ))}
    </PageShell>
  );
}

export function RideDetail({ role }) {
  const { rideId } = useParams();
  const navigate = useNavigate();
  const config = ROLES[role];
  const [ride, setRide] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get(`/ride/${rideId}`)
      .then(({ data }) => setRide(data.ride))
      .catch((err) => setError(getApiErrorMessage(err)));
  }, [rideId]);

  const other = ride && (role === "user" ? ride.captain : ride.user);
  const mine = ride?.rating?.[role === "user" ? "byUser" : "byCaptain"];
  const theirs = ride?.rating?.[role === "user" ? "byCaptain" : "byUser"];
  const status = STATUS[ride?.status] || STATUS.pending;

  return (
    <PageShell title="Trip details" backTo={config.history}>
      {error && <Banner tone="danger">{error}</Banner>}
      {!ride && !error && <Skeleton height={220} radius="20px" />}
      {ride && (
        <>
          <div className="qr-card" style={{ display: "grid", gap: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <span className="sheet-eyebrow">
                  {formatDate(ride.createdAt)} · {formatTime(ride.createdAt)}
                </span>
                <div className="summary-fare" style={{ fontSize: "var(--text-2xl)" }}>
                  {money(ride.fare)}
                </div>
              </div>
              <Badge tone={status.tone}>{status.label}</Badge>
            </div>
            <TripLegs pickup={ride.pickup} destination={ride.destination} />
            <div className="receipt-rows">
              <div className="receipt-row">
                <span>Ride type</span>
                <strong>{VEHICLES[ride.vehicle]?.name || ride.vehicle}</strong>
              </div>
              <div className="receipt-row">
                <span>Distance</span>
                <strong>{formatDistance(ride.distance)}</strong>
              </div>
              <div className="receipt-row">
                <span>Estimated time</span>
                <strong>{formatDuration(ride.duration)}</strong>
              </div>
              <div className="receipt-row">
                <span>Payment</span>
                <strong>Cash</strong>
              </div>
              {ride.status === "cancelled" && (
                <div className="receipt-row">
                  <span>Cancelled by</span>
                  <strong style={{ textTransform: "capitalize" }}>{ride.cancelledBy || "—"}</strong>
                </div>
              )}
            </div>
          </div>

          {other?.fullname && (
            <div className="qr-card person-card">
              <Avatar fullname={other.fullname} />
              <div className="person-card-body">
                <strong style={{ fontSize: "var(--text-base)" }}>{fullNameOf(other.fullname)}</strong>
                <div className="person-card-meta">
                  <Stars rating={other.rating} />
                  {role === "user" && other.vehicle && (
                    <span>
                      {other.vehicle.color} {other.vehicle.type} · {other.vehicle.number}
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}

          {ride.status === "completed" && (
            <div className="qr-card" style={{ display: "grid", gap: 8 }}>
              <span className="section-label">Ratings</span>
              <div className="receipt-row" style={{ padding: 0 }}>
                <span>You rated</span>
                <strong>{mine ? `${mine.stars} ★` : "Not rated"}</strong>
              </div>
              <div className="receipt-row" style={{ padding: 0 }}>
                <span>You were rated</span>
                <strong>{theirs ? `${theirs.stars} ★` : "Not rated yet"}</strong>
              </div>
              {!mine && (
                <Button variant="secondary" icon={<Star size={17} />} onClick={() => navigate(`/${role}/rides/${ride._id}/rate`)}>
                  Rate this trip
                </Button>
              )}
            </div>
          )}

          {role === "user" && (
            <Button
              variant="secondary"
              icon={<RefreshCcw size={18} />}
              onClick={() => navigate(config.home, { state: { rebook: { pickup: ride.pickup, destination: ride.destination } } })}
            >
              Book this trip again
            </Button>
          )}
        </>
      )}
    </PageShell>
  );
}

export function RateRide({ role }) {
  const { rideId } = useParams();
  const navigate = useNavigate();
  const [ride, setRide] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get(`/ride/${rideId}`)
      .then(({ data }) => setRide(data.ride))
      .catch((err) => setError(getApiErrorMessage(err)));
  }, [rideId]);

  return (
    <PageShell title="Rate your trip" backTo={`/${role}/rides/${rideId}`}>
      {error && <Banner tone="danger">{error}</Banner>}
      {ride && (
        <div className="qr-card" style={{ display: "grid", gap: 16 }}>
          <SummaryBody role={role} ended={{ ride, outcome: "completed" }} />
          <Button variant="secondary" onClick={() => navigate(`/${role}/rides/${rideId}`)}>
            Back to trip
          </Button>
        </div>
      )}
    </PageShell>
  );
}
