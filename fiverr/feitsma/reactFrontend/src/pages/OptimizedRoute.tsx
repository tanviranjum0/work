import { useEffect, useRef, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
const alphabet = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z",
];

// ─── Google Maps type augmentation ────────────────────────────────────────────

declare namespace google {
  namespace maps {
    interface MapOptions {
      center: { lat: number; lng: number };
      zoom: number;
      mapTypeId: string;
      disableDefaultUI: boolean;
      styles: any[];
    }

    class Map {
      constructor(element: Element, options: MapOptions);
      panTo(latLng: { lat: number; lng: number }): void;
      setZoom(zoom: number): void;
      fitBounds(bounds: any): void;
    }

    class DirectionsRenderer {
      constructor(options: any);
      setDirections(result: any): void;
    }

    class Marker {
      constructor(options: any);
      setPosition(position: { lat: number; lng: number }): void;
      addListener(event: string, handler: () => void): void;
    }

    class InfoWindow {
      constructor(options: any);
      open(map: Map, anchor?: Marker | null): void;
    }

    class DirectionsService {
      route(request: any, callback: (result: any, status: any) => void): void;
    }

    class LatLng {
      constructor(lat: number, lng: number);
    }

    enum TravelMode {
      DRIVING = "DRIVING",
    }

    enum DirectionsStatus {
      OK = "OK",
    }

    type DirectionsWaypoint = {
      location: LatLng | string;
      stopover: boolean;
    };

    const SymbolPath: {
      CIRCLE: number;
      FORWARD_CLOSED_ARROW: number;
    };
  }
}

declare global {
  interface Window {
    google: any;
    initMap?: () => void;
  }
}

// ─── Types ────────────────────────────────────────────────────────────────────

interface Order {
  _id: string;
  id: number;
  OwnerRef: string;
  pickupAddress: string;
  deliveryAddress: string;
  deliverySelected: { lat: number; lng: number } | null;
  boxQuantity: number;
  clientName: string;
  shipmentType: string;
  clientPhoneNumber: string | number;
  status: string;
  driverAllocated: boolean;
  createdAt: string;
  updatedAt: string;
  deliveryShift: "morning" | "afternoon" | "evening" | "night" | "fullday";
  /** e.g. "Collection" or "DeliveryCollection" — shown on the printed route
   *  sheet in place of status. */
  deliveryType: string;
  reachingTime?: string;
  note: string;
  __v: number;
}

type OrderStatus = "pending" | "transit" | "delivered";
type OptimizeState = "idle" | "loading" | "done" | "error";

// ─── Constants ────────────────────────────────────────────────────────────────

const WAREHOUSE = {
  address: "Izaäk Enschedéweg 50, 2031 CS Haarlem, Netherlands",
  lat: 52.3892183,
  lng: 4.6606146,
};

const SHIFT_COLORS: Record<string, string> = {
  morning: "#f59e0b",
  afternoon: "#3b82f6",
  evening: "#8b5cf6",
  night: "#64748b",
};

// ─── Mock Orders ──────────────────────────────────────────────────────────────

const MOCK_ORDERS: Order[] = [
  {
    deliverySelected: {
      lat: 52.41684859999999,
      lng: 4.822424199999999,
    },
    _id: "",
    id: 1,
    OwnerRef: "6a26b5c8681f5eb1913ca53a",
    clientName: "Loading...",
    clientPhoneNumber: 0,
    pickupAddress: "Loading...",
    deliveryAddress: "Loading...",
    shipmentType: "delivery",
    deliveryType: "Loading...",
    boxQuantity: 43,
    driverAllocated: false,
    status: "pending",
    deliveryShift: "fullday",
    note: "Loading...",
    createdAt: "2026-06-18T17:47:12.474Z",
    updatedAt: "2026-06-18T17:47:12.474Z",
    __v: 0,
  },
];
// ─── Helper: shift label ───────────────────────────────────────────────────────

function shiftLabel(shift: string) {
  return (
    {
      morning: "Morning",
      afternoon: "Afternoon",
      evening: "Evening",
      night: "Night",
      fullday: "Full Day",
    }[shift] ?? shift
  );
}

// ─── Helper: shift hours ───────────────────────────────────────────────────────

function shiftHours(shift: string) {
  return (
    {
      morning: "6AM–12PM",
      afternoon: "12PM–6PM",
      evening: "6PM–12AM",
      night: "12AM–6AM",
      fullday: "00:00-23:59",
    }[shift] ?? ""
  );
}

// ─── Helper: "HH:MM" input value → today's Date ───────────────────────────────

function parseTimeInputToDate(value: string): Date {
  const [hours, minutes] = value.split(":").map(Number);
  const date = new Date();
  date.setHours(
    Number.isFinite(hours) ? hours : 0,
    Number.isFinite(minutes) ? minutes : 0,
    0,
    0,
  );
  return date;
}

function currentTimeInputValue(): string {
  const now = new Date();
  return `${String(now.getHours()).padStart(2, "0")}:${String(
    now.getMinutes(),
  ).padStart(2, "0")}`;
}

/** "14:05" → "2:05 PM" — for display only (the stored value stays 24-hour). */
function formatTimeInput12h(value: string): string {
  const [h24, m] = value.split(":").map(Number);
  if (!Number.isFinite(h24) || !Number.isFinite(m)) return value;
  const isPM = h24 >= 12;
  const h12 = h24 % 12 || 12;
  return `${h12}:${String(m).padStart(2, "0")} ${isPM ? "PM" : "AM"}`;
}

// ─── Order Card ───────────────────────────────────────────────────────────────

function OrderCard({
  order,
  seq,
  status,
  isActive,
  onClick,
}: {
  order: Order;
  seq: number;
  status: OrderStatus;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      className={`order-card ${isActive ? "order-card-active" : ""} status-${status}`}
      onClick={onClick}
    >
      <div className="oc-seq-col">
        <span className="oc-seq">{alphabet[seq] || seq}</span>
        <span
          className="oc-shift-pip"
          style={{ background: SHIFT_COLORS[order.deliveryShift] ?? "#94a3b8" }}
          title={shiftLabel(order.deliveryShift)}
        />
      </div>

      <div className="oc-body">
        <div className="oc-row-top">
          <span className="oc-name">{order.clientName}</span>
          <span className="text-sm">
            <span className="od-icon">📞</span>
            <a href={`tel:${order.clientPhoneNumber}`} className="od-link">
              {order.clientPhoneNumber}
            </a>
          </span>
          <span className={`oc-status-badge oc-status-${status}`}>
            {status === "delivered"
              ? "Done"
              : status === "transit"
                ? "Active"
                : "Pending"}
          </span>
        </div>

        <p className="oc-address">{order.deliveryAddress}</p>

        <div className="oc-chips">
          <span className="oc-chip oc-chip-box">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
              <path
                d="M21 8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16V8z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinejoin="round"
              />
              <path
                d="M12 22V12M3.27 6.96L12 12l8.73-5.04"
                stroke="currentColor"
                strokeWidth="2"
              />
            </svg>
            {order.boxQuantity} {order.boxQuantity === 1 ? "box" : "boxes"}
          </span>
          <span
            className="oc-chip oc-chip-shift"
            style={{
              borderColor: SHIFT_COLORS[order.deliveryShift] + "55",
              color: SHIFT_COLORS[order.deliveryShift],
            }}
          >
            {shiftLabel(order.deliveryShift)} ·{" "}
            {shiftHours(order.deliveryShift)}
          </span>
          <span className="oc-chip">{order.shipmentType}</span>
        </div>
        {order.reachingTime && (
          <div className="oc-eta">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
              <circle
                cx="12"
                cy="12"
                r="9"
                stroke="currentColor"
                strokeWidth="1.8"
              />
              <path
                d="M12 7v5l3.5 2"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            ETA {order.reachingTime}
          </div>
        )}
        {order.note ? (
          <p className="oc-note">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 8v4l3 3"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <circle
                cx="12"
                cy="12"
                r="9"
                stroke="currentColor"
                strokeWidth="2"
              />
            </svg>
            {order.note}
          </p>
        ) : null}
      </div>

      {status === "delivered" && (
        <span className="oc-done-icon">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <circle cx="7" cy="7" r="7" fill="#22c55e" />
            <path
              d="M3.5 7l2.5 2.5 4.5-5"
              stroke="#fff"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      )}
    </button>
  );
}

// ─── Time Picker ────────────────────────────────────────────────────────────

function TimePickerField({
  value,
  onChange,
}: {
  value: string; // "HH:MM", 24-hour
  onChange: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const [h24raw, mRaw] = value.split(":").map(Number);
  const h24 = Number.isFinite(h24raw) ? h24raw : 0;
  const m = Number.isFinite(mRaw) ? mRaw : 0;
  const isPM = h24 >= 12;
  const h12 = h24 % 12 || 12;

  const commit = (nextH12: number, nextM: number, nextIsPM: boolean) => {
    const clampedH12 = Math.min(12, Math.max(1, nextH12));
    const clampedM = Math.min(59, Math.max(0, nextM));
    let nextH24 = clampedH12 % 12;
    if (nextIsPM) nextH24 += 12;
    onChange(
      `${String(nextH24).padStart(2, "0")}:${String(clampedM).padStart(2, "0")}`,
    );
  };

  const applyPreset = (minutesFromNow: number) => {
    const d = new Date(Date.now() + minutesFromNow * 60000);
    onChange(
      `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`,
    );
  };

  const presets: { label: string; minutes: number }[] = [
    { label: "Now", minutes: 0 },
    { label: "+15m", minutes: 15 },
    { label: "+30m", minutes: 30 },
    { label: "+1h", minutes: 60 },
  ];

  return (
    <div className="time-picker" ref={rootRef}>
      <button
        type="button"
        className={`time-picker-trigger ${open ? "time-picker-trigger-open" : ""}`}
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="true"
        aria-expanded={open}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
          <circle
            cx="12"
            cy="12"
            r="9"
            stroke="currentColor"
            strokeWidth="1.8"
          />
          <path
            d="M12 7v5l3.5 2"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span className="tp-trigger-time">
          {h12}:{String(m).padStart(2, "0")}{" "}
          <span className="tp-trigger-ampm">{isPM ? "PM" : "AM"}</span>
        </span>
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          className={`tp-chevron ${open ? "tp-chevron-open" : ""}`}
        >
          <path
            d="M2.5 4.5L6 8l3.5-3.5"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {open && (
        <div
          className="time-picker-panel"
          role="dialog"
          aria-label="Choose start time"
        >
          <div className="tp-presets">
            {presets.map((p) => (
              <button
                key={p.label}
                type="button"
                className="tp-preset"
                onClick={() => applyPreset(p.minutes)}
              >
                {p.label}
              </button>
            ))}
          </div>

          <div className="tp-steppers">
            <div className="tp-stepper-col">
              <button
                type="button"
                className="tp-step-btn"
                aria-label="Increase hour"
                onClick={() => commit(h12 === 12 ? 1 : h12 + 1, m, isPM)}
              >
                ▲
              </button>
              <input
                type="number"
                inputMode="numeric"
                className="tp-num-input"
                value={h12}
                min={1}
                max={12}
                onChange={(e) => {
                  const v = Number(e.target.value);
                  if (Number.isFinite(v)) commit(v, m, isPM);
                }}
                aria-label="Hour"
              />
              <button
                type="button"
                className="tp-step-btn"
                aria-label="Decrease hour"
                onClick={() => commit(h12 === 1 ? 12 : h12 - 1, m, isPM)}
              >
                ▼
              </button>
              <span className="tp-stepper-label">Hour</span>
            </div>

            <span className="tp-colon">:</span>

            <div className="tp-stepper-col">
              <button
                type="button"
                className="tp-step-btn"
                aria-label="Increase minute"
                onClick={() => commit(h12, (m + 1) % 60, isPM)}
              >
                ▲
              </button>
              <input
                type="number"
                inputMode="numeric"
                className="tp-num-input"
                value={String(m).padStart(2, "0")}
                min={0}
                max={59}
                onChange={(e) => {
                  const v = Number(e.target.value);
                  if (Number.isFinite(v)) commit(h12, v, isPM);
                }}
                aria-label="Minute"
              />
              <button
                type="button"
                className="tp-step-btn"
                aria-label="Decrease minute"
                onClick={() => commit(h12, m === 0 ? 59 : m - 1, isPM)}
              >
                ▼
              </button>
              <span className="tp-stepper-label">Min</span>
            </div>

            <div className="tp-ampm-toggle">
              <button
                type="button"
                className={`tp-ampm-btn ${!isPM ? "tp-ampm-active" : ""}`}
                onClick={() => commit(h12, m, false)}
              >
                AM
              </button>
              <button
                type="button"
                className={`tp-ampm-btn ${isPM ? "tp-ampm-active" : ""}`}
                onClick={() => commit(h12, m, true)}
              >
                PM
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Stats bar ────────────────────────────────────────────────────────────────

function StatsBar({
  orders,
  statuses,
  initialBoxesRequired,
}: {
  orders: Order[];
  statuses: Record<number, OrderStatus>;
  initialBoxesRequired: number;
}) {
  console.log(initialBoxesRequired);
  const completed = orders.filter((o) => statuses[o.id] === "delivered").length;
  const inProgress = orders.filter((o) => statuses[o.id] === "transit").length;
  // const totalBoxes = orders.reduce((s, o) => s + o.boxQuantity, 0);
  const pct = Math.round((completed / orders.length) * 100);

  return (
    <div className="stats-bar">
      <div className="stat">
        <span className="stat-val">
          {completed}/{orders.length}
        </span>
        <span className="stat-lbl">Delivered</span>
      </div>
      <div className="stat-sep" />
      <div className="stat">
        <span className="stat-val">{inProgress}</span>
        <span className="stat-lbl">En Route</span>
      </div>
      <div className="stat-sep" />
      <div className="stat">
        <span className="stat-val">{initialBoxesRequired}</span>
        <span className="stat-lbl">Initial Boxes</span>
      </div>
      <div className="stat-progress">
        <div className="stat-progress-fill" style={{ width: `${pct}%` }} />
      </div>
      <span className="stat-pct">{pct}%</span>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function OptimizedRoutesPage() {
  const router = useNavigate();
  const [initialBoxesRequired, setInitialBoxesRequired] = useState<number>(0);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<google.maps.Map | null>(null);
  const dirRenderer = useRef<google.maps.DirectionsRenderer | null>(null);
  const driverMarker = useRef<google.maps.Marker | null>(null);
  const warehouseMarker = useRef<google.maps.Marker | null>(null);
  const watchId = useRef<number | null>(null);
  const mapsLoaded = useRef(false);
  const params = useParams<{ category: string; id: string }>();
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);
  const [statuses, setStatuses] = useState<Record<number, OrderStatus>>(() =>
    Object.fromEntries(orders.map((o) => [o.id, o.status as OrderStatus])),
  );

  const [optimizeState, setOptimizeState] = useState<OptimizeState>("idle");
  const [activeOrderId, setActiveOrderId] = useState<number | null>(null);
  const [driverPos, setDriverPos] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [geoError, setGeoError] = useState<string>("");
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [startTimeInput, setStartTimeInput] = useState<string>(
    currentTimeInputValue,
  );
  const [userInfo, setUserInfo] = useState<{ name?: string; email?: string }>(
    {},
  );
  const [routeMeta, setRouteMeta] = useState<{
    legsCalculated: number;
    serviceBufferMinutesPerStop: number;
  } | null>(null);
  const [detailsCollapsed, setDetailsCollapsed] = useState(false);
  const handleUpdateTimes = async (
    ordersOverride?: Order[],
    startTimeOverride?: Date,
  ) => {
    const DEPOT = {
      lat: 52.389285,
      lng: 4.660226,
    };
    const list = ordersOverride ?? orders;
    const result = await fetch(`/api/routes/times`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify([
        {
          deliverySelected: DEPOT,
          status: "transit",
        },
        ...list,
      ]),
      credentials: "include",
    });
    const data = await result.json();
    // console.log(data)
    if (result.ok) {
      let currentTime = startTimeOverride ?? new Date();
      const newShipments = data.shipments.map(
        (shipment: {
          travelTimeFromPreviousMinutes?: number;
          status: string;
        }) => {
          // Every leg's travel time must count toward the running clock,
          // no matter the shipment's status — otherwise every stop after
          // the first "pending" one loses its ETA entirely.
          //
          // travelTimeFromPreviousMinutes already includes the 10-minute
          // loading/unloading buffer added server-side (raw driving time +
          // buffer, computed together so the two numbers can't drift out
          // of sync). So for three 30-minute legs starting at 12:00 AM:
          //   stop 1: 12:00 + (30 + 10) = 12:40 AM
          //   stop 2: 12:40 + (30 + 10) = 1:20 AM
          //   stop 3: 1:20  + (30 + 10) = 2:00 AM
          const travelMinutes = shipment.travelTimeFromPreviousMinutes || 0;
          currentTime = new Date(
            currentTime.getTime() + travelMinutes * 60 * 1000,
          );

          // Delivered shipments already happened — no projected ETA needed.
          if (shipment.status === "delivered") {
            return {
              ...shipment,
              reachingTime: undefined,
            };
          }

          return {
            ...shipment,
            reachingTime: currentTime.toLocaleTimeString("en-US", {
              hour: "numeric",
              minute: "2-digit",
              hour12: true,
            }),
          };
        },
      );
      newShipments.splice(0, 1);
      setOrders(newShipments);
      if (data.meta) {
        setRouteMeta({
          legsCalculated: data.meta.legsCalculated ?? 0,
          serviceBufferMinutesPerStop:
            data.meta.serviceBufferMinutesPerStop ?? 10,
        });
      }
    }
  };
  // ── Initialise map after Google Maps script loads ────────────────────────

  const handleInitialLoad = async () => {
    const result = await fetch(`/api/routes/${params.id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    const data = await result.json();
    if (data.message == "Unauthorized: No token provided") {
      router("/login");
    }
    if (!result.ok) {
      if (data.message == "No Route found") {
        alert("No route found.");
        setTimeout(() => {
          router("/home");
        }, 2000);
      }
    }
    const mock: Order[] = [];
    setInitialBoxesRequired(data[0].initialLoad);
    console.log(data[0].initialLoad);

    data[0].shipments.map((order: Order, idx: number) =>
      mock.push({ ...order, id: idx + 1 }),
    );
    setStatuses(() =>
      Object.fromEntries(mock.map((o) => [o.id, o.status as OrderStatus])),
    );
    setOrders(mock);
  };

  const initMap = useCallback(() => {
    if (!mapRef.current || !window.google || mapsLoaded.current) return;
    mapsLoaded.current = true;

    const map = new window.google.maps.Map(mapRef.current, {
      center: { lat: WAREHOUSE.lat, lng: WAREHOUSE.lng },
      zoom: 12,
      mapTypeId: "roadmap",
      disableDefaultUI: false,
      styles: [
        {
          featureType: "poi",
          elementType: "labels",
          stylers: [{ visibility: "off" }],
        },
        {
          featureType: "transit",
          elementType: "labels",
          stylers: [{ visibility: "off" }],
        },
      ],
    });

    mapInstance.current = map;

    // Warehouse marker
    warehouseMarker.current = new window.google.maps.Marker({
      position: { lat: WAREHOUSE.lat, lng: WAREHOUSE.lng },
      map,
      title: "Warehouse — " + WAREHOUSE.address,
      icon: {
        path: window.google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
        scale: 7,
        fillColor: "#1e40af",
        fillOpacity: 1,
        strokeColor: "#fff",
        strokeWeight: 2,
        rotation: 0,
      },
      zIndex: 200,
    });

    const iw = new window.google.maps.InfoWindow({
      content: `<div style="font:600 13px 'DM Sans',sans-serif;color:#0f172a;padding:4px 2px">
        🏭 Warehouse<br/><span style="font-weight:400;font-size:11px;color:#64748b">${WAREHOUSE.address}</span>
      </div>`,
    });

    const warehouseMarkerInstance = warehouseMarker.current!;
    warehouseMarkerInstance.addListener("click", () =>
      iw.open(map, warehouseMarkerInstance),
    );

    // Directions renderer
    dirRenderer.current = new window.google.maps.DirectionsRenderer({
      map,
      suppressMarkers: false,
      polylineOptions: {
        strokeColor: "#1e40af",
        strokeWeight: 4,
        strokeOpacity: 0.85,
      },
    });
  }, [orders]);

  // ── Driver marker ──────────────────────────────────────────────────────────

  const updateDriverMarker = useCallback((lat: number, lng: number) => {
    if (!mapInstance.current || !window.google) return;

    const pos = { lat, lng };

    if (!driverMarker.current) {
      const marker = new window.google.maps.Marker({
        position: pos,
        map: mapInstance.current,
        title: "Your location",
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 10,
          fillColor: "#2563eb",
          fillOpacity: 1,
          strokeColor: "#fff",
          strokeWeight: 3,
        },
        zIndex: 300,
      });

      driverMarker.current = marker;

      const driverIw = new window.google.maps.InfoWindow({
        content: `<div style="font:600 13px 'DM Sans',sans-serif;color:#1e40af">🚚 You are here</div>`,
      });
      marker.addListener("click", () =>
        driverIw.open(mapInstance.current, marker),
      );
    } else {
      driverMarker.current.setPosition(pos);
    }
  }, []);

  // ── Geolocation ────────────────────────────────────────────────────────────

  useEffect(() => {
    if (!navigator.geolocation) {
      setGeoError("Geolocation is not supported by this browser.");
      return;
    }

    watchId.current = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude: lat, longitude: lng } = pos.coords;

        // const lat = 52.389015197753906;
        // const lng = 4.660130023956299;
        setDriverPos({ lat, lng });
        setGeoError("");
        updateDriverMarker(lat, lng);
      },
      (err) => {
        setGeoError(
          `Location unavailable (${err.message}). Using warehouse as fallback.`,
        );
        // Fallback: place driver marker at warehouse
        updateDriverMarker(WAREHOUSE.lat, WAREHOUSE.lng);
      },
      { enableHighAccuracy: true, maximumAge: 5000, timeout: 10000 },
    );

    return () => {
      if (watchId.current !== null)
        navigator.geolocation.clearWatch(watchId.current);
    };
  }, [updateDriverMarker]);

  // ── Route Optimisation ─────────────────────────────────────────────────────

  const handleOptimize = useCallback(async (): Promise<Order[] | null> => {
    if (!window.google || !mapInstance.current || !dirRenderer.current)
      return null;

    // setOptimizeState("loading");
    const directionsService = new window.google.maps.DirectionsService();

    const waypoints: google.maps.DirectionsWaypoint[] = orders
      .filter((o) => o.deliverySelected)
      .map((o) => ({
        location: new window.google.maps.LatLng(
          o.deliverySelected!.lat,
          o.deliverySelected!.lng,
        ),

        stopover: true,
      }));

    // route() is callback-based, not Promise-based — wrap it so callers can
    // genuinely await the result instead of racing the callback.
    return new Promise<Order[] | null>((resolve) => {
      directionsService.route(
        {
          origin: WAREHOUSE.address,
          destination: WAREHOUSE.address,
          waypoints,
          travelMode: window.google.maps.TravelMode.DRIVING,
        },
        (
          result: {
            routes: {
              [x: string]: number[];
              bounds: any;
            }[];
          },
          status: any,
        ) => {
          if (status === window.google.maps.DirectionsStatus.OK && result) {
            dirRenderer.current!.setDirections(result);
            // Re-order the sidebar list to match optimised sequence
            const optimisedIndices: number[] = result.routes[0].waypoint_order;
            const reordered = optimisedIndices.map((i) => orders[i]);
            setOrders(reordered);
            // Fit map to route bounds
            const bounds = result.routes[0].bounds;
            mapInstance.current!.fitBounds(bounds);

            // setOptimizeState("done");
            resolve(reordered);
          } else {
            console.error("Directions request failed:", status);
            setOptimizeState("error");
            resolve(null);
          }
        },
      );
    });
  }, [orders]);

  // ── Mark stop complete / active ────────────────────────────────────────────

  const markComplete = async (id: number, mainId: string) => {
    const result = await fetch(`/api/shipments/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        shipmentId: mainId,
        routeId: params.id,
        status: "delivered",
      }),
    });
    const data = await result.json();
    if (data.message == "Unauthorized: No token provided") {
      router("/login");
    }
    setStatuses((prev) => ({ ...prev, [id]: "delivered" }));
    if (activeOrderId === id) setActiveOrderId(null);
  };

  const handleOptimizeAndTime = async () => {
    setOptimizeState("loading");

    const reordered = await handleOptimize();
    if (reordered) {
      await handleUpdateTimes(reordered, parseTimeInputToDate(startTimeInput));
    }
    setOptimizeState("done");
  };

  const handlePrint = () => {
    window.print();
  };

  const startDelivery = (id: number) => {
    setStatuses((prev) => {
      const next = { ...prev };
      // Only one active at a time
      Object.keys(next).forEach((k) => {
        if (next[+k] === "transit") next[+k] = "pending";
      });
      next[id] = "transit";
      return next;
    });
    setActiveOrderId(id);

    // Pan map to this order's location
    const order = orders.find((o) => o.id === id);
    if (order?.deliverySelected && mapInstance.current) {
      mapInstance.current.panTo(order.deliverySelected);
      mapInstance.current.setZoom(15);
    }
  };

  const completedCount = Object.values(statuses).filter(
    (s) => s === "delivered",
  ).length;

  const handleRouteMarkComplete = async () => {
    const data = await fetch(`/api/routes/complete/${params.id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ routeId: params.id }),
    });
    const result = await data.json();
    if (result.message == "Unauthorized: No token provided") {
      router("/login");
    }
  };
  if (completedCount === orders.length && orders.length > 0) {
    handleRouteMarkComplete();
  }

  useEffect(() => {
    const cachedUser = localStorage.getItem("user");
    if (cachedUser) {
      try {
        const parsedUser = JSON.parse(cachedUser);
        setUserInfo({ name: parsedUser?.name, email: parsedUser?.email });
      } catch {
        // Malformed cache — print sheet just omits driver name/email.
      }
      initMap();
      handleInitialLoad();
    } else {
      router("/login");
    }
  }, [router, params]);
  return (
    <>
      <PageStyles />

      <div className="ro-root">
        {/* ═══════════════════════════════════════
            SIDEBAR
        ═══════════════════════════════════════ */}
        <aside className="ro-sidebar">
          {/* Header */}
          <div className="sidebar-header">
            <div className="sidebar-top-row">
              <div className="sidebar-meta">
                <h1 className="sidebar-title">Today&apos;s Route</h1>
                <p className="sidebar-subtitle">{orders.length} stops</p>
              </div>
              <button
                type="button"
                className="details-toggle"
                onClick={() => setDetailsCollapsed((v) => !v)}
                aria-expanded={!detailsCollapsed}
              >
                {detailsCollapsed ? "Show details" : "Hide details"}
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  fill="none"
                  className={`details-chevron ${detailsCollapsed ? "" : "details-chevron-open"}`}
                >
                  <path
                    d="M2.5 4.5L6 8l3.5-3.5"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>

            {!detailsCollapsed && (
              <>
                {/* Geo status */}
                <div
                  className={`geo-status ${geoError ? "geo-err" : driverPos ? "geo-ok" : "geo-loading"}`}
                >
                  <span className="geo-pip" />
                  <span className="geo-text">
                    {geoError
                      ? "Location unavailable"
                      : driverPos
                        ? `GPS active · ${driverPos.lat.toFixed(4)}, ${driverPos.lng.toFixed(4)}`
                        : "Acquiring GPS…"}
                  </span>
                </div>

                {/* Custom start time */}
                <div className="start-time-row">
                  <span className="start-time-label">Calculate ETAs from</span>
                  <TimePickerField
                    value={startTimeInput}
                    onChange={setStartTimeInput}
                  />
                </div>

                {/* Optimize + Print buttons */}
                <div className="header-actions">
                  <button
                    className={`btn-optimize ${optimizeState === "loading" ? "btn-loading" : ""} ${optimizeState === "done" ? "btn-done" : ""}`}
                    onClick={handleOptimizeAndTime}
                    disabled={optimizeState === "loading"}
                  >
                    {optimizeState === "loading" ? (
                      <>
                        <svg
                          className="spin-icon"
                          viewBox="0 0 24 24"
                          fill="none"
                          width="16"
                          height="16"
                        >
                          <circle
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="rgba(255,255,255,0.35)"
                            strokeWidth="3"
                          />
                          <path
                            d="M12 2a10 10 0 0110 10"
                            stroke="#fff"
                            strokeWidth="3"
                            strokeLinecap="round"
                          />
                        </svg>
                        Optimizing…
                      </>
                    ) : optimizeState === "done" ? (
                      <>
                        <svg
                          viewBox="0 0 16 16"
                          fill="none"
                          width="16"
                          height="16"
                        >
                          <path
                            d="M3 8l3.5 3.5 6.5-7"
                            stroke="#fff"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        Route Optimized
                      </>
                    ) : (
                      <>
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          width="16"
                          height="16"
                        >
                          <path
                            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                            stroke="#fff"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        Optimize &amp; Start Route
                      </>
                    )}
                  </button>

                  <button
                    className="btn-print"
                    onClick={handlePrint}
                    disabled={optimizeState !== "done"}
                    title={
                      optimizeState !== "done"
                        ? "Optimize the route first"
                        : "Print route sheet"
                    }
                  >
                    <svg viewBox="0 0 24 24" fill="none" width="15" height="15">
                      <path
                        d="M6 9V3h12v6M6 18H4a1 1 0 01-1-1v-6a1 1 0 011-1h16a1 1 0 011 1v6a1 1 0 01-1 1h-2M6 14h12v7H6v-7z"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    Print Route
                  </button>
                </div>

                {optimizeState === "error" && (
                  <p className="optimize-error">
                    ⚠ Route request failed. Check your API key and quota.
                  </p>
                )}

                {/* Stats */}
                <StatsBar
                  orders={orders}
                  statuses={statuses}
                  initialBoxesRequired={initialBoxesRequired}
                />

                {/* Loading/unloading buffer — already included in every
                    ETA above; this strip just explains why. */}
                {routeMeta && (
                  <div className="buffer-strip">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M21 8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16V8z"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M12 22V12M3.27 6.96L12 12l8.73-5.04"
                        stroke="currentColor"
                        strokeWidth="1.8"
                      />
                    </svg>
                    <span className="buffer-strip-text">
                      ETAs above already include a{" "}
                      <strong>
                        {routeMeta.serviceBufferMinutesPerStop} min
                      </strong>{" "}
                      loading/unloading buffer at every stop
                    </span>
                    <span className="buffer-strip-total">
                      {routeMeta.legsCalculated *
                        routeMeta.serviceBufferMinutesPerStop}{" "}
                      min built in
                    </span>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Scrollable order list */}
          <div className="order-list">
            {orders.map((order, idx) => {
              const status = statuses[order.id];
              return (
                <div key={order.id} className="order-list-item">
                  <OrderCard
                    order={order}
                    seq={idx + 1}
                    status={status}
                    isActive={selectedId === order.id}
                    onClick={() =>
                      setSelectedId(order.id === selectedId ? null : order.id)
                    }
                  />

                  {/* Expanded actions */}
                  {selectedId === order.id && (
                    <div className="order-actions">
                      <div className="order-detail-row">
                        <span className="od-icon">📞</span>
                        <a
                          href={`tel:${order.clientPhoneNumber}`}
                          className="od-link"
                        >
                          {order.clientPhoneNumber}
                        </a>
                      </div>
                      <div className="order-detail-row">
                        <span className="od-icon">📍</span>
                        <span className="od-text">{order.deliveryAddress}</span>
                      </div>

                      <div className="order-action-btns">
                        {status === "pending" && (
                          <>
                            <button
                              className="oa-btn oa-start"
                              onClick={() => {
                                startDelivery(order.id);
                              }}
                            >
                              Start Delivery
                            </button>
                            <a
                              className="oa-btn oa-nav"
                              href={`https://maps.google.com/maps?daddr=${encodeURIComponent(order.deliveryAddress)}&travelmode=driving`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              Navigate
                            </a>
                          </>
                        )}
                        {status === "transit" && (
                          <>
                            <button
                              className="oa-btn oa-complete"
                              onClick={() => {
                                markComplete(order.id, order._id);
                              }}
                            >
                              Mark Complete
                            </button>
                            <a
                              className="oa-btn oa-nav"
                              href={`https://maps.google.com/maps?daddr=${encodeURIComponent(order.deliveryAddress)}&travelmode=driving`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              Navigate
                            </a>
                          </>
                        )}
                        {status === "delivered" && (
                          <span className="oa-completed-msg">✓ Delivered</span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            {completedCount === orders.length && orders.length > 0 && (
              <div className="all-done-banner">
                <span className="adb-emoji">🎉</span>
                <strong>All deliveries complete!</strong>
                <span>Great work today.</span>
              </div>
            )}
          </div>
        </aside>

        {/* ═══════════════════════════════════════
            MAP PANEL
        ═══════════════════════════════════════ */}
        <main className="ro-map-panel">
          <div ref={mapRef} className="ro-map" />

          {/* Map overlays */}
          <div className="map-legend">
            <div className="ml-item">
              <span className="ml-dot" style={{ background: "#1e40af" }} />{" "}
              Warehouse
            </div>
            <div className="ml-item">
              <span
                className="ml-dot"
                style={{ background: "#2563eb", border: "2px solid #fff" }}
              />{" "}
              You
            </div>
            <div className="ml-item">
              <span className="ml-dot" style={{ background: "#f97316" }} /> Stop
            </div>
          </div>

          {optimizeState === "idle" && (
            <div className="map-prompt">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path
                  d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13V7m0 13l6-3m-6-10l6-3m0 0l5.447 2.724A1 1 0 0121 7.618v10.764a1 1 0 01-1.447.894L15 17m0-13v13"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Press <strong>Optimize &amp; Start Route</strong> to calculate the
              fastest path
            </div>
          )}
        </main>
      </div>

      {/* ═══════════════════════════════════════
          PRINT-ONLY ROUTE SHEET
          Hidden on screen; shown only by the @media print rules below.
      ═══════════════════════════════════════ */}
      <div className="print-sheet">
        <div className="print-letterhead">
          <div className="print-brand">
            <span className="print-brand-mark">🚚</span>
            <span className="print-brand-name">Feitsma Verhuizingen</span>
          </div>
          <div className="print-doc-type">Route Sheet</div>
        </div>

        <div className="print-header">
          <div className="print-header-main">
            <h1>Route #{params.id}</h1>
            <p>
              {orders.length} {orders.length === 1 ? "stop" : "stops"} ·{" "}
              {orders.reduce((sum, o) => sum + o.boxQuantity, 0)} boxes
              {routeMeta &&
                ` · ${
                  routeMeta.legsCalculated *
                  routeMeta.serviceBufferMinutesPerStop
                } min loading/unloading buffer built into ETAs`}
            </p>
          </div>
          <div className="print-meta">
            <p>
              <strong>Generated</strong> {new Date().toLocaleString()}
            </p>
            {startTimeInput && (
              <p>
                <strong>Calculated from</strong>{" "}
                {formatTimeInput12h(startTimeInput)}
              </p>
            )}
            {userInfo.name && (
              <p>
                <strong>Driver</strong> {userInfo.name}
              </p>
            )}
            {userInfo.email && <p>{userInfo.email}</p>}
          </div>
        </div>

        <table className="print-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Client</th>
              <th>Phone</th>
              <th>Delivery address</th>
              <th>Boxes</th>
              <th>Shift</th>
              <th>ETA</th>
              <th>Shipment Type</th>
              <th>Notes</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, idx) => {
              return (
                <tr key={order.id}>
                  <td className="print-seq">{alphabet[idx + 1] || idx + 1}</td>
                  <td>{order.clientName}</td>
                  <td>{order.clientPhoneNumber}</td>
                  <td>{order.deliveryAddress}</td>
                  <td>{order.boxQuantity}</td>
                  <td>{shiftLabel(order.deliveryShift)}</td>
                  <td>{order?.reachingTime ?? "—"}</td>
                  <td>{order?.shipmentType.toUpperCase() || "—"}</td>
                  <td>{order.note || "—"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <div className="print-footer">
          <div className="print-sign">
            <div className="print-sign-line" />
            <span>Driver signature</span>
          </div>
          <div className="print-sign">
            <div className="print-sign-line" />
            <span>Completed at</span>
          </div>
          <div className="print-footer-note">
            Generated by Feitsma Verhuizingen
          </div>
        </div>
      </div>
    </>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

function PageStyles() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700;9..40,800&display=swap');

      *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

      :root {
        --brand:       #1e40af;
        --brand-h:     #1d3a9e;
        --brand-lt:    #eff6ff;
        --brand-ring:  rgba(30,64,175,0.13);
        --green:       #16a34a;
        --green-lt:    #dcfce7;
        --orange:      #f97316;
        --red:         #ef4444;
        --t1: #0f172a; --t2: #475569; --t3: #94a3b8;
        --border:  #e2e8f0;
        --surface: #f8fafc;
        --card:    #ffffff;
        --r-sm: 6px; --r-md: 10px; --r-lg: 14px; --r-xl: 18px;
        --sh: 0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04);
        --font: 'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif;
      }

      html, body { height: 100%; overflow: hidden; font-family: var(--font); }

      /* ── Root layout ── */
      .ro-root {
        display: flex;
        height: 100vh;
        background: #f1f5f9;
        overflow: hidden;
      }

      /* ═══════ SIDEBAR ═══════ */
      .ro-sidebar {
        width: 35%;
        min-width: 300px;
        max-width: 480px;
        display: flex;
        flex-direction: column;
        background: var(--card);
        border-right: 1px solid var(--border);
        overflow: hidden;
        flex-shrink: 0;
      }

      .sidebar-header {
        padding: 18px 18px 12px;
        border-bottom: 1px solid var(--border);
        background: #fff;
        display: flex;
        flex-direction: column;
        gap: 10px;
        flex-shrink: 0;
      }

      .sidebar-logo {
        display: flex;
        align-items: center;
        gap: 9px;
      }

      .sidebar-logo-text {
        font-size: 17px;
        font-weight: 800;
        color: var(--t1);
        letter-spacing: -0.4px;
      }

      .sidebar-meta {}

      .sidebar-top-row {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 10px;
      }

      .details-toggle {
        display: flex;
        align-items: center;
        gap: 5px;
        height: 28px;
        padding: 0 10px;
        border: 1.5px solid var(--border);
        border-radius: 99px;
        background: var(--surface);
        color: var(--t2);
        font-family: var(--font);
        font-size: 11px;
        font-weight: 700;
        cursor: pointer;
        white-space: nowrap;
        flex-shrink: 0;
        transition: background 0.15s, border-color 0.15s, color 0.15s;
        -webkit-tap-highlight-color: transparent;
      }
      .details-toggle:hover { background: var(--brand-lt); border-color: var(--brand); color: var(--brand); }
      .details-toggle:active { transform: scale(0.96); }

      .details-chevron { transition: transform 0.18s; flex-shrink: 0; }
      .details-chevron-open { transform: rotate(180deg); }

      .sidebar-title {
        font-size: clamp(18px, 2.5vw, 22px);
        font-weight: 800;
        color: var(--t1);
        letter-spacing: -0.5px;
      }

      .sidebar-subtitle {
        font-size: 12px;
        color: var(--t3);
        margin-top: 2px;
      }

      /* Geo status */
      .geo-status {
        display: flex;
        align-items: center;
        gap: 7px;
        padding: 7px 11px;
        border-radius: var(--r-md);
        font-size: 11px;
        font-weight: 600;
      }
      .geo-ok      { background: var(--green-lt);  color: var(--green); }
      .geo-err     { background: #fef2f2;           color: var(--red);   }
      .geo-loading { background: var(--surface);    color: var(--t3);    }

      .geo-pip {
        width: 8px; height: 8px;
        border-radius: 50%;
        flex-shrink: 0;
        animation: pip 1.8s ease-in-out infinite;
      }
      .geo-ok      .geo-pip { background: var(--green); }
      .geo-err     .geo-pip { background: var(--red); animation: none; }
      .geo-loading .geo-pip { background: var(--t3); }

      @keyframes pip {
        0%, 100% { opacity: 1; }
        50%       { opacity: 0.4; }
      }

      .geo-text { font-size: 11px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

      /* Custom start time */
      .start-time-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
      }

      .start-time-label {
        font-size: 11px;
        font-weight: 600;
        color: var(--t2);
        white-space: nowrap;
      }

      .time-picker { position: relative; }

      .time-picker-trigger {
        display: flex;
        align-items: center;
        gap: 7px;
        height: 34px;
        padding: 0 12px;
        border: 1.5px solid transparent;
        border-radius: 99px;
        background: var(--brand-lt);
        color: var(--brand);
        font-family: var(--font);
        cursor: pointer;
        transition: background 0.15s, border-color 0.15s, transform 0.1s;
        -webkit-tap-highlight-color: transparent;
      }
      .time-picker-trigger:hover { background: var(--brand-ring); }
      .time-picker-trigger:active { transform: scale(0.97); }
      .time-picker-trigger-open { border-color: var(--brand); background: #fff; }

      .tp-trigger-time { font-size: 13px; font-weight: 800; letter-spacing: -0.2px; }
      .tp-trigger-ampm { font-size: 10px; font-weight: 700; opacity: 0.75; }

      .tp-chevron { transition: transform 0.18s; opacity: 0.8; }
      .tp-chevron-open { transform: rotate(180deg); }

      .time-picker-panel {
        position: absolute;
        top: calc(100% + 8px);
        right: 0;
        width: 232px;
        background: #fff;
        border: 1px solid var(--border);
        border-radius: var(--r-lg);
        box-shadow: 0 14px 36px rgba(15,23,42,0.16);
        padding: 12px;
        z-index: 60;
        animation: tpDropIn 0.15s ease both;
      }

      @keyframes tpDropIn {
        from { opacity: 0; transform: translateY(-6px); }
        to   { opacity: 1; transform: translateY(0); }
      }

      .tp-presets {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 6px;
        margin-bottom: 12px;
      }

      .tp-preset {
        height: 28px;
        border: none;
        border-radius: var(--r-sm);
        background: var(--surface);
        color: var(--t2);
        font-family: var(--font);
        font-size: 11px;
        font-weight: 700;
        cursor: pointer;
        transition: background 0.15s, color 0.15s, transform 0.1s;
      }
      .tp-preset:hover { background: var(--brand-lt); color: var(--brand); }
      .tp-preset:active { transform: scale(0.94); }

      .tp-steppers {
        display: flex;
        align-items: flex-end;
        justify-content: center;
        gap: 8px;
      }

      .tp-stepper-col {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 4px;
      }

      .tp-step-btn {
        width: 34px;
        height: 22px;
        border: 1.5px solid var(--border);
        border-radius: var(--r-sm);
        background: var(--surface);
        color: var(--brand);
        font-size: 10px;
        line-height: 1;
        cursor: pointer;
        transition: background 0.15s, border-color 0.15s, transform 0.1s;
      }
      .tp-step-btn:hover { background: var(--brand-lt); border-color: var(--brand); }
      .tp-step-btn:active { transform: scale(0.92); }

      .tp-num-input {
        width: 44px;
        height: 40px;
        border: 1.5px solid var(--border);
        border-radius: var(--r-sm);
        background: var(--surface);
        color: var(--t1);
        font-family: var(--font);
        font-size: 18px;
        font-weight: 800;
        text-align: center;
        -moz-appearance: textfield;
      }
      .tp-num-input::-webkit-outer-spin-button,
      .tp-num-input::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
      .tp-num-input:focus { outline: none; border-color: var(--brand); background: var(--brand-lt); box-shadow: 0 0 0 3px var(--brand-ring); }

      .tp-stepper-label { font-size: 9px; font-weight: 700; color: var(--t3); text-transform: uppercase; letter-spacing: 0.4px; }

      .tp-colon { font-size: 18px; font-weight: 800; color: var(--t3); padding-bottom: 18px; }

      .tp-ampm-toggle {
        display: flex;
        flex-direction: column;
        gap: 4px;
        margin-bottom: 18px;
      }

      .tp-ampm-btn {
        width: 40px;
        height: 24px;
        border: 1.5px solid var(--border);
        border-radius: var(--r-sm);
        background: #fff;
        color: var(--t2);
        font-family: var(--font);
        font-size: 11px;
        font-weight: 700;
        cursor: pointer;
        transition: background 0.15s, border-color 0.15s, color 0.15s;
      }
      .tp-ampm-btn:hover { border-color: var(--brand); }
      .tp-ampm-active { background: var(--brand); border-color: var(--brand); color: #fff; }

      /* Header action buttons */
      .header-actions {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }

      /* Optimize button */
      .btn-optimize {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        width: 100%;
        height: 46px;
        background: var(--brand);
        color: #fff;
        border: none;
        border-radius: var(--r-md);
        font-size: 14px;
        font-weight: 700;
        font-family: var(--font);
        cursor: pointer;
        transition: background 0.18s, box-shadow 0.18s, transform 0.1s;
        box-shadow: 0 2px 8px rgba(30,64,175,0.28);
        -webkit-tap-highlight-color: transparent;
      }
      .btn-optimize:hover:not(:disabled) { background: var(--brand-h); box-shadow: 0 4px 14px rgba(30,64,175,0.38); }
      .btn-optimize:active:not(:disabled) { transform: scale(0.98); }
      .btn-optimize:disabled { opacity: 0.7; cursor: not-allowed; }
      .btn-optimize.btn-done { background: var(--green); box-shadow: 0 2px 8px rgba(22,163,74,0.3); }
      .btn-optimize.btn-done:hover { background: #15803d; }

      /* Print button */
      .btn-print {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        width: 100%;
        height: 42px;
        background: #fff;
        color: var(--t2);
        border: 1.5px solid var(--border);
        border-radius: var(--r-md);
        font-size: 13px;
        font-weight: 700;
        font-family: var(--font);
        cursor: pointer;
        transition: background 0.15s, border-color 0.15s, color 0.15s, transform 0.1s;
        -webkit-tap-highlight-color: transparent;
      }
      .btn-print:hover:not(:disabled) { background: var(--surface); border-color: #cbd5e1; color: var(--t1); }
      .btn-print:active:not(:disabled) { transform: scale(0.98); }
      .btn-print:disabled { opacity: 0.5; cursor: not-allowed; }

      .spin-icon { animation: spin 0.7s linear infinite; }
      @keyframes spin { to { transform: rotate(360deg); } }

      .optimize-error {
        font-size: 11px;
        color: var(--red);
        background: #fef2f2;
        border-radius: var(--r-sm);
        padding: 7px 10px;
      }

      /* Stats bar */
      .stats-bar {
        display: flex;
        align-items: center;
        gap: 6px;
        background: var(--surface);
        border-radius: var(--r-md);
        padding: 9px 12px;
        position: relative;
        overflow: hidden;
      }

      .stat { display: flex; flex-direction: column; align-items: center; flex: 1; }
      .stat-val { font-size: 16px; font-weight: 800; color: var(--t1); line-height: 1; }
      .stat-lbl { font-size: 10px; color: var(--t3); margin-top: 2px; font-weight: 500; }
      .stat-sep  { width: 1px; height: 28px; background: var(--border); }

      .stat-progress {
        position: absolute;
        bottom: 0; left: 0; right: 0;
        height: 3px;
        background: var(--border);
      }

      .stat-progress-fill {
        height: 100%;
        background: linear-gradient(90deg, var(--brand), #60a5fa);
        border-radius: 99px;
        transition: width 0.6s ease;
      }

      .stat-pct {
        font-size: 11px;
        font-weight: 700;
        color: var(--brand);
        margin-left: 4px;
      }

      /* Loading/unloading buffer strip */
      .buffer-strip {
        display: flex;
        align-items: center;
        gap: 7px;
        padding: 8px 11px;
        border-radius: var(--r-md);
        background: #fff7ed;
        color: #c2410c;
        border: 1px solid #fed7aa;
      }

      .buffer-strip svg { flex-shrink: 0; }

      .buffer-strip-text {
        flex: 1;
        font-size: 11px;
        font-weight: 600;
        line-height: 1.3;
      }
      .buffer-strip-text strong { font-weight: 800; }

      .buffer-strip-total {
        font-size: 11px;
        font-weight: 800;
        white-space: nowrap;
        flex-shrink: 0;
      }

      /* ── Order list ── */
      .order-list {
        flex: 1;
        overflow-y: auto;
        padding: 12px 12px 20px;
        display: flex;
        flex-direction: column;
        gap: 6px;
        scrollbar-width: thin;
        scrollbar-color: var(--border) transparent;
      }

      .order-list::-webkit-scrollbar { width: 4px; }
      .order-list::-webkit-scrollbar-track { background: transparent; }
      .order-list::-webkit-scrollbar-thumb { background: var(--border); border-radius: 99px; }

      .order-list-item { display: flex; flex-direction: column; }

      /* Order card */
      .order-card {
        display: flex;
        align-items: flex-start;
        gap: 10px;
        width: 100%;
        text-align: left;
        background: #fff;
        border: 1.5px solid var(--border);
        border-radius: var(--r-lg);
        padding: 12px;
        cursor: pointer;
        font-family: var(--font);
        transition: border-color 0.15s, background 0.15s, box-shadow 0.15s;
        position: relative;
        -webkit-tap-highlight-color: transparent;
      }

      .order-card:hover { border-color: #cbd5e1; background: var(--surface); }
      .order-card-active { border-color: var(--brand); box-shadow: 0 0 0 3px var(--brand-ring); background: var(--brand-lt); }
      .order-card.status-completed { opacity: 0.6; }
      .order-card.status-in_transit { border-color: #f97316; background: #fff7ed; }

      .oc-seq-col {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 6px;
        flex-shrink: 0;
        padding-top: 2px;
      }

      .oc-seq {
        width: 26px; height: 26px;
        border-radius: 50%;
        background: var(--brand);
        color: #fff;
        font-size: 12px;
        font-weight: 800;
        display: flex; align-items: center; justify-content: center;
        flex-shrink: 0;
      }

      .order-card.status-completed .oc-seq { background: var(--green); }
      .order-card.status-in_transit .oc-seq { background: var(--orange); }

      .oc-shift-pip {
        width: 6px; height: 6px;
        border-radius: 50%;
        flex-shrink: 0;
      }

      .oc-body { flex: 1; min-width: 0; }

      .oc-row-top {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
        margin-bottom: 3px;
      }

      .oc-name { font-size: 13px; font-weight: 700; color: var(--t1); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

      .oc-status-badge {
        font-size: 10px;
        font-weight: 700;
        padding: 2px 7px;
        border-radius: 99px;
        flex-shrink: 0;
        white-space: nowrap;
      }
      .oc-status-pending    { background: #fef3c7; color: #b45309; }
      .oc-status-in_transit{ background: #fff7ed; color: #c2410c; }
      .oc-status-completed  { background: var(--green-lt); color: var(--green); }

      .oc-address {
        font-size: 11px;
        color: var(--t2);
        line-height: 1.4;
        margin-bottom: 6px;
        overflow: hidden;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
      }

      .oc-chips {
        display: flex;
        flex-wrap: wrap;
        gap: 5px;
      }

      .oc-chip {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        font-size: 10px;
        font-weight: 600;
        color: var(--t3);
        background: var(--surface);
        border: 1px solid var(--border);
        border-radius: 99px;
        padding: 2px 7px;
        white-space: nowrap;
      }

      .oc-chip-box { color: var(--t2); }

      .oc-eta {
        display: inline-flex;
        align-items: center;
        gap: 5px;
        margin-top: 6px;
        padding: 3px 8px;
        border-radius: 99px;
        background: var(--brand-lt);
        color: var(--brand);
        font-size: 11px;
        font-weight: 700;
      }
      .oc-eta svg { flex-shrink: 0; }

      .oc-note {
        display: flex;
        align-items: flex-start;
        gap: 5px;
        font-size: 10px;
        color: var(--t3);
        margin-top: 6px;
        font-style: italic;
        line-height: 1.4;
      }
      .oc-note svg { flex-shrink: 0; margin-top: 1px; }

      .oc-done-icon {
        position: absolute;
        top: 8px; right: 8px;
      }

      /* ── Expanded order actions ── */
      .order-actions {
        background: var(--surface);
        border: 1.5px solid var(--border);
        border-top: none;
        border-radius: 0 0 var(--r-lg) var(--r-lg);
        padding: 10px 12px 12px;
        display: flex;
        flex-direction: column;
        gap: 8px;
        animation: expandDown 0.18s ease both;
      }

      @keyframes expandDown {
        from { opacity: 0; transform: translateY(-6px); }
        to   { opacity: 1; transform: translateY(0); }
      }

      .order-detail-row {
        display: flex;
        align-items: flex-start;
        gap: 8px;
        font-size: 12px;
        color: var(--t2);
      }
      .od-icon { flex-shrink: 0; }
      .od-link { color: var(--brand); font-weight: 600; text-decoration: none; }
      .od-link:hover { text-decoration: underline; }
      .od-text { line-height: 1.4; }

      .order-action-btns {
        display: flex;
        gap: 8px;
        margin-top: 4px;
      }

      .oa-btn {
        flex: 1;
        height: 36px;
        border-radius: var(--r-md);
        font-size: 12px;
        font-weight: 700;
        font-family: var(--font);
        cursor: pointer;
        transition: background 0.15s, transform 0.1s;
        text-align: center;
        display: flex;
        align-items: center;
        justify-content: center;
        text-decoration: none;
        -webkit-tap-highlight-color: transparent;
      }

      .oa-start    { background: var(--brand); color: #fff; border: none; }
      .oa-start:hover { background: var(--brand-h); }

      .oa-complete { background: var(--green); color: #fff; border: none; }
      .oa-complete:hover { background: #15803d; }

      .oa-nav { background: #fff; color: var(--t2); border: 1.5px solid var(--border); }
      .oa-nav:hover { background: var(--surface); }

      .oa-completed-msg {
        flex: 1;
        font-size: 12px;
        font-weight: 700;
        color: var(--green);
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .oa-btn:active { transform: scale(0.97); }

      /* ── All done ── */
      .all-done-banner {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 4px;
        padding: 24px 16px;
        background: var(--green-lt);
        border-radius: var(--r-xl);
        text-align: center;
        margin-top: 8px;
      }
      .adb-emoji { font-size: 32px; }
      .all-done-banner strong { font-size: 15px; color: var(--green); }
      .all-done-banner span   { font-size: 12px; color: #4ade80; }

      /* ═══════ MAP PANEL ═══════ */
      .ro-map-panel {
        flex: 1;
        position: relative;
        overflow: hidden;
      }

      .ro-map {
        width: 100%;
        height: 100%;
        background: #d4e9f7;
      }

      /* Map overlays */
      .map-legend {
        position: absolute;
        top: 12px;
        left: 12px;
        background: rgba(255,255,255,0.92);
        backdrop-filter: blur(8px);
        border: 1px solid rgba(255,255,255,0.8);
        border-radius: var(--r-md);
        padding: 8px 12px;
        display: flex;
        flex-direction: column;
        gap: 5px;
        box-shadow: 0 4px 14px rgba(0,0,0,0.1);
        z-index: 5;
        pointer-events: none;
      }

      .ml-item {
        display: flex; align-items: center; gap: 7px;
        font-size: 11px; font-weight: 600; color: #475569;
        font-family: var(--font);
      }

      .ml-dot {
        width: 10px; height: 10px;
        border-radius: 50%;
        flex-shrink: 0;
      }

      .map-prompt {
        position: absolute;
        bottom: 24px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(15,23,42,0.88);
        backdrop-filter: blur(8px);
        color: #f1f5f9;
        font-size: 13px;
        font-weight: 500;
        font-family: var(--font);
        padding: 10px 20px;
        border-radius: 99px;
        display: flex;
        align-items: center;
        gap: 10px;
        pointer-events: none;
        white-space: nowrap;
        z-index: 5;
        box-shadow: 0 4px 20px rgba(0,0,0,0.25);
      }

      .map-prompt strong { font-weight: 700; color: #93c5fd; }

      /* ═══════════════════════════
         RESPONSIVE
      ═══════════════════════════ */

      /* Tablet portrait — stack vertically */
      @media (max-width: 768px) {
        html, body { overflow: auto; }
        .ro-root {
          flex-direction: column;
          height: auto;
          min-height: 100vh;
          overflow: auto;
        }
        .ro-sidebar {
          width: 100%;
          max-width: 100%;
          border-right: none;
          border-bottom: 1px solid var(--border);
          overflow: visible;
        }
        .order-list {
          max-height: 40vh;
          overflow-y: auto;
        }
        .ro-map-panel {
          height: 55vh;
          flex: none;
        }
        .ro-map { height: 100%; }
        .map-prompt { font-size: 11px; padding: 8px 14px; bottom: 14px; }
      }

      @media (max-width: 420px) {
        .sidebar-header { padding: 14px 14px 10px; }
        .stat-val { font-size: 14px; }
        .ro-map-panel { height: 48vh; }
        .order-action-btns { flex-wrap: wrap; }
        .oa-btn { flex: 1 1 calc(50% - 4px); }
        .map-prompt { display: none; }
      }

      /* Touch targets */
      @media (hover: none) and (pointer: coarse) {
        .btn-optimize, .btn-print, .oa-btn { min-height: 48px; }
        .order-card { padding: 14px; }
        .time-picker-trigger { min-height: 40px; }
        .tp-step-btn { min-height: 30px; }
        .tp-preset, .tp-ampm-btn { min-height: 34px; }
        .details-toggle { min-height: 34px; }
      }

      /* Reduced motion */
      @media (prefers-reduced-motion: reduce) {
        .spin-icon    { animation: none; }
        .geo-pip      { animation: none; }
        .order-actions { animation: none; }
        .stat-progress-fill { transition: none; }
        * { transition-duration: 0.01ms !important; }
      }

      /* ═══════ PRINT-ONLY ROUTE SHEET ═══════ */
      .print-sheet { display: none; }

      @media print {
        @page {
          size: landscape;
          margin: 14mm 12mm;
        }

        html, body { overflow: visible; height: auto; }
        body * { visibility: hidden; }
        .print-sheet, .print-sheet * { visibility: visible; }
        .print-sheet {
          display: block;
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          color: #0f172a;
          font-family: var(--font);
        }

        /* Letterhead */
        .print-letterhead {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          border-bottom: 3px solid var(--brand);
          padding-bottom: 8px;
          margin-bottom: 14px;
        }
        .print-brand {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .print-brand-mark { font-size: 18px; }
        .print-brand-name {
          font-size: 17px;
          font-weight: 800;
          color: var(--brand);
          letter-spacing: -0.3px;
        }
        .print-doc-type {
          font-size: 11px;
          font-weight: 700;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 1.2px;
        }

        /* Header */
        .print-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 16px;
          margin-bottom: 16px;
        }
        .print-header-main h1 { font-size: 20px; font-weight: 800; margin: 0 0 3px; }
        .print-header-main p { font-size: 11px; color: #475569; margin: 0; }
        .print-meta { text-align: right; }
        .print-meta p { font-size: 10px; color: #475569; margin: 0 0 3px; }
        .print-meta strong { color: #0f172a; font-weight: 700; }

        /* Table */
        .print-table {
          width: 100%;
          border-collapse: separate;
          border-spacing: 0;
          font-size: 10.5px;
          border: 1px solid #cbd5e1;
          border-radius: 8px;
          overflow: hidden;
        }
        .print-table th, .print-table td {
          padding: 7px 9px;
          text-align: left;
          vertical-align: top;
          border-bottom: 1px solid #e2e8f0;
        }
        .print-table th {
          background: #eff6ff;
          color: #1e40af;
          font-weight: 700;
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 0.4px;
          border-bottom: 1.5px solid #cbd5e1;
        }
        .print-table tbody tr:last-child td { border-bottom: none; }
        .print-table tbody tr:nth-child(even) { background: #f8fafc; }
        .print-seq { font-weight: 800; color: #1e40af; }

        /* Footer / sign-off */
        .print-footer {
          display: flex;
          align-items: flex-end;
          gap: 40px;
          margin-top: 28px;
        }
        .print-sign {
          display: flex;
          flex-direction: column;
          gap: 4px;
          width: 220px;
        }
        .print-sign-line { height: 28px; border-bottom: 1px solid #94a3b8; }
        .print-sign span { font-size: 10px; color: #64748b; font-weight: 600; }
        .print-footer-note {
          margin-left: auto;
          font-size: 9px;
          color: #94a3b8;
        }
      }

      /* Dark mode */
      @media (prefers-color-scheme: dark) {
        :root {
          --t1: #f1f5f9; --t2: #94a3b8; --t3: #64748b;
          --border:  #2a3a52; --surface: #1c2940; --card: #111d35;
          --brand: #3b82f6; --brand-h: #2563eb; --brand-lt: rgba(59,130,246,0.14);
        }
        body { background: #0b1220; }
        .ro-sidebar { background: var(--card); }
        .sidebar-header, .order-card { background: var(--card); }
        .order-card:hover, .order-card-active { background: var(--surface); }
        .order-card.status-in_transit { background: rgba(249,115,22,0.08); }
        .order-actions { background: var(--surface); }
        .stats-bar { background: var(--surface); }
        .oa-nav { background: var(--card); color: var(--t2); border-color: var(--border); }
        .all-done-banner { background: rgba(22,163,74,0.12); }
        .map-legend { background: rgba(17,29,53,0.92); border-color: rgba(42,58,82,0.8); }
        .ml-item { color: #94a3b8; }
        .time-picker-trigger-open { background: var(--card); }
        .time-picker-panel { background: var(--card); border-color: var(--border); }
        .tp-ampm-btn { background: var(--card); }
        .btn-print { background: var(--card); border-color: var(--border); }
        .buffer-strip { background: rgba(249,115,22,0.1); border-color: rgba(249,115,22,0.28); color: #fb923c; }
      }
    `}</style>
  );
}
