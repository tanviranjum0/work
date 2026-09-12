import { useNavigate } from "react-router-dom";
import { useState, useMemo, useRef, useEffect, useCallback } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

type RouteStatus = "scheduled" | "active" | "completed" | "cancelled";
type Shift = "morning" | "afternoon" | "evening" | "night" | "fullday";
type SortKey = "date" | "stops" | "boxes" | "status";

interface Shipment {
  _id: string;
  clientName: string;
  clientPhoneNumber: string;
  pickupAddress: string;
  deliveryAddress: string;
  deliverySelected: boolean;
  shipmentType: string;
  boxQuantity: number;
  driverAllocated: boolean;
  status: RouteStatus;
  deliveryShift: Shift;
  done: boolean;
  note: string;
  updatedAt: string;
}

interface OptimizedRoute {
  id: string;
  _id: string;
  deliveryShift: Shift;
  date: string; // ISO date string
  status: RouteStatus;
  shipments: Shipment[];
  initialLoad: number;
  totalBoxes: number;
  vehicleCapacity: number;
  updatedAt: string;
  shipmentType: "collection" | "delivery";
}

type ToastKind = "success" | "info" | "warning" | "danger";

interface Toast {
  id: number;
  kind: ToastKind;
  title: string;
  message: string;
}

// ─── Status meta ──────────────────────────────────────────────────────────────

const STATUS_META: Record<
  RouteStatus,
  {
    label: string;
    dot: string;
    pill: string;
    pillText: string;
  }
> = {
  scheduled: {
    label: "Scheduled",
    dot: "#f59e0b",
    pill: "bg-amber-50 text-amber-700 border-amber-200",
    pillText: "Scheduled",
  },
  active: {
    label: "Active",
    dot: "#2563eb",
    pill: "bg-blue-50  text-blue-700  border-blue-200",
    pillText: "Active",
  },
  completed: {
    label: "Completed",
    dot: "#16a34a",
    pill: "bg-green-50 text-green-700 border-green-200",
    pillText: "Completed",
  },
  cancelled: {
    label: "Cancelled",
    dot: "#dc2626",
    pill: "bg-red-50   text-red-700   border-red-200",
    pillText: "Cancelled",
  },
};

const SHIFT_META: Record<
  Shift,
  { label: string; emoji: string; color: string }
> = {
  fullday: {
    label: "Full Day",
    emoji: "🕛",
    color: "text-gray-700",
  },
  morning: { label: "Morning", emoji: "🌅", color: "text-amber-700" },
  afternoon: { label: "Afternoon", emoji: "☀️", color: "text-orange-600" },
  evening: { label: "Evening", emoji: "🌆", color: "text-purple-700" },
  night: { label: "Night", emoji: "🌙", color: "text-slate-600" },
};

// ─── Toast helpers ────────────────────────────────────────────────────────────

let toastSeq = 0;

function useToasts() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const push = useCallback(
    (kind: ToastKind, title: string, message: string) => {
      const id = ++toastSeq;
      setToasts((t) => [...t, { id, kind, title, message }]);
      setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3800);
    },
    [],
  );

  const dismiss = useCallback(
    (id: number) => setToasts((t) => t.filter((x) => x.id !== id)),
    [],
  );

  return { toasts, push, dismiss };
}

// ─── Delete confirm popover ───────────────────────────────────────────────────

function DeleteConfirm({
  route,
  onConfirm,
  onCancel,
}: {
  route: OptimizedRoute;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={ref}
      className="absolute right-0 top-full mt-2 z-50 w-64 bg-white rounded-xl border border-slate-200 shadow-xl p-4"
    >
      <p className="text-sm font-semibold text-slate-800 mb-1">
        Delete {route._id.slice(-7)}
      </p>
      <p className="text-xs text-slate-500 mb-3 leading-relaxed">
        This will permanently remove the route and all delivered shipments. This
        can&apos;t be undone.
      </p>
      <div className="flex gap-2">
        <div
          onClick={onCancel}
          className="flex-1 flex items-center justify-center  h-8 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
        >
          Cancel
        </div>
        <div
          onClick={onConfirm}
          className="flex-1 flex items-center justify-center h-8 rounded-lg bg-red-600 text-xs font-semibold text-white hover:bg-red-700 transition-colors"
        >
          Delete
        </div>
      </div>
    </div>
  );
}

// ─── Complete confirm popover ───────────────────────────────────────────────────

function CompleteConfirm({
  route,
  onConfirm,
  onCancel,
}: {
  route: OptimizedRoute;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onCancel();
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [onCancel]);

  return (
    <div
      ref={ref}
      className="absolute right-0 top-full mt-2 z-50 w-64 bg-white rounded-xl border border-slate-200 shadow-xl p-4"
    >
      <p className="text-sm font-semibold text-slate-800 mb-1">
        Complete {route._id.slice(-7)}
      </p>
      <p className="text-xs text-slate-500 mb-3 leading-relaxed">
        This will mark the route as complete and all {route.shipments.length}{" "}
        stops as completed. This can&apos;t be undone.
      </p>
      <div className="flex gap-2">
        <div
          onClick={onCancel}
          className="flex-1 flex items-center justify-center  h-8 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
        >
          Cancel
        </div>
        <div
          onClick={onConfirm}
          className="flex-1 flex items-center justify-center h-8 rounded-lg bg-green-600 text-xs font-semibold text-white hover:bg-green-700 transition-colors"
        >
          Complete
        </div>
      </div>
    </div>
  );
}

// ─── Status dropdown ─────────────────────────────────────────────────────────

function StatusDropdown({ value }: { value: RouteStatus }) {
  const meta = STATUS_META[value];

  // const ALL: RouteStatus[] = ["scheduled", "active", "completed", "cancelled"];

  return (
    <div className="relative">
      <div
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-bold transition-all select-none ${meta.pill}`}
      >
        <span
          className="w-1.5 h-1.5 rounded-full"
          style={{ background: meta.dot }}
        />
        {meta.pillText}
      </div>
    </div>
  );
}

// ─── Stop progress bar ────────────────────────────────────────────────────────

function StopProgress({ stops }: { stops: Shipment[] }) {
  const done = stops.filter((s) => s.done).length;
  const total = stops.length;
  const pct = total ? Math.round((done / total) * 100) : 0;

  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 rounded-full bg-slate-100 overflow-hidden">
        <div
          className="h-full rounded-full bg-linear-to-r from-blue-600 to-blue-400 transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-xs font-semibold text-slate-500 whitespace-nowrap tabular-nums">
        {done}/{total}
      </span>
    </div>
  );
}

// ─── Route row (desktop) + Route card (mobile) ───────────────────────────────

function RouteRow({
  route,
  isExpanded,
  onExpand,

  onComplete,
  onDelete,
  onViewMap,
}: {
  route: OptimizedRoute;
  isExpanded: boolean;
  onExpand: () => void;
  onStatusChange: (id: string, s: RouteStatus) => void;
  onComplete: (id: string, docId: string) => void;
  onDelete: (id: string, docId?: string) => void;
  onViewMap: (id: string) => void;
}) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [confirmComplete, setConfirmComplete] = useState(false);
  const shift = SHIFT_META[route.deliveryShift];
  const isFinal = route.status === "completed" || route.status === "cancelled";
  const doneStops = route.shipments.filter((s) => s.done).length;

  return (
    <>
      {/* Main row */}
      <div
        className={`group select-none grid items-center gap-3 px-5 py-4 border-b border-slate-100 transition-colors cursor-pointer
          ${isExpanded ? "bg-blue-50/40" : "hover:bg-slate-50/70"}
          grid-cols-[1fr_1fr_1fr_1fr_auto]`}
        role="button"
        aria-expanded={isExpanded}
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && onExpand()}
      >
        {/* Route ID + driver */}
        <div
          className="flex items-center gap-3 min-w-0"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="w-8 h-8 rounded-lg bg-blue-700 flex items-center justify-center shrink-0 shadow-sm shadow-blue-800/20">
            <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none">
              <path
                d="M3 12h18M3 6h6M15 6h6M3 18h6M15 18h6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold text-slate-800 leading-tight">
              {route._id.slice(-7)}
            </p>
          </div>
        </div>

        {/* Shift + date */}
        <div className="min-w-0">
          <p className={`text-xs font-semibold ${shift.color}`}>
            {shift.emoji} {shift.label}
          </p>
          <p className="text-xs text-slate-400 mt-0.5">
            {new Date(route.date).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "long",
            })}
          </p>
        </div>

        {/* Stops progress */}
        <div className="min-w-0">
          <StopProgress stops={route.shipments} />
          <p className="text-xs text-slate-400 mt-1">
            {route.shipments.length} stops · {route.initialLoad} boxes
          </p>
        </div>

        <div
          className="flex items-center gap-1.5 shrink-0 justify-center"
          onClick={(e) => e.stopPropagation()}
        >
          <StatusDropdown value={route.status} />
        </div>

        {/* Actions */}
        <div
          className="flex items-center gap-1.5 shrink-0"
          onClick={(e) => e.stopPropagation()}
        >
          {/* View map */}
          <div
            title="View on map"
            onClick={() => onViewMap(route.id)}
            className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:border-blue-300 hover:text-blue-700 hover:bg-blue-50 transition-colors"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none">
              <path
                d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13V7m0 13l6-3m-6-10l6-3m0 0l5.447 2.724A1 1 0 0121 7.618v10.764a1 1 0 01-1.447.894L15 17m0-13v13"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          {/* Complete */}
          <div className="relative">
            <button
              type="button"
              title="Mark all stops complete"
              disabled={isFinal}
              onClick={() => {
                if (!isExpanded) {
                  onExpand();
                }
                if (!isFinal) {
                  setConfirmComplete(true);
                }
              }}
              className={`w-8 h-8 rounded-lg border flex items-center justify-center transition-colors
              ${
                isFinal
                  ? "border-slate-100 text-slate-300 cursor-not-allowed"
                  : "border-slate-200 text-slate-500 hover:border-green-300 hover:text-green-700 hover:bg-green-50"
              }`}
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none">
                <path
                  d="M20 6L9 17l-5-5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            {confirmComplete && (
              <CompleteConfirm
                route={route}
                onConfirm={() => {
                  setConfirmComplete(false);
                  onComplete(route.id, route._id);
                }}
                onCancel={() => setConfirmComplete(false)}
              />
            )}
          </div>
          {/* Delete */}
          <div className="relative">
            <div
              title="Delete route"
              onClick={() => {
                if (!isExpanded) {
                  onExpand();
                }

                setConfirmDelete((v) => !v);
              }}
              className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:border-red-300 hover:text-red-600 hover:bg-red-50 transition-colors"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none">
                <path
                  d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0l-1 14a2 2 0 01-2 2H7a2 2 0 01-2-2L4 6h16z"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            {confirmDelete && (
              <DeleteConfirm
                route={route}
                onConfirm={() => {
                  setConfirmDelete(false);
                  onDelete(route.id, route._id);
                }}
                onCancel={() => setConfirmDelete(false)}
              />
            )}
          </div>

          {/* Expand chevron */}
          <span
            onClick={onExpand}
            className={`w-5 h-5 flex items-center justify-center text-slate-400 transition-transform ${isExpanded ? "rotate-180" : ""}`}
          >
            <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
              <path
                d="M4 6l4 4 4-4"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </div>
      </div>

      {/* Expanded stop list */}
      {isExpanded && (
        <div className="bg-slate-50/60 border-b border-slate-100 px-5 py-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Stop Breakdown · {doneStops}/{route.shipments.length} completed
            </p>
            <div className="flex items-center gap-2">
              <span
                className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                  route.shipmentType === "delivery"
                    ? "bg-indigo-50 text-indigo-700"
                    : "bg-teal-50 text-teal-700"
                }`}
              >
                {route.shipmentType}
              </span>
            </div>
          </div>

          <div className="grid gap-2">
            {route.shipments.map((shipment, i) => (
              <div
                key={i}
                className={`flex items-start gap-3 p-3 rounded-xl border transition-colors
                  ${
                    shipment.done
                      ? "bg-green-50/50 border-green-100"
                      : "bg-white border-slate-200"
                  }`}
              >
                {/* Sequence */}
                <span
                  className={`shrink-0 w-6 h-6 rounded-full text-[11px] font-bold flex items-center justify-center ${
                    shipment.done
                      ? "bg-green-600 text-white"
                      : "bg-blue-700 text-white"
                  }`}
                >
                  {i + 1}
                </span>

                {/* clientName + deliveryAddress */}
                <div className="flex-1 min-w-0">
                  <p
                    className={`text-sm font-semibold leading-tight ${shipment.done ? "text-green-700 line-through decoration-green-400 decoration-1" : "text-slate-800"}`}
                  >
                    {shipment.clientName}
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5 truncate">
                    {shipment.deliveryAddress}
                  </p>
                </div>

                {/* Boxes + done indicator */}
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                    {shipment.boxQuantity}{" "}
                    {shipment.boxQuantity === 1 ? "box" : "boxes"}
                  </span>
                  {shipment.done && (
                    <svg
                      className="w-4 h-4 text-green-600"
                      viewBox="0 0 16 16"
                      fill="none"
                    >
                      <circle cx="8" cy="8" r="8" fill="#dcfce7" />
                      <path
                        d="M5 8l2 2 4-4"
                        stroke="#16a34a"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* vehicleCapacity bar */}
          <div className="mt-4 pt-3 border-t border-slate-200">
            <div className="flex justify-between text-xs font-semibold text-slate-400 mb-1.5">
              <span>Vehicle Capacity</span>
              <span
                className={
                  route.initialLoad >= route.vehicleCapacity
                    ? "text-orange-600"
                    : "text-slate-500"
                }
              >
                {route.initialLoad}/{route.vehicleCapacity} boxes
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ${
                  route.totalBoxes >= route.vehicleCapacity
                    ? "bg-linear-to-r from-orange-500 to-orange-400"
                    : "bg-linear-to-r from-blue-600 to-blue-400"
                }`}
                style={{
                  width: `${Math.min((route.totalBoxes / route.vehicleCapacity) * 100, 100)}%`,
                }}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ─── Mobile card ──────────────────────────────────────────────────────────────

function MobileRouteCard({
  route,
  isExpanded,
  onExpand,
  onComplete,
  onDelete,
  onViewMap,
}: {
  route: OptimizedRoute;
  isExpanded: boolean;
  onExpand: () => void;
  onStatusChange: (id: string, s: RouteStatus) => void;
  onComplete: (id: string, docId: string) => void;
  onDelete: (id: string, docid?: string) => void;
  onViewMap: (id: string) => void;
}) {
  const [confirmDeleteMobile, setConfirmDeleteMobile] =
    useState<boolean>(false);
  const [confirmCompleteMobile, setConfirmCompleteMobile] =
    useState<boolean>(false);
  const shift = SHIFT_META[route.deliveryShift];
  const isFinal = route.status === "completed" || route.status === "cancelled";

  const onCancel = () => {
    setConfirmDeleteMobile(false);
  };

  return (
    <div
      className={`bg-white rounded-2xl border transition-all duration-150 overflow-hidden
      ${isExpanded ? "border-blue-300 shadow-md shadow-blue-100" : "border-slate-200 shadow-sm"}`}
    >
      {/* Card header */}
      <div className="w-full text-left p-4 flex items-start gap-3">
        <div className="w-9 h-9 rounded-xl bg-blue-700 flex items-center justify-center shrink-0 shadow-sm shadow-blue-800/20">
          <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none">
            <path
              d="M3 12h18M3 6h6M15 6h6M3 18h6M15 18h6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm font-bold text-slate-800">
              {route._id.slice(-7)}
            </p>
            <StatusDropdown value={route.status} />
          </div>

          <div className="mt-2 flex flex-wrap gap-2">
            <span className={`text-xs font-semibold ${shift.color}`}>
              {shift.emoji} {shift.label}
            </span>
            <span className="text-xs text-slate-400">
              {new Date(route.date).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "long",
              })}
            </span>
            <span className="text-xs text-slate-400">·</span>
            <span className="text-xs text-slate-500">
              {route.shipments.length} stops · {route.totalBoxes} boxes
            </span>
          </div>
        </div>

        <svg
          onClick={onExpand}
          className={`w-4 h-4 text-slate-400 shrink-0 mt-1 transition-transform ${isExpanded ? "rotate-180" : ""}`}
          viewBox="0 0 16 16"
          fill="none"
        >
          <path
            d="M4 6l4 4 4-4"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* Stop progress */}
      <div className="px-4 pb-3">
        <StopProgress stops={route.shipments} />
      </div>

      {/* Expanded stops */}
      {isExpanded && (
        <div className="border-t border-slate-100 p-4 space-y-2 bg-slate-50/60">
          {route.shipments.map((shipment, i) => (
            <div
              key={i}
              className={`flex items-start gap-2.5 p-2.5 rounded-xl border text-sm
                ${shipment.done ? "bg-green-50 border-green-100" : "bg-white border-slate-200"}`}
            >
              <span
                className={`w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5 ${shipment.done ? "bg-green-600 text-white" : "bg-blue-700 text-white"}`}
              >
                {i + 1}
              </span>
              <div className="flex-1 min-w-0">
                <p
                  className={`text-xs font-semibold ${shipment.done ? "line-through text-slate-400" : "text-slate-700"}`}
                >
                  {shipment.clientName}
                </p>
                <p className="text-[11px] text-slate-400 truncate">
                  {shipment.deliveryAddress}
                </p>
              </div>
              <span className="text-[11px] text-slate-400 font-semibold shrink-0">
                {shipment.boxQuantity}b
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Action row */}
      <div className="flex border-t border-slate-100 divide-x divide-slate-100">
        <div
          onClick={() => onViewMap(route.id)}
          className="flex-1 flex items-center justify-center gap-1.5 py-3 text-xs font-semibold text-slate-600 hover:bg-blue-50 hover:text-blue-700 transition-colors"
        >
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none">
            <path
              d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13V7m0 13l6-3m-6-10l6-3m0 0l5.447 2.724A1 1 0 0121 7.618v10.764a1 1 0 01-1.447.894L15 17m0-13v13"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Map
        </div>

        <button
          disabled={isFinal}
          onClick={() => !isFinal && setConfirmCompleteMobile(true)}
          className={`flex-1 flex items-center justify-center gap-1.5 py-3 text-xs font-semibold transition-colors
            ${isFinal ? "text-slate-300 cursor-not-allowed" : "text-slate-600 hover:bg-green-50 hover:text-green-700"}`}
        >
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none">
            <path
              d="M20 6L9 17l-5-5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Complete
        </button>

        <div className="flex-1 relative ">
          <div
            onClick={() => {
              setConfirmDeleteMobile((v) => !v);
            }}
            className="w-full flex items-center justify-center gap-1.5 py-3 text-xs font-semibold text-slate-600 hover:bg-red-50 hover:text-red-600 transition-colors"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none">
              <path
                d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0l-1 14a2 2 0 01-2 2H7a2 2 0 01-2-2L4 6h16z"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Delete
          </div>
          {confirmDeleteMobile && (
            /* Backdrop */
            <div
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              style={{
                background: "rgba(0,0,0,0.7)",
                backdropFilter: "blur(6px)",
              }}
            >
              {/* Card — stop propagation so clicking inside doesn't close */}
              <div
                className="w-full max-w-sm rounded-2xl border border-slate-700/80 p-7 shadow-2xl"
                style={{ background: "#111a2e" }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Icon */}
                <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-5">
                  <svg
                    className="w-5 h-5 text-red-400"
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
                </div>

                <h2 className="text-lg font-bold text-white text-center leading-tight mb-2">
                  Delete Route?
                </h2>
                <p className="text-sm text-slate-400 text-center leading-relaxed mb-7">
                  This will permanently remove the route and all delivered
                  shipments. This can&apos;t be undone.
                </p>

                <div className="flex gap-3">
                  <button
                    onClick={onCancel}
                    className="flex-1 h-11 rounded-xl border border-slate-600 text-sm font-semibold text-slate-300 hover:bg-slate-700/50 hover:border-slate-500 hover:text-white transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      setConfirmDeleteMobile(false);
                      onDelete(route.id, route._id);
                    }}
                    className="flex-1 h-11 rounded-xl bg-red-600 text-sm font-bold text-white hover:bg-red-500 active:scale-[.97] transition-all shadow-lg shadow-red-900/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
                  >
                    Yes, Delete
                  </button>
                </div>
              </div>
            </div>
          )}

          {confirmCompleteMobile && (
            /* Backdrop */
            <div
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              style={{
                background: "rgba(0,0,0,0.7)",
                backdropFilter: "blur(6px)",
              }}
            >
              {/* Card — stop propagation so clicking inside doesn't close */}
              <div
                className="w-full max-w-sm rounded-2xl border border-slate-700/80 p-7 shadow-2xl"
                style={{ background: "#111a2e" }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Icon */}
                <div className="w-12 h-12 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center mx-auto mb-5">
                  <svg
                    width="48px"
                    height="48px"
                    viewBox="0 0 1024 1024"
                    fill="#05df72"
                    className="icon"
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                    stroke="#05df72"
                  >
                    <g id="SVGRepo_bgCarrier" strokeWidth="0" />

                    <g
                      id="SVGRepo_tracerCarrier"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />

                    <g id="SVGRepo_iconCarrier">
                      <path
                        d="M824.8 1003.2H203.2c-12.8 0-25.6-2.4-37.6-7.2-11.2-4.8-21.6-12-30.4-20.8-8.8-8.8-16-19.2-20.8-30.4-4.8-12-7.2-24-7.2-37.6V260c0-12.8 2.4-25.6 7.2-37.6 4.8-11.2 12-21.6 20.8-30.4 8.8-8.8 19.2-16 30.4-20.8 12-4.8 24-7.2 37.6-7.2h94.4v48H203.2c-26.4 0-48 21.6-48 48v647.2c0 26.4 21.6 48 48 48h621.6c26.4 0 48-21.6 48-48V260c0-26.4-21.6-48-48-48H730.4v-48H824c12.8 0 25.6 2.4 37.6 7.2 11.2 4.8 21.6 12 30.4 20.8 8.8 8.8 16 19.2 20.8 30.4 4.8 12 7.2 24 7.2 37.6v647.2c0 12.8-2.4 25.6-7.2 37.6-4.8 11.2-12 21.6-20.8 30.4-8.8 8.8-19.2 16-30.4 20.8-11.2 4.8-24 7.2-36.8 7.2z"
                        fill=""
                      />

                      <path
                        d="M752.8 308H274.4V152.8c0-32.8 26.4-60 60-60h61.6c22.4-44 67.2-72.8 117.6-72.8 50.4 0 95.2 28.8 117.6 72.8h61.6c32.8 0 60 26.4 60 60v155.2m-430.4-48h382.4V152.8c0-6.4-5.6-12-12-12H598.4l-5.6-16c-12-33.6-43.2-56-79.2-56s-67.2 22.4-79.2 56l-5.6 16H334.4c-6.4 0-12 5.6-12 12v107.2zM432.8 792c-6.4 0-12-2.4-16.8-7.2L252.8 621.6c-4.8-4.8-7.2-10.4-7.2-16.8s2.4-12 7.2-16.8c4.8-4.8 10.4-7.2 16.8-7.2s12 2.4 16.8 7.2L418.4 720c4 4 8.8 5.6 13.6 5.6s10.4-1.6 13.6-5.6l295.2-295.2c4.8-4.8 10.4-7.2 16.8-7.2s12 2.4 16.8 7.2c9.6 9.6 9.6 24 0 33.6L449.6 784.8c-4.8 4-11.2 7.2-16.8 7.2z"
                        fill=""
                      />
                    </g>
                  </svg>
                </div>

                <h2 className="text-lg font-bold text-white text-center leading-tight mb-2">
                  Complete Route?
                </h2>
                <p className="text-sm text-slate-400 text-center leading-relaxed mb-7">
                  This will mark the route as complete and all completed
                  {route.shipments.length + " "} stops. This can&apos;t be
                  undone.
                </p>

                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setConfirmCompleteMobile(false);
                    }}
                    className="flex-1 h-11 rounded-xl border border-slate-600 text-sm font-semibold text-slate-300 hover:bg-slate-700/50 hover:border-slate-500 hover:text-white transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      setConfirmCompleteMobile(false);
                      onComplete(route.id, route._id);
                    }}
                    className="flex-1 h-11 rounded-xl bg-green-600 text-sm font-bold text-white hover:bg-green-500 active:scale-[.97] transition-all shadow-lg shadow-green-900/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500"
                  >
                    Complete
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Toast stack ─────────────────────────────────────────────────────────────

function ToastStack({
  toasts,
  onDismiss,
}: {
  toasts: Toast[];
  onDismiss: (id: number) => void;
}) {
  const COLORS: Record<ToastKind, string> = {
    success: "bg-white border-green-200 text-green-700",
    info: "bg-white border-blue-200  text-blue-700",
    warning: "bg-white border-amber-200 text-amber-700",
    danger: "bg-white border-red-200   text-red-700",
  };
  const DOTS: Record<ToastKind, string> = {
    success: "bg-green-500",
    info: "bg-blue-500",
    warning: "bg-amber-500",
    danger: "bg-red-500",
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-[calc(100vw-40px)]">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`flex items-start gap-3 border rounded-xl px-4 py-3 shadow-lg min-w-65 max-w-sm ${COLORS[t.kind]}`}
        >
          <span
            className={`w-2 h-2 rounded-full shrink-0 mt-1.5 ${DOTS[t.kind]}`}
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold leading-tight text-slate-800">
              {t.title}
            </p>
            <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
              {t.message}
            </p>
          </div>
          <div
            onClick={() => onDismiss(t.id)}
            className="text-slate-300 hover:text-slate-500 shrink-0 mt-0.5 text-base leading-none"
          >
            ×
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Filter tabs ──────────────────────────────────────────────────────────────

function FilterTabs({
  active,
  onChange,
  counts,
}: {
  active: RouteStatus | "all";
  onChange: (f: RouteStatus | "all") => void;
  counts: Record<string, number>;
}) {
  const tabs: { id: RouteStatus | "all"; label: string }[] = [
    { id: "all", label: "All" },
    { id: "active", label: "Active" },
    { id: "scheduled", label: "Scheduled" },
    { id: "completed", label: "Completed" },
    { id: "cancelled", label: "Cancelled" },
  ];

  return (
    <div
      className="flex gap-2 overflow-x-auto pb-1 scrollbar-none"
      role="tablist"
    >
      {tabs.map((t) => {
        const isActive = active === t.id;
        return (
          <div
            key={t.id}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(t.id)}
            className={[
              "inline-flex cursor-pointer items-center gap-1.5 px-3.5 py-2 rounded-full border text-xs font-semibold whitespace-nowrap transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
              isActive
                ? "bg-blue-700 border-blue-700 text-white shadow-sm shadow-blue-800/20"
                : "bg-white border-slate-200 text-slate-600 hover:border-slate-300",
            ].join(" ")}
          >
            {t.label}
            <span
              className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-4.5 text-center ${isActive ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"}`}
            >
              {counts[t.id] ?? 0}
            </span>
          </div>
        );
      })}
    </div>
  );
}
const SortIcon = ({
  k,
  sortKey,
  sortDesc,
}: {
  k: SortKey;
  sortKey: SortKey;
  sortDesc: boolean;
}) => (
  <svg
    className={`w-3 h-3 inline ml-0.5 transition-transform ${sortKey === k && sortDesc ? "rotate-180" : ""} ${sortKey !== k ? "opacity-30" : "text-blue-600"}`}
    viewBox="0 0 12 12"
    fill="none"
  >
    <path
      d="M6 2v8M3 7l3 3 3-3"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
// ─── Main Page ────────────────────────────────────────────────────────────────

export default function Routes() {
  const [routes, setRoutes] = useState<OptimizedRoute[]>([]);
  const [totalBoxesOnTransit, setTotalBoxesOnTransit] = useState<number>(0);
  const [filterStatus, setFilterStatus] = useState<RouteStatus | "all">("all");
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [sortKey, setSortKey] = useState<SortKey>("status");
  const [sortDesc, setSortDesc] = useState(false);
  const router = useNavigate();
  //handle initial render

  const handleInitialRender = async () => {
    const result = await fetch("/api/routes/all", {
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
    if (result.ok) {
      const initialRoutes: OptimizedRoute[] = [];
      setTotalBoxesOnTransit(0);
      data.map((route: OptimizedRoute, index: number) => {
        const shipments: Shipment[] = [];
        if (route.status == "active") {
          route.shipments.map((shipment: Shipment) => {
            if ((shipment.status as string) === "transit") {
              setTotalBoxesOnTransit((c) => c + shipment.boxQuantity);
            }
            shipments.push({
              _id: shipment._id,
              clientName: shipment.clientName,
              clientPhoneNumber: shipment.clientPhoneNumber,
              pickupAddress: shipment.pickupAddress,
              deliveryAddress: shipment.deliveryAddress,
              deliverySelected: shipment.deliverySelected,
              shipmentType: shipment.shipmentType,
              boxQuantity: shipment.boxQuantity,
              driverAllocated: shipment.driverAllocated,
              status: shipment.status,
              deliveryShift: shipment.deliveryShift,
              note: shipment.note,
              done: (shipment.status as string) === "delivered" ? true : false,
              updatedAt: shipment.updatedAt,
            });
          });
        } else {
          route.shipments.map((shipment: Shipment) => {
            shipments.push({
              _id: shipment._id,
              clientName: shipment.clientName,
              clientPhoneNumber: shipment.clientPhoneNumber,
              pickupAddress: shipment.pickupAddress,
              deliveryAddress: shipment.deliveryAddress,
              deliverySelected: shipment.deliverySelected,
              shipmentType: shipment.shipmentType,
              boxQuantity: shipment.boxQuantity,
              driverAllocated: shipment.driverAllocated,
              status: shipment.status,
              deliveryShift: shipment.deliveryShift,
              note: shipment.note,
              done: (shipment.status as string) === "delivered" ? true : false,
              updatedAt: shipment.updatedAt,
            });
          });
        }

        initialRoutes.push({
          id: (index + 1).toString(),
          _id: route._id,
          deliveryShift: route.deliveryShift,
          date: route.updatedAt,
          initialLoad: route.initialLoad,
          status: route.status,
          totalBoxes: route.totalBoxes,
          vehicleCapacity: route.vehicleCapacity,
          shipmentType: route.shipmentType,
          shipments,
          updatedAt: route.updatedAt,
        });
      });
      setRoutes(initialRoutes);
    } else {
      if (data.message == "Unauthorized: Invalid token") {
        router("/login");
      }
    }
  };

  const { toasts, push: pushToast, dismiss: dismissToast } = useToasts();

  // ── Counts ──
  const counts = useMemo(() => {
    const c: Record<string, number> = { all: routes.length };
    (
      ["scheduled", "active", "completed", "cancelled"] as RouteStatus[]
    ).forEach((s) => (c[s] = routes.filter((r) => r.status === s).length));
    return c;
  }, [routes]);

  useEffect(() => {
    const cachedUser = localStorage.getItem("user");
    if (cachedUser) {
      handleInitialRender();
    } else {
      router("/login");
    }
  }, [router]);
  // ── Filtered + sorted list ──
  const displayed = useMemo(() => {
    let list = routes.filter((r) => {
      const matchStatus = filterStatus === "all" || r.status === filterStatus;
      const q = search.trim().toLowerCase();
      const matchSearch =
        !q ||
        r._id.toLowerCase().includes(q) ||
        r.shipments.some(
          (s) =>
            s.clientName.toLowerCase().includes(q) ||
            s.deliveryAddress.toLowerCase().includes(q),
        );
      return matchStatus && matchSearch;
    });

    list = [...list].sort((a, b) => {
      let diff = 0;
      if (sortKey === "date") diff = a.date.localeCompare(b.date);
      if (sortKey === "stops") diff = a.shipments.length - b.shipments.length;
      if (sortKey === "boxes") diff = a.totalBoxes - b.totalBoxes;
      if (sortKey === "status") diff = a.status.localeCompare(b.status);
      return sortDesc ? -diff : diff;
    });

    return list;
  }, [routes, filterStatus, search, sortKey, sortDesc]);

  // ── Handlers ──
  const handleStatusChange = (id: string, status: RouteStatus) => {
    const route = routes.find((r) => r.id === id);
    setRoutes((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
    pushToast(
      "info",
      "Status updated",
      `${route?._id} is now ${STATUS_META[status].label}.`,
    );
  };

  const handleComplete = async (id: string, docId: string) => {
    const result = await fetch("/api/routes/complete/" + docId, {
      method: "POST",
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
      pushToast(
        "danger",
        "Error completing route",
        data.message || "Failed to complete route",
      );
      return;
    }
    const route = routes.find((r) => r.id === id);
    setRoutes((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              status: "completed",
              stops: r.shipments.map((s) => ({ ...s, done: true })),
            }
          : r,
      ),
    );
    pushToast(
      "success",
      "Route completed",
      `${route?._id} marked as completed · all ${route?.shipments.length} stops done.`,
    );
  };

  const handleDelete = async (id: string, docId?: string) => {
    const result = await fetch("/api/routes/delete/" + docId, {
      method: "DELETE",
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
      pushToast(
        "danger",
        "Error deleting route",
        data.message || "Failed to delete route",
      );
    } else {
      setRoutes((prev) => prev.filter((r) => r.id !== id));
      if (expandedId === id) setExpandedId(null);
      pushToast("danger", "Route deleted", `${data?.message}`);
    }
  };

  const handleViewMap = (id: string) => {
    const route = routes.find((r) => r.id === id);
    pushToast("info", "Opening map", `Loading route map for ${route?._id}…`);
    router(`/optimized-route/${route?._id}`);
  };

  const toggleExpand = (id: string) =>
    setExpandedId((prev) => (prev === id ? null : id));

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortDesc((d) => !d);
    else {
      setSortKey(key);
      setSortDesc(true);
    }
  };

  const totalStopsToday = routes.reduce((s, r) => s + r.shipments.length, 0);
  return (
    <div className="bg-[#0b1220] min-h-screen ">
      <main className="bg-[#0b1220] max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        {/* ── Page header ── */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <p className="text-[10px] font-bold tracking-widest text-gray-200 uppercase mb-1">
              Fleet Management
            </p>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-300 tracking-tight">
              Routes
            </h1>
            <p className="text-sm text-slate-300 mt-1">
              {routes.length} optimized routes · {counts.active} active ·{" "}
              {counts.scheduled} scheduled
            </p>
          </div>
          <a
            href="/get-route"
            className="inline-flex items-center gap-2 h-10 px-4 rounded-xl bg-blue-700 text-white text-sm font-bold hover:bg-blue-800 active:scale-[.98] transition-all shadow-md shadow-blue-800/20 hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 5v14M5 12h14"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
              />
            </svg>
            New Route
          </a>
        </div>

        {/* ── KPI strip ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            {
              label: "Active runs",
              value: counts.active ?? 0,
              unit: "routes",
              color: "text-blue-700",
            },
            {
              label: "Stops today",
              value: totalStopsToday,
              unit: "stops",
              color: "text-slate-800",
            },
            {
              label: "Boxes en route",
              value: totalBoxesOnTransit,
              unit: "boxes",
              color: "text-slate-800",
            },
            {
              label: "Completed",
              value: counts.completed ?? 0,
              unit: "routes",
              color: "text-green-700",
            },
          ].map((kpi) => (
            <div
              key={kpi.label}
              className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm"
            >
              <p className="text-xs font-semibold text-slate-400">
                {kpi.label}
              </p>
              <p className={`text-2xl font-extrabold mt-0.5 ${kpi.color}`}>
                {kpi.value}
              </p>
              <p className="text-xs text-slate-400 mt-0.5">{kpi.unit}</p>
            </div>
          ))}
        </div>

        {/* ── Toolbar ── */}
        <div className="flex flex-col gap-3">
          {/* Search */}
          <div className="relative max-w-sm">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
              <svg className="w-4 h-4" viewBox="0 0 20 20" fill="none">
                <circle
                  cx="9"
                  cy="9"
                  r="6"
                  stroke="currentColor"
                  strokeWidth="1.8"
                />
                <path
                  d="M13.5 13.5l3 3"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
            </span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search Routes, Addresses, Client Names…"
              className="w-full h-10 pl-9 pr-8 rounded-xl border border-slate-200 text-sm font-medium text-slate-900  bg-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
            />
            {search && (
              <div
                onClick={() => setSearch("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-400 text-sm leading-none transition-colors"
              >
                ×
              </div>
            )}
          </div>

          {/* Filter tabs */}
          <FilterTabs
            active={filterStatus}
            onChange={setFilterStatus}
            counts={counts}
          />
        </div>

        {/* ── Desktop table ── */}
        <div className="hidden md:block bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {/* Table head */}
          {displayed.length > 0 && (
            <div
              className="grid px-5 py-3 border-b border-slate-100 bg-slate-50/60 text-[11px] font-bold uppercase tracking-wider text-slate-400
              grid-cols-[1fr_1fr_1fr_1fr_auto]"
            >
              <span>Route / Driver</span>
              <div
                onClick={() => handleSort("date")}
                className="text-left hover:text-slate-600 transition-colors"
              >
                Shift / Date{" "}
                <SortIcon k="date" sortKey={sortKey} sortDesc={sortDesc} />
              </div>
              <div
                onClick={() => handleSort("stops")}
                className="text-left hover:text-slate-600 transition-colors"
              >
                Progress{" "}
                <SortIcon k="stops" sortKey={sortKey} sortDesc={sortDesc} />
              </div>
              {/* <div
                onClick={() => handleSort("boxes")}
                className="text-left hover:text-slate-600 transition-colors hidden lg:block"
              >
                Distance{" "}
                <SortIcon k="boxes" sortKey={sortKey} sortDesc={sortDesc} />
              </div> */}
              <div
                onClick={() => handleSort("status")}
                className="text-left hover:text-slate-600 transition-colors"
              >
                Status{" "}
                <SortIcon k="status" sortKey={sortKey} sortDesc={sortDesc} />
              </div>
              <span className="text-right pr-1">Actions</span>
            </div>
          )}

          {displayed.length === 0 ? (
            <div className="py-16 flex flex-col items-center gap-3 text-center">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
                <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13V7m0 13l6-3m-6-10l6-3m0 0l5.447 2.724A1 1 0 0121 7.618v10.764a1 1 0 01-1.447.894L15 17m0-13v13"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <p className="text-sm font-bold text-slate-700">
                {search || filterStatus !== "all"
                  ? "No routes match"
                  : "No routes yet"}
              </p>
              <p className="text-xs text-slate-400 max-w-xs leading-relaxed">
                {search || filterStatus !== "all"
                  ? "Try a different search or clear the filter."
                  : "Generate your first route from the Route Configuration page."}
              </p>
              {(search || filterStatus !== "all") && (
                <div
                  onClick={() => {
                    setSearch("");
                    setFilterStatus("all");
                  }}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-800 underline underline-offset-2 transition-colors"
                >
                  Clear filters
                </div>
              )}
            </div>
          ) : (
            displayed.map((route) => (
              <RouteRow
                key={route.id}
                route={route}
                isExpanded={expandedId === route.id}
                onExpand={() => toggleExpand(route.id)}
                onStatusChange={handleStatusChange}
                onComplete={handleComplete}
                onDelete={handleDelete}
                onViewMap={handleViewMap}
              />
            ))
          )}
        </div>

        {/* ── Mobile cards ── */}
        <div className="md:hidden space-y-3">
          {displayed.length === 0 ? (
            <div className="py-12 flex flex-col items-center gap-3 text-center">
              <p className="text-sm font-bold text-slate-700">
                No routes match
              </p>
              <p className="text-xs text-slate-400">
                Clear your search or filter to see all routes.
              </p>
              <div
                onClick={() => {
                  setSearch("");
                  setFilterStatus("all");
                }}
                className="text-xs font-semibold text-blue-600 underline underline-offset-2"
              >
                Clear filters
              </div>
            </div>
          ) : (
            displayed.map((route) => (
              <MobileRouteCard
                key={route.id}
                route={route}
                isExpanded={expandedId === route.id}
                onExpand={() => toggleExpand(route.id)}
                onStatusChange={handleStatusChange}
                onComplete={handleComplete}
                onDelete={handleDelete}
                onViewMap={handleViewMap}
              />
            ))
          )}
        </div>

        {/* Result count */}
        {displayed.length > 0 && (
          <p className="text-xs text-slate-400 text-center pb-2">
            Showing {displayed.length} of {routes.length} routes
          </p>
        )}
      </main>

      <ToastStack toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
