import { useNavigate } from "react-router-dom";
import { useState, useMemo, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import Loading from "./loading";
// ─── Types ────────────────────────────────────────────────────────────────────

type ShipmentStatus = "pending" | "transit" | "deleted" | "delivered";

interface Shipment {
  _id: string;
  clientName: string;
  clientPhoneNumber: number;
  pickupAddress: string;
  deliveryAddress: string;
  shipmentType: string;
  boxQuantity: number;
  isUrgent: boolean;
  routeNumber: string;
  driverAllocated: boolean;
  status: ShipmentStatus;
  deliveryShift: string;
  createdAt: string;
  updatedAt: string;
}
type ToastKind = "success" | "info" | "danger";

interface Toast {
  id: number;
  kind: ToastKind;
  message: string;
}

// ─── Status meta ──────────────────────────────────────────────────────────────

const STATUS_META: Record<
  ShipmentStatus,
  { label: string; color: string; bg: string; dot: string }
> = {
  pending: {
    label: "Pending",
    color: "#b45309",
    bg: "#fef3c7",
    dot: "#f59e0b",
  },
  transit: {
    label: "In Transit",
    color: "#1e40af",
    bg: "#dbeafe",
    dot: "#3b82f6",
  },
  deleted: {
    label: "Deleted",
    color: "#b91c1c",
    bg: "#fee2e2",
    dot: "#ef4444",
  },
  delivered: {
    label: "Delivered",
    color: "#15803d",
    bg: "#dcfce7",
    dot: "#22c55e",
  },
};

const STATUS_ORDER: ShipmentStatus[] = [
  "pending",
  "transit",
  "deleted",
  "delivered",
];

// ─── Icons ────────────────────────────────────────────────────────────────────

const IconTruck = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
    <path
      d="M3 16V6a1 1 0 011-1h10a1 1 0 011 1v10M3 16h12M3 16a2 2 0 104 0M15 16a2 2 0 104 0M15 9h3l3 3v4h-2"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const IconSearch = () => (
  <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
    <circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="1.8" />
    <path
      d="M13.5 13.5l3 3"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
  </svg>
);

const IconCheck = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path
      d="M2.5 7l3 3 6-6"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const IconEdit = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
    <path
      d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M18.5 2.5a2.12 2.12 0 013 3L12 15l-4 1 1-4 9.5-9.5z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const IconTrash = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
    <path
      d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0l-1 14a2 2 0 01-2 2H7a2 2 0 01-2-2L4 6h16zM10 11v6M14 11v6"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const IconFlag = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
    <path
      d="M4 22V4M4 4h12l-2 4 2 4H4"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const IconLogo = () => (
  <svg
    width="13"
    height="13"
    viewBox="25 25 70 70"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect x="25" y="25" width="70" height="70" rx="16" fill="#3A5F8F" />

    <g stroke="white" strokeWidth="3" strokeLinejoin="round">
      <path d="M60 45 L75 52 L60 60 L45 52 Z" />
      <path d="M45 52 L45 68 L60 76 L60 60 Z" />
      <path d="M75 52 L75 68 L60 76 L60 60 Z" />
    </g>
  </svg>
);

const IconCalendar = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
    <rect
      x="3"
      y="5"
      width="18"
      height="16"
      rx="2"
      stroke="currentColor"
      strokeWidth="1.8"
    />
    <path
      d="M3 9h18M8 3v4M16 3v4"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
  </svg>
);

const IconRoute = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
    <circle cx="6" cy="19" r="2.5" stroke="currentColor" strokeWidth="2" />
    <circle cx="18" cy="5" r="2.5" stroke="currentColor" strokeWidth="2" />
    <path
      d="M8.5 19H17a3.5 3.5 0 000-7H7a3.5 3.5 0 010-7h8.5"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const IconBox = () => (
  <svg width="34" height="34" viewBox="0 0 24 24" fill="none">
    <path
      d="M21 8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16V8z"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinejoin="round"
    />
    <path
      d="M3.27 6.96L12 12l8.73-5.04M12 22.08V12"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinejoin="round"
    />
  </svg>
);

// ─── Status Dropdown ──────────────────────────────────────────────────────────

function StatusDropdown({ status }: { status: ShipmentStatus }) {
  const meta = STATUS_META[status];

  return (
    <div className="status-dd">
      <div
        className="status-badge status-badge-btn"
        style={{ color: meta.color, background: meta.bg }}
      >
        <span className="status-dot" style={{ background: meta.dot }} />
        {meta.label}
      </div>
    </div>
  );
}

// ─── Toast ────────────────────────────────────────────────────────────────────

function ToastStack({
  toasts,
  onDismiss,
}: {
  toasts: Toast[];
  onDismiss: (id: number) => void;
}) {
  return (
    <div className="toast-stack" aria-live="polite">
      {toasts.map((t) => (
        <div key={t.id} className={`toast toast-${t.kind}`}>
          <span className="toast-icon">
            {t.kind === "success" && <IconCheck />}
            {t.kind === "danger" && <IconTrash />}
            {t.kind === "info" && <IconFlag />}
          </span>
          <span className="toast-msg">{t.message}</span>
          <button
            className="toast-close"
            onClick={() => onDismiss(t.id)}
            aria-label="Dismiss"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}

// ─── Shipment Row (desktop table row + mobile card, shared logic) ────────────

function ShipmentRow({
  shipment,
  onComplete,
  onEdit,
  isUpdating,
}: {
  shipment: Shipment;
  onComplete: (id: string) => void;
  onEdit: (id: string) => void;
  isUpdating: boolean;
}) {
  // const [confirmOpen, setConfirmOpen] = useState(false);
  const router = useNavigate();
  const hasRoute = Boolean(shipment.routeNumber);
  return (
    <div className={`row ${isUpdating ? "row-updating" : ""} `}>
      {/* Tracking + route (mobile combines into card header) */}
      <div className="cell cell-id">
        <div className="id-icon">
          <IconTruck />
        </div>
        <div
          onClick={() => {
            router(`/best-route/${shipment._id}`);
          }}
          className="cursor-pointer id-body"
        >
          <div className="flex  items-center">
            {shipment.isUrgent && (
              <div className="w-2.5 h-2.5 absolute bg-red-600 rounded-full"></div>
            )}
            <div className={`tracking-id ${shipment.isUrgent ? "ml-3.5" : ""}`}>
              {shipment?._id?.slice(-7)}
            </div>
          </div>
          <div className="client-name">{shipment.clientName}</div>
          <div
            className={`route-badge ${hasRoute ? "" : "route-badge-empty"}`}
            title={
              hasRoute ? `Route ${shipment.routeNumber}` : "No route assigned"
            }
          >
            <IconRoute />
            <span className="route-badge-text">
              {hasRoute ? `Route ${shipment.routeNumber}` : "No route"}
            </span>
          </div>
        </div>
      </div>

      <div className="cell cell-route">
        <div className="route-line">
          <span className="route-dot route-dot-start" />
          <span className="route-text">{shipment.pickupAddress}</span>
        </div>
        <div className="route-connector" />
        <div className="route-line">
          <span className="route-dot route-dot-end" />
          <span className="route-text">{shipment.deliveryAddress}</span>
        </div>
      </div>

      <div className="cell cell-meta">
        <span className="meta-chip">
          <IconCalendar /> ETA {shipment?.updatedAt?.split("T")[0]}
        </span>
        <span className="meta-chip">
          <IconLogo /> {shipment.boxQuantity} |{" "}
          {shipment.deliveryShift.toUpperCase()}
        </span>
      </div>

      <div className="cell cell-status">
        <StatusDropdown status={shipment.status} />
      </div>

      <div className="cell cell-actions">
        <button
          className="action-btn action-complete"
          onClick={() => onComplete(shipment._id)}
          disabled={isUpdating}
          title="Mark as delivered"
          aria-label="Mark as delivered"
        >
          <IconTrash />
          <span className="action-label">Delete</span>
        </button>

        <button
          className="action-btn action-edit"
          onClick={() => onEdit(shipment._id)}
          disabled={isUpdating}
          title="Edit shipment"
          aria-label="Edit shipment"
        >
          <IconEdit />
          <span className="action-label">Edit</span>
        </button>
      </div>

      {isUpdating && (
        <div className="row-spinner-overlay">
          <svg
            className="row-spinner"
            viewBox="0 0 24 24"
            fill="none"
            width="18"
            height="18"
          >
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke="rgba(30,64,175,0.2)"
              strokeWidth="3"
            />
            <path
              d="M12 2a10 10 0 0110 10"
              stroke="#1e40af"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </svg>
        </div>
      )}
    </div>
  );
}

// ─── Filter Tabs ──────────────────────────────────────────────────────────────

function FilterTabs({
  active,
  onChange,
  counts,
}: {
  active: ShipmentStatus | "all";
  onChange: (f: ShipmentStatus | "all") => void;
  counts: Record<string, number>;
}) {
  const tabs: { id: ShipmentStatus | "all"; label: string }[] = [
    { id: "all", label: "All" },
    { id: "pending", label: "Pending" },
    { id: "transit", label: "In Transit" },
    { id: "delivered", label: "Delivered" },
  ];

  return (
    <div className="filter-tabs" role="tablist">
      {tabs.map((t) => (
        <button
          key={t.id}
          role="tab"
          aria-selected={active === t.id}
          className={`filter-tab ${active === t.id ? "filter-tab-active" : ""}`}
          onClick={() => onChange(t.id)}
        >
          {t.label}
          <span className="filter-count">{counts[t.id] ?? 0}</span>
        </button>
      ))}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

let toastSeq = 0;

export default function Shipments() {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [filter, setFilter] = useState<ShipmentStatus | "all">("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState<boolean>(true);
  const [updatingIds, setUpdatingIds] = useState<Set<string>>(new Set());
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [isMoreShipmentAvailable, setIsMoreShipmentAvailable] = useState(true);
  const router = useNavigate();
  const getInitialData = async () => {
    const result = await fetch("/api/shipments", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    const data = await result.json();
    if (result.ok) {
      setShipments(data.shipments);
    } else {
      if (data.message == "Unauthorized: No token provided") {
        router("/login");
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    const cachedUser = localStorage.getItem("user");
    if (cachedUser) {
      getInitialData();
    } else {
      router("/login");
    }
  }, [router]);

  // ── Toast helpers ──
  const pushToast = useCallback((kind: ToastKind, message: string) => {
    const id = ++toastSeq;
    setToasts((t) => [...t, { id, kind, message }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3200);
  }, []);

  const dismissToast = (id: number) =>
    setToasts((t) => t.filter((x) => x.id !== id));

  // ── Simulated async action wrapper ──
  const runUpdate = useCallback((id: string, fn: () => void, delay = 500) => {
    setUpdatingIds((s) => new Set(s).add(id));
    setTimeout(() => {
      fn();
      setUpdatingIds((s) => {
        const next = new Set(s);
        next.delete(id);
        return next;
      });
    }, delay);
  }, []);

  const handleComplete = (id: string) => {
    const shipment = shipments.find((s) => s._id === id);
    if (shipment) {
      runUpdate(id, async () => {
        const result = await fetch(`/api/shipments/${shipment._id}`, {
          method: "DELETE",
          credentials: "include",
        });
        const data = await result.json();
        if (data.message == "Unauthorized: No token provided") {
          router("/login");
        }
        if (result.ok) {
          // setShipments((list) => list.filter((s) => s._id !== id));
          pushToast("success", `Successfully deleted shipment id: ${id}`);
          window.location.reload();
        }
      });
    } else {
      pushToast("success", `There is a problem deleting ${id}.`);
    }
  };

  const handleLoadMoreShipments = async () => {
    const result = await fetch(
      `/api/shipments/more?limit=10&startIndex=${shipments.length}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      },
    );
    const data = await result.json();
    if (data.message == "Unauthorized: No token provided") {
      router("/login");
    }
    if (result.ok) {
      if (data.shipments.length < 10) {
        setIsMoreShipmentAvailable(false);
      }
      const newShipments = [...shipments, ...data.shipments];
      setShipments(newShipments);
    }
  };

  const handleEdit = (id: string) => {
    const shipment = shipments.find((s) => s._id === id);
    localStorage.setItem("shipmentForUpdate", JSON.stringify(shipment));
    pushToast("info", `Opening editor for ${shipment?._id}…`);
    router("/update-shipment");
  };

  // ── Derived data ──
  const counts = useMemo(() => {
    const c: Record<string, number> = { all: shipments.length };
    STATUS_ORDER.forEach((s) => (c[s] = 0));
    shipments.forEach((s) => {
      c[s.status] = (c[s.status] ?? 0) + 1;
    });
    return c;
  }, [shipments]);

  const filtered = useMemo(() => {
    return shipments.filter((s) => {
      const matchesFilter = filter === "all" || s.status === filter;
      const q = search.trim().toLowerCase();
      const matchesSearch =
        !q ||
        s._id.toLowerCase().includes(q) ||
        s.clientName.toLowerCase().includes(q) ||
        s.pickupAddress.toLowerCase().includes(q) ||
        s.deliveryAddress.toLowerCase().includes(q);
      return matchesFilter && matchesSearch;
    });
  }, [shipments, filter, search]);
  if (loading) {
    return <Loading />;
  }
  return (
    <>
      <GlobalStyles />
      <div className="page-wrapper">
        <div className="page-inner">
          {/* ── Header ── */}
          <div className="page-header">
            <div>
              <h1
                style={{
                  color: "white",
                }}
                className="page-title "
              >
                Shipments
              </h1>
              <p className="page-subtitle">
                {shipments.length} total · {counts.transit} in transit ·{" "}
                {counts.pending} pending · {counts.delivered} delivered
              </p>
            </div>
            <Link to={"/new-shipment"} className="btn-new">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 5v14M5 12h14"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                />
              </svg>
              New Shipment
            </Link>
          </div>

          {/* ── Toolbar ── */}
          <div className="toolbar">
            <div className="search-wrap">
              <span className="search-icon">
                <IconSearch />
              </span>
              <input
                type="text"
                className="search-input"
                placeholder="Search by tracking ID, client, or location…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              {search && (
                <button
                  className="search-clear"
                  onClick={() => setSearch("")}
                  aria-label="Clear search"
                >
                  ×
                </button>
              )}
            </div>
            <FilterTabs active={filter} onChange={setFilter} counts={counts} />
          </div>

          {/* ── List ── */}
          <div className="list-card">
            {/* Table head (desktop only) */}
            {filtered.length > 0 && (
              <div className="row-head row sm:grid hidden">
                <div className="cell cell-id">Shipment</div>
                <div className="cell cell-route">Route</div>
                <div className="cell cell-meta">Details</div>
                <div className="cell cell-status">Status</div>
                <div className="cell cell-actions">Actions</div>
              </div>
            )}

            {filtered.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">
                  <IconBox />
                </div>
                <h3 className="empty-title">
                  {search || filter !== "all"
                    ? "No shipments match"
                    : "No shipments yet"}
                </h3>
                <p className="empty-text">
                  {search || filter !== "all"
                    ? "Try a different search term or clear the filters."
                    : "Create your first shipment to see it listed here."}
                </p>
                {(search || filter !== "all") && (
                  <button
                    className="empty-reset"
                    onClick={() => {
                      setSearch("");
                      setFilter("all");
                    }}
                  >
                    Clear filters
                  </button>
                )}
              </div>
            ) : (
              <div>
                {filtered.map((s, i) => {
                  return (
                    <ShipmentRow
                      key={i + "shipmentrow"}
                      shipment={s}
                      onComplete={handleComplete}
                      onEdit={handleEdit}
                      isUpdating={updatingIds.has(s._id)}
                    />
                  );
                })}
              </div>
            )}
          </div>
          <div className={`w-full  flex items-center justify-center `}>
            <button
              onClick={(e) => {
                e.preventDefault();
                handleLoadMoreShipments();
              }}
              className={`btn-new`}
              disabled={!isMoreShipmentAvailable}
            >
              {!isMoreShipmentAvailable
                ? "No Shipments Available"
                : "Load More Shipment"}
            </button>
          </div>
        </div>
      </div>

      <ToastStack toasts={toasts} onDismiss={dismissToast} />
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
        --red:          #ef4444;
        --red-light:    #fee2e2;

        --text-primary:   #0f172a;
        --text-secondary: #475569;
        --text-muted:     #94a3b8;

        --border:       #e2e8f0;
        --surface:      #f8fafc;
        --card-bg:      #ffffff;
        --bg:           #f1f5f9;

        --radius-sm: 6px; --radius-md: 10px; --radius-lg: 14px; --radius-xl: 18px;

        --shadow-card: 0 1px 2px rgba(0,0,0,0.04), 0 1px 3px rgba(0,0,0,0.06);
        --shadow-drop: 0 10px 32px rgba(0,0,0,0.12);

        --font: 'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;

        --tx-xs:   clamp(10px, 1.6vw, 11px);
        --tx-sm:   clamp(11px, 1.8vw, 12px);
        --tx-base: clamp(13px, 2vw, 14px);
        --tx-md:   clamp(14px, 2.2vw, 15px);
        --tx-lg:   clamp(16px, 2.6vw, 18px);
        --tx-xl:   clamp(22px, 4vw, 28px);
      }

      html { font-size: 16px; -webkit-text-size-adjust: 100%; }
      body { font-family: var(--font); background: var(--bg); color: var(--text-primary); line-height: 1.5; }

      /* ── Page ── */
      .page-wrapper {
        min-height: 100vh;
        padding: clamp(16px, 3vw, 40px) clamp(14px, 3vw, 32px);
        display: flex;
        justify-content: center;
      }

      .page-inner {
        width: 100%;
        max-width: 1240px;
        display: flex;
        flex-direction: column;
        gap: clamp(16px, 2.5vw, 24px);
      }

      /* ── Header ── */
      .page-header {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 16px;
        flex-wrap: wrap;
        animation: fadeDown 0.35s ease both;
      }

      @keyframes fadeDown {
        from { opacity: 0; transform: translateY(-8px); }
        to   { opacity: 1; transform: translateY(0); }
      }

      .page-title {
        font-size: var(--tx-xl);
        font-weight: 800;
        color: var(--text-primary);
        letter-spacing: -0.6px;
      }

      .page-subtitle {
        font-size: var(--tx-base);
        color: var(--text-secondary);
        margin-top: 4px;
      }

      .btn-new {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        background: var(--brand);
        color: #fff;
        border: none;
        border-radius: var(--radius-md);
        padding: 0 18px;
        height: 44px;
        font-size: var(--tx-base);
        font-weight: 600;
        font-family: var(--font);
        cursor: pointer;
        box-shadow: 0 1px 3px rgba(30,64,175,0.3);
        transition: background 0.18s, box-shadow 0.18s, transform 0.1s;
        white-space: nowrap;
        -webkit-tap-highlight-color: transparent;
      }

      .btn-new:hover { background: var(--brand-dark); box-shadow: 0 4px 12px rgba(30,64,175,0.35); }
      .btn-new:active { transform: scale(0.97); }

      /* ── Toolbar ── */
      .toolbar {
        display: flex;
        flex-direction: column;
        gap: 14px;
        animation: fadeDown 0.35s ease 0.05s both;
      }

      .search-wrap {
        position: relative;
        display: flex;
        align-items: center;
        max-width: 420px;
        width: 100%;
      }

      .search-icon {
        position: absolute;
        left: 14px;
        color: var(--text-muted);
        display: flex;
        pointer-events: none;
      }

      .search-input {
        width: 100%;
        height: 44px;
        padding: 0 38px 0 40px;
        border: 1.5px solid var(--border);
        border-radius: var(--radius-md);
        font-size: var(--tx-base);
        font-family: var(--font);
        background: #fff;
        color: var(--text-primary);
        outline: none;
        transition: border-color 0.18s, box-shadow 0.18s;
      }

      .search-input:focus { border-color: var(--brand); box-shadow: 0 0 0 3px var(--brand-ring); }
      .search-input::placeholder { color: var(--text-muted); }

      .search-clear {
        position: absolute;
        right: 8px;
        width: 26px;
        height: 26px;
        border-radius: 50%;
        border: none;
        background: var(--surface);
        color: var(--text-muted);
        font-size: 16px;
        line-height: 1;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: background 0.15s;
      }
      .search-clear:hover { background: var(--border); }

      /* ── Filter tabs ── */
      .filter-tabs {
        display: flex;
        gap: 6px;
        overflow-x: auto;
        padding-bottom: 2px;
        scrollbar-width: none;
      }
      .filter-tabs::-webkit-scrollbar { display: none; }

      .filter-tab {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 9px 14px;
        border-radius: 99px;
        border: 1.5px solid var(--border);
        background: #fff;
        color: var(--text-secondary);
        font-size: var(--tx-sm);
        font-weight: 600;
        font-family: var(--font);
        cursor: pointer;
        white-space: nowrap;
        transition: background 0.15s, border-color 0.15s, color 0.15s;
        -webkit-tap-highlight-color: transparent;
      }

      .filter-tab:hover { border-color: #cbd5e1; }

      .filter-tab-active {
        background: var(--brand);
        border-color: var(--brand);
        color: #fff;
      }

      .filter-count {
        background: rgba(0,0,0,0.06);
        color: inherit;
        font-size: 10px;
        font-weight: 700;
        border-radius: 99px;
        padding: 1px 6px;
        min-width: 18px;
        text-align: center;
      }

      .filter-tab-active .filter-count { background: rgba(255,255,255,0.25); }

      /* ── List Card ── */
      .list-card {
        background: var(--card-bg);
        border: 1px solid var(--border);
        border-radius: var(--radius-xl);
        overflow: hidden;
        box-shadow: var(--shadow-card);
        animation: fadeUp 0.4s cubic-bezier(0.22,1,0.36,1) 0.1s both;
      }

      @keyframes fadeUp {
        from { opacity: 0; transform: translateY(14px); }
        to   { opacity: 1; transform: translateY(0); }
      }

      /* ── Row (grid) ── */
      .row {
        display: grid;
        grid-template-columns: 1.6fr 1.8fr 1.4fr 1fr 1.4fr;
        align-items: center;
        gap: 12px;
        padding: 16px 20px;
        border-bottom: 1px solid var(--border);
        position: relative;
        transition: background 0.15s, opacity 0.2s;
      }

      .list-card .row:last-child { border-bottom: none; }

      .row:not(.row-head):hover { background: var(--surface); }

      .row-head {
        background: var(--surface);
        font-size: var(--tx-xs);
        font-weight: 700;
        color: var(--text-muted);
        text-transform: uppercase;
        letter-spacing: 0.6px;
        padding: 12px 20px;
      }

      .row-updating { opacity: 0.55; pointer-events: none; }

      .row-spinner-overlay {
        position: absolute;
        inset: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(255,255,255,0.4);
      }

      .row-spinner { animation: spin 0.7s linear infinite; }
      @keyframes spin { to { transform: rotate(360deg); } }

      /* ── Cells ── */
      .cell { min-width: 0; }

      .cell-id {
        display: flex;
        align-items: center;
        gap: 12px;
      }

      .id-icon {
        width: 36px;
        height: 36px;
        border-radius: var(--radius-sm);
        background: var(--brand-light);
        color: var(--brand);
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
      }

      .tracking-id {
        font-size: var(--tx-md);
        font-weight: 700;
        color: var(--text-primary);
        letter-spacing: -0.2px;
      }

      .client-name {
        font-size: var(--tx-sm);
        color: var(--text-muted);
        margin-top: 1px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      /* Lets long client names / route numbers truncate instead of overflowing */
      .id-body { min-width: 0; }

      .route-badge {
        display: inline-flex;
        align-items: center;
        gap: 5px;
        max-width: 100%;
        margin-top: 6px;
        padding: 2px 8px;
        border-radius: 99px;
        background: var(--brand-light);
        color: var(--brand);
        font-size: var(--tx-xs);
        font-weight: 700;
        line-height: 1.5;
      }

      .route-badge svg { flex-shrink: 0; }

      .route-badge-text {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .route-badge-empty {
        background: var(--surface);
        color: var(--text-secondary);
        border: 1px dashed var(--border);
        font-weight: 600;
      }

      /* Route */
      .cell-route { display: flex; flex-direction: column; gap: 2px; }

      .route-line {
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .route-dot {
        width: 8px; height: 8px;
        border-radius: 50%;
        flex-shrink: 0;
      }

      .route-dot-start { background: #16a34a; }
      .route-dot-end   { background: #dc2626; }

      .route-text {
        font-size: var(--tx-base);
        color: var(--text-primary);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        font-weight: 500;
      }

      .route-connector {
        width: 1px;
        height: 12px;
        background: var(--border);
        margin-left: 3.5px;
      }

      /* Meta */
      .cell-meta {
        display: flex;
        flex-direction: column;
        gap: 5px;
      }

      .meta-chip {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        font-size: var(--tx-sm);
        color: var(--text-secondary);
        white-space: nowrap;
      }

      .meta-chip svg { flex-shrink: 0; color: var(--text-muted); }

      /* Status */
      .cell-status { position: relative; }

      .status-dd { position: relative; }

      .status-badge {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 7px 12px;
        border-radius: 99px;
        font-size: var(--tx-sm);
        font-weight: 700;
        font-family: var(--font);
        border: none;
        cursor: pointer;
        white-space: nowrap;
        transition: filter 0.15s, transform 0.1s;
        -webkit-tap-highlight-color: transparent;
      }

      .status-badge-btn:hover { filter: brightness(0.96); }
      .status-badge-btn:active { transform: scale(0.97); }
      .status-badge-btn:disabled { cursor: default; opacity: 0.7; }

      .status-dot {
        width: 7px; height: 7px;
        border-radius: 50%;
        flex-shrink: 0;
      }

      .status-chevron {
        display: flex;
        margin-left: 2px;
        transition: transform 0.18s;
        opacity: 0.6;
      }

      .status-chevron-open { transform: rotate(180deg); }

      .status-menu {
        position: absolute;
        top: calc(100% + 6px);
        left: 0;
        background: #fff;
        border: 1px solid var(--border);
        border-radius: var(--radius-md);
        box-shadow: var(--shadow-drop);
        z-index: 30;
        list-style: none;
        min-width: 160px;
        overflow: hidden;
        animation: dropIn 0.15s ease both;
      }

      @keyframes dropIn {
        from { opacity: 0; transform: translateY(-6px); }
        to   { opacity: 1; transform: translateY(0); }
      }

      .status-menu-item {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 10px 14px;
        font-size: var(--tx-sm);
        font-weight: 600;
        color: var(--text-primary);
        cursor: pointer;
        transition: background 0.12s;
        min-height: 40px;
      }

      .status-menu-item:hover { background: var(--surface); }
      .status-menu-item-active { background: var(--brand-light); }

      .status-menu-check {
        margin-left: auto;
        color: var(--brand);
        display: flex;
      }

      /* Actions */
      .cell-actions {
        display: flex;
        align-items: center;
        gap: 6px;
        justify-content: flex-end;
        flex-wrap: nowrap;
      }

      .action-btn {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        height: 36px;
        padding: 0 12px;
        border-radius: var(--radius-sm);
        border: 1.5px solid var(--border);
        background: #fff;
        color: var(--text-secondary);
        font-size: var(--tx-sm);
        font-weight: 600;
        font-family: var(--font);
        cursor: pointer;
        transition: background 0.15s, border-color 0.15s, color 0.15s, transform 0.1s;
        -webkit-tap-highlight-color: transparent;
        white-space: nowrap;
      }

      .action-btn:hover:not(:disabled) { background: var(--surface); border-color: #cbd5e1; }
      .action-btn:active:not(:disabled) { transform: scale(0.96); }
      .action-btn:disabled { opacity: 0.4; cursor: not-allowed; }

      .action-complete:hover:not(:disabled) {
        color: var(--green); border-color: #bbf7d0; background: var(--green-light);
      }

      .action-edit:hover:not(:disabled) {
        color: var(--brand); border-color: #bfdbfe; background: var(--brand-light);
      }

      .action-delete-wrap { position: relative; }

      .action-delete:hover:not(:disabled) {
        color: var(--red); border-color: #fecaca; background: var(--red-light);
      }

      /* ── Delete confirm popover ── */
      .confirm-pop {
        position: absolute;
        top: calc(100% + 8px);
        right: 0;
        background: #fff;
        border: 1px solid var(--border);
        border-radius: var(--radius-md);
        box-shadow: var(--shadow-drop);
        padding: 14px;
        width: 220px;
        z-index: 40;
        animation: dropIn 0.15s ease both;
      }

      .confirm-text {
        font-size: var(--tx-sm);
        color: var(--text-secondary);
        line-height: 1.5;
        margin-bottom: 10px;
      }

      .confirm-actions { display: flex; gap: 8px; }

      .confirm-cancel,
      .confirm-delete {
        flex: 1;
        height: 34px;
        border-radius: var(--radius-sm);
        font-size: var(--tx-sm);
        font-weight: 600;
        font-family: var(--font);
        cursor: pointer;
        transition: background 0.15s, transform 0.1s;
      }

      .confirm-cancel {
        border: 1.5px solid var(--border);
        background: #fff;
        color: var(--text-primary);
      }
      .confirm-cancel:hover { background: var(--surface); }

      .confirm-delete {
        border: none;
        background: var(--red);
        color: #fff;
      }
      .confirm-delete:hover { background: #dc2626; }
      .confirm-cancel:active, .confirm-delete:active { transform: scale(0.96); }

      /* ── Empty state ── */
      .empty-state {
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        padding: clamp(40px, 8vw, 72px) 24px;
        gap: 6px;
      }

      .empty-icon {
        width: 64px; height: 64px;
        border-radius: 16px;
        background: var(--brand-light);
        color: var(--brand);
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 8px;
      }

      .empty-title {
        font-size: var(--tx-lg);
        font-weight: 700;
        color: var(--text-primary);
      }

      .empty-text {
        font-size: var(--tx-base);
        color: var(--text-muted);
        max-width: 320px;
      }

      .empty-reset {
        margin-top: 12px;
        padding: 10px 20px;
        border-radius: var(--radius-md);
        border: 1.5px solid var(--border);
        background: #fff;
        color: var(--brand);
        font-size: var(--tx-base);
        font-weight: 600;
        font-family: var(--font);
        cursor: pointer;
        transition: background 0.15s, border-color 0.15s;
      }
      .empty-reset:hover { background: var(--brand-light); border-color: #bfdbfe; }

      /* ── Toasts ── */
      .toast-stack {
        position: fixed;
        bottom: 20px;
        right: 20px;
        display: flex;
        flex-direction: column;
        gap: 10px;
        z-index: 1000;
        max-width: calc(100vw - 40px);
      }

      .toast {
        display: flex;
        align-items: center;
        gap: 10px;
        background: #fff;
        border: 1px solid var(--border);
        border-radius: var(--radius-md);
        box-shadow: var(--shadow-drop);
        padding: 12px 14px;
        font-size: var(--tx-sm);
        font-weight: 600;
        color: var(--text-primary);
        min-width: 240px;
        max-width: 360px;
        animation: toastIn 0.25s cubic-bezier(0.22,1,0.36,1) both;
      }

      @keyframes toastIn {
        from { opacity: 0; transform: translateY(12px) scale(0.97); }
        to   { opacity: 1; transform: translateY(0) scale(1); }
      }

      .toast-icon {
        width: 26px; height: 26px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
      }

      .toast-success .toast-icon { background: var(--green-light); color: var(--green); }
      .toast-info    .toast-icon { background: var(--brand-light); color: var(--brand); }
      .toast-danger  .toast-icon { background: var(--red-light); color: var(--red); }

      .toast-msg { flex: 1; line-height: 1.4; }

      .toast-close {
        background: none; border: none;
        font-size: 18px; line-height: 1;
        color: var(--text-muted);
        cursor: pointer;
        padding: 0 2px;
        flex-shrink: 0;
        transition: color 0.15s;
      }
      .toast-close:hover { color: var(--text-primary); }

      /* ══════════════════════════════════════
         RESPONSIVE
      ══════════════════════════════════════ */

      /* ── Tablet 900–1199 ── */
      @media (min-width: 900px) and (max-width: 1199px) {
        .row { grid-template-columns: 1.4fr 1.6fr 1.2fr 0.9fr 1.5fr; }
        .action-label { display: none; }
        .action-btn { padding: 0 10px; }
      }

      /* ── Tablet portrait / small laptop 700–899 ── */
      @media (min-width: 700px) and (max-width: 899px) {
        .row { grid-template-columns: 1.6fr 1.6fr 1fr 1.4fr; }
        .row-head .cell-meta { display: none; }
        .cell-meta { display: none; }
        .action-label { display: none; }
        .action-btn { padding: 0 10px; }
      }

      /* ── Mobile < 700px: card layout ── */
      @media (max-width: 699px) {
        .page-wrapper { padding: 14px; }

        .row-head { display: none; }

        .row {
          display: flex;
          flex-direction: column;
          align-items: stretch;
          gap: 12px;
          padding: 16px;
          border-radius: var(--radius-lg);
          border: 1px solid var(--border);
          margin-bottom: 12px;
        }

        .list-card { background: transparent; border: none; box-shadow: none; }
        .list-card .row { background: #fff; box-shadow: var(--shadow-card); }
        .list-card .row:last-child { margin-bottom: 0; }

        .cell-id { justify-content: space-between; }

        .cell-route {
          background: var(--surface);
          border-radius: var(--radius-md);
          padding: 10px 12px;
        }

        .cell-meta { flex-direction: row; flex-wrap: wrap; gap: 10px 16px; }

        .cell-status { order: -1; }

        .cell-actions {
          justify-content: stretch;
          gap: 8px;
        }

        .action-btn { flex: 1; justify-content: center; height: 42px; }
        .action-label { display: inline; }

        .confirm-pop { right: auto; left: 0; width: calc(100vw - 64px); max-width: 280px; }

        .toast-stack { left: 14px; right: 14px; bottom: 14px; }
        .toast { min-width: 0; max-width: none; width: 100%; }
      }

      /* ── Extra small < 380 ── */
      @media (max-width: 379px) {
        .page-title { font-size: 22px; }
        .btn-new span { display: none; }
        .cell-actions { flex-wrap: wrap; }
        .action-btn { flex: 1 1 calc(50% - 4px); }
      }

      /* ── Touch targets ── */
      @media (hover: none) and (pointer: coarse) {
        .action-btn { min-height: 44px; }
        .status-badge-btn { min-height: 38px; }
        .filter-tab { min-height: 40px; }
        .search-input { min-height: 46px; }
      }

      /* ── Reduced motion ── */
      @media (prefers-reduced-motion: reduce) {
        .page-header, .toolbar, .list-card, .toast, .status-menu, .confirm-pop {
          animation: none;
        }
        .row-spinner { animation: none; }
        * { transition-duration: 0.01ms !important; }
      }

      /* ── Dark mode ── */
      @media (prefers-color-scheme: light) {
        :root {
          --bg:        #0b1220;
          --card-bg:   #151f30;
          --surface:   #1c2940;
          --border:    #2a3a52;
          --text-primary:   #f1f5f9;
          --text-secondary: #94a3b8;
          --text-muted:     #64748b;
          --brand:        #3b82f6;
          --brand-dark:   #2563eb;
          --brand-light:  rgba(59,130,246,0.14);
          --brand-ring:   rgba(59,130,246,0.22);
        }
        .search-input, .filter-tab, .action-btn, .empty-reset,
        .confirm-pop, .confirm-cancel, .status-menu, .toast {
          background: #151f30;
          color: var(--text-primary);
          border-color: var(--border);
        }
        .filter-tab:hover, .action-btn:hover:not(:disabled),
        .status-menu-item:hover, .confirm-cancel:hover {
          background: var(--surface);
        }
        .list-card .row { background: #151f30; }
        @media (max-width: 699px) {
          .list-card .row { background: #151f30; }
          .cell-route { background: #1c2940; }
        }
      }

      /* ── Print ── */
      @media print {
        .page-wrapper { padding: 0; background: #fff; }
        .btn-new, .cell-actions, .toolbar, .toast-stack { display: none; }
        .list-card { box-shadow: none; border: 1px solid #000; }
      }
    `}</style>
  );
}
