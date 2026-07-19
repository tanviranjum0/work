/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import React, { useState, useMemo, useEffect } from "react";

import { useParams } from "next/navigation";
// ─── Types ────────────────────────────────────────────────────────────────────

interface RouteStop {
  id: "A" | "B" | "C";
  label: string;
  sublabel?: string;
  address: string;
  color: string;
  bg: string;
}

interface Shipment {
  distanceData: {
    distance: {
      text: string;
    };
    duration: object;
  };
  _id: string;
  clientName: string;
  clientPhoneNumber: number;
  pickupAddress: string;
  deliveryAddress: string;
  shipmentType: string;
  boxQuantity: number;
  driverAllocated: boolean;
  status: string;
  deliveryShift: string;
  createdAt: string;
  updatedAt: string;
  note: string;
}

interface RouteSummaryItem {
  label: string;
  value: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const SUMMARY: RouteSummaryItem[] = [
  { label: "Total Distance", value: "2,789 km" },
];

// ─── Icons ────────────────────────────────────────────────────────────────────

const IconDistance = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path
      d="M3 12h18M3 6h6M15 6h6M3 18h6M15 18h6"
      stroke="#1e40af"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

const IconClock = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="9" stroke="#1e40af" strokeWidth="2" />
    <path
      d="M12 7v5l3 3"
      stroke="#1e40af"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const IconFuel = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path
      d="M4 20V7a2 2 0 012-2h6a2 2 0 012 2v13"
      stroke="#1e40af"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M4 20h10M14 9h2a2 2 0 012 2v3a2 2 0 002 2v0a2 2 0 002-2V9l-3-3"
      stroke="#1e40af"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const IconRoute = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path
      d="M3 11l19-9-9 19-2-8-8-2z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ICONS: Record<string, React.ReactNode> = {
  "Total Distance": <IconDistance />,
  "Total Time": <IconClock />,
  "Est. Fuel Cost": <IconFuel />,
};

const IconExternal = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
    <path
      d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M15 3h6v6M21 3L10 14"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// ─── Stop Item ────────────────────────────────────────────────────────────────

function StopItem({ stop, isLast }: { stop: RouteStop; isLast: boolean }) {
  return (
    <div className="stop-item">
      <div className="stop-left">
        <div
          className="stop-badge"
          style={{ background: stop.bg, color: stop.color }}
        >
          {stop.id}
        </div>
        {!isLast && <div className="stop-line" />}
      </div>
      <div className="stop-body">
        <p className="stop-label">{stop.label}</p>
        {stop.sublabel && <p className="stop-sublabel">{stop.sublabel}</p>}
        <p className="stop-address">{stop.address}</p>
      </div>
    </div>
  );
}

// ─── Summary Row ──────────────────────────────────────────────────────────────

function SummaryRow({
  item,
  shipment,
}: {
  item: RouteSummaryItem;
  shipment?: Shipment;
}) {
  return (
    <div className="summary-row">
      <div className="summary-icon-wrap">{ICONS[item.label]}</div>
      <span className="summary-label">{item.label}</span>
      <span className="summary-value">
        {shipment?.distanceData.distance.text ?? "Loading…"}
      </span>
    </div>
  );
}

// ─── Map (iframe) ─────────────────────────────────────────────────────────────

function RouteMapFrame({
  shipment,
  STOPS,
  onLoad,
  loaded,
}: {
  shipment?: Shipment;
  STOPS: RouteStop[];
  onLoad: () => void;
  loaded: boolean;
}) {
  // Build a Google Maps directions embed URL (no API key required via the
  // legacy "output=embed" parameter). For production with the official
  // Maps Embed API, swap this for:
  // https://www.google.com/maps/embed/v1/directions?origin=...&destination=...&waypoints=...&key=YOUR_API_KEY
  const mapSrc = useMemo(() => {
    const origin = STOPS[0].address;
    // const waypoint = STOPS[1].address;
    const destination = STOPS[1].address;
    // const daddr = `${encodeURIComponent(waypoint)}+to:${encodeURIComponent(destination)}`;
    // return `https://maps.google.com/maps?saddr=${encodeURIComponent(origin)}&daddr=${daddr}&output=embed`;

    return `https://www.google.com/maps/embed/v1/directions?origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}&key=AIzaSyB1aG-PTEi0s9wtwmVlEuH9UmgnTVmPZ1M`;
    // return `https://www.google.com/maps/embed/v1/directions?origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}&waypoints=${encodeURIComponent(waypoint)}&key=AIzaSyB1aG-PTEi0s9wtwmVlEuH9UmgnTVmPZ1M`;
  }, [STOPS]);
  // External "open in Google Maps" link
  const externalHref = useMemo(() => {
    const origin = encodeURIComponent(STOPS[0].address);
    const destination = encodeURIComponent(STOPS[1].address);
    // const waypoints = encodeURIComponent(STOPS[1].address);
    return `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&travelmode=driving`;
    // return `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&waypoints=${waypoints}&travelmode=driving`;
  }, [STOPS]);

  return (
    <div className="map-frame-wrap">
      {!loaded && (
        <div className="map-skeleton" aria-hidden="true">
          <div className="skeleton-shimmer" />
          <div className="skeleton-pin skeleton-pin-a" />
          <div className="skeleton-pin skeleton-pin-b" />
          <div className="skeleton-pin skeleton-pin-c" />
          <span className="skeleton-label">Loading map…</span>
        </div>
      )}
      <iframe
        className={`h-full w-full`}
        src={mapSrc}
        allowFullScreen
        title="Best route map from pickup to delivery"
        loading="lazy"
        onLoad={() => {
          onLoad();
        }}
        referrerPolicy="no-referrer-when-downgrade"
      ></iframe>

      {/* Legend overlay */}
      {/* <div className="map-legend">
        {STOPS.map((s) => (
          <div key={s.id} className="legend-item">
            <span className="legend-dot" style={{ background: s.color }} />
            <span className="legend-text">
              {s.id === "A"
                ? "Pickup"
                : s.id === "B"
                  ? "Warehouse"
                  : "Delivery"}
            </span>
          </div>
        ))}
      </div> */}
      {/* Distance badge */}
      <div className="map-distance-badge">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
          <path
            d="M3 12h18"
            stroke="#1e40af"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <path
            d="M3 12l4-4M3 12l4 4M21 12l-4-4M21 12l-4 4"
            stroke="#1e40af"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
        {SUMMARY[0].value}
      </div>
      {/* Open in Google Maps */}
      <a
        className="map-external-link"
        href={externalHref}
        target="_blank"
        rel="noopener noreferrer"
      >
        <IconExternal />
        Open in Maps
      </a>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function BestRouteMap() {
  const [activeTab, setActiveTab] = useState<"info" | "map">("info");
  const [mapLoaded, setMapLoaded] = useState(true);
  const params = useParams();
  const id = params.id;
  const [shipment, setShipment] = useState<Shipment | undefined>();
  const loadShipment = async () => {
    if (typeof window === "undefined") return undefined;
    const cache = localStorage.getItem("shipment");
    if (cache) {
      const parsedCache = JSON.parse(cache);
      setShipment(parsedCache);
    } else {
      const result = await fetch(
        process.env.NEXT_PUBLIC_BACKEND_URL + `/api/shipments/${id}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        },
      );
      const data = await result.json();
      console.log(data);
      setShipment(data);
      localStorage.setItem("shipment", JSON.stringify(data));
    }
  };

  useEffect(() => {
    loadShipment();
  }, []);
  useEffect(() => {}, [shipment]);
  const STOPS: RouteStop[] = [
    {
      id: "A",
      label: "Warehouse (Buffer)",
      sublabel: "Central Warehouse",
      address: "Izaäk Enschedéweg 50, 2031 CS Haarlem, Netherlands",
      color: "#1e40af",
      bg: "#dbeafe",
    },
    {
      id: "B",
      label: "Delivery Location",
      address: shipment?.deliveryAddress || "",
      color: "#dc2626",
      bg: "#fee2e2",
    },
  ];

  return (
    <>
      <GlobalStyles />
      <div className="page-wrapper">
        <div className="route-card">
          {/* ── Mobile Tabs ── */}
          <div className="mobile-tabs">
            <button
              className={`tab-btn ${activeTab === "info" ? "tab-active" : ""}`}
              onClick={() => setActiveTab("info")}
            >
              Route Info
            </button>
            <button
              className={`tab-btn ${activeTab === "map" ? "tab-active" : ""}`}
              onClick={() => setActiveTab("map")}
            >
              Map View
            </button>
          </div>

          {/* ── Card Body ── */}
          <div className="card-body">
            {/* LEFT: Info Panel */}
            <div
              className={`info-panel ${activeTab === "map" ? "tab-hidden" : ""}`}
            >
              <div className="info-header">
                <div className="title-row">
                  <h1 className="route-title">Best Route</h1>
                  {/* <span className="badge-optimized">
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <path
                        d="M2 5l2 2 4-4"
                        stroke="#16a34a"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    Optimized
                  </span> */}
                </div>
                <p className="route-subtitle">
                  Here&apos;s the best route for your shipment.
                </p>
              </div>

              {/* Stops */}
              <div className="stops-list">
                {STOPS.map((s, i) => (
                  <StopItem
                    key={s.id}
                    stop={s}
                    isLast={i === STOPS.length - 1}
                  />
                ))}
              </div>

              <div className="panel-divider" />

              {/* Summary */}
              <div className="summary-section">
                <h3 className="summary-heading">Route Summary</h3>
                <div className="summary-list">
                  {SUMMARY.map((item) => (
                    <SummaryRow
                      shipment={shipment}
                      key={item.label}
                      item={item}
                    />
                  ))}
                  <div className="border-2 rounded text-gray-700 p-2">
                    <span className="italic bold text-black">Note: </span>
                    <div className="text-sm">{shipment?.note}</div>
                  </div>
                </div>
              </div>

              <div className="panel-divider" />

              {/* CTA */}
              {/* <button className="btn-turn-by-turn">
                <IconRoute />
                View Turn-by-Turn
              </button> */}
            </div>

            {/* RIGHT: Map */}
            <div
              className={`map-panel ${activeTab === "info" ? "tab-hidden" : ""}`}
            >
              <RouteMapFrame
                shipment={shipment}
                STOPS={STOPS}
                loaded={mapLoaded}
                onLoad={() => setMapLoaded(true)}
              />

              {/* Mobile-only summary strip */}
              <div className="map-summary-strip">
                {SUMMARY.map((item, i) => (
                  <React.Fragment key={item.label}>
                    {i > 0 && <div className="strip-divider" />}
                    <div className="strip-stat">
                      <span className="strip-val">{item.value}</span>
                      <span className="strip-lbl">
                        {item.label.replace("Total ", "").replace("Est. ", "")}
                      </span>
                    </div>
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
          {/* card-body */}
        </div>
        {/* route-card */}
      </div>
    </>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

function GlobalStyles() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700;9..40,800&display=swap');

      *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

      :root {
        --brand:        #1e40af;
        --brand-dark:   #1d3a9e;
        --brand-light:  #eff6ff;
        --brand-ring:   rgba(30,64,175,0.12);

        --green:        #16a34a;
        --green-light:  #dcfce7;
        --red:          #dc2626;

        --text-primary:   #0f172a;
        --text-secondary: #475569;
        --text-muted:     #94a3b8;

        --border:       #e2e8f0;
        --surface:      #f8fafc;
        --card-bg:      #ffffff;
        --bg:           #eef2f6;

        --radius-sm:    6px;
        --radius-md:    10px;
        --radius-lg:    14px;
        --radius-xl:    20px;

        --shadow-card:  0 4px 6px -1px rgba(0,0,0,0.07), 0 2px 4px -2px rgba(0,0,0,0.05);
        --shadow-drop:  0 8px 24px rgba(0,0,0,0.12);

        --font: 'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;

        --text-xs:    clamp(10px, 1.6vw, 11px);
        --text-sm:    clamp(11px, 1.8vw, 12px);
        --text-base:  clamp(13px, 2vw,   14px);
        --text-md:    clamp(14px, 2.2vw, 15px);
        --text-lg:    clamp(16px, 2.8vw, 18px);
        --text-xl:    clamp(20px, 3.6vw, 26px);
      }

      html { font-size: 16px; -webkit-text-size-adjust: 100%; }
      body {
        font-family: var(--font);
        background: var(--bg);
        color: var(--text-primary);
        min-height: 100vh;
        line-height: 1.5;
      }

      /* ── Page ── */
      .page-wrapper {
        height: 100dvh;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      /* ── Card ── */
      .route-card {
        background: var(--card-bg);
        border-radius: var(--radius-xl);
        border: 1px solid var(--border);
        box-shadow: var(--shadow-card);
        width: 100%;
        height: 100%;
        animation: cardIn 0.4s cubic-bezier(0.22,1,0.36,1) both;
        display: flex;
        flex-direction: column;
      }

      @keyframes cardIn {
        from { opacity: 0; transform: translateY(16px); }
        to   { opacity: 1; transform: translateY(0); }
      }

      /* ── Mobile Tabs (hidden on desktop) ── */
      .mobile-tabs {
        display: none;
        gap: 4px;
        border-bottom: 1px solid var(--border);
        flex-shrink: 0;
      }

      .tab-btn {
        flex: 1;
        padding: 13px 0;
        background: none;
        border: none;
        border-bottom: 2px solid transparent;
        font-size: var(--text-base);
        font-weight: 600;
        font-family: var(--font);
        color: var(--text-muted);
        cursor: pointer;
        transition: color 0.2s, border-color 0.2s;
        -webkit-tap-highlight-color: transparent;
        margin-bottom: -1px;
      }

      .tab-btn.tab-active {
        color: var(--brand);
        border-bottom-color: var(--brand);
      }

      /* ── Card Body ── */
      .card-body {
        display: grid;
        grid-template-columns: 320px 1fr;
        flex: 1;
        min-height: 0;
      }

      /* ── Info Panel ── */
      .info-panel {
        border-right: 1px solid var(--border);
        padding: clamp(20px, 3vw, 32px);
        display: flex;
        flex-direction: column;
        overflow-y: auto;
        min-height: 0;
      }

      .info-header { margin-bottom: clamp(16px, 3vw, 24px); }

      .title-row {
        display: flex;
        align-items: center;
        gap: 10px;
        flex-wrap: wrap;
      }

      .route-title {
        font-size: var(--text-xl);
        font-weight: 800;
        color: var(--text-primary);
        letter-spacing: -0.5px;
      }

      .badge-optimized {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        background: var(--green-light);
        color: var(--green);
        font-size: var(--text-xs);
        font-weight: 600;
        padding: 4px 10px 4px 7px;
        border-radius: 99px;
        border: 1px solid #bbf7d0;
        white-space: nowrap;
      }

      .route-subtitle {
        font-size: var(--text-base);
        color: var(--text-secondary);
        margin-top: 6px;
        line-height: 1.5;
      }

      /* ── Stops ── */
      .stops-list { display: flex; flex-direction: column; }

      .stop-item {
        display: flex;
        gap: 12px;
        align-items: flex-start;
      }

      .stop-left {
        display: flex;
        flex-direction: column;
        align-items: center;
        flex-shrink: 0;
        padding-top: 2px;
      }

      .stop-badge {
        width: clamp(28px, 5vw, 32px);
        height: clamp(28px, 5vw, 32px);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: var(--text-sm);
        font-weight: 700;
        flex-shrink: 0;
        transition: transform 0.2s;
      }

      .stop-badge:hover { transform: scale(1.1); }

      .stop-line {
        width: 2px;
        flex: 1;
        min-height: 28px;
        background: linear-gradient(to bottom, #cbd5e1, #e2e8f0);
        margin: 4px 0;
        border-radius: 2px;
      }

      .stop-body {
        padding-bottom: clamp(16px, 3vw, 24px);
        flex: 1;
        min-width: 0;
      }

      .stop-label {
        font-size: var(--text-md);
        font-weight: 700;
        color: var(--text-primary);
        line-height: 1.3;
      }

      .stop-sublabel {
        font-size: var(--text-sm);
        font-weight: 500;
        color: var(--text-secondary);
        margin-top: 1px;
      }

      .stop-address {
        font-size: var(--text-sm);
        color: var(--text-muted);
        margin-top: 3px;
        word-break: break-word;
      }

      /* ── Divider ── */
      .panel-divider {
        height: 1px;
        background: var(--border);
        margin: clamp(12px, 2.5vw, 18px) 0;
      }

      /* ── Summary ── */
      .summary-section { display: flex; flex-direction: column; }

      .summary-heading {
        font-size: var(--text-md);
        font-weight: 700;
        color: var(--text-primary);
        margin-bottom: clamp(10px, 2vw, 14px);
      }

      .summary-list { display: flex; flex-direction: column; gap: 2px; }

      .summary-row {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: clamp(9px, 1.8vw, 12px) clamp(10px, 2vw, 14px);
        border-radius: var(--radius-md);
        transition: background 0.15s;
      }

      .summary-row:hover { background: var(--surface); }

      .summary-icon-wrap {
        width: 32px;
        height: 32px;
        background: var(--brand-light);
        border-radius: var(--radius-sm);
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
      }

      .summary-label {
        flex: 1;
        font-size: var(--text-base);
        color: var(--text-secondary);
        font-weight: 500;
      }

      .summary-value {
        font-size: var(--text-md);
        font-weight: 700;
        color: var(--text-primary);
      }

      /* ── CTA Button ── */
      .btn-turn-by-turn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        width: 100%;
        padding: clamp(12px, 2.5vw, 14px) 20px;
        background: #fff;
        color: var(--brand);
        border: 1.5px solid var(--border);
        border-radius: var(--radius-md);
        font-size: var(--text-base);
        font-weight: 600;
        font-family: var(--font);
        cursor: pointer;
        transition: background 0.18s, border-color 0.18s, box-shadow 0.18s, transform 0.1s;
        min-height: 48px;
        -webkit-tap-highlight-color: transparent;
        margin-top: auto;
      }

      .btn-turn-by-turn:hover {
        background: var(--brand-light);
        border-color: #93c5fd;
        box-shadow: 0 2px 8px rgba(30,64,175,0.12);
      }

      .btn-turn-by-turn:active { transform: scale(0.98); }

      /* ── Map Panel ── */
      .map-panel {
        display: flex;
        flex-direction: column;
        position: relative;
        background: #d4e9f7;
        min-height: 0;
      }

      /* ── iframe wrap ── */
      .map-frame-wrap {
        flex: 1;
        position: relative;
        min-height: 100dvh;
        background: #d4e9f7;
        overflow: hidden;
      }

      .map-iframe {
        position: absolute;
        inset: 0;
        width: 100vw;
        height: 100vh;
        border: 0;
        transition: opacity 0.4s ease;
      }

      .map-iframe-loaded { opacity: 1; }

      /* ── Skeleton ── */
      .map-skeleton {
        position: absolute;
        inset: 0;
        background: linear-gradient(135deg, #e8f4f8 0%, #d4e9f7 100%);
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
      }

      .skeleton-shimmer {
        position: absolute;
        inset: 0;
        background: linear-gradient(
          100deg,
          transparent 30%,
          rgba(255,255,255,0.5) 50%,
          transparent 70%
        );
        background-size: 200% 100%;
        animation: shimmer 1.6s ease-in-out infinite;
      }

      @keyframes shimmer {
        from { background-position: 200% 0; }
        to   { background-position: -200% 0; }
      }

      .skeleton-pin {
        position: absolute;
        width: 14px;
        height: 14px;
        border-radius: 50%;
        opacity: 0.5;
        animation: pinFloat 1.8s ease-in-out infinite;
      }

      .skeleton-pin-a { background: #16a34a; top: 32%; right: 22%; animation-delay: 0s; }
      .skeleton-pin-b { background: #1e40af; top: 50%; left: 48%; animation-delay: 0.2s; }
      .skeleton-pin-c { background: #dc2626; bottom: 18%; left: 18%; animation-delay: 0.4s; }

      @keyframes pinFloat {
        0%, 100% { transform: translateY(0); opacity: 0.4; }
        50%       { transform: translateY(-6px); opacity: 0.9; }
      }

      .skeleton-label {
        position: relative;
        font-size: var(--text-sm);
        font-weight: 600;
        color: var(--text-muted);
        background: rgba(255,255,255,0.85);
        padding: 6px 14px;
        border-radius: 99px;
        z-index: 2;
      }

      /* ── Map overlays ── */
      .map-legend {
        position: absolute;
        top: 12px;
        left: 12px;
        background: rgba(255,255,255,0.92);
        backdrop-filter: blur(8px);
        border: 1px solid rgba(255,255,255,0.8);
        border-radius: var(--radius-md);
        padding: 8px 12px;
        display: flex;
        flex-direction: column;
        gap: 5px;
        box-shadow: var(--shadow-drop);
        z-index: 5;
        pointer-events: none;
      }

      .legend-item {
        display: flex;
        align-items: center;
        gap: 7px;
      }

      .legend-dot {
        width: 9px;
        height: 9px;
        border-radius: 50%;
        flex-shrink: 0;
      }

      .legend-text {
        font-size: var(--text-xs);
        color: var(--text-secondary);
        font-weight: 600;
        white-space: nowrap;
        font-family: var(--font);
      }

      .map-distance-badge {
        position: absolute;
        bottom: 12px;
        right: 12px;
        background: rgba(255,255,255,0.92);
        backdrop-filter: blur(8px);
        border: 1px solid rgba(255,255,255,0.8);
        border-radius: 99px;
        padding: 5px 12px;
        font-size: var(--text-sm);
        font-weight: 700;
        color: var(--brand);
        font-family: var(--font);
        display: flex;
        align-items: center;
        gap: 5px;
        box-shadow: var(--shadow-drop);
        z-index: 5;
        pointer-events: none;
      }

      .map-external-link {
        position: absolute;
        top: 12px;
        right: 12px;
        background: rgba(255,255,255,0.92);
        backdrop-filter: blur(8px);
        border: 1px solid rgba(255,255,255,0.8);
        border-radius: 99px;
        padding: 6px 12px;
        font-size: var(--text-xs);
        font-weight: 600;
        color: var(--brand);
        font-family: var(--font);
        display: flex;
        align-items: center;
        gap: 5px;
        box-shadow: var(--shadow-drop);
        z-index: 5;
        text-decoration: none;
        transition: background 0.15s, transform 0.1s;
      }

      .map-external-link:hover { background: #fff; }
      .map-external-link:active { transform: scale(0.96); }

      /* ── Mobile map summary strip ── */
      .map-summary-strip {
        display: none;
        background: #fff;
        border-top: 1px solid var(--border);
        padding: 12px 16px;
        align-items: center;
        justify-content: space-around;
        flex-shrink: 0;
      }

      .strip-stat {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 2px;
      }

      .strip-val {
        font-size: var(--text-md);
        font-weight: 700;
        color: var(--text-primary);
      }

      .strip-lbl {
        font-size: var(--text-xs);
        color: var(--text-muted);
        font-weight: 500;
      }

      .strip-divider {
        width: 1px;
        height: 32px;
        background: var(--border);
      }

      .tab-hidden { display: none !important; }

      /* ════════════════════════════════════════════
         RESPONSIVE BREAKPOINTS
      ════════════════════════════════════════════ */

      /* ── Large desktop 1400px+ ── */
      @media (min-width: 1400px) {
        .card-body { grid-template-columns: 360px 1fr; }
      }

      /* ── Desktop / Tablet landscape 769–1399px ── */
      @media (min-width: 769px) and (max-width: 1399px) {
        .card-body { grid-template-columns: 300px 1fr; }
      }

      /* ── Tablet portrait 600–768px ── */
      @media (min-width: 600px) and (max-width: 768px) {
        .page-wrapper { padding: 0; }
        .route-card { height: 100dvh; max-height: none; border-radius: 0; border: none; }

        .card-body {
          grid-template-columns: 1fr;
          grid-template-rows: auto 1fr;
        }
        .info-panel {
          border-right: none;
          border-bottom: 1px solid var(--border);
          max-height: 46vh;
        }
        .stops-list { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px; }
        .stop-item  { flex-direction: column; align-items: center; text-align: center; }
        .stop-left  { flex-direction: row; align-items: center; gap: 8px; padding-top: 0; }
        .stop-line  { width: 24px; height: 2px; min-height: unset; margin: 0; }
        .stop-body  { padding-bottom: 0; }
        .summary-list { display: grid; grid-template-columns: 1fr 1fr 1fr; }
        .map-summary-strip { display: none !important; }
      }

      /* ── Mobile < 600px ── */
      @media (max-width: 599px) {
        .page-wrapper { padding: 0; }
        .route-card { height: 100vh; border-radius: 0;  }

        .mobile-tabs { display: flex; }

        .card-body {
          grid-template-columns: 1fr;
          grid-template-rows: 1fr;
          flex: 1;
          min-height: 0;
        }

        .info-panel { border-right: none; }

        .map-panel { min-height: 0; }
        .map-frame-wrap { min-height: 0; }

        .map-summary-strip { display: flex; }

        .stop-body { padding-bottom: 14px; }

     

        .btn-turn-by-turn { margin-top: 18px; }

        .map-external-link span { display: none; }
      }

      /* ── Extra-small < 380px ── */
      @media (max-width: 379px) {
        .route-title { font-size: 19px; }
        .info-panel  { padding: 16px; }
        .summary-list { grid-template-columns: 1fr; }
        .map-legend { padding: 6px 8px; gap: 4px; }
        .map-distance-badge { font-size: 11px; padding: 4px 9px; }
        .map-external-link { padding: 5px 8px; }
        .map-summary-strip { padding: 10px 8px; }
        .strip-val { font-size: 13px; }
      }

      /* ── Landscape phones ── */
      @media (max-height: 700px) and (orientation: landscape) {
        .page-wrapper { padding: 0px; }
        .route-card { height: 100dvh; border-radius: 0; border: none; }
        .mobile-tabs { display:  none; }
        .card-body { grid-template-columns: 260px 1fr; grid-template-rows: 1fr; }
        .info-panel  { display: flex !important; padding: 14px 16px; }
        .map-panel   { display: flex !important; }
        .stops-list { gap: 0; }
        .stop-body   { padding-bottom: 10px; }
        .panel-divider { margin: 8px 0; }
        .info-header { margin-bottom: 12px; }
      }

      /* ── Touch targets ── */
      @media (hover: none) and (pointer: coarse) {
        .btn-turn-by-turn { min-height: 52px; }
        .tab-btn          { padding: 14px 0; }
        .stop-badge       { width: 34px; height: 34px; }
        .map-external-link { padding: 8px 14px; }
      }

      /* ── Reduced motion ── */
      @media (prefers-reduced-motion: reduce) {
        .route-card { animation: none; }
        .skeleton-shimmer, .skeleton-pin { animation: none; }
        .map-iframe { transition: none; }
        * { transition-duration: 0.01ms !important; }
      }

      /* ── Dark mode ── */
      @media (prefers-color-scheme: light) {
        :root {
          --bg:           #0b1220;
          --card-bg:      #1e293b;
          --surface:      #263347;
          --border:       #334155;
          --text-primary:   #f1f5f9;
          --text-secondary: #94a3b8;
          --text-muted:     #64748b;
          --brand:        #3b82f6;
          --brand-dark:   #2563eb;
          --brand-light:  rgba(59,130,246,0.12);
        }
        .map-panel,
        .map-frame-wrap,
        .map-skeleton { background: #1c3044; }
        .map-legend,
        .map-distance-badge,
        .map-external-link {
          background: rgba(30,41,59,0.92);
          border-color: rgba(51,65,85,0.8);
        }
        .map-external-link:hover { background: rgba(38,51,71,0.95); }
        .legend-text { color: #94a3b8; }
        .map-distance-badge,
        .map-external-link { color: #60a5fa; }
        .map-summary-strip { background: #1e293b; }
        .btn-turn-by-turn { background: #1e293b; border-color: #334155; color: #60a5fa; }
        .btn-turn-by-turn:hover { background: #263347; }
        .skeleton-label { background: rgba(30,41,59,0.85); color: #94a3b8; }
      }

      /* ── Print ── */
      @media print {
        .page-wrapper { padding: 0; background: #fff; }
        .route-card { box-shadow: none; border: 1px solid #000; height: 100dvh; }
        .mobile-tabs { display: none; }
        .btn-turn-by-turn { display: none; }
        .card-body { grid-template-columns: 300px 1fr; }
        .tab-hidden { display: flex !important; }
        .map-external-link { display: none; }
      }
    `}</style>
  );
}
