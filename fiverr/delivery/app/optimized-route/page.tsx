/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Script from "next/script";

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
  deliveryShift: "morning" | "afternoon" | "evening" | "night";
  note: string;
  __v: number;
}

type OrderStatus = "pending" | "in_transit" | "delivered";
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
    boxQuantity: 43,
    driverAllocated: false,
    status: "pending",
    deliveryShift: "morning",
    note: "Loading...",
    createdAt: "2026-06-18T17:47:12.474Z",
    updatedAt: "2026-06-18T17:47:12.474Z",
    __v: 0,
  },
  //   {
  //     deliverySelected: {
  //       lat: 52.3816888,
  //       lng: 4.635539,
  //     },
  //     _id: "6a342f7cab4672285ed1b6d4",
  //     id: 2,
  //     OwnerRef: "6a26b5c8681f5eb1913ca53a",
  //     clientName: "Tanvir Anjum",
  //     clientPhoneNumber: 315455455,
  //     pickupAddress: "Izaäk Enschedéweg 50, 2031 CS Haarlem, Netherlands",
  //     deliveryAddress: "Grote Markt 1, Haarlem, Netherlands",
  //     shipmentType: "collection",
  //     boxQuantity: 32,
  //     driverAllocated: false,
  //     status: "pending",
  //     deliveryShift: "evening",
  //     note: "This is sample note1",
  //     createdAt: "2026-06-18T17:48:44.011Z",
  //     updatedAt: "2026-06-18T17:48:44.011Z",
  //     __v: 0,
  //   },
  //   {
  //     deliverySelected: {
  //       lat: 51.9926677,
  //       lng: 4.3626214,
  //     },
  //     _id: "6a342f96ab4672285ed1b6d5",
  //     id: 3,
  //     OwnerRef: "6a26b5c8681f5eb1913ca53a",
  //     clientName: "hghgh",
  //     clientPhoneNumber: 315455455,
  //     pickupAddress: "Izaäk Enschedéweg 50, 2031 CS Haarlem, Netherlands",
  //     deliveryAddress: "Vulcanusweg 307, 2624 AV Delft, Netherlands",
  //     shipmentType: "collection",
  //     boxQuantity: 44,
  //     driverAllocated: false,
  //     status: "pending",
  //     deliveryShift: "night",
  //     note: "This is sample note1",
  //     createdAt: "2026-06-18T17:49:10.885Z",
  //     updatedAt: "2026-06-18T17:49:10.885Z",
  //     __v: 0,
  //   },
  //   {
  //     deliverySelected: {
  //       lat: 51.92359099999999,
  //       lng: 4.4843807,
  //     },
  //     _id: "6a342facab4672285ed1b6d6",
  //     id: 4,
  //     OwnerRef: "6a26b5c8681f5eb1913ca53a",
  //     clientName: "Tanvir Anjum",
  //     clientPhoneNumber: 545545544,
  //     pickupAddress: "Izaäk Enschedéweg 50, 2031 CS Haarlem, Netherlands",
  //     deliveryAddress: "Binnenrotte 25, 3011 PV Rotterdam, Netherlands",
  //     shipmentType: "collection",
  //     boxQuantity: 50,
  //     driverAllocated: false,
  //     status: "pending",
  //     deliveryShift: "afternoon",
  //     note: "This is sample note1",
  //     createdAt: "2026-06-18T17:49:32.641Z",
  //     updatedAt: "2026-06-18T17:49:32.641Z",
  //     __v: 0,
  //   },
  //   {
  //     deliverySelected: {
  //       lat: 51.4539971,
  //       lng: 5.4003882,
  //     },
  //     _id: "6a342fcfab4672285ed1b6d7",
  //     id: 5,
  //     OwnerRef: "6a26b5c8681f5eb1913ca53a",
  //     clientName: "hghgh",
  //     clientPhoneNumber: 315455455,
  //     pickupAddress: "Izaäk Enschedéweg 50, 2031 CS Haarlem, Netherlands",
  //     deliveryAddress: "Flight Forum 40, 5657 DB Eindhoven, Netherlands",
  //     shipmentType: "collection",
  //     boxQuantity: 55,
  //     driverAllocated: false,
  //     status: "pending",
  //     deliveryShift: "morning",
  //     note: "This is sample note1",
  //     createdAt: "2026-06-18T17:50:07.574Z",
  //     updatedAt: "2026-06-18T17:50:07.574Z",
  //     __v: 0,
  //   },
  //   {
  //     deliverySelected: {
  //       lat: 51.4393661,
  //       lng: 5.4788028,
  //     },
  //     _id: "6a342fe4ab4672285ed1b6d8",
  //     id: 6,
  //     OwnerRef: "6a26b5c8681f5eb1913ca53a",
  //     clientName: "Tanvir Anjum",
  //     clientPhoneNumber: 315455455,
  //     pickupAddress: "Izaäk Enschedéweg 50, 2031 CS Haarlem, Netherlands",
  //     deliveryAddress: "Markt 10, 5611 EB Eindhoven, Netherlands",
  //     shipmentType: "collection",
  //     boxQuantity: 45,
  //     driverAllocated: false,
  //     status: "pending",
  //     deliveryShift: "morning",
  //     note: "This is sample note1",
  //     createdAt: "2026-06-18T17:50:28.651Z",
  //     updatedAt: "2026-06-18T17:50:28.651Z",
  //     __v: 0,
  //   },
  //   {
  //     deliverySelected: {
  //       lat: 52.0801105,
  //       lng: 4.3435356,
  //     },
  //     _id: "6a342ffbab4672285ed1b6d9",
  //     id: 7,
  //     OwnerRef: "6a26b5c8681f5eb1913ca53a",
  //     clientName: "Tanvir Anjum",
  //     clientPhoneNumber: 545545544,
  //     pickupAddress: "Izaäk Enschedéweg 50, 2031 CS Haarlem, Netherlands",
  //     deliveryAddress:
  //       "Laan van Nieuw Oost-Indië 300, 2593 CE Den Haag, Netherlands",
  //     shipmentType: "collection",
  //     boxQuantity: 65,
  //     driverAllocated: false,
  //     status: "pending",
  //     deliveryShift: "afternoon",
  //     note: "This is sample note1",
  //     createdAt: "2026-06-18T17:50:51.681Z",
  //     updatedAt: "2026-06-18T17:50:51.681Z",
  //     __v: 0,
  //   },
  //   {
  //     deliverySelected: {
  //       lat: 52.0781639,
  //       lng: 4.3132419,
  //     },
  //     _id: "6a343014ab4672285ed1b6da",
  //     id: 8,
  //     OwnerRef: "6a26b5c8681f5eb1913ca53a",
  //     clientName: "Tanvir Anjum",
  //     clientPhoneNumber: 545545544,
  //     pickupAddress: "Izaäk Enschedéweg 50, 2031 CS Haarlem, Netherlands",
  //     deliveryAddress: "Spuistraat 70, The Hague, Netherlands",
  //     shipmentType: "collection",
  //     boxQuantity: 55,
  //     driverAllocated: false,
  //     status: "pending",
  //     deliveryShift: "afternoon",
  //     note: "This is sample note1",
  //     createdAt: "2026-06-18T17:51:16.779Z",
  //     updatedAt: "2026-06-18T17:51:16.779Z",
  //     __v: 0,
  //   },
  //   {
  //     deliverySelected: {
  //       lat: 52.1161509,
  //       lng: 5.0552452,
  //     },
  //     _id: "6a343027ab4672285ed1b6db",
  //     id: 9,
  //     OwnerRef: "6a26b5c8681f5eb1913ca53a",
  //     clientName: "Tanvir Anjum",
  //     clientPhoneNumber: 315455455,
  //     pickupAddress: "Izaäk Enschedéweg 50, 2031 CS Haarlem, Netherlands",
  //     deliveryAddress: "Atoomweg 63, 3542 AA Utrecht, Netherlands",
  //     shipmentType: "collection",
  //     boxQuantity: 33,
  //     driverAllocated: false,
  //     status: "pending",
  //     deliveryShift: "morning",
  //     note: "This is sample note1",
  //     createdAt: "2026-06-18T17:51:35.942Z",
  //     updatedAt: "2026-06-18T17:51:35.942Z",
  //     __v: 0,
  //   },
  //   {
  //     deliverySelected: {
  //       lat: 52.09285879999999,
  //       lng: 5.1165487,
  //     },
  //     _id: "6a34303eab4672285ed1b6dc",
  //     id: 10,
  //     OwnerRef: "6a26b5c8681f5eb1913ca53a",
  //     clientName: "Tanvir Anjum",
  //     clientPhoneNumber: 545545544,
  //     pickupAddress: "Izaäk Enschedéweg 50, 2031 CS Haarlem, Netherlands",
  //     deliveryAddress: "Oudegracht 99, 3511 AE Utrecht, Netherlands",
  //     shipmentType: "collection",
  //     boxQuantity: 65,
  //     driverAllocated: false,
  //     status: "pending",
  //     deliveryShift: "morning",
  //     note: "This is sample note1",
  //     createdAt: "2026-06-18T17:51:58.122Z",
  //     updatedAt: "2026-06-18T17:51:58.122Z",
  //     __v: 0,
  //   },
  //   {
  //     deliverySelected: {
  //       lat: 53.2073066,
  //       lng: 6.600050299999999,
  //     },
  //     _id: "6a343050ab4672285ed1b6dd",
  //     id: 11,
  //     OwnerRef: "6a26b5c8681f5eb1913ca53a",
  //     clientName: "Tanvir Anjum",
  //     clientPhoneNumber: 315455455,
  //     pickupAddress: "Izaäk Enschedéweg 50, 2031 CS Haarlem, Netherlands",
  //     deliveryAddress: "Bornholmstraat 50, Groningen, Netherlands",
  //     shipmentType: "collection",
  //     boxQuantity: 54,
  //     driverAllocated: false,
  //     status: "pending",
  //     deliveryShift: "morning",
  //     note: "This is sample note1",
  //     createdAt: "2026-06-18T17:52:16.041Z",
  //     updatedAt: "2026-06-18T17:52:16.041Z",
  //     __v: 0,
  //   },
  //   {
  //     deliverySelected: {
  //       lat: 53.2073066,
  //       lng: 6.600050299999999,
  //     },
  //     _id: "6a343050ab4672285ed1b6de",
  //     id: 12,
  //     OwnerRef: "6a26b5c8681f5eb1913ca53a",
  //     clientName: "Tanvir Anjum",
  //     clientPhoneNumber: 315455455,
  //     pickupAddress: "Izaäk Enschedéweg 50, 2031 CS Haarlem, Netherlands",
  //     deliveryAddress: "Bornholmstraat 50, Groningen, Netherlands",
  //     shipmentType: "collection",
  //     boxQuantity: 54,
  //     driverAllocated: false,
  //     status: "pending",
  //     deliveryShift: "morning",
  //     note: "This is sample note1",
  //     createdAt: "2026-06-18T17:52:16.144Z",
  //     updatedAt: "2026-06-18T17:52:16.144Z",
  //     __v: 0,
  //   },
  //   {
  //     deliverySelected: {
  //       lat: 53.2188849,
  //       lng: 6.5658126,
  //     },
  //     _id: "6a343699ab4672285ed1b6df",
  //     id: 13,
  //     OwnerRef: "6a26b5c8681f5eb1913ca53a",
  //     clientName: "Tanvir Anjum",
  //     clientPhoneNumber: 545545544,
  //     pickupAddress: "Izaäk Enschedéweg 50, 2031 CS Haarlem, Netherlands",
  //     deliveryAddress: "Grote Markt 5, 9712 HN Groningen, Netherlands",
  //     shipmentType: "collection",
  //     boxQuantity: 44,
  //     driverAllocated: false,
  //     status: "pending",
  //     deliveryShift: "morning",
  //     note: "This is sample note1",
  //     createdAt: "2026-06-18T18:19:05.259Z",
  //     updatedAt: "2026-06-18T18:19:05.259Z",
  //     __v: 0,
  //   },
  //   {
  //     deliverySelected: {
  //       lat: 51.4332582,
  //       lng: 5.431146,
  //     },
  //     _id: "6a3436b4ab4672285ed1b6e0",
  //     id: 14,
  //     OwnerRef: "6a26b5c8681f5eb1913ca53a",
  //     clientName: "Tanvir Anjum",
  //     clientPhoneNumber: 545545544,
  //     pickupAddress: "Izaäk Enschedéweg 50, 2031 CS Haarlem, Netherlands",
  //     deliveryAddress: "Hurksestraat 19, 5652 AH Eindhoven, Netherlands",
  //     shipmentType: "collection",
  //     boxQuantity: 55,
  //     driverAllocated: false,
  //     status: "pending",
  //     deliveryShift: "morning",
  //     note: "This is sample note1",
  //     createdAt: "2026-06-18T18:19:32.755Z",
  //     updatedAt: "2026-06-18T18:19:32.755Z",
  //     __v: 0,
  //   },
  //   {
  //     deliverySelected: {
  //       lat: 51.6903961,
  //       lng: 5.2954436,
  //     },
  //     _id: "6a3436d0ab4672285ed1b6e1",
  //     id: 15,
  //     OwnerRef: "6a26b5c8681f5eb1913ca53a",
  //     clientName: "Tanvir Anjum",
  //     clientPhoneNumber: 545545544,
  //     pickupAddress: "Izaäk Enschedéweg 50, 2031 CS Haarlem, Netherlands",
  //     deliveryAddress: "Stationsplein 1, 5211 AP 's-Hertogenbosch, Netherlands",
  //     shipmentType: "collection",
  //     boxQuantity: 66,
  //     driverAllocated: false,
  //     status: "pending",
  //     deliveryShift: "morning",
  //     note: "This is sample note1",
  //     createdAt: "2026-06-18T18:20:00.395Z",
  //     updatedAt: "2026-06-18T18:20:00.395Z",
  //     __v: 0,
  //   },
  //   {
  //     deliverySelected: {
  //       lat: 52.3056508,
  //       lng: 4.9329768,
  //     },
  //     _id: "6a3436e5ab4672285ed1b6e2",
  //     id: 16,
  //     OwnerRef: "6a26b5c8681f5eb1913ca53a",
  //     clientName: "Tanvir Anjum",
  //     clientPhoneNumber: 315455455,
  //     pickupAddress: "Izaäk Enschedéweg 50, 2031 CS Haarlem, Netherlands",
  //     deliveryAddress: "Keienbergweg 100, 1101 GH Amsterdam, Netherlands",
  //     shipmentType: "collection",
  //     boxQuantity: 34,
  //     driverAllocated: false,
  //     status: "pending",
  //     deliveryShift: "morning",
  //     note: "This is sample note1",
  //     createdAt: "2026-06-18T18:20:21.791Z",
  //     updatedAt: "2026-06-18T18:20:21.791Z",
  //     __v: 0,
  //   },
  //   {
  //     deliverySelected: {
  //       lat: 52.0889982,
  //       lng: 5.100483,
  //     },
  //     _id: "6a343703ab4672285ed1b6e3",
  //     id: 17,
  //     OwnerRef: "6a26b5c8681f5eb1913ca53a",
  //     clientName: "Tanvir Anjum",
  //     clientPhoneNumber: 315455455,
  //     pickupAddress: "Izaäk Enschedéweg 50, 2031 CS Haarlem, Netherlands",
  //     deliveryAddress: "Leidseweg 57, Utrecht, Netherlands",
  //     shipmentType: "collection",
  //     boxQuantity: 77,
  //     driverAllocated: false,
  //     status: "pending",
  //     deliveryShift: "morning",
  //     note: "This is sample note1",
  //     createdAt: "2026-06-18T18:20:51.597Z",
  //     updatedAt: "2026-06-18T18:20:51.597Z",
  //     __v: 0,
  //   },
  //   {
  //     deliverySelected: {
  //       lat: 52.39080310000001,
  //       lng: 4.8349964,
  //     },
  //     _id: "6a34371aab4672285ed1b6e4",
  //     id: 18,
  //     OwnerRef: "6a26b5c8681f5eb1913ca53a",
  //     clientName: "Tanvir Anjum",
  //     clientPhoneNumber: 315455455,
  //     pickupAddress: "Izaäk Enschedéweg 50, 2031 CS Haarlem, Netherlands",
  //     deliveryAddress: "Radarweg 60, 1043 NT Amsterdam, Netherlands",
  //     shipmentType: "collection",
  //     boxQuantity: 76,
  //     driverAllocated: false,
  //     status: "pending",
  //     deliveryShift: "morning",
  //     note: "This is sample note1",
  //     createdAt: "2026-06-18T18:21:14.973Z",
  //     updatedAt: "2026-06-18T18:21:14.973Z",
  //     __v: 0,
  //   },
  //   {
  //     deliverySelected: {
  //       lat: 52.6318715,
  //       lng: 4.7506,
  //     },
  //     _id: "6a343743ab4672285ed1b6e5",
  //     id: 19,
  //     OwnerRef: "6a26b5c8681f5eb1913ca53a",
  //     clientName: "hghgh",
  //     clientPhoneNumber: 315455455,
  //     pickupAddress: "Izaäk Enschedéweg 50, 2031 CS Haarlem, Netherlands",
  //     deliveryAddress: "Marktstraat, 1811 JP Alkmaar, Netherlands",
  //     shipmentType: "collection",
  //     boxQuantity: 66,
  //     driverAllocated: false,
  //     status: "pending",
  //     deliveryShift: "morning",
  //     note: "This is sample note1",
  //     createdAt: "2026-06-18T18:21:55.283Z",
  //     updatedAt: "2026-06-18T18:21:55.283Z",
  //     __v: 0,
  //   },
  //   {
  //     deliverySelected: {
  //       lat: 52.169678,
  //       lng: 5.349870999999999,
  //     },
  //     _id: "6a343764ab4672285ed1b6e6",
  //     id: 20,
  //     OwnerRef: "6a26b5c8681f5eb1913ca53a",
  //     clientName: "Tanvir Anjum",
  //     clientPhoneNumber: 315455455,
  //     pickupAddress: "Izaäk Enschedéweg 50, 2031 CS Haarlem, Netherlands",
  //     deliveryAddress: "Neonweg 12, Amersfoort, Netherlands",
  //     shipmentType: "collection",
  //     boxQuantity: 66,
  //     driverAllocated: false,
  //     status: "pending",
  //     deliveryShift: "morning",
  //     note: "This is sample note1",
  //     createdAt: "2026-06-18T18:22:28.152Z",
  //     updatedAt: "2026-06-18T18:22:28.152Z",
  //     __v: 0,
  //   },
];
// // ─── Helper: shift label ───────────────────────────────────────────────────────

function shiftLabel(shift: string) {
  return (
    {
      morning: "Morning",
      afternoon: "Afternoon",
      evening: "Evening",
      night: "Night",
    }[shift] ?? shift
  );
}

// ─── Helper: shift hours ───────────────────────────────────────────────────────

function shiftHours(shift: string) {
  return (
    {
      morning: "06–14h",
      afternoon: "12–20h",
      evening: "16–00h",
      night: "22–06h",
    }[shift] ?? ""
  );
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
        <span className="oc-seq">{seq}</span>
        <span
          className="oc-shift-pip"
          style={{ background: SHIFT_COLORS[order.deliveryShift] ?? "#94a3b8" }}
          title={shiftLabel(order.deliveryShift)}
        />
      </div>

      <div className="oc-body">
        <div className="oc-row-top">
          <span className="oc-name">{order.clientName}</span>
          <span className={`oc-status-badge oc-status-${status}`}>
            {status === "delivered"
              ? "Done"
              : status === "in_transit"
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

// ─── Stats bar ────────────────────────────────────────────────────────────────

function StatsBar({
  orders,
  statuses,
}: {
  orders: Order[];
  statuses: Record<number, OrderStatus>;
}) {
  const completed = orders.filter((o) => statuses[o.id] === "delivered").length;
  const inProgress = orders.filter(
    (o) => statuses[o.id] === "in_transit",
  ).length;
  const totalBoxes = orders.reduce((s, o) => s + o.boxQuantity, 0);
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
        <span className="stat-val">{totalBoxes}</span>
        <span className="stat-lbl">Total Boxes</span>
      </div>
      <div className="stat-progress">
        <div className="stat-progress-fill" style={{ width: `${pct}%` }} />
      </div>
      <span className="stat-pct">{pct}%</span>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function RouteOptimizationPage() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<google.maps.Map | null>(null);
  const dirRenderer = useRef<google.maps.DirectionsRenderer | null>(null);
  const driverMarker = useRef<google.maps.Marker | null>(null);
  const warehouseMarker = useRef<google.maps.Marker | null>(null);
  const watchId = useRef<number | null>(null);
  const mapsLoaded = useRef(false);

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

  // ── Initialise map after Google Maps script loads ──────────────────────────
  const handleInitialLoad = () => {
    const rawData = localStorage.getItem("OptimizedRouteShipments");
    const data = rawData ? JSON.parse(rawData) : [];
    const mock: Order[] = [];
    data.map((order: Order, idx: number) =>
      mock.push({ ...order, id: idx + 1 }),
    );
    setStatuses(() =>
      Object.fromEntries(mock.map((o) => [o.id, o.status as OrderStatus])),
    );
    setOrders(mock);
  };

  const initMap = useCallback(() => {
    handleInitialLoad();
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
  }, []);

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
        // const { latitude: lat, longitude: lng } = pos.coords;

        const lat = 52.389015197753906;
        const lng = 4.660130023956299;
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

  const handleOptimize = useCallback(async () => {
    if (!window.google || !mapInstance.current || !dirRenderer.current) return;

    setOptimizeState("loading");

    const directionsService = await new window.google.maps.DirectionsService();

    const waypoints: google.maps.DirectionsWaypoint[] = orders
      .filter((o) => o.deliverySelected)
      .map((o) => ({
        location: new window.google.maps.LatLng(
          o.deliverySelected!.lat,
          o.deliverySelected!.lng,
        ),

        stopover: true,
      }));
    await directionsService.route(
      {
        origin: WAREHOUSE.address,
        destination: WAREHOUSE.address,
        waypoints,
        optimizeWaypoints: true,
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

          setOptimizeState("done");
        } else {
          console.error("Directions request failed:", status);
          setOptimizeState("error");
        }
      },
    );
  }, [orders]);

  // ── Mark stop complete / active ────────────────────────────────────────────

  const markComplete = async (id: number, mainId: string) => {
    const result = await fetch(
      process.env.NEXT_PUBLIC_BACKEND_URL + `/api/shipments/${mainId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ status: "delivered" }),
      },
    );
    if (result.ok) {
      localStorage.setItem("initialShipments", "");
    }
    setStatuses((prev) => ({ ...prev, [id]: "delivered" }));
    if (activeOrderId === id) setActiveOrderId(null);
  };

  const startDelivery = (id: number) => {
    setStatuses((prev) => {
      const next = { ...prev };
      // Only one active at a time
      Object.keys(next).forEach((k) => {
        if (next[+k] === "in_transit") next[+k] = "pending";
      });
      next[id] = "in_transit";
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

  return (
    <>
      <Script
        src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API}`}
        strategy="afterInteractive"
        onLoad={initMap}
      />

      <PageStyles />

      <div className="ro-root">
        {/* ═══════════════════════════════════════
            SIDEBAR
        ═══════════════════════════════════════ */}
        <aside className="ro-sidebar">
          {/* Header */}
          <div className="sidebar-header">
            {/* <div className="sidebar-logo">
              <svg viewBox="0 0 28 28" fill="none" width="26" height="26">
                <rect width="28" height="28" rx="7" fill="#1e40af" />
                <path
                  d="M6 14h10M12 10l4 4-4 4"
                  stroke="#fff"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle cx="20" cy="14" r="3" fill="#60a5fa" />
              </svg>
              <span className="sidebar-logo-text">ShipSwift</span>
            </div> */}

            <div className="sidebar-meta">
              <h1 className="sidebar-title">Today&apos;s Route</h1>
              <p className="sidebar-subtitle">
                {orders.length} stops · Haarlem area
              </p>
            </div>

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

            {/* Optimize button */}
            <button
              className={`btn-optimize ${optimizeState === "loading" ? "btn-loading" : ""} ${optimizeState === "done" ? "btn-done" : ""}`}
              onClick={handleOptimize}
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
                  <svg viewBox="0 0 16 16" fill="none" width="16" height="16">
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
                  <svg viewBox="0 0 24 24" fill="none" width="16" height="16">
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

            {optimizeState === "error" && (
              <p className="optimize-error">
                ⚠ Route request failed. Check your API key and quota.
              </p>
            )}

            {/* Stats */}
            <StatsBar orders={orders} statuses={statuses} />
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
                        {status === "in_transit" && (
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
        .btn-optimize, .oa-btn { min-height: 48px; }
        .order-card { padding: 14px; }
      }

      /* Reduced motion */
      @media (prefers-reduced-motion: reduce) {
        .spin-icon    { animation: none; }
        .geo-pip      { animation: none; }
        .order-actions { animation: none; }
        .stat-progress-fill { transition: none; }
        * { transition-duration: 0.01ms !important; }
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
      }
    `}</style>
  );
}
