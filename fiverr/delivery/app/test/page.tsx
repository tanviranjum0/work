"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";

// ─── Types ────────────────────────────────────────────────────────────────────

type ShipmentType = "collection" | "delivery";
type DeliveryShift = "morning" | "afternoon" | "evening" | "night";

interface Order {
  pickupAddress: string;
  deliveryAddress: string;
  deliverySelected: { lat: number; lng: number } | null;
  boxQuantity: number;
  clientName: string;
  shipmentType: ShipmentType;
  clientPhoneNumber: string;
  deliveryShift: DeliveryShift;
  note: string;
}

interface FormState {
  shipmentType: ShipmentType;
  capacity: number;
  shift: DeliveryShift;
}

type SubmitPhase = "idle" | "calculating" | "done";

// ─── Constants ────────────────────────────────────────────────────────────────

const WAREHOUSE = "Izaäk Enschedéweg 50, 2031 CS Haarlem, Netherlands";

const SHIFT_META: Record<
  DeliveryShift,
  {
    label: string;
    emoji: string;
    hours: string;
    color: string;
    bg: string;
    border: string;
  }
> = {
  morning: {
    label: "Morning",
    emoji: "🌅",
    hours: "06:00 – 12:00",
    color: "text-amber-700",
    bg: "bg-amber-50",
    border: "border-amber-200",
  },
  afternoon: {
    label: "Afternoon",
    emoji: "☀️",
    hours: "12:00 – 18:00",
    color: "text-orange-600",
    bg: "bg-orange-50",
    border: "border-orange-200",
  },
  evening: {
    label: "Evening",
    emoji: "🌆",
    hours: "18:00 – 22:00",
    color: "text-purple-700",
    bg: "bg-purple-50",
    border: "border-purple-200",
  },
  night: {
    label: "Night",
    emoji: "🌙",
    hours: "22:00 – 06:00",
    color: "text-slate-700",
    bg: "bg-slate-100",
    border: "border-slate-300",
  },
};

// ─── Smart shift detection ────────────────────────────────────────────────────

function detectShift(): DeliveryShift {
  const hour = new Date().getHours();
  if (hour >= 6 && hour < 12) return "morning";
  if (hour >= 12 && hour < 18) return "afternoon";
  if (hour >= 18 && hour < 22) return "evening";
  return "night";
}

// ─── Mock order pool (40 orders) ─────────────────────────────────────────────

const ORDER_POOL: Order[] = [
  {
    pickupAddress: WAREHOUSE,
    deliveryAddress: "Grote Markt 1, 2011 RD Haarlem",
    deliverySelected: { lat: 52.3807, lng: 4.6333 },
    boxQuantity: 3,
    clientName: "Emma de Vries",
    shipmentType: "collection",
    clientPhoneNumber: "+31612345601",
    deliveryShift: "morning",
    note: "Ring doorbell twice",
  },
  {
    pickupAddress: WAREHOUSE,
    deliveryAddress: "Zijlweg 40, 2013 SK Haarlem",
    deliverySelected: { lat: 52.3889, lng: 4.6241 },
    boxQuantity: 5,
    clientName: "Lars Bakker",
    shipmentType: "delivery",
    clientPhoneNumber: "+31612345602",
    deliveryShift: "morning",
    note: "",
  },
  {
    pickupAddress: WAREHOUSE,
    deliveryAddress: "Kleverlaan 99, 2023 JB Haarlem",
    deliverySelected: { lat: 52.3978, lng: 4.6512 },
    boxQuantity: 2,
    clientName: "Sofia Jansen",
    shipmentType: "collection",
    clientPhoneNumber: "+31612345603",
    deliveryShift: "afternoon",
    note: "Leave at front door",
  },
  {
    pickupAddress: WAREHOUSE,
    deliveryAddress: "Wagenweg 76, 2012 NM Haarlem",
    deliverySelected: { lat: 52.3852, lng: 4.638 },
    boxQuantity: 8,
    clientName: "Daan Mulder",
    shipmentType: "delivery",
    clientPhoneNumber: "+31612345604",
    deliveryShift: "morning",
    note: "Heavy package",
  },
  {
    pickupAddress: WAREHOUSE,
    deliveryAddress: "Schotersingel 30, 2021 GH Haarlem",
    deliverySelected: { lat: 52.3943, lng: 4.6455 },
    boxQuantity: 4,
    clientName: "Noor van den Berg",
    shipmentType: "collection",
    clientPhoneNumber: "+31612345605",
    deliveryShift: "afternoon",
    note: "",
  },
  {
    pickupAddress: WAREHOUSE,
    deliveryAddress: "Frans Halsstraat 12, 2021 AK Haarlem",
    deliverySelected: { lat: 52.3862, lng: 4.649 },
    boxQuantity: 6,
    clientName: "Tom Visser",
    shipmentType: "delivery",
    clientPhoneNumber: "+31612345606",
    deliveryShift: "evening",
    note: "Fragile items",
  },
  {
    pickupAddress: WAREHOUSE,
    deliveryAddress: "Rijksstraatweg 14, 2024 EB Haarlem",
    deliverySelected: { lat: 52.4051, lng: 4.658 },
    boxQuantity: 1,
    clientName: "Fleur Smit",
    shipmentType: "collection",
    clientPhoneNumber: "+31612345607",
    deliveryShift: "night",
    note: "",
  },
  {
    pickupAddress: WAREHOUSE,
    deliveryAddress: "Westergracht 30, 2012 HD Haarlem",
    deliverySelected: { lat: 52.3828, lng: 4.631 },
    boxQuantity: 7,
    clientName: "Bas Kuiper",
    shipmentType: "delivery",
    clientPhoneNumber: "+31612345608",
    deliveryShift: "morning",
    note: "Call on arrival",
  },
  {
    pickupAddress: WAREHOUSE,
    deliveryAddress: "Duinwijcklaan 5, 2015 HA Haarlem",
    deliverySelected: { lat: 52.3905, lng: 4.596 },
    boxQuantity: 3,
    clientName: "Anne Meijer",
    shipmentType: "collection",
    clientPhoneNumber: "+31612345609",
    deliveryShift: "afternoon",
    note: "",
  },
  {
    pickupAddress: WAREHOUSE,
    deliveryAddress: "Tempeliersstraat 22, 2012 EN Haarlem",
    deliverySelected: { lat: 52.3816, lng: 4.637 },
    boxQuantity: 5,
    clientName: "Pieter de Groot",
    shipmentType: "delivery",
    clientPhoneNumber: "+31612345610",
    deliveryShift: "evening",
    note: "No elevator",
  },
  {
    pickupAddress: WAREHOUSE,
    deliveryAddress: "Nieuwe Groenmarkt 8, 2011 WC Haarlem",
    deliverySelected: { lat: 52.3813, lng: 4.6361 },
    boxQuantity: 2,
    clientName: "Lisa Bos",
    shipmentType: "collection",
    clientPhoneNumber: "+31612345611",
    deliveryShift: "morning",
    note: "",
  },
  {
    pickupAddress: WAREHOUSE,
    deliveryAddress: "Pijnboomstraat 3, 2023 VK Haarlem",
    deliverySelected: { lat: 52.396, lng: 4.6527 },
    boxQuantity: 9,
    clientName: "Joost Laan",
    shipmentType: "delivery",
    clientPhoneNumber: "+31612345612",
    deliveryShift: "night",
    note: "Second floor",
  },
  {
    pickupAddress: WAREHOUSE,
    deliveryAddress: "Planetenlaan 7, 2024 HN Haarlem",
    deliverySelected: { lat: 52.4078, lng: 4.6612 },
    boxQuantity: 4,
    clientName: "Roos van Dijk",
    shipmentType: "collection",
    clientPhoneNumber: "+31612345613",
    deliveryShift: "morning",
    note: "",
  },
  {
    pickupAddress: WAREHOUSE,
    deliveryAddress: "Heemsteedse Dreef 70, 2102 KR Heemstede",
    deliverySelected: { lat: 52.3555, lng: 4.6204 },
    boxQuantity: 6,
    clientName: "Koen Hendriks",
    shipmentType: "delivery",
    clientPhoneNumber: "+31612345614",
    deliveryShift: "afternoon",
    note: "Bulky items",
  },
  {
    pickupAddress: WAREHOUSE,
    deliveryAddress: "Binnenweg 42, 2101 JJ Heemstede",
    deliverySelected: { lat: 52.353, lng: 4.6172 },
    boxQuantity: 3,
    clientName: "Iris Vermeer",
    shipmentType: "collection",
    clientPhoneNumber: "+31612345615",
    deliveryShift: "evening",
    note: "",
  },
  {
    pickupAddress: WAREHOUSE,
    deliveryAddress: "Houtplein 18, 2012 DE Haarlem",
    deliverySelected: { lat: 52.3836, lng: 4.6351 },
    boxQuantity: 5,
    clientName: "Sander Prins",
    shipmentType: "delivery",
    clientPhoneNumber: "+31612345616",
    deliveryShift: "morning",
    note: "Doorcode 4521",
  },
  {
    pickupAddress: WAREHOUSE,
    deliveryAddress: "Lange Begijnestraat 9, 2011 HM Haarlem",
    deliverySelected: { lat: 52.3805, lng: 4.6349 },
    boxQuantity: 2,
    clientName: "Merel Vliet",
    shipmentType: "collection",
    clientPhoneNumber: "+31612345617",
    deliveryShift: "afternoon",
    note: "",
  },
  {
    pickupAddress: WAREHOUSE,
    deliveryAddress: "Cronjéstraat 15, 2042 AE Zandvoort",
    deliverySelected: { lat: 52.3713, lng: 4.5328 },
    boxQuantity: 7,
    clientName: "Hugo van Leeuwen",
    shipmentType: "delivery",
    clientPhoneNumber: "+31612345618",
    deliveryShift: "night",
    note: "Coastal delivery",
  },
  {
    pickupAddress: WAREHOUSE,
    deliveryAddress: "Zandvoortselaan 33, 2100 AA Heemstede",
    deliverySelected: { lat: 52.36, lng: 4.589 },
    boxQuantity: 1,
    clientName: "Julia Brouwer",
    shipmentType: "collection",
    clientPhoneNumber: "+31612345619",
    deliveryShift: "evening",
    note: "",
  },
  {
    pickupAddress: WAREHOUSE,
    deliveryAddress: "Oudeweg 60, 2031 CC Haarlem",
    deliverySelected: { lat: 52.3997, lng: 4.6441 },
    boxQuantity: 4,
    clientName: "Mark Dijkstra",
    shipmentType: "delivery",
    clientPhoneNumber: "+31612345620",
    deliveryShift: "morning",
    note: "Near the park",
  },
  {
    pickupAddress: WAREHOUSE,
    deliveryAddress: "Floris van Adrichemstraat 22, 2021 Haarlem",
    deliverySelected: { lat: 52.387, lng: 4.646 },
    boxQuantity: 3,
    clientName: "Eva Willems",
    shipmentType: "collection",
    clientPhoneNumber: "+31612345621",
    deliveryShift: "morning",
    note: "",
  },
  {
    pickupAddress: WAREHOUSE,
    deliveryAddress: "Klokhuisplein 6, 2011 HK Haarlem",
    deliverySelected: { lat: 52.381, lng: 4.6358 },
    boxQuantity: 5,
    clientName: "Niels de Boer",
    shipmentType: "delivery",
    clientPhoneNumber: "+31612345622",
    deliveryShift: "afternoon",
    note: "Signature required",
  },
  {
    pickupAddress: WAREHOUSE,
    deliveryAddress: "Spaarndamseweg 100, 2021 BA Haarlem",
    deliverySelected: { lat: 52.3941, lng: 4.6278 },
    boxQuantity: 2,
    clientName: "Lotte Mulder",
    shipmentType: "collection",
    clientPhoneNumber: "+31612345623",
    deliveryShift: "evening",
    note: "",
  },
  {
    pickupAddress: WAREHOUSE,
    deliveryAddress: "Raaks 1, 2011 LS Haarlem",
    deliverySelected: { lat: 52.3811, lng: 4.6348 },
    boxQuantity: 6,
    clientName: "Robin de Graaf",
    shipmentType: "delivery",
    clientPhoneNumber: "+31612345624",
    deliveryShift: "night",
    note: "Leave with neighbor if absent",
  },
  {
    pickupAddress: WAREHOUSE,
    deliveryAddress: "Kinderhuisvest 3, 2011 PL Haarlem",
    deliverySelected: { lat: 52.3818, lng: 4.6344 },
    boxQuantity: 4,
    clientName: "Amber van Beek",
    shipmentType: "collection",
    clientPhoneNumber: "+31612345625",
    deliveryShift: "morning",
    note: "",
  },
  {
    pickupAddress: WAREHOUSE,
    deliveryAddress: "Koediefslaan 12, 2015 CJ Haarlem",
    deliverySelected: { lat: 52.389, lng: 4.6009 },
    boxQuantity: 3,
    clientName: "Tim Kuijpers",
    shipmentType: "delivery",
    clientPhoneNumber: "+31612345626",
    deliveryShift: "afternoon",
    note: "",
  },
  {
    pickupAddress: WAREHOUSE,
    deliveryAddress: "Elswoutslaan 1, 2051 AB Overveen",
    deliverySelected: { lat: 52.392, lng: 4.588 },
    boxQuantity: 8,
    clientName: "Fenna Dekker",
    shipmentType: "collection",
    clientPhoneNumber: "+31612345627",
    deliveryShift: "evening",
    note: "Through gate on left",
  },
  {
    pickupAddress: WAREHOUSE,
    deliveryAddress: "Bloemendaalseweg 100, 2061 AG Bloemendaal",
    deliverySelected: { lat: 52.4002, lng: 4.57 },
    boxQuantity: 2,
    clientName: "Cas van Vliet",
    shipmentType: "delivery",
    clientPhoneNumber: "+31612345628",
    deliveryShift: "night",
    note: "",
  },
  {
    pickupAddress: WAREHOUSE,
    deliveryAddress: "Molenkade 5, 2032 JX Haarlem",
    deliverySelected: { lat: 52.401, lng: 4.6395 },
    boxQuantity: 5,
    clientName: "Ineke Vogel",
    shipmentType: "collection",
    clientPhoneNumber: "+31612345629",
    deliveryShift: "morning",
    note: "",
  },
  {
    pickupAddress: WAREHOUSE,
    deliveryAddress: "Spekstraat 8, 2011 SW Haarlem",
    deliverySelected: { lat: 52.3801, lng: 4.6357 },
    boxQuantity: 1,
    clientName: "Sven Hendriks",
    shipmentType: "delivery",
    clientPhoneNumber: "+31612345630",
    deliveryShift: "afternoon",
    note: "",
  },
  {
    pickupAddress: WAREHOUSE,
    deliveryAddress: "Garenkokerskade 18, 2031 EM Haarlem",
    deliverySelected: { lat: 52.3999, lng: 4.6437 },
    boxQuantity: 7,
    clientName: "Dagmar Laan",
    shipmentType: "collection",
    clientPhoneNumber: "+31612345631",
    deliveryShift: "evening",
    note: "Warehouse entrance round back",
  },
  {
    pickupAddress: WAREHOUSE,
    deliveryAddress: "Westelijk Halfrond 42, 2033 GG Haarlem",
    deliverySelected: { lat: 52.403, lng: 4.6275 },
    boxQuantity: 3,
    clientName: "Boris Akkerman",
    shipmentType: "delivery",
    clientPhoneNumber: "+31612345632",
    deliveryShift: "morning",
    note: "",
  },
  {
    pickupAddress: WAREHOUSE,
    deliveryAddress: "Nieuwe Kerksplein 1, 2011 MG Haarlem",
    deliverySelected: { lat: 52.3808, lng: 4.6339 },
    boxQuantity: 4,
    clientName: "Vera Visser",
    shipmentType: "collection",
    clientPhoneNumber: "+31612345633",
    deliveryShift: "night",
    note: "",
  },
  {
    pickupAddress: WAREHOUSE,
    deliveryAddress: "Nassaulaan 25, 2012 JL Haarlem",
    deliverySelected: { lat: 52.3845, lng: 4.6302 },
    boxQuantity: 2,
    clientName: "Jelle Vermeulen",
    shipmentType: "delivery",
    clientPhoneNumber: "+31612345634",
    deliveryShift: "morning",
    note: "Parcel locker available",
  },
  {
    pickupAddress: WAREHOUSE,
    deliveryAddress: "Veerpolder 5, 2031 XA Haarlem",
    deliverySelected: { lat: 52.402, lng: 4.6488 },
    boxQuantity: 6,
    clientName: "Hanna de Wit",
    shipmentType: "collection",
    clientPhoneNumber: "+31612345635",
    deliveryShift: "afternoon",
    note: "",
  },
  {
    pickupAddress: WAREHOUSE,
    deliveryAddress: "Kruisweg 3, 2131 CR Hoofddorp",
    deliverySelected: { lat: 52.3055, lng: 4.686 },
    boxQuantity: 5,
    clientName: "Omar Saleh",
    shipmentType: "delivery",
    clientPhoneNumber: "+31612345636",
    deliveryShift: "evening",
    note: "",
  },
  {
    pickupAddress: WAREHOUSE,
    deliveryAddress: "Toolenburgerplas 10, 2132 MN Hoofddorp",
    deliverySelected: { lat: 52.2998, lng: 4.698 },
    boxQuantity: 3,
    clientName: "Layla van der Zee",
    shipmentType: "collection",
    clientPhoneNumber: "+31612345637",
    deliveryShift: "night",
    note: "Call 30 min before",
  },
  {
    pickupAddress: WAREHOUSE,
    deliveryAddress: "Middenweg 55, 2033 RB Haarlem",
    deliverySelected: { lat: 52.404, lng: 4.642 },
    boxQuantity: 4,
    clientName: "Max van Rooij",
    shipmentType: "delivery",
    clientPhoneNumber: "+31612345638",
    deliveryShift: "morning",
    note: "",
  },
  {
    pickupAddress: WAREHOUSE,
    deliveryAddress: "Dreef 33, 2012 HR Haarlem",
    deliverySelected: { lat: 52.386, lng: 4.634 },
    boxQuantity: 2,
    clientName: "Ylva Bergman",
    shipmentType: "collection",
    clientPhoneNumber: "+31612345639",
    deliveryShift: "afternoon",
    note: "",
  },
  {
    pickupAddress: WAREHOUSE,
    deliveryAddress: "Vondelweg 8, 2023 CD Haarlem",
    deliverySelected: { lat: 52.3968, lng: 4.6493 },
    boxQuantity: 9,
    clientName: "Ben van der Berg",
    shipmentType: "delivery",
    clientPhoneNumber: "+31612345640",
    deliveryShift: "evening",
    note: "Ground floor only",
  },
];

// ─── Greedy packing ───────────────────────────────────────────────────────────

function packOrders(
  pool: Order[],
  shipmentType: ShipmentType,
  shift: DeliveryShift,
  capacity: number,
): Order[] {
  const matching = pool.filter(
    (o) => o.shipmentType === shipmentType && o.deliveryShift === shift,
  );
  const packed: Order[] = [];
  let used = 0;
  for (const order of matching) {
    if (used + order.boxQuantity <= capacity) {
      packed.push(order);
      used += order.boxQuantity;
    }
  }
  return packed;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function SectionLabel({
  icon,
  children,
  hint,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <div className="flex flex-col gap-0.5 mb-2">
      <div className="flex items-center gap-2">
        <span className="text-blue-700">{icon}</span>
        <span className="text-sm font-semibold text-slate-700">{children}</span>
      </div>
      {hint && <p className="text-xs text-slate-400 ml-7">{hint}</p>}
    </div>
  );
}

function ShipmentToggle({
  value,
  onChange,
}: {
  value: ShipmentType;
  onChange: (v: ShipmentType) => void;
}) {
  return (
    <div
      className="grid grid-cols-2 gap-3"
      role="radiogroup"
      aria-label="Shipment type"
    >
      {(["delivery", "collection"] as ShipmentType[]).map((type) => {
        const active = value === type;
        return (
          <button
            key={type}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(type)}
            className={[
              "relative flex flex-col items-center gap-2.5 py-5 px-3 rounded-xl border-2 transition-all duration-150 cursor-pointer select-none",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2",
              active
                ? "border-blue-600 bg-blue-700 text-white shadow-lg shadow-blue-800/25"
                : "border-slate-200 bg-white text-slate-500 hover:border-slate-300 hover:bg-slate-50",
            ].join(" ")}
          >
            {/* Icon */}
            <span className={active ? "text-blue-200" : "text-slate-400"}>
              {type === "delivery" ? (
                <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M3 16V6a1 1 0 011-1h10a1 1 0 011 1v10M3 16h12M3 16a2 2 0 104 0M15 16a2 2 0 104 0M15 9h3l3 3v4h-2"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ) : (
                <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2v-4M9 21H5a2 2 0 01-2-2v-4m0 0h18"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                </svg>
              )}
            </span>
            <span className="text-sm font-semibold capitalize leading-none">
              {type}
            </span>

            {/* Check badge */}
            {active && (
              <span className="absolute top-2.5 right-2.5">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <circle cx="8" cy="8" r="8" fill="rgba(255,255,255,0.22)" />
                  <path
                    d="M4.5 8l2.5 2.5 4.5-5"
                    stroke="white"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

function CapacityInput({
  value,
  onChange,
  error,
}: {
  value: string;
  onChange: (v: string) => void;
  error: string;
}) {
  return (
    <div>
      <div className="relative">
        <input
          type="number"
          min={1}
          max={999}
          inputMode="numeric"
          placeholder="e.g. 20"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={[
            "w-full h-12 rounded-xl border-2 px-4 pr-16 text-base font-semibold text-slate-800 bg-white transition-all duration-150 outline-none",
            "placeholder:text-slate-300 placeholder:font-normal",
            "[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none",
            error
              ? "border-red-400 focus:ring-2 focus:ring-red-300 bg-red-50"
              : "border-slate-200 hover:border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100",
          ].join(" ")}
        />
        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400 pointer-events-none">
          boxes
        </span>
      </div>
      {error && (
        <p
          className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-red-600"
          role="alert"
        >
          <svg
            className="w-3.5 h-3.5 flex-shrink-0"
            viewBox="0 0 14 14"
            fill="none"
          >
            <circle cx="7" cy="7" r="7" fill="#fecaca" />
            <path
              d="M7 4.5v3M7 9.5h.01"
              stroke="#dc2626"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
}

function ShiftSelect({
  value,
  onChange,
  autoDetected,
}: {
  value: DeliveryShift;
  onChange: (v: DeliveryShift) => void;
  autoDetected: boolean;
}) {
  const meta = SHIFT_META[value];

  return (
    <div className="space-y-2">
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value as DeliveryShift)}
          className="w-full h-12 rounded-xl border-2 border-slate-200 hover:border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 px-4 pr-10 text-sm font-semibold text-slate-800 bg-white appearance-none outline-none transition-all duration-150 cursor-pointer"
        >
          <option value="morning">🌅 Morning — 06:00 to 12:00</option>
          <option value="afternoon">☀️ Afternoon — 12:00 to 18:00</option>
          <option value="evening">🌆 Evening — 18:00 to 22:00</option>
          <option value="night">🌙 Night — 22:00 to 06:00</option>
        </select>
        <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M4 6l4 4 4-4"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </div>

      {/* Shift pill + auto-detect note */}
      <div className="flex items-center gap-2 flex-wrap">
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${meta.bg} ${meta.color} ${meta.border}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-current" />
          {meta.emoji} {meta.label} · {meta.hours}
        </span>
        {autoDetected && (
          <span className="text-xs text-slate-400">
            ← auto-detected · change anytime
          </span>
        )}
      </div>
    </div>
  );
}

// ─── Loading spinner ──────────────────────────────────────────────────────────

function LoadingState({
  shift,
  shipmentType,
  capacity,
}: {
  shift: DeliveryShift;
  shipmentType: ShipmentType;
  capacity: number;
}) {
  const meta = SHIFT_META[shift];
  return (
    <div className="mt-6 bg-white rounded-2xl border border-slate-200 shadow-sm p-8 flex flex-col items-center gap-5 text-center">
      {/* Spinner ring */}
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 rounded-full border-4 border-blue-100" />
        <div className="absolute inset-0 rounded-full border-4 border-blue-600 border-t-transparent animate-spin" />
        <div className="absolute inset-3 rounded-full bg-blue-50 flex items-center justify-center text-blue-700">
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
            <path
              d="M3 16V6a1 1 0 011-1h10a1 1 0 011 1v10M3 16h12M3 16a2 2 0 104 0M15 16a2 2 0 104 0M15 9h3l3 3v4h-2"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>

      <div>
        <p className="text-sm font-semibold text-slate-800">
          Calculating optimal route…
        </p>
        <p className="text-xs text-slate-400 mt-1 max-w-xs">
          Packing{" "}
          <span className="font-semibold text-slate-600">{shipmentType}</span>{" "}
          orders for the{" "}
          <span className={`font-semibold ${meta.color}`}>
            {meta.emoji} {meta.label}
          </span>{" "}
          shift · up to{" "}
          <span className="font-semibold text-slate-600">{capacity}</span> boxes
        </p>
      </div>

      {/* Bouncing dots */}
      <div className="flex gap-1.5">
        {[0, 0.15, 0.3].map((delay, i) => (
          <span
            key={i}
            className="w-2 h-2 rounded-full bg-blue-400 animate-bounce"
            style={{ animationDelay: `${delay}s` }}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Results panel ────────────────────────────────────────────────────────────

function ResultsPanel({
  results,
  usedBoxes,
  capacity,
  shift,
  shipmentType,
  skipped,
  onReset,
  onNavigate,
}: {
  results: Order[];
  usedBoxes: number;
  capacity: number;
  shift: DeliveryShift;
  shipmentType: ShipmentType;
  skipped: number;
  onReset: () => void;
  onNavigate: () => void;
}) {
  const meta = SHIFT_META[shift];
  const fillPct = Math.min(Math.round((usedBoxes / capacity) * 100), 100);
  const isFull = usedBoxes >= capacity;

  return (
    <div className="mt-6 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Panel header */}
      <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/70 flex items-start justify-between gap-3 flex-wrap">
        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">
            Route Preview
          </p>
          <h2 className="text-base font-bold text-slate-800">
            {results.length > 0
              ? `${results.length} stop${results.length !== 1 ? "s" : ""} selected`
              : "No matching orders"}
          </h2>
        </div>

        {results.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <span
              className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full border ${meta.bg} ${meta.color} ${meta.border}`}
            >
              {meta.emoji} {meta.label}
            </span>
            <span
              className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full border ${
                shipmentType === "delivery"
                  ? "bg-indigo-50 text-indigo-700 border-indigo-200"
                  : "bg-teal-50 text-teal-700 border-teal-200"
              }`}
            >
              {shipmentType}
            </span>
          </div>
        )}
      </div>

      {results.length === 0 ? (
        /* Empty state */
        <div className="px-6 py-12 flex flex-col items-center gap-3 text-center">
          <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center">
            <svg
              className="w-6 h-6 text-amber-600"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M12 9v4M12 17h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <p className="text-sm font-semibold text-slate-700">
            No matching orders
          </p>
          <p className="text-xs text-slate-400 max-w-xs leading-relaxed">
            There are no{" "}
            <strong className="text-slate-600">{shipmentType}</strong> orders
            for the{" "}
            <strong className="text-slate-600">
              {SHIFT_META[shift].label}
            </strong>{" "}
            shift, or your capacity is below the minimum order size.
          </p>
          <button
            onClick={onReset}
            className="mt-2 text-xs font-semibold text-blue-600 hover:text-blue-800 underline underline-offset-2 transition-colors"
          >
            ← Adjust filters
          </button>
        </div>
      ) : (
        <>
          {/* Capacity bar */}
          <div className="px-6 pt-5">
            <div className="flex justify-between items-center text-xs font-semibold text-slate-500 mb-1.5">
              <span>Capacity used</span>
              <span className={isFull ? "text-orange-600" : "text-slate-500"}>
                {usedBoxes} / {capacity} boxes{isFull ? " · full" : ""}
              </span>
            </div>
            <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ${
                  isFull
                    ? "bg-gradient-to-r from-orange-500 to-orange-400"
                    : "bg-gradient-to-r from-blue-600 to-blue-400"
                }`}
                style={{ width: `${fillPct}%` }}
              />
            </div>
            <p className="text-[10px] text-slate-400 mt-1">
              {fillPct}% loaded · {skipped} order{skipped !== 1 ? "s" : ""}{" "}
              skipped due to capacity
            </p>
          </div>

          {/* Order rows */}
          <div className="px-6 pt-4 pb-3 divide-y divide-slate-100">
            {results.map((order, i) => (
              <div
                key={`${order.clientName}-${i}`}
                className="flex items-start gap-3 py-3 group"
              >
                {/* Sequence number */}
                <span className="mt-0.5 flex-shrink-0 w-6 h-6 rounded-full bg-blue-700 text-white text-[11px] font-bold flex items-center justify-center">
                  {i + 1}
                </span>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-800 leading-tight">
                    {order.clientName}
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5 truncate">
                    {order.deliveryAddress}
                  </p>
                  {order.note && (
                    <p className="text-xs text-amber-700 italic mt-0.5 flex items-start gap-1">
                      <span className="text-amber-400 flex-shrink-0">↳</span>
                      <span className="leading-relaxed">{order.note}</span>
                    </p>
                  )}
                </div>

                {/* Box count chip */}
                <span className="flex-shrink-0 bg-slate-100 text-slate-500 text-[11px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap mt-0.5">
                  {order.boxQuantity}{" "}
                  {order.boxQuantity === 1 ? "box" : "boxes"}
                </span>
              </div>
            ))}
          </div>

          {/* Action row */}
          <div className="px-6 pb-6 space-y-3">
            <button
              type="button"
              onClick={onNavigate}
              className="w-full h-12 rounded-xl bg-blue-700 hover:bg-blue-800 active:scale-[.98] text-white text-sm font-bold flex items-center justify-center gap-2 transition-all duration-150 shadow-md shadow-blue-800/20 hover:shadow-lg hover:shadow-blue-800/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                <path
                  d="M3 11l19-9-9 19-2-8-8-2z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Open Route Map · {results.length} stops
            </button>

            <button
              type="button"
              onClick={onReset}
              className="w-full text-xs font-semibold text-slate-400 hover:text-slate-600 underline underline-offset-2 transition-colors"
            >
              ← Start over
            </button>
          </div>
        </>
      )}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function GetRoutePage() {
  const router = useRouter();

  // ── Form state ─────────────────────────────────────────────────────────────
  const [form, setForm] = useState<FormState>({
    shipmentType: "delivery",
    capacity: 20,
    shift: "morning", // overridden by useEffect on mount
  });

  const [capacityInput, setCapacityInput] = useState<string>("20");
  const [capacityError, setCapacityError] = useState<string>("");
  const [shiftWasAutoSet, setShiftWasAutoSet] = useState(false);

  // ── Submit state ───────────────────────────────────────────────────────────
  const [phase, setPhase] = useState<SubmitPhase>("idle");
  const [results, setResults] = useState<Order[] | null>(null);
  const [usedBoxes, setUsedBoxes] = useState(0);
  const [skipped, setSkipped] = useState(0);

  // ── Smart default shift ────────────────────────────────────────────────────
  useEffect(() => {
    const detected = detectShift();
    setForm((prev) => ({ ...prev, shift: detected }));
    setShiftWasAutoSet(true);
  }, []);

  // ── Live pool stats ────────────────────────────────────────────────────────
  const poolStats = useMemo(() => {
    const matching = ORDER_POOL.filter(
      (o) =>
        o.shipmentType === form.shipmentType && o.deliveryShift === form.shift,
    );
    const totalBoxes = matching.reduce((s, o) => s + o.boxQuantity, 0);
    return { count: matching.length, totalBoxes };
  }, [form.shipmentType, form.shift]);

  // ── Current time label ─────────────────────────────────────────────────────
  const [currentTime] = useState(() =>
    new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
  );

  // ── Handlers ───────────────────────────────────────────────────────────────

  const handleCapacityChange = (raw: string) => {
    setCapacityInput(raw);
    const n = parseInt(raw, 10);
    if (!raw || isNaN(n) || n < 1) {
      setCapacityError("Enter a number between 1 and 999.");
    } else if (n > 999) {
      setCapacityError("Maximum is 999 boxes.");
    } else {
      setCapacityError("");
      setForm((prev) => ({ ...prev, capacity: n }));
    }
    resetResults();
  };

  const handleShiftChange = (shift: DeliveryShift) => {
    setForm((prev) => ({ ...prev, shift }));
    setShiftWasAutoSet(false); // user overrode, hide the "auto-detected" hint
    resetResults();
  };

  const handleShipmentTypeChange = (type: ShipmentType) => {
    setForm((prev) => ({ ...prev, shipmentType: type }));
    resetResults();
  };

  const resetResults = () => {
    setPhase("idle");
    setResults(null);
    setUsedBoxes(0);
    setSkipped(0);
  };

  const handleSubmit = () => {
    const cap = parseInt(capacityInput, 10);
    if (!capacityInput || isNaN(cap) || cap < 1) {
      setCapacityError("Enter a valid capacity first.");
      return;
    }
    if (capacityError) return;

    setPhase("calculating");
    setResults(null);

    setTimeout(() => {
      const packed = packOrders(ORDER_POOL, form.shipmentType, form.shift, cap);
      const totalMatchingBoxes = ORDER_POOL.filter(
        (o) =>
          o.shipmentType === form.shipmentType &&
          o.deliveryShift === form.shift,
      ).length;

      const boxes = packed.reduce((s, o) => s + o.boxQuantity, 0);
      setResults(packed);
      setUsedBoxes(boxes);
      setSkipped(totalMatchingBoxes - packed.length);
      setPhase("done");

      console.log("[ShipSwift] Filtered route orders:", packed);
    }, 1500);
  };

  const handleNavigate = () => {
    if (results) {
      // Production: store in sessionStorage, navigate
      // sessionStorage.setItem("routeOrders", JSON.stringify(results));
      // router.push("/route-optimization");
      console.log("[ShipSwift] Navigating with orders:", results);
      alert(
        `✅ Ready to navigate!\n\n${results.length} stops · ${usedBoxes} boxes\n\n` +
          `In production this calls:\nrouter.push('/route-optimization')\n\nwith the filtered orders in sessionStorage.`,
      );
    }
  };

  // ── Submit button state ────────────────────────────────────────────────────
  const canSubmit =
    !capacityError && !!capacityInput && parseInt(capacityInput, 10) >= 1;

  const btnLabel =
    phase === "calculating"
      ? "Calculating…"
      : phase === "done" && results !== null
        ? `${results.length} stops found — recalculate`
        : "Generate Route";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-slate-100 flex flex-col">
      {/* ── Sticky nav ── */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2.5 group select-none">
            <div className="w-7 h-7 rounded-[7px] bg-blue-700 flex items-center justify-center shadow-sm shadow-blue-900/20 group-hover:shadow-md transition-shadow">
              <svg viewBox="0 0 28 28" fill="none" width="16" height="16">
                <path
                  d="M4 14h11M10 10l4 4-4 4"
                  stroke="#fff"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle cx="20" cy="14" r="3" fill="#60a5fa" />
              </svg>
            </div>
            <span className="text-[17px] font-extrabold tracking-tight text-slate-900 group-hover:text-blue-700 transition-colors">
              ShipSwift
            </span>
          </a>

          {/* Right: time + active shift badge */}
          <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none">
              <circle
                cx="12"
                cy="12"
                r="9"
                stroke="currentColor"
                strokeWidth="1.8"
              />
              <path
                d="M12 7v5l3 3"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span>{currentTime}</span>
            <span className="text-slate-300">·</span>
            <span
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold border ${SHIFT_META[form.shift].bg} ${SHIFT_META[form.shift].color} ${SHIFT_META[form.shift].border}`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
              {SHIFT_META[form.shift].emoji} {SHIFT_META[form.shift].label}
            </span>
          </div>
        </div>
      </header>

      {/* ── Page body ── */}
      <main className="flex-1 flex flex-col items-center px-4 sm:px-6 py-8 sm:py-12">
        <div className="w-full max-w-lg">
          {/* Page title */}
          <div className="mb-7 text-center sm:text-left">
            <p className="text-[10px] font-bold tracking-widest text-blue-600 uppercase mb-1.5">
              Route Configuration
            </p>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Configure Your Route
            </h1>
            <p className="mt-2 text-sm text-slate-500 leading-relaxed">
              Choose your shipment type, shift, and vehicle capacity. ShipSwift
              will select and pack the optimal set of orders for your run.
            </p>
          </div>

          {/* ── Form card ── */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            {/* Card header */}
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-600">
                <svg
                  className="w-4 h-4 text-blue-700"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M3 16V6a1 1 0 011-1h10a1 1 0 011 1v10M3 16h12M3 16a2 2 0 104 0M15 16a2 2 0 104 0M15 9h3l3 3v4h-2"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Vehicle &amp; Shift Settings
              </div>
              <span className="text-xs text-slate-400">
                {ORDER_POOL.length} orders in pool
                {poolStats.count > 0 && (
                  <>
                    {" "}
                    ·{" "}
                    <span className="text-slate-600 font-semibold">
                      {poolStats.count} match
                    </span>
                  </>
                )}
              </span>
            </div>

            {/* Fields */}
            <div className="p-6 sm:p-7 space-y-7">
              {/* 1 · Shipment Type */}
              <div>
                <SectionLabel
                  icon={
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
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
                  }
                  hint="What kind of orders will this vehicle handle?"
                >
                  Shipment Type
                </SectionLabel>
                <ShipmentToggle
                  value={form.shipmentType}
                  onChange={handleShipmentTypeChange}
                />
              </div>

              {/* 2 · Vehicle Capacity */}
              <div>
                <SectionLabel
                  icon={
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <rect
                        x="2"
                        y="7"
                        width="20"
                        height="14"
                        rx="2"
                        stroke="currentColor"
                        strokeWidth="1.8"
                      />
                      <path
                        d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                      />
                    </svg>
                  }
                  hint="Maximum number of boxes the vehicle can carry in one run."
                >
                  Vehicle Box Capacity
                </SectionLabel>
                <CapacityInput
                  value={capacityInput}
                  onChange={handleCapacityChange}
                  error={capacityError}
                />

                {/* Live hint */}
                {!capacityError && poolStats.count > 0 && (
                  <p className="mt-2 text-xs text-slate-400">
                    {poolStats.count} matching orders · {poolStats.totalBoxes}{" "}
                    boxes total.{" "}
                    {form.capacity >= poolStats.totalBoxes ? (
                      <span className="text-green-600 font-semibold">
                        Vehicle fits the full load.
                      </span>
                    ) : (
                      <span className="text-amber-600 font-semibold">
                        Greedy-packing to {form.capacity} boxes.
                      </span>
                    )}
                  </p>
                )}
                {!capacityError && poolStats.count === 0 && (
                  <p className="mt-2 text-xs text-amber-600 font-medium">
                    No {form.shipmentType} orders for the{" "}
                    {SHIFT_META[form.shift].label} shift yet.
                  </p>
                )}
              </div>

              {/* 3 · Shift */}
              <div>
                <SectionLabel
                  icon={
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <circle
                        cx="12"
                        cy="12"
                        r="9"
                        stroke="currentColor"
                        strokeWidth="1.8"
                      />
                      <path
                        d="M12 7v5l3 3"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  }
                  hint={`Auto-detected ${SHIFT_META[form.shift].label} based on current time (${currentTime}).`}
                >
                  Client Availability Shift
                </SectionLabel>
                <ShiftSelect
                  value={form.shift}
                  onChange={handleShiftChange}
                  autoDetected={shiftWasAutoSet}
                />
              </div>

              {/* Submit */}
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!canSubmit || phase === "calculating"}
                className={[
                  "w-full h-[52px] rounded-xl flex items-center justify-center gap-2.5 text-sm font-bold transition-all duration-200",
                  "focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 select-none",
                  !canSubmit || phase === "calculating"
                    ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                    : phase === "done"
                      ? "bg-green-600 hover:bg-green-700 text-white shadow-md shadow-green-900/20 active:scale-[.98]"
                      : "bg-blue-700 hover:bg-blue-800 text-white shadow-md shadow-blue-900/25 hover:shadow-lg active:scale-[.98]",
                ].join(" ")}
              >
                {phase === "calculating" ? (
                  <>
                    <svg
                      className="w-4 h-4 animate-spin"
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
                    Calculating route…
                  </>
                ) : phase === "done" ? (
                  <>
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M5 13l4 4L19 7"
                        stroke="white"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    {btnLabel}
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M3 12h18M3 6h6M15 6h6M3 18h6M15 18h6"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                    {btnLabel}
                  </>
                )}
              </button>
            </div>
          </div>

          {/* ── Loading ── */}
          {phase === "calculating" && (
            <LoadingState
              shift={form.shift}
              shipmentType={form.shipmentType}
              capacity={form.capacity}
            />
          )}

          {/* ── Results ── */}
          {phase === "done" && results !== null && (
            <ResultsPanel
              results={results}
              usedBoxes={usedBoxes}
              capacity={form.capacity}
              shift={form.shift}
              shipmentType={form.shipmentType}
              skipped={skipped}
              onReset={resetResults}
              onNavigate={handleNavigate}
            />
          )}

          <div className="h-12" />
        </div>
      </main>
    </div>
  );
}
