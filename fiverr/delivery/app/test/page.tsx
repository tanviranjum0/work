/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
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
  capacity: string;
  shift: DeliveryShift;
}

type SubmitPhase = "idle" | "calculating" | "done";

// ─── Constants ────────────────────────────────────────────────────────────────

const WAREHOUSE = "Izaäk Enschedéweg 50, 2031 CS Haarlem, Netherlands";

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

function getDefaultShift(): DeliveryShift {
  const h = new Date().getHours();
  if (h >= 6 && h < 12) return "morning";
  if (h >= 12 && h < 18) return "afternoon";
  if (h >= 18 && h < 24) return "evening";
  return "night";
}

// ─── Mock Order Pool (40 orders) ──────────────────────────────────────────────

// const ORDER_POOl: Order[] = [
//   /* ─ morning collection ─ */
//   {
//     pickupAddress: WAREHOUSE,
//     deliveryAddress: "Grote Markt 1, 2011 RD Haarlem",
//     deliverySelected: { lat: 52.3807, lng: 4.6333 },
//     boxQuantity: 3,
//     clientName: "Emma de Vries",
//     shipmentType: "collection",
//     clientPhoneNumber: "+31612345601",
//     deliveryShift: "morning",
//     note: "Ring doorbell twice",
//   },
//   {
//     pickupAddress: WAREHOUSE,
//     deliveryAddress: "Pijnboomstraat 3, 2023 VK Haarlem",
//     deliverySelected: { lat: 52.396, lng: 4.6527 },
//     boxQuantity: 2,
//     clientName: "Joost Laan",
//     shipmentType: "collection",
//     clientPhoneNumber: "+31612345612",
//     deliveryShift: "morning",
//     note: "",
//   },
//   {
//     pickupAddress: WAREHOUSE,
//     deliveryAddress: "Planetenlaan 7, 2024 HN Haarlem",
//     deliverySelected: { lat: 52.4078, lng: 4.6612 },
//     boxQuantity: 4,
//     clientName: "Roos van Dijk",
//     shipmentType: "collection",
//     clientPhoneNumber: "+31612345613",
//     deliveryShift: "morning",
//     note: "",
//   },
//   {
//     pickupAddress: WAREHOUSE,
//     deliveryAddress: "Nieuwe Groenmarkt 8, 2011 WC Haarlem",
//     deliverySelected: { lat: 52.3813, lng: 4.6361 },
//     boxQuantity: 1,
//     clientName: "Lisa Bos",
//     shipmentType: "collection",
//     clientPhoneNumber: "+31612345611",
//     deliveryShift: "morning",
//     note: "",
//   },
//   {
//     pickupAddress: WAREHOUSE,
//     deliveryAddress: "Kinderhuisvest 3, 2011 PL Haarlem",
//     deliverySelected: { lat: 52.3818, lng: 4.6344 },
//     boxQuantity: 5,
//     clientName: "Amber van Beek",
//     shipmentType: "collection",
//     clientPhoneNumber: "+31612345625",
//     deliveryShift: "morning",
//     note: "",
//   },
//   {
//     pickupAddress: WAREHOUSE,
//     deliveryAddress: "Spaarndamseweg 100, 2021 BA Haarlem",
//     deliverySelected: { lat: 52.3941, lng: 4.6278 },
//     boxQuantity: 2,
//     clientName: "Lotte Mulder",
//     shipmentType: "collection",
//     clientPhoneNumber: "+31612345623",
//     deliveryShift: "morning",
//     note: "",
//   },
//   {
//     pickupAddress: WAREHOUSE,
//     deliveryAddress: "Molenkade 5, 2032 JX Haarlem",
//     deliverySelected: { lat: 52.401, lng: 4.6395 },
//     boxQuantity: 3,
//     clientName: "Ineke Vogel",
//     shipmentType: "collection",
//     clientPhoneNumber: "+31612345629",
//     deliveryShift: "morning",
//     note: "",
//   },
//   {
//     pickupAddress: WAREHOUSE,
//     deliveryAddress: "Floris van Adrichemstraat 22, 2021 Haarlem",
//     deliverySelected: { lat: 52.387, lng: 4.646 },
//     boxQuantity: 4,
//     clientName: "Eva Willems",
//     shipmentType: "collection",
//     clientPhoneNumber: "+31612345621",
//     deliveryShift: "morning",
//     note: "",
//   },
//   {
//     pickupAddress: WAREHOUSE,
//     deliveryAddress: "Koediefslaan 12, 2015 CJ Haarlem",
//     deliverySelected: { lat: 52.389, lng: 4.6009 },
//     boxQuantity: 6,
//     clientName: "Tim Kuijpers",
//     shipmentType: "collection",
//     clientPhoneNumber: "+31612345626",
//     deliveryShift: "morning",
//     note: "",
//   },
//   {
//     pickupAddress: WAREHOUSE,
//     deliveryAddress: "Nassaulaan 25, 2012 JL Haarlem",
//     deliverySelected: { lat: 52.3845, lng: 4.6302 },
//     boxQuantity: 3,
//     clientName: "Jelle Vermeulen",
//     shipmentType: "collection",
//     clientPhoneNumber: "+31612345634",
//     deliveryShift: "morning",
//     note: "Parcel locker available",
//   },
//   /* ─ morning delivery ─ */
//   {
//     pickupAddress: WAREHOUSE,
//     deliveryAddress: "Zijlweg 40, 2013 SK Haarlem",
//     deliverySelected: { lat: 52.3889, lng: 4.6241 },
//     boxQuantity: 5,
//     clientName: "Lars Bakker",
//     shipmentType: "delivery",
//     clientPhoneNumber: "+31612345602",
//     deliveryShift: "morning",
//     note: "",
//   },
//   {
//     pickupAddress: WAREHOUSE,
//     deliveryAddress: "Wagenweg 76, 2012 NM Haarlem",
//     deliverySelected: { lat: 52.3852, lng: 4.638 },
//     boxQuantity: 8,
//     clientName: "Daan Mulder",
//     shipmentType: "delivery",
//     clientPhoneNumber: "+31612345604",
//     deliveryShift: "morning",
//     note: "Heavy package",
//   },
//   {
//     pickupAddress: WAREHOUSE,
//     deliveryAddress: "Frans Halsstraat 12, 2021 AK Haarlem",
//     deliverySelected: { lat: 52.3862, lng: 4.649 },
//     boxQuantity: 4,
//     clientName: "Tom Visser",
//     shipmentType: "delivery",
//     clientPhoneNumber: "+31612345606",
//     deliveryShift: "morning",
//     note: "Fragile items",
//   },
//   {
//     pickupAddress: WAREHOUSE,
//     deliveryAddress: "Westergracht 30, 2012 HD Haarlem",
//     deliverySelected: { lat: 52.3828, lng: 4.631 },
//     boxQuantity: 2,
//     clientName: "Bas Kuiper",
//     shipmentType: "delivery",
//     clientPhoneNumber: "+31612345608",
//     deliveryShift: "morning",
//     note: "Call on arrival",
//   },
//   {
//     pickupAddress: WAREHOUSE,
//     deliveryAddress: "Houtplein 18, 2012 DE Haarlem",
//     deliverySelected: { lat: 52.3836, lng: 4.6351 },
//     boxQuantity: 5,
//     clientName: "Sander Prins",
//     shipmentType: "delivery",
//     clientPhoneNumber: "+31612345616",
//     deliveryShift: "morning",
//     note: "Doorcode 4521",
//   },
//   {
//     pickupAddress: WAREHOUSE,
//     deliveryAddress: "Lange Begijnestraat 9, 2011 HM Haarlem",
//     deliverySelected: { lat: 52.3805, lng: 4.6349 },
//     boxQuantity: 2,
//     clientName: "Merel Vliet",
//     shipmentType: "delivery",
//     clientPhoneNumber: "+31612345617",
//     deliveryShift: "morning",
//     note: "",
//   },
//   {
//     pickupAddress: WAREHOUSE,
//     deliveryAddress: "Dreef 33, 2012 HR Haarlem",
//     deliverySelected: { lat: 52.386, lng: 4.634 },
//     boxQuantity: 3,
//     clientName: "Westelijk Halfrond",
//     shipmentType: "delivery",
//     clientPhoneNumber: "+31612345632",
//     deliveryShift: "morning",
//     note: "",
//   },
//   {
//     pickupAddress: WAREHOUSE,
//     deliveryAddress: "Middenweg 55, 2033 RB Haarlem",
//     deliverySelected: { lat: 52.404, lng: 4.642 },
//     boxQuantity: 4,
//     clientName: "Max van Rooij",
//     shipmentType: "delivery",
//     clientPhoneNumber: "+31612345638",
//     deliveryShift: "morning",
//     note: "",
//   },
//   {
//     pickupAddress: WAREHOUSE,
//     deliveryAddress: "Vondelweg 8, 2023 CD Haarlem",
//     deliverySelected: { lat: 52.3968, lng: 4.6493 },
//     boxQuantity: 9,
//     clientName: "Ben van der Berg",
//     shipmentType: "delivery",
//     clientPhoneNumber: "+31612345640",
//     deliveryShift: "morning",
//     note: "Ground floor only",
//   },
//   {
//     pickupAddress: WAREHOUSE,
//     deliveryAddress: "Kruisweg 3, 2131 CR Hoofddorp",
//     deliverySelected: { lat: 52.3055, lng: 4.686 },
//     boxQuantity: 5,
//     clientName: "Omar Saleh",
//     shipmentType: "delivery",
//     clientPhoneNumber: "+31612345636",
//     deliveryShift: "morning",
//     note: "",
//   },
//   /* ─ afternoon collection ─ */
//   {
//     pickupAddress: WAREHOUSE,
//     deliveryAddress: "Kleverlaan 99, 2023 JB Haarlem",
//     deliverySelected: { lat: 52.3978, lng: 4.6512 },
//     boxQuantity: 2,
//     clientName: "Sofia Jansen",
//     shipmentType: "collection",
//     clientPhoneNumber: "+31612345603",
//     deliveryShift: "afternoon",
//     note: "Leave at front door",
//   },
//   {
//     pickupAddress: WAREHOUSE,
//     deliveryAddress: "Schotersingel 30, 2021 GH Haarlem",
//     deliverySelected: { lat: 52.3943, lng: 4.6455 },
//     boxQuantity: 4,
//     clientName: "Noor van den Berg",
//     shipmentType: "collection",
//     clientPhoneNumber: "+31612345605",
//     deliveryShift: "afternoon",
//     note: "",
//   },
//   {
//     pickupAddress: WAREHOUSE,
//     deliveryAddress: "Rijksstraatweg 14, 2024 EB Haarlem",
//     deliverySelected: { lat: 52.4051, lng: 4.658 },
//     boxQuantity: 1,
//     clientName: "Fleur Smit",
//     shipmentType: "collection",
//     clientPhoneNumber: "+31612345607",
//     deliveryShift: "afternoon",
//     note: "",
//   },
//   {
//     pickupAddress: WAREHOUSE,
//     deliveryAddress: "Duinwijcklaan 5, 2015 HA Haarlem",
//     deliverySelected: { lat: 52.3905, lng: 4.596 },
//     boxQuantity: 3,
//     clientName: "Anne Meijer",
//     shipmentType: "collection",
//     clientPhoneNumber: "+31612345609",
//     deliveryShift: "afternoon",
//     note: "",
//   },
//   {
//     pickupAddress: WAREHOUSE,
//     deliveryAddress: "Binnenweg 42, 2101 JJ Heemstede",
//     deliverySelected: { lat: 52.353, lng: 4.6172 },
//     boxQuantity: 3,
//     clientName: "Iris Vermeer",
//     shipmentType: "collection",
//     clientPhoneNumber: "+31612345615",
//     deliveryShift: "afternoon",
//     note: "",
//   },
//   {
//     pickupAddress: WAREHOUSE,
//     deliveryAddress: "Zandvoortselaan 33, 2100 AA Heemstede",
//     deliverySelected: { lat: 52.36, lng: 4.589 },
//     boxQuantity: 1,
//     clientName: "Julia Brouwer",
//     shipmentType: "collection",
//     clientPhoneNumber: "+31612345619",
//     deliveryShift: "afternoon",
//     note: "",
//   },
//   {
//     pickupAddress: WAREHOUSE,
//     deliveryAddress: "Toolenburgerplas 10, 2132 MN Hoofddorp",
//     deliverySelected: { lat: 52.2998, lng: 4.698 },
//     boxQuantity: 3,
//     clientName: "Layla van der Zee",
//     shipmentType: "collection",
//     clientPhoneNumber: "+31612345637",
//     deliveryShift: "afternoon",
//     note: "Call 30 min before",
//   },
//   {
//     pickupAddress: WAREHOUSE,
//     deliveryAddress: "Nieuwe Kerksplein 1, 2011 MG Haarlem",
//     deliverySelected: { lat: 52.3808, lng: 4.6339 },
//     boxQuantity: 4,
//     clientName: "Vera Visser",
//     shipmentType: "collection",
//     clientPhoneNumber: "+31612345633",
//     deliveryShift: "afternoon",
//     note: "",
//   },
//   /* ─ afternoon delivery ─ */
//   {
//     pickupAddress: WAREHOUSE,
//     deliveryAddress: "Tempeliersstraat 22, 2012 EN Haarlem",
//     deliverySelected: { lat: 52.3816, lng: 4.637 },
//     boxQuantity: 7,
//     clientName: "Pieter de Groot",
//     shipmentType: "delivery",
//     clientPhoneNumber: "+31612345610",
//     deliveryShift: "afternoon",
//     note: "No elevator",
//   },
//   {
//     pickupAddress: WAREHOUSE,
//     deliveryAddress: "Heemsteedse Dreef 70, 2102 KR Heemstede",
//     deliverySelected: { lat: 52.3555, lng: 4.6204 },
//     boxQuantity: 6,
//     clientName: "Koen Hendriks",
//     shipmentType: "delivery",
//     clientPhoneNumber: "+31612345614",
//     deliveryShift: "afternoon",
//     note: "Bulky items",
//   },
//   {
//     pickupAddress: WAREHOUSE,
//     deliveryAddress: "Raaks 1, 2011 LS Haarlem",
//     deliverySelected: { lat: 52.3811, lng: 4.6348 },
//     boxQuantity: 6,
//     clientName: "Robin de Graaf",
//     shipmentType: "delivery",
//     clientPhoneNumber: "+31612345624",
//     deliveryShift: "afternoon",
//     note: "Leave with neighbor",
//   },
//   {
//     pickupAddress: WAREHOUSE,
//     deliveryAddress: "Klokhuisplein 6, 2011 HK Haarlem",
//     deliverySelected: { lat: 52.381, lng: 4.6358 },
//     boxQuantity: 5,
//     clientName: "Niels de Boer",
//     shipmentType: "delivery",
//     clientPhoneNumber: "+31612345622",
//     deliveryShift: "afternoon",
//     note: "Signature required",
//   },
//   {
//     pickupAddress: WAREHOUSE,
//     deliveryAddress: "Cronjéstraat 15, 2042 AE Zandvoort",
//     deliverySelected: { lat: 52.3713, lng: 4.5328 },
//     boxQuantity: 7,
//     clientName: "Hugo van Leeuwen",
//     shipmentType: "delivery",
//     clientPhoneNumber: "+31612345618",
//     deliveryShift: "afternoon",
//     note: "Coastal delivery",
//   },
//   /* ─ evening collection & delivery ─ */
//   {
//     pickupAddress: WAREHOUSE,
//     deliveryAddress: "Garenkokerskade 18, 2031 EM Haarlem",
//     deliverySelected: { lat: 52.3999, lng: 4.6437 },
//     boxQuantity: 7,
//     clientName: "Dagmar Laan",
//     shipmentType: "collection",
//     clientPhoneNumber: "+31612345631",
//     deliveryShift: "evening",
//     note: "Warehouse entrance round back",
//   },
//   {
//     pickupAddress: WAREHOUSE,
//     deliveryAddress: "Elswoutslaan 1, 2051 AB Overveen",
//     deliverySelected: { lat: 52.392, lng: 4.588 },
//     boxQuantity: 8,
//     clientName: "Fenna Dekker",
//     shipmentType: "collection",
//     clientPhoneNumber: "+31612345627",
//     deliveryShift: "evening",
//     note: "Through gate on left",
//   },
//   {
//     pickupAddress: WAREHOUSE,
//     deliveryAddress: "Veerpolder 5, 2031 XA Haarlem",
//     deliverySelected: { lat: 52.402, lng: 4.6488 },
//     boxQuantity: 6,
//     clientName: "Hanna de Wit",
//     shipmentType: "delivery",
//     clientPhoneNumber: "+31612345635",
//     deliveryShift: "evening",
//     note: "",
//   },
//   {
//     pickupAddress: WAREHOUSE,
//     deliveryAddress: "Bloemendaalseweg 100, 2061 AG Bloemendaal",
//     deliverySelected: { lat: 52.4002, lng: 4.57 },
//     boxQuantity: 2,
//     clientName: "Cas van Vliet",
//     shipmentType: "delivery",
//     clientPhoneNumber: "+31612345628",
//     deliveryShift: "evening",
//     note: "",
//   },
//   {
//     pickupAddress: WAREHOUSE,
//     deliveryAddress: "Spekstraat 8, 2011 SW Haarlem",
//     deliverySelected: { lat: 52.3801, lng: 4.6357 },
//     boxQuantity: 4,
//     clientName: "Sven Hendriks",
//     shipmentType: "delivery",
//     clientPhoneNumber: "+31612345630",
//     deliveryShift: "evening",
//     note: "",
//   },
//   /* ─ night collection & delivery ─ */
//   {
//     pickupAddress: WAREHOUSE,
//     deliveryAddress: "Westelijk Halfrond 42, 2033 GG Haarlem",
//     deliverySelected: { lat: 52.403, lng: 4.6275 },
//     boxQuantity: 3,
//     clientName: "Boris Akkerman",
//     shipmentType: "collection",
//     clientPhoneNumber: "+31612345632",
//     deliveryShift: "night",
//     note: "",
//   },
//   {
//     pickupAddress: WAREHOUSE,
//     deliveryAddress: "Oudeweg 60, 2031 CC Haarlem",
//     deliverySelected: { lat: 52.3997, lng: 4.6441 },
//     boxQuantity: 4,
//     clientName: "Mark Dijkstra",
//     shipmentType: "delivery",
//     clientPhoneNumber: "+31612345620",
//     deliveryShift: "night",
//     note: "Near the park",
//   },
// ];

// ─── Greedy packing filter ────────────────────────────────────────────────────

function greedyPack(
  pool: Order[],
  type: ShipmentType,
  shift: DeliveryShift,
  cap: number,
): Order[] {
  const candidates = pool.filter(
    (o) => o.shipmentType === type && o.deliveryShift === shift,
  );
  const result: Order[] = [];
  let used = 0;
  for (const o of candidates) {
    if (used + o.boxQuantity <= cap) {
      result.push(o);
      used += o.boxQuantity;
    }
  }
  return result;
}

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
const IcoNav = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
    <path
      d="M3 11l19-9-9 19-2-8-8-2z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// ─── Main component ───────────────────────────────────────────────────────────

export default function GetRoutePage() {
  const ORDER_POOL: Order[] = [];
  const [orders, setOrders] = useState(ORDER_POOL);
  const router = useRouter();
  const loadInitialOrderData = async () => {
    const result = await fetch(
      process.env.NEXT_PUBLIC_BACKEND_URL + "/api/routes/initial",
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      },
    );
    const data = await result.json();
    if (data.length == 0) {
      router.push("/new-shipment");
    }
    if (result.ok) {
      setOrders(data);
    } else {
      alert("Something Went Wrong");
    }
  };

  // ── Form state ──────────────────────────────────────────────────────────────
  const [form, setForm] = useState<FormState>({
    shipmentType: "delivery",
    capacity: "240",
    shift: "morning",
  });
  const [capacityErr, setCapacityErr] = useState("");

  // ── Submit state ────────────────────────────────────────────────────────────
  const [phase, setPhase] = useState<SubmitPhase>("idle");
  const [results, setResults] = useState<Order[] | null>(null);
  const [usedBoxes, setUsedBoxes] = useState(0);

  // ── Smart default shift ─────────────────────────────────────────────────────
  useEffect(() => {
    loadInitialOrderData();
    setForm((prev) => ({ ...prev, shift: getDefaultShift() }));
  }, []);

  // ── Derived helpers ─────────────────────────────────────────────────────────
  const parsedCap = parseInt(form.capacity, 10);
  const capValid =
    form.capacity !== "" &&
    !isNaN(parsedCap) &&
    parsedCap >= 1 &&
    parsedCap <= 999;

  const poolStats = useMemo(() => {
    const m = orders.filter(
      (o) =>
        o.shipmentType === form.shipmentType && o.deliveryShift === form.shift,
    );
    return {
      count: m.length,
      totalBoxes: m.reduce((s, o) => s + o.boxQuantity, 0),
    };
  }, [form.shipmentType, form.shift]);

  const currentShift = SHIFT_CONFIG[form.shift];

  // ── Handlers ────────────────────────────────────────────────────────────────
  const resetResults = useCallback(() => {
    setPhase("idle");
    setResults(null);
    setUsedBoxes(0);
  }, []);

  const handleCapacity = (v: string) => {
    setForm((p) => ({ ...p, capacity: v }));
    resetResults();
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

  const handleSubmit = () => {
    if (!capValid) {
      setCapacityErr("Enter a valid capacity first.");
      return;
    }
    setPhase("calculating");
    setResults(null);

    const filtered = greedyPack(
      orders,
      form.shipmentType,
      form.shift,
      parsedCap,
    );
    const boxes = filtered.reduce((s, o) => s + o.boxQuantity, 0);
    setResults(filtered);
    setUsedBoxes(boxes);
    setPhase("done");
    // In production:
    // sessionStorage.setItem("routeOrders", JSON.stringify(filtered));
    // router.push("/route-optimization");
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

  // ─────────────────────────────────────────────────────────────────────────────
  const handleGetOptimizedRoute = async () => {
    console.log(results);
    localStorage.setItem("OptimizedRouteShipments", "");
    const result = await fetch(
      process.env.NEXT_PUBLIC_BACKEND_URL + "/api/routes/start",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(results),
      },
    );
    if (result.ok) {
      router.push("/optimized-route");
    }
  };
  return (
    <div className="min-h-screen bg-[#0b1220] flex flex-col">
      {/* ── Sticky nav ─────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-30  backdrop-blur-md border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
          {/* Logo */}
          {/* <a
            href="/"
            className="flex items-center gap-2.5 group outline-none focus-visible:ring-2 focus-visible:ring-blue-600 rounded-lg"
          >
            <div className="w-[30px] h-[30px] rounded-[8px] bg-blue-700 flex items-center justify-center shadow-sm shadow-blue-900/30 group-hover:shadow-md transition-shadow">
              <svg viewBox="0 0 28 28" fill="none" width="17" height="17">
                <path
                  d="M5 14h11M11 10l4 4-4 4"
                  stroke="#fff"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle cx="20" cy="14" r="3" fill="#93c5fd" />
              </svg>
            </div>
            <span className="text-[17px] font-[800] tracking-tight text-slate-900 leading-none">
              ShipSwift
            </span>
          </a> */}

          {/* Live context pills */}
          {/* <div className="flex items-center gap-2 text-xs font-semibold select-none"> */}
          <span className="hidden sm:flex items-center gap-1 text-slate-400">
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
              Set your vehicle&apos;s capacity and target shift. ShipSwift packs
              the best possible order list and routes your day.
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
                  {(["delivery", "collection"] as ShipmentType[]).map(
                    (type) => {
                      const active = form.shipmentType === type;
                      return (
                        <button
                          key={type}
                          type="button"
                          role="radio"
                          aria-checked={active}
                          onClick={() => {
                            setForm((p) => ({ ...p, shipmentType: type }));
                            resetResults();
                          }}
                          className={[
                            "relative flex flex-col items-center gap-2.5 py-5 px-4 rounded-xl border-[1.5px]",
                            "text-sm font-semibold transition-all duration-150 cursor-pointer select-none",
                            "focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1",
                            active
                              ? "border-blue-600 bg-blue-700 text-white shadow-md shadow-blue-800/20"
                              : "border-slate-200 bg-white text-slate-500 hover:border-slate-300 hover:bg-slate-50",
                          ].join(" ")}
                        >
                          <span
                            className={
                              active ? "text-blue-200" : "text-slate-300"
                            }
                          >
                            {type === "delivery" ? (
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
                            ) : (
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
                            )}
                          </span>
                          <span className="capitalize leading-none">
                            {type}
                          </span>
                          {active && (
                            <span className="absolute top-2 right-2 text-white/60">
                              <IcoCheck />
                            </span>
                          )}
                        </button>
                      );
                    },
                  )}
                </div>
              </fieldset>

              {/* ── Vehicle Capacity ──────────────────────── */}
              <div>
                <label
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
                </p>
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

                {/* Validation error */}
                {capacityErr && (
                  <p
                    className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-red-600"
                    role="alert"
                  >
                    <IcoAlert /> {capacityErr}
                  </p>
                )}

                {/* Live hint */}
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

              {/* ── Shift selector ────────────────────────── */}
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
                <p className="text-xs text-slate-400 mb-2.5">
                  Auto-detected from current time ({clock}). Change if needed.
                </p>
                <div className="relative">
                  <select
                    id="shift"
                    value={form.shift}
                    onChange={(e) => {
                      setForm((p) => ({
                        ...p,
                        shift: e.target.value as DeliveryShift,
                      }));
                      resetResults();
                    }}
                    className="w-full h-12 rounded-xl border-[1.5px] border-slate-200 hover:border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 px-4 pr-10 text-sm font-semibold text-slate-800 bg-white appearance-none outline-none transition-all duration-150 cursor-pointer"
                  >
                    {(Object.keys(SHIFT_CONFIG) as DeliveryShift[]).map((s) => {
                      const c = SHIFT_CONFIG[s];
                      return (
                        <option key={s} value={s}>
                          {c.emoji} {c.label} — {c.hours}
                        </option>
                      );
                    })}
                  </select>
                  <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                    <IcoChevron />
                  </span>
                </div>

                {/* Shift chip preview */}
                <div className="mt-2.5 flex flex-wrap gap-2">
                  {(Object.keys(SHIFT_CONFIG) as DeliveryShift[]).map((s) => {
                    const c = SHIFT_CONFIG[s];
                    const count = orders.filter(
                      (o) =>
                        o.deliveryShift === s &&
                        o.shipmentType === form.shipmentType,
                    ).length;
                    return (
                      <button
                        key={s}
                        type="button"
                        onClick={() => {
                          setForm((p) => ({ ...p, shift: s }));
                          resetResults();
                        }}
                        className={[
                          "flex items-center gap-1 px-2 py-1 rounded-full text-[11px] font-semibold border transition-all duration-100 cursor-pointer select-none",
                          form.shift === s
                            ? `${c.color} ${c.bg} ${c.border} shadow-sm`
                            : "text-slate-400 bg-slate-50 border-slate-200 hover:border-slate-300",
                        ].join(" ")}
                      >
                        {c.emoji} {c.label}
                        <span className="ml-0.5 opacity-60">({count})</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* ── Submit button ─────────────────────────── */}
              <button
                type="button"
                onClick={handleSubmit}
                disabled={phase === "calculating" || !capValid}
                className={[
                  "w-full h-13 rounded-xl flex items-center justify-center gap-2.5 text-sm font-bold",
                  "transition-all duration-150 select-none focus:outline-none",
                  "focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2",
                  phase === "calculating"
                    ? "bg-blue-500 text-white cursor-not-allowed opacity-80"
                    : phase === "done" && results !== null
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
                ) : phase === "done" && results !== null ? (
                  <>
                    <span className="text-emerald-200">
                      <IcoCheck />
                    </span>{" "}
                    Route ready — {results.length} stops
                  </>
                ) : (
                  <>
                    <IcoRoute /> Generate route
                  </>
                )}
              </button>

              {phase === "done" && (
                <button
                  type="button"
                  onClick={resetResults}
                  className="w-full text-xs font-semibold text-slate-400 hover:text-slate-600 underline underline-offset-2 transition-colors"
                >
                  ← Reconfigure
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
                  {form.shipmentType} · {SHIFT_CONFIG[form.shift].label} shift ·{" "}
                  up to {form.capacity} boxes
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
          {phase === "done" && results !== null && (
            <div className="mt-5 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              {/* Results header */}
              <div className="px-6 py-4 bg-slate-50 border-b border-slate-100">
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div>
                    <p className="text-[10px] font-bold tracking-widest text-slate-400 uppercase mb-0.5">
                      Result
                    </p>
                    <h2 className="text-base font-bold text-slate-800">
                      {results.length > 0
                        ? `${results.length} stops selected`
                        : "No orders found"}
                    </h2>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                      {usedBoxes}/{form.capacity} boxes
                    </span>
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${currentShift.color} ${currentShift.bg} ${currentShift.border}`}
                    >
                      {currentShift.emoji} {currentShift.label}
                    </span>
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${
                        form.shipmentType === "delivery"
                          ? "bg-indigo-50 text-indigo-700 border-indigo-200"
                          : "bg-teal-50 text-teal-700 border-teal-200"
                      }`}
                    >
                      {form.shipmentType}
                    </span>
                  </div>
                </div>
              </div>

              {/* Empty state */}
              {results.length === 0 ? (
                <div className="px-6 py-10 flex flex-col items-center gap-3 text-center">
                  <div className="w-11 h-11 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
                    <IcoAlert />
                  </div>
                  <p className="text-sm font-bold text-slate-700">
                    No orders match your criteria
                  </p>
                  <p className="text-xs text-slate-400 max-w-xs">
                    No <strong>{form.shipmentType}</strong> orders exist for the{" "}
                    <strong>{SHIFT_CONFIG[form.shift].label}</strong> shift, or
                    the capacity is too low for any single order.
                  </p>
                </div>
              ) : (
                <>
                  {/* Capacity bar */}
                  <div className="px-6 pt-5">
                    <div className="flex justify-between text-xs font-semibold text-slate-400 mb-1.5">
                      <span>Capacity used</span>
                      <span
                        className={
                          usedBoxes >= parsedCap
                            ? "text-orange-600 font-bold"
                            : ""
                        }
                      >
                        {usedBoxes} / {parsedCap} boxes
                        {usedBoxes >= parsedCap ? " · full" : ""}
                      </span>
                    </div>
                    <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-linear-to-r from-blue-700 to-blue-400 transition-all duration-700 ease-out"
                        style={{
                          width: `${Math.min((usedBoxes / parsedCap) * 100, 100)}%`,
                        }}
                      />
                    </div>
                  </div>

                  {/* Stop list */}
                  <ul className="px-6 py-4 divide-y divide-slate-100">
                    {results.map((o, i) => (
                      <li
                        key={`${o.clientName}-${i}`}
                        className="py-3 flex items-start gap-3 group"
                      >
                        <span className="mt-0.5 w-6 h-6 rounded-full bg-blue-700 text-white text-[11px] font-bold flex items-center justify-center shrink-0">
                          {i + 1}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-slate-800 leading-tight">
                            {o.clientName}
                          </p>
                          <p className="text-xs text-slate-400 mt-0.5 truncate">
                            {o.deliveryAddress}
                          </p>
                          {o.note && (
                            <p className="text-xs text-amber-700 italic mt-0.5">
                              ↳ {o.note}
                            </p>
                          )}
                          <p className="text-[11px] text-slate-400 mt-0.5">
                            {o.clientPhoneNumber}
                          </p>
                        </div>
                        <span className="shrink-0 bg-slate-100 text-slate-500 text-xs font-semibold px-2 py-0.5 rounded-full whitespace-nowrap self-start mt-0.5">
                          {o.boxQuantity}{" "}
                          {o.boxQuantity === 1 ? "box" : "boxes"}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {/* Skipped orders note */}
                  {(() => {
                    const skipped = poolStats.count - results.length;
                    return skipped > 0 ? (
                      <div className="px-6 py-3 border-t border-slate-100 text-xs text-slate-400 text-center">
                        {skipped} order{skipped !== 1 ? "s" : ""} from this
                        shift skipped due to capacity.
                      </div>
                    ) : null;
                  })()}

                  {/* Navigate CTA */}
                  <div className="px-6 pb-6 pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        handleGetOptimizedRoute();
                      }}
                      className="w-full h-12 rounded-xl bg-blue-700 hover:bg-blue-800 active:scale-[.98] text-white text-sm font-bold flex items-center justify-center gap-2 transition-all duration-150 shadow-md shadow-blue-900/20 hover:shadow-lg hover:shadow-blue-900/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                    >
                      <IcoNav />
                      Open route map · {results.length} stops
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
