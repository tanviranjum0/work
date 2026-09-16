import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
// ─── Types ────────────────────────────────────────────────────────────────────
interface User {
  fullName: string;
  email: string;
  _id: string;
}
type ShipmentStatus = "pending" | "transit" | "delivered" | "cancelled";

interface Shipment {
  _id: string;
  clientName: string;
  clientPhoneNumber: number;
  pickupAddress: string;
  deliveryAddress: string;
  shipmentType: string;
  boxQuantity: number;
  driverAllocated: boolean;
  status: ShipmentStatus;
  deliveryShift: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Status config ────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<
  ShipmentStatus,
  { label: string; dot: string; text: string; bg: string }
> = {
  pending: {
    label: "Pending",
    dot: "bg-amber-500",
    text: "text-amber-400",
    bg: "bg-amber-500/10",
  },
  transit: {
    label: "In Transit",
    dot: "bg-blue-500",
    text: "text-blue-400",
    bg: "bg-blue-500/10",
  },
  delivered: {
    label: "Delivered",
    dot: "bg-emerald-500",
    text: "text-emerald-400",
    bg: "bg-emerald-500/10",
  },
  cancelled: {
    label: "Cancelled",
    dot: "bg-red-500",
    text: "text-red-400",
    bg: "bg-red-500/10",
  },
};

// ─── Sidebar nav items ────────────────────────────────────────────────────────

const NAV_ITEMS = [
  {
    href: "/home",
    label: "Home",
    active: true,
    icon: (
      <svg className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none">
        <rect
          x="3"
          y="3"
          width="7"
          height="9"
          rx="1.5"
          stroke="currentColor"
          strokeWidth="1.8"
        />
        <rect
          x="14"
          y="3"
          width="7"
          height="5"
          rx="1.5"
          stroke="currentColor"
          strokeWidth="1.8"
        />
        <rect
          x="14"
          y="12"
          width="7"
          height="9"
          rx="1.5"
          stroke="currentColor"
          strokeWidth="1.8"
        />
        <rect
          x="3"
          y="16"
          width="7"
          height="5"
          rx="1.5"
          stroke="currentColor"
          strokeWidth="1.8"
        />
      </svg>
    ),
  },
  {
    href: "/shipments",
    label: "Shipments",
    active: false,
    icon: (
      <svg className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none">
        <path
          d="M21 8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16V8z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
        <path
          d="M3.27 6.96L12 12.01l8.73-5.05M12 22.08V12"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    href: "/routes",
    label: "Routes",
    active: false,
    icon: (
      <svg className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none">
        <path
          d="M3 12h18M3 6h6M15 6h6M3 18h6M15 18h6"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    href: "/get-route",
    label: "New Route",
    active: false,
    icon: (
      <svg className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
        <path
          d="M12 8v8M8 12h8"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    href: "/new-shipment",
    label: "New Shipment",
    active: false,
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width="24"
        height="24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M8 8l-5 2.5 5 2.5 5-2.5-5-2.5z" />
        <path d="M3 15.5l5 2.5 5-2.5" />
        <path d="M3 10.5v5" />
        <path d="M8 13v5" />
        <path d="M13 10.5v5" />

        <path d="M18 4v12M12 10h12" strokeWidth="1.8" />
      </svg>
    ),
  },
];

// ─── Logout Modal ─────────────────────────────────────────────────────────────

function LogoutModal({
  onCancel,
  onConfirm,
}: {
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(6px)" }}
      onClick={onCancel}
    >
      {/* Card — stop propagation so clicking inside doesn't close */}
      <div
        className="w-full max-w-sm rounded-2xl border border-slate-700/80 p-7 shadow-2xl"
        style={{ background: "#111a2e" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Icon */}
        <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-5">
          <svg className="w-5 h-5 text-red-400" viewBox="0 0 24 24" fill="none">
            <path
              d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <h2 className="text-lg cursor-pointer font-bold text-white text-center leading-tight mb-2">
          Log out?
        </h2>
        <p className="text-sm text-slate-400 text-center leading-relaxed mb-7">
          You&apos;ll need to sign back in to access the dashboard, your routes,
          and shipment data.
        </p>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 h-11 cursor-pointer rounded-xl border border-slate-600 text-sm font-semibold text-slate-300 hover:bg-slate-700/50 hover:border-slate-500 hover:text-white transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 h-11 cursor-pointer rounded-xl bg-red-600 text-sm font-bold text-white hover:bg-red-500 active:scale-[.97] transition-all shadow-lg shadow-red-900/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
          >
            Yes, Log Out
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────

function Sidebar({
  user,
  onLogout,
  mobileOpen,
  onMobileClose,
}: {
  user: User | null;
  onLogout: () => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
}) {
  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/60 lg:hidden"
          onClick={onMobileClose}
        />
      )}

      <aside
        className={[
          "fixed top-0 left-0 h-full z-40 flex flex-col border-r border-slate-800",
          "w-60 transition-transform duration-300",
          "lg:translate-x-0 lg:static lg:z-auto",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
        ].join(" ")}
        style={{ background: "#0d1526" }}
      >
        {/* Nav */}
        <nav className="flex-1 mt-16 lg:mt-0 overflow-y-auto px-3 py-4 space-y-0.5">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-3 mb-2">
            Navigation
          </p>
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              onClick={onMobileClose}
              className={[
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 group",
                item.active
                  ? "bg-blue-600/15 text-blue-400 border border-blue-500/20"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60",
              ].join(" ")}
            >
              <span
                className={
                  item.active
                    ? "text-blue-400"
                    : "text-slate-500 group-hover:text-slate-300 transition-colors"
                }
              >
                {item.icon}
              </span>
              {item.label}
              {item.active && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-400" />
              )}
            </Link>
          ))}
        </nav>

        {/* Bottom — user + logout */}
        <div className="px-3 py-4 border-t border-slate-800 space-y-2 shrink-0">
          {/* User chip */}
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-slate-800/40">
            <div className="w-7 h-7 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center shrink-0">
              <span className="text-[11px] font-bold text-blue-300">
                {user?.fullName?.charAt(0) ?? "?"}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-slate-200 leading-tight truncate">
                {user?.fullName ?? "Guest"}
              </p>
            </div>
          </div>

          {/* Logout */}
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-400 hover:text-red-400 cursor-pointer hover:bg-red-500/8 transition-all group focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500/50"
          >
            <svg
              className="w-4 h-4 group-hover:text-red-400 transition-colors shrink-0"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Log Out
          </button>
        </div>
      </aside>
    </>
  );
}

// ─── KPI Card ─────────────────────────────────────────────────────────────────

function KpiCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div
      className="rounded-2xl border border-slate-800 p-5 flex flex-col gap-4"
      style={{ background: "#111a2e" }}
    >
      <div className="flex items-start justify-between">
        <p className="text-xs font-semibold text-slate-400">{label}</p>
        <span className="w-9 h-9 rounded-xl bg-blue-600/10 border border-blue-500/15 flex items-center justify-center text-blue-400 shrink-0">
          {icon}
        </span>
      </div>
      <div>
        <p className="text-3xl font-extrabold text-white tracking-tight leading-none mb-1.5">
          {value}
        </p>
      </div>
    </div>
  );
}

// ─── Shipment Row ─────────────────────────────────────────────────────────────

function ShipmentRow({ shipment }: { shipment: Shipment }) {
  const router = useNavigate();
  const { label, dot, text, bg } = STATUS_CONFIG[shipment.status];

  return (
    <div
      onClick={() => router(`/best-route/${shipment._id}`)}
      className="flex cursor-pointer items-center gap-4 px-5 py-3.5 border-b border-slate-800/70 last:border-0 group hover:bg-slate-800/20 transition-colors"
    >
      {/* Icon */}
      <div className="w-8 h-8 rounded-lg bg-slate-700/60 flex items-center justify-center shrink-0">
        <svg
          className="w-3.5 h-3.5 text-slate-400"
          viewBox="0 0 24 24"
          fill="none"
        >
          <path
            d="M21 8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16V8z"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
          <path
            d="M3.27 6.96L12 12l8.73-5.04M12 22V12"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* Client + code */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-slate-100 leading-tight truncate">
          {shipment.clientName}
        </p>
        <p className="text-xs text-slate-500 mt-0.5">
          {shipment._id?.slice(-7)} ·{" "}
          {new Date(shipment.updatedAt).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "long",
          })}
        </p>
      </div>

      {/* Type badge */}
      <span
        className={`hidden sm:inline-flex text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-lg border ${
          shipment.shipmentType === "delivery"
            ? "text-indigo-400 bg-indigo-500/10 border-indigo-500/20"
            : "text-teal-400 bg-teal-500/10 border-teal-500/20"
        }`}
      >
        {shipment.shipmentType === "delivery" ? "Delivery" : "Collection"}
      </span>

      {/* Boxes */}
      <span className="hidden md:block text-xs font-semibold text-slate-500 tabular-nums whitespace-nowrap">
        {shipment.boxQuantity} {shipment.boxQuantity === 1 ? "box" : "boxes"}
      </span>

      {/* Status */}
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[11px] font-bold border-transparent ${bg} ${text}`}
      >
        <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
        <span className="hidden xs:inline">{label}</span>
      </span>
    </div>
  );
}

// ─── Activity feed ────────────────────────────────────────────────────────────

// ─── Main dashboard ───────────────────────────────────────────────────────────

export default function Home() {
  const router = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [kpis, setKpis] = useState([
    {
      label: "Active Shipments",
      value: "loading...",
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
          <path
            d="M21 8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16V8z"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
          <path
            d="M3.27 6.96L12 12.01l8.73-5.05M12 22.08V12"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
      ),
    },

    {
      label: "Pending Shipments",
      value: "loading...",
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
          <path
            d="M3 12h18M3 6h6M15 6h6M3 18h6M15 18h6"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
      ),
    },
  ]);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const getInitialData = async () => {
    const result = await fetch("/api/shipments/home", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    const data = await result.json();
    if (result.ok) {
      setKpis([
        {
          label: "Active Shipments",
          value: data.total,
          icon: (
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
              <path
                d="M21 8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16V8z"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinejoin="round"
              />
              <path
                d="M3.27 6.96L12 12.01l8.73-5.05M12 22.08V12"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
          ),
        },

        {
          label: "Pending Shipments",
          value: data.pendingCount,
          icon: (
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
              <path
                d="M3 12h18M3 6h6M15 6h6M3 18h6M15 18h6"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
          ),
        },
      ]);
      setShipments(data.shipments);
    } else {
      if (data.message == "Unauthorized: No token provided") {
        router("/login");
      }
    }
  };

  useEffect(() => {
    const cachedUser = localStorage.getItem("user");
    if (cachedUser) {
      getInitialData();
      setUser(JSON.parse(cachedUser));
    } else {
      router("/login");
    }
  }, [router]);

  const handleLogoutConfirm = () => {
    setShowLogoutModal(false);
    // In production: clear auth cookies/tokens then:
    localStorage.clear();
    router("/login");
  };

  return (
    <div
      className="flex h-screen overflow-hidden"
      style={{ background: "#0b1220", fontFamily: "'DM Sans', sans-serif" }}
    >
      {/* Google Font */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700;9..40,800&display=swap');
        * { box-sizing: border-box; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { scrollbar-width: none; }
      `}</style>

      {/* ── Sidebar ── */}
      <Sidebar
        user={user}
        onLogout={() => setShowLogoutModal(true)}
        mobileOpen={mobileSidebarOpen}
        onMobileClose={() => setMobileSidebarOpen(false)}
      />

      {/* ── Main content ── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header
          className="h-16 flex items-center justify-between px-5 sm:px-8 border-b border-slate-800 shrink-0"
          style={{ background: "#0b1220" }}
        >
          <div className="flex items-center gap-4">
            {/* Hamburger (mobile) */}
            <button
              className="lg:hidden w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              onClick={() => setMobileSidebarOpen(true)}
              aria-label="Open sidebar"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                <path
                  d="M4 6h16M4 12h16M4 18h16"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>

            <div>
              <h1 className="text-lg font-bold text-white leading-tight">
                Home
              </h1>
              <p className="text-xs text-slate-500 hidden sm:block">
                {new Date().toLocaleDateString("en-GB", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                })}
              </p>
            </div>
          </div>
        </header>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto scrollbar-hide px-5 sm:px-8 py-6 space-y-6">
          {/* ── KPI Cards ── */}
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
            {kpis.map((kpi) => (
              <KpiCard key={kpi.label} {...kpi} />
            ))}
          </div>

          {/* ── Bottom two-column grid ── */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
            {/* Recent shipments — 2/3 width */}
            <div
              className="xl:col-span-2 rounded-2xl border border-slate-800 overflow-hidden"
              style={{ background: "#111a2e" }}
            >
              {/* Card header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-blue-600/10 border border-blue-500/20 flex items-center justify-center">
                    <svg
                      className="w-3.5 h-3.5 text-blue-400"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <path
                        d="M21 8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16V8z"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M3.27 6.96L12 12l8.73-5.04M12 22V12"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-white">
                      Recent Shipments
                    </h2>
                    <p className="text-xs text-slate-500">
                      Showing latest 5 of {shipments.length}
                    </p>
                  </div>
                </div>

                <Link
                  to={"/shipments"}
                  className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors"
                >
                  View all
                  <svg className="w-3 h-3" viewBox="0 0 12 12" fill="none">
                    <path
                      d="M2.5 9.5l7-7M5 2.5h4.5V7"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </Link>
              </div>

              {/* Rows */}
              <div>
                {shipments.map((s) => (
                  <ShipmentRow key={s._id} shipment={s} />
                ))}
              </div>

              {/* View All button */}
              <div className="px-5 py-4 border-t border-slate-800">
                <Link
                  to={"/shipments"}
                  className="flex items-center justify-center gap-2 w-full h-10 rounded-xl border border-slate-700 text-sm font-semibold text-slate-300 hover:text-white hover:bg-slate-700/50 hover:border-slate-600 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M21 3L10 14"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  View All Shipments
                </Link>
              </div>
            </div>
          </div>

          {/* ── Quick links strip ── */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              {
                href: "/get-route",
                label: "New Route",
                desc: "Configure & generate",
                icon: "🗺️",
              },
              {
                href: "/best-route",
                label: "Best Route",
                desc: "View optimized path",
                icon: "⚡",
              },
              {
                href: "/shipments",
                label: "All Shipments",
                desc: "Full shipment list",
                icon: "📦",
              },
              {
                href: "/routes",
                label: "All Routes",
                desc: "Fleet route overview",
                icon: "🚚",
              },
            ].map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="rounded-xl border border-slate-800 p-4 hover:border-slate-700 hover:bg-slate-800/30 transition-all group focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                style={{ background: "#111a2e" }}
              >
                <span className="text-xl mb-2.5 block">{link.icon}</span>
                <p className="text-sm font-semibold text-slate-200 group-hover:text-white transition-colors">
                  {link.label}
                </p>
                <p className="text-xs text-slate-600 mt-0.5">{link.desc}</p>
              </Link>
            ))}
          </div>

          <div className="h-4" />
        </div>
      </div>

      {/* ── Logout Modal ── */}
      {showLogoutModal && (
        <LogoutModal
          onCancel={() => setShowLogoutModal(false)}
          onConfirm={handleLogoutConfirm}
        />
      )}
    </div>
  );
}
