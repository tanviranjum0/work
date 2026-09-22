import { useEffect, useState, useMemo } from "react";
import { debounce } from "lodash";

import { useNavigate } from "react-router-dom";

// ─── Types ────────────────────────────────────────────────────────────────────

type ShipmentType = "collection" | "delivery" | "mixed";
type DeliveryShift = "morning" | "afternoon" | "evening" | "night" | "fullday";
const IconTruck = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="#1447e6">
    <path
      d="M3 16V6a1 1 0 011-1h10a1 1 0 011 1v10M3 16h12M3 16a2 2 0 104 0M15 16a2 2 0 104 0M15 9h3l3 3v4h-2"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
interface Order {
  pickupAddress: string;
  createdAt: string;
  _id: string;
  updatedAt: string;
  routeNumber: string;
  deliveryAddress: string;
  deliverySelected: { lat: number; lng: number } | null;
  boxQuantity: number;
  OwnerRef: string;
  clientName: string;
  shipmentType: ShipmentType;
  status: string;
  driverAllocated: boolean;
  clientPhoneNumber: number;
  deliveryShift: DeliveryShift;
  note: string;
  isUrgent?: boolean;
}

interface FormState {
  shipmentType: ShipmentType;
  capacity: string;
  shift: DeliveryShift;
}

type SubmitPhase = "idle" | "calculating" | "done";

// ─── Constants ────────────────────────────────────────────────────────────────

// const WAREHOUSE = "Izaäk Enschedéweg 50, 2031 CS Haarlem, Netherlands";

const SHIFT_CONFIG: Record<
  DeliveryShift,
  {
    label: string;
    hours: string;
    emoji: string;
    color: string;
    bg: string;
    border: string;
  }
> = {
  fullday: {
    label: "Full Day",
    hours: "0:00AM – 23:59PM",
    emoji: "🕛",
    color: "text-gray-700",
    bg: "bg-gray-50",
    border: "border-gray-200",
  },
  morning: {
    label: "Morning",
    hours: "06:00AM – 12:00PM",
    emoji: "🌅",
    color: "text-amber-700",
    bg: "bg-amber-50",
    border: "border-amber-200",
  },
  afternoon: {
    label: "Afternoon",
    hours: "12:00PM – 18:00PM",
    emoji: "☀️",
    color: "text-orange-700",
    bg: "bg-orange-50",
    border: "border-orange-200",
  },
  evening: {
    label: "Evening",
    hours: "18:00PM – 12:00AM",
    emoji: "🌆",
    color: "text-purple-700",
    bg: "bg-purple-50",
    border: "border-purple-200",
  },
  night: {
    label: "Night",
    hours: "12:00AM – 06:00AM",
    emoji: "🌙",
    color: "text-slate-700",
    bg: "bg-slate-100",
    border: "border-slate-300",
  },
};

// ─── Smart default shift ──────────────────────────────────────────────────────

// function getDefaultShift(): DeliveryShift {
//   const h = new Date().getHours();
//   if (h >= 6 && h < 12) return "morning";
//   if (h >= 12 && h < 18) return "afternoon";
//   if (h >= 18 && h < 24) return "evening";
//   return "night";
// }

// ─── Tiny icons ───────────────────────────────────────────────────────────────

const IcoTruck = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path
      d="M3 17V7a1 1 0 011-1h10a1 1 0 011 1v10M3 17h12M3 17a2 2 0 104 0M15 17a2 2 0 104 0M15 10h3l3 3v4h-2"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
const IcoBox = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
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
);
const IcoClock = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
    <path
      d="M12 7v5l3 3"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
const IcoChevron = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path
      d="M4 6l4 4 4-4"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
const IcoRoute = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path
      d="M3 12h18M3 6h6M15 6h6M3 18h6M15 18h6"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);
const IcoSpin = () => (
  <svg
    className="animate-spin"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
  >
    <circle
      cx="12"
      cy="12"
      r="10"
      stroke="rgba(255,255,255,.3)"
      strokeWidth="3"
    />
    <path
      d="M12 2a10 10 0 0110 10"
      stroke="white"
      strokeWidth="3"
      strokeLinecap="round"
    />
  </svg>
);
const IcoCheck = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path
      d="M3 8l4 4 6-7"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
const IcoAlert = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path
      d="M12 9v4M12 17h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// ─── Main component ───────────────────────────────────────────────────────────

export default function GetRoutePage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [routeError, setRouteError] = useState<string>("");
  const [routeType, setRouteType] = useState("mixed");
  const [routeNumber, setRouteNumber] = useState("");
  const [routeSuggestions, setRouteSuggestions] = useState<string[]>([]);
  const [routeNumberBasedOrders, setRouteNumberBasedOrders] = useState<Order[]>(
    [],
  );
  const [loadingShipments, setLoadingShipments] = useState<boolean>(false);
  const router = useNavigate();

  const handleGetRouteSuggestion = async (routeNumber: string) => {
    setLoadingShipments(true);
    const suggestions = await fetch("/api/shipments/routeid", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ routeNumber: routeNumber }),
    });
    const result = await suggestions.json();
    if (result.message == "Unauthorized: No token provided") {
      router("/login");
    }
    setRouteSuggestions(result);
    setLoadingShipments(false);
  };
  const loadInitialOrderData = async (): Promise<void> => {
    const result: Response = await fetch("/api/routes/initial", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    const data = await result.json();
    if (data.length == 0) {
      setRouteType("number");
    }
    if (result.ok) {
      handleGetRouteSuggestion("");
      setOrders([]);
      data.map((shipment: Order) => {
        setOrders((s) => [...s, shipment]);
      });
    } else {
      if (data.message == "Unauthorized: Invalid token") {
        router("/login");
      }
    }
  };

  // ── Form state ──────────────────────────────────────────────────────────────
  const [form, setForm] = useState<FormState>({
    shipmentType: "mixed",
    capacity: "240",
    shift: "fullday",
  });
  const [capacityErr, setCapacityErr] = useState<string>("");

  // ── Submit state ────────────────────────────────────────────────────────────
  const [phase, setPhase] = useState<SubmitPhase>("idle");

  // ── Smart default shift ─────────────────────────────────────────────────────
  useEffect(() => {
    const cachedUser = localStorage.getItem("user");
    if (cachedUser) {
      loadInitialOrderData();
    } else {
      router("/login");
    }
  }, [router]);
  // ── Derived helpers ─────────────────────────────────────────────────────────
  const parsedCap: number = parseInt(form.capacity, 10);
  const capValid: boolean =
    form.capacity !== "" &&
    !isNaN(parsedCap) &&
    parsedCap >= 1 &&
    parsedCap <= 999;

  const poolStats = useMemo(() => {
    const m = orders.filter((o) => o.deliveryShift === form.shift);
    return {
      count: m.length,
      totalBoxes: m.reduce((s, o) => s + o.boxQuantity, 0),
    };
  }, [form.shift]);

  const currentShift = SHIFT_CONFIG[form.shift];

  // ── Handlers ────────────────────────────────────────────────────────────────

  const handleCapacity = (v: string) => {
    setForm((p) => ({ ...p, capacity: v }));
    const n = parseInt(v, 10);
    if (v === "" || isNaN(n) || n < 1) {
      setCapacityErr("Enter a number between 1 and 999.");
      return;
    }
    if (n > 999) {
      setCapacityErr("Maximum capacity is 999.");
      return;
    }
    setCapacityErr("");
  };

  const handleSubmit = async () => {
    if (!form.capacity || !form.shipmentType || !form.shift) {
      setRouteError("All input fields are required!");
    }
    setPhase("calculating");
    if (routeType == "number") {
      if (routeNumberBasedOrders.length == 0) {
        setPhase("idle");
        return setRouteError("No orders found for this route number.");
      }
      const result = await fetch("/api/routes/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          vehicleCapacity: Number(form.capacity),
          routeNumber: routeNumber,
          deliveryShift: "fullday",
          routeType: "number",
        }),
      });
      const data = await result.json();
      if (data.message == "Unauthorized: No token provided") {
        router("/login");
      }
      if (result.ok && data) {
        localStorage.setItem("data", JSON.stringify(data));
        setPhase("idle");
        router(`/optimized-route/${data.route._id}`);
      }
      setPhase("idle");
      return;
    }
    if (!capValid) {
      setPhase("idle");
      setCapacityErr("Enter a valid capacity first.");
      return;
    }

    const result = await fetch("/api/routes/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        deliveryShift: form.shift,
        vehicleCapacity: Number(form.capacity),
        routeType: "mixed",
      }),
    });
    const data = await result.json();

    if (data.message == "Unauthorized: No token provided") {
      router("/login");
    }
    if (result.ok) {
      setPhase("idle");
      router(`/optimized-route/${data.route._id}`);
    }
    setPhase("idle");
  };

  // ── Live clock display ──────────────────────────────────────────────────────
  const [clock, setClock] = useState("");
  useEffect(() => {
    const tick = () =>
      setClock(
        new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      );
    tick();
    const id = setInterval(tick, 10000);
    return () => clearInterval(id);
  }, []);

  const getRouteNumberBasedShipements = useMemo(
    () =>
      debounce(async (inputValue: string) => {
        try {
          const response = await fetch(
            `/api/shipments/specific/routenumber?routeNumber=${inputValue}`,
            {
              method: "GET",
              headers: { "Content-Type": "application/json" },
              credentials: "include",
            },
          );
          const data = await response.json();
          if (data.message == "Unauthorized: No token provided") {
            router("/login");
          }
          setRouteNumberBasedOrders(data);
          setLoadingShipments(false);
        } catch (error) {
          setLoadingShipments(false);

          console.error(error);
        }
      }, 1000),
    [],
  );

  return (
    <div className="min-h-screen bg-[#0b1220] flex flex-col">
      {/* ── Sticky nav ─────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-30  backdrop-blur-md border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
          <span className="flex items-center gap-1 text-slate-400">
            <IcoClock /> {clock}
          </span>
          <span className="hidden sm:block text-slate-200">·</span>
          <span
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border ${currentShift.color} ${currentShift.bg} ${currentShift.border}`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full bg-current ${phase === "idle" ? "animate-pulse" : ""}`}
            />
            {currentShift.emoji} {currentShift.label}
          </span>
          {/* </div> */}
        </div>
      </header>

      {/* ── Page body ──────────────────────────────────────────────────────── */}
      <main className="flex-1 flex flex-col items-center px-4 sm:px-6 py-10 sm:py-14 gap-6">
        <div className="w-full max-w-xl">
          {/* Page heading */}
          <div className="mb-7">
            <p className="text-[11px] font-bold tracking-[0.12em] text-blue-600 uppercase mb-2 select-none">
              Route Configuration
            </p>
            <h1 className="text-2xl sm:text-[28px] font-extrabold text-slate-300 tracking-tight leading-tight">
              Configure your run
            </h1>
            <p className="mt-2 text-sm text-slate-400 leading-relaxed">
              Set your vehicle&apos;s capacity and target shift. Feitsma
              Verhuizingen packs the best possible order list and routes your
              day.
            </p>
          </div>

          {/* ════════════════ FORM CARD ════════════════ */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            {/* Card header */}
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between gap-3 flex-wrap">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-600">
                <IcoTruck /> Vehicle &amp; Shift
              </div>
              <span className="text-xs text-slate-400 font-medium">
                {orders.length} orders in pool
              </span>
            </div>

            <div className="p-6 sm:p-7 space-y-7">
              {/* ── Shipment Type ─────────────────────────── */}
              <fieldset>
                <legend className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-3">
                  <span className="text-blue-600">
                    <IcoTruck />
                  </span>
                  Shipment type
                </legend>
                <div className="grid grid-cols-2 gap-3" role="radiogroup">
                  <div
                    onClick={() => setRouteType("mixed")}
                    className={`relative flex flex-col items-center gap-2.5 py-5 px-4 rounded-xl border-[1.5px] text-sm font-semibold transition-all duration-150 cursor-pointer select-none focus:outline-none focus-visible:ring-2 ${routeType == "mixed" ? " focus-visible:ring-blue-500 focus-visible:ring-offset-1 border-blue-600 bg-blue-700 text-white" : "border-gray-300 bg-white text-gray-700"} shadow-md shadow-blue-800/20`}
                  >
                    <span className={"flex text-blue-200"}>
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <path
                          d="M3 17V7a1 1 0 011-1h10a1 1 0 011 1v10M3 17h12M3 17a2 2 0 104 0M15 17a2 2 0 104 0M15 10h3l3 3v4h-2"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>

                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <path
                          d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2v-4M9 21H5a2 2 0 01-2-2v-4m0 0h18"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                        />
                      </svg>
                    </span>
                    <span className="capitalize leading-none">Mixed</span>
                    <span className="absolute top-2 right-2 text-white/60">
                      <IcoCheck />
                    </span>
                  </div>
                  {/* divided */}
                  <div
                    onClick={() => setRouteType("number")}
                    className={`relative flex flex-col items-center gap-2.5 py-5 px-4 rounded-xl border-[1.5px] text-sm font-semibold transition-all duration-150 cursor-pointer select-none focus:outline-none focus-visible:ring-2 ${routeType == "mixed" ? "border-gray-300 bg-white text-gray-700" : " focus-visible:ring-blue-500 focus-visible:ring-offset-1 border-blue-600 bg-blue-700 text-white"} shadow-md shadow-blue-800/20`}
                  >
                    <span className={"flex text-blue-200"}>
                      <svg
                        width="24px"
                        height="24px"
                        viewBox="0 0 24 24"
                        fill="#93C5FD"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M12 4C9.243 4 7 6.243 7 9h2c0-1.654 1.346-3 3-3s3 1.346 3 3c0 1.069-.454 1.465-1.481 2.255-.382.294-.813.626-1.226 1.038C10.981 13.604 10.995 14.897 11 15v2h2v-2.009c0-.024.023-.601.707-1.284.32-.32.682-.598 1.031-.867C15.798 12.024 17 11.1 17 9c0-2.757-2.243-5-5-5zm-1 14h2v2h-2z" />
                      </svg>
                    </span>
                    <span className="capitalize leading-none">
                      Number Based
                    </span>

                    <span className="absolute top-2 right-2 text-white/60">
                      <IcoCheck />
                    </span>
                  </div>
                </div>
              </fieldset>

              {/* ── Vehicle Capacity ──────────────────────── */}
              {routeType == "mixed" && (
                <>
                  <div>
                    <label
                      htmlFor="shift"
                      className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-1.5 select-none"
                    >
                      <span className="text-blue-600">
                        <IcoBox />
                      </span>
                      Select Vehicle Type
                    </label>
                    <div className="relative">
                      <select
                        id="vehicle-type-select"
                        value={form.capacity}
                        onChange={(e) => {
                          setForm((p) => ({
                            ...p,
                            capacity: e.target.value,
                          }));
                        }}
                        className="w-full h-12 rounded-xl border-[1.5px] border-slate-200 hover:border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 px-4 pr-10 text-sm font-semibold text-slate-800 bg-white appearance-none outline-none transition-all duration-150 cursor-pointer"
                      >
                        {[
                          { type: "Car", capacity: 240 },
                          { type: "Van", capacity: 350 },
                          { type: "Truck", capacity: 450 },
                        ].map((s) => {
                          return (
                            <option key={s.type} value={s.capacity}>
                              {s.type}
                            </option>
                          );
                        })}
                      </select>
                      <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                        <IcoChevron />
                      </span>
                    </div>
                    <div className="text-center text-gray-800">
                      or manually put your vehicle capacity
                    </div>
                    {/* <label
                      htmlFor="capacity"
                      className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-1.5 select-none"
                    >
                      <span className="text-blue-600">
                        <IcoBox />
                      </span>
                      Vehicle box capacity
                    </label>
                    <p className="text-xs text-slate-400 mb-2.5">
                      Max boxes your vehicle can carry per run.
                    </p> */}
                    <div className="relative">
                      <input
                        id="capacity"
                        type="number"
                        min={1}
                        max={999}
                        inputMode="numeric"
                        placeholder="e.g. 20"
                        value={form.capacity}
                        onChange={(e) => handleCapacity(e.target.value)}
                        className={[
                          "w-full h-12 rounded-xl border-[1.5px] px-4 pr-14 text-base font-semibold text-slate-800",
                          "placeholder:text-slate-300 bg-white outline-none transition-all duration-150",
                          "focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
                          capacityErr
                            ? "border-red-400 bg-red-50 focus:ring-red-400 focus:border-red-400"
                            : "border-slate-200 hover:border-slate-300",
                        ].join(" ")}
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400 pointer-events-none">
                        boxes
                      </span>
                    </div>

                    {capacityErr && (
                      <p
                        className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-red-600"
                        role="alert"
                      >
                        <IcoAlert /> {capacityErr}
                      </p>
                    )}

                    {!capacityErr && capValid && poolStats.count > 0 && (
                      <p className="mt-1.5 text-xs text-slate-400">
                        <span className="font-semibold text-slate-500">
                          {poolStats.count}
                        </span>{" "}
                        matching orders ·{" "}
                        <span className="font-semibold text-slate-500">
                          {poolStats.totalBoxes}
                        </span>{" "}
                        total boxes.{" "}
                        {parsedCap >= poolStats.totalBoxes ? (
                          <span className="text-green-600 font-semibold">
                            Vehicle fits the full load.
                          </span>
                        ) : (
                          <span className="text-amber-600 font-semibold">
                            Greedy-pack up to {parsedCap} boxes.
                          </span>
                        )}
                      </p>
                    )}
                    {!capacityErr && capValid && poolStats.count === 0 && (
                      <p className="mt-1.5 text-xs text-amber-600 font-semibold flex items-center gap-1.5">
                        <IcoAlert /> No orders match this shift &amp; type.
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="shift"
                      className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-1.5 select-none"
                    >
                      <span className="text-blue-600">
                        <IcoClock />
                      </span>
                      Client availability shift
                    </label>
                    <div className="relative">
                      <select
                        id="shift"
                        value={form.shift}
                        onChange={(e) => {
                          setForm((p) => ({
                            ...p,
                            shift: e.target.value as DeliveryShift,
                          }));
                        }}
                        className="w-full h-12 rounded-xl border-[1.5px] border-slate-200 hover:border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 px-4 pr-10 text-sm font-semibold text-slate-800 bg-white appearance-none outline-none transition-all duration-150 cursor-pointer"
                      >
                        {(Object.keys(SHIFT_CONFIG) as DeliveryShift[]).map(
                          (s) => {
                            const c = SHIFT_CONFIG[s];
                            return (
                              <option key={s} value={s}>
                                {c.emoji} {c.label} — {c.hours}
                              </option>
                            );
                          },
                        )}
                      </select>
                      <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                        <IcoChevron />
                      </span>
                    </div>
                    <div className="mt-2.5 flex flex-wrap gap-2">
                      {(Object.keys(SHIFT_CONFIG) as DeliveryShift[]).map(
                        (s) => {
                          const c = SHIFT_CONFIG[s];
                          const count = orders.filter(
                            (o) => o.deliveryShift === s,
                          ).length;
                          return (
                            <button
                              key={s}
                              type="button"
                              onClick={() => {
                                setForm((p) => ({ ...p, shift: s }));
                              }}
                              className={[
                                "flex items-center gap-1 px-2 py-1 rounded-full text-[11px] font-semibold border transition-all duration-100 cursor-pointer select-none",
                                form.shift === s
                                  ? `${c.color} ${c.bg} ${c.border} shadow-sm`
                                  : "text-slate-400 bg-slate-50 border-slate-200 hover:border-slate-300",
                              ].join(" ")}
                            >
                              {c.emoji} {c.label}
                              <span className="ml-0.5 opacity-60">
                                ({count})
                              </span>
                            </button>
                          );
                        },
                      )}
                    </div>
                  </div>
                </>
              )}
              {routeType == "number" && (
                <>
                  <label
                    htmlFor="capacity"
                    className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-1.5 select-none"
                  >
                    <span className="text-blue-600">
                      <IcoBox />
                    </span>
                    Enter Route
                  </label>
                  <p className="text-xs text-slate-400 mb-2.5">
                    Route number to be delivered. (This needs to be exactly same
                    as the route number )
                  </p>
                  <div className="relative">
                    <input
                      id="capacity"
                      type="text"
                      inputMode="text"
                      placeholder="e.g. 12345"
                      value={routeNumber}
                      onChange={(e) => {
                        setRouteNumberBasedOrders([]);
                        setRouteNumber(e.target.value);
                        handleGetRouteSuggestion(e.target.value);
                      }}
                      className={[
                        "w-full h-12 rounded-xl border-[1.5px] px-4 pr-14 text-base font-semibold text-slate-800",
                        "placeholder:text-slate-300 bg-white outline-none transition-all duration-150",
                        "focus:ring-2 focus:ring-blue-500 focus:border-blue-500 border-slate-200 hover:border-slate-300",
                      ].join(" ")}
                    />
                    <ul className="bg-gray-50 cursor-pointer rounded border-2">
                      {routeSuggestions.map((s, i) => (
                        <li
                          onClick={() => {
                            setLoadingShipments(true);
                            setRouteNumber(s);
                            setRouteSuggestions([]);
                            getRouteNumberBasedShipements(s);
                          }}
                          key={i}
                          className="border rounded hover:bg-gray-300 py-1 px-2"
                        >
                          <span className="text-black ">
                            R -{"  "}{" "}
                            <strong>
                              {"  "}
                              {s}
                            </strong>
                          </span>
                        </li>
                      ))}
                    </ul>
                    <div className="text-red-700">{routeError}</div>
                    {routeNumberBasedOrders.length != 0 &&
                      routeNumberBasedOrders.map((order, index) => {
                        return (
                          <div
                            className="flex items-center text-gray-700  justify-between p-3 rounded-md bg-gray-100  mt-2"
                            key={index}
                          >
                            {" "}
                            {/* <div className="cell flex text-gray-700 items-center justify-center cell-id"> */}
                            <div className="id-icon">
                              <IconTruck />
                            </div>
                            <div className="cursor-pointer flex gap-3 items-center">
                              <div className="flex  items-center">
                                {order.isUrgent && (
                                  <div className="w-2.5 h-2.5 absolute bg-red-600 rounded-full"></div>
                                )}{" "}
                                {"     "}
                                <div
                                  className={`tracking-id ${order.isUrgent ? "ml-3.5" : ""}`}
                                >
                                  {order?._id?.slice(-7)} {"   |   "}
                                </div>
                              </div>
                              <div className="client-name">
                                {order.clientName}
                              </div>
                            </div>
                            <div className="cell text-gray-700 cell-status">
                              {order.status}
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </>
              )}
              {/* ── Submit button ─────────────────────────── */}
              {!loadingShipments ? (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={phase === "calculating" || !capValid}
                  className={[
                    "w-full h-13 cursor-pointer rounded-xl flex items-center justify-center gap-2.5 text-sm font-bold",
                    "transition-all duration-150 select-none focus:outline-none",
                    "focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2",
                    phase === "calculating"
                      ? "bg-blue-500 text-white cursor-not-allowed opacity-80"
                      : phase === "done"
                        ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-900/20 active:scale-[.98]"
                        : !capValid
                          ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                          : "bg-blue-700 hover:bg-blue-800 text-white shadow-md shadow-blue-900/25 hover:shadow-lg hover:shadow-blue-900/30 active:scale-[.98]",
                  ].join(" ")}
                >
                  {phase === "calculating" ? (
                    <>
                      <IcoSpin /> Calculating optimal route…
                    </>
                  ) : (
                    <>
                      <IcoRoute /> Generate route
                    </>
                  )}
                </button>
              ) : (
                <button
                  type="button"
                  disabled={true}
                  className={[
                    "w-full h-13 cursor-pointer rounded-xl flex items-center justify-center gap-2.5 text-sm font-bold",
                    "transition-all duration-150 select-none focus:outline-none",
                    "focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2",
                    phase === "calculating"
                      ? "bg-blue-500 text-white cursor-not-allowed opacity-80"
                      : phase === "done"
                        ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-900/20 active:scale-[.98]"
                        : !capValid
                          ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                          : "bg-blue-900 hover:bg-blue-900 text-white shadow-md shadow-blue-900/25 hover:shadow-lg hover:shadow-blue-900/30 active:scale-[.98]",
                  ].join(" ")}
                >
                  <>
                    <IcoRoute /> Loading shipments
                  </>
                </button>
              )}
            </div>
          </div>

          {/* ════════════════ LOADING STATE ════════════════ */}
          {phase === "calculating" && (
            <div className="mt-5 bg-white rounded-2xl border border-slate-200 shadow-sm p-8 flex flex-col items-center gap-4 text-center">
              <div className="relative w-14 h-14">
                <div className="absolute inset-0 rounded-full border-4 border-blue-100" />
                <div className="absolute inset-0 rounded-full border-4 border-blue-600 border-t-transparent animate-spin" />
                <div className="absolute inset-1.5 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                  <IcoTruck />
                </div>
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800">
                  Packing your route…
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  {routeType == "number" ? "Numbered Route" : "Mixed"} ·{" "}
                  {SHIFT_CONFIG[form.shift].label} shift · up to {form.capacity}{" "}
                  boxes
                </p>
              </div>
              <div className="flex gap-1.5">
                {[0, 0.15, 0.3].map((d, i) => (
                  <span
                    key={i}
                    className="w-2 h-2 rounded-full bg-blue-400 animate-bounce"
                    style={{ animationDelay: `${d}s` }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* ════════════════ RESULTS PANEL ════════════════ */}
        </div>
      </main>
    </div>
  );
}
