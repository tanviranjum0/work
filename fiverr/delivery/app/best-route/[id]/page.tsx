/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable react-hooks/rules-of-hooks */
"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
type RouteStop = {
  id: "A" | "B" | "C";
  label: string;
  title: string;
  address: string;
  tone: "green" | "blue" | "red";
};
interface Shipment {
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
}

const summary = [
  { label: "Total Distance", value: "2,789 km" },
  { label: "Total Time", value: "32 h 45 min" },
  { label: "Est. Fuel Cost", value: "$620.40" },
];

export default function BestRouteMapView() {
  const [mapLocation, setMapLocation] = useState(
    "https://www.google.com/maps?q=Izaäk Enschedéweg 50, 2031 CS Haarlem, Netherlands to Museumstraat 1, 1071 XX Amsterdam, Netherlands&output=embed",
  );
  const params = useParams();
  const id = params.id;
  const [shipment, setShipment] = useState<Shipment | undefined>();
  const loadShipment = async () => {
    if (typeof window === "undefined") return undefined;
    const cache = localStorage.getItem("shipment");
    if (cache) {
      const parsedCache = JSON.parse(cache);
      setMapLocation(
        `https://www.google.com/maps?q=${parsedCache.pickupAddress} to ${parsedCache.deliveryAddress}&output=embed`,
      );
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
      setMapLocation(
        `https://www.google.com/maps?q=${data.pickupAddress} to ${data.deliveryAddress}&output=embed`,
      );
      setShipment(data);
      localStorage.setItem("shipment", JSON.stringify(data));
    }
  };

  useEffect(() => {
    loadShipment();
  }, []);

  const stops: RouteStop[] = [
    {
      id: "A",
      label: "Pickup Location",
      title: shipment?.pickupAddress || "",
      address: "",
      tone: "green",
    },
    {
      id: "B",
      label: "Warehouse (Buffer)",
      title: "Izaak Enschedeweg 50, 2031 CS  Haarlem, Netherlands",
      address: "",
      tone: "blue",
    },
    {
      id: "C",
      label: "Delivery Location",
      title: shipment?.deliveryAddress || "",
      address: "",
      tone: "red",
    },
  ];

  // useMemo(() => {
  //   if (shipment) {
  //     console.log("Shipment", shipment);
  //     setStops([
  //       {
  //         id: "A",
  //         label: "Pickup Location",
  //         title: "",
  //         address: shipment.pickupAddress,
  //         tone: "green",
  //       },
  //       {
  //         id: "B",
  //         label: "Warehouse (Buffer)",
  //         title: "Izaak Enschedeweg 50,",
  //         address: "2031 CS  Haarlem, Netherlands",
  //         tone: "blue",
  //       },
  //       {
  //         id: "C",
  //         label: "Delivery Location",
  //         title: "",
  //         address: shipment.deliveryAddress,
  //         tone: "red",
  //       },
  //     ]);
  //   }
  // }, [shipment]);
  return (
    <section className="route-shell" aria-label="Best Route Map View">
      <article className="route-card">
        <div
          style={{
            height: "100vh",
            width: "100%",
            position: "absolute",
            zIndex: 10,
          }}
          aria-hidden="true"
        >
          <MapArtwork mapLocation={mapLocation} />
        </div>

        <aside className="details-panel">
          <div className="panel-heading">
            <div>
              <h2>Best Route</h2>
              <p>Here&apos;s the best route for your shipment.</p>
            </div>
            <span className="status-pill">Optimized</span>
          </div>

          <div className="stop-list">
            {stops.map((stop) => (
              <div className="stop-row" key={stop.id}>
                <span className={`stop-marker ${stop.tone}`}>{stop.id}</span>
                <div>
                  <h3>{stop.label}</h3>
                  <p>{stop.title}</p>
                  {stop.address ? <p>{stop.address}</p> : null}
                </div>
              </div>
            ))}
          </div>

          <div className="summary-block">
            <h3>Route Summary</h3>
            {summary.map((item) => (
              <div className="summary-row" key={item.label}>
                <span>{item.label}</span>
                <strong>{item.value}</strong>
              </div>
            ))}
          </div>

          <button className="route-button" type="button">
            View Turn-by-Turn
          </button>
        </aside>
      </article>

      <style jsx>{`
        .route-shell {
          min-height: 100vh;
          width: 100%;
          height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-start;
          gap: 20px;
          padding: 20px;
          color: #0f2345;
          background:
            radial-gradient(
              circle at 22% 12%,
              rgba(77, 139, 255, 0.11),
              transparent 30%
            ),
            linear-gradient(180deg, #ffffff 0%, #f7fbff 100%);
          font-family:
            Inter,
            ui-sans-serif,
            system-ui,
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            sans-serif;
        }

        .page-header {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 18px;
        }

        .step-badge {
          width: 44px;
          height: 44px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          flex: 0 0 auto;
          border-radius: 50%;
          color: #ffffff;
          background: #102b57;
          box-shadow: 0 8px 20px rgba(16, 43, 87, 0.2);
          font-size: 20px;
          font-weight: 800;
        }

        h1,
        h2,
        h3,
        p {
          margin: 0;
        }

        h1 {
          font-size: clamp(22px, 4vw, 28px);
          line-height: 1.15;
          font-weight: 800;
        }

        .route-card {
          position: relative;
          width: 100%;
          flex: 1;
          min-height: 0;
          overflow: hidden;
          border: 1px solid rgba(117, 139, 166, 0.45);
          border-radius: 14px;
          background: #d9eefc;
          box-shadow: 0 22px 60px rgba(26, 61, 105, 0.14);
        }

        .map-layer {
          position: absolute;
          inset: 0;
          background: #dceffc;
        }

        .details-panel {
          position: relative;
          z-index: 2;
          width: clamp(312px, 24vw, 390px);
          min-height: 100%;
          display: flex;
          flex-direction: column;
          padding: 42px 28px 32px;
          background: rgba(255, 255, 255, 0.9);
          border-right: 1px solid rgba(224, 233, 242, 0.95);
          backdrop-filter: blur(4px);
        }

        .panel-heading {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 54px;
        }

        .panel-heading h2 {
          font-size: 20px;
          line-height: 1.2;
          font-weight: 800;
          color: #12264a;
        }

        .panel-heading p {
          margin-top: 12px;
          color: #536783;
          font-size: 11px;
          font-weight: 700;
          line-height: 1.35;
        }

        .status-pill {
          margin-top: 2px;
          padding: 5px 10px;
          border-radius: 999px;
          color: #0b8f5c;
          background: #dcfaeb;
          font-size: 11px;
          font-weight: 800;
          white-space: nowrap;
        }

        .stop-list {
          display: grid;
          gap: 30px;
        }

        .stop-row {
          display: grid;
          grid-template-columns: 28px minmax(0, 1fr);
          gap: 13px;
          align-items: start;
        }

        .stop-marker {
          width: 25px;
          height: 25px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          color: #ffffff;
          font-size: 11px;
          font-weight: 900;
          box-shadow: 0 3px 8px rgba(15, 35, 69, 0.16);
        }

        .stop-marker.green {
          background: #16a05d;
        }

        .stop-marker.blue {
          background: #0b58d0;
        }

        .stop-marker.red {
          background: #f04438;
        }

        .stop-row h3,
        .summary-block h3 {
          color: #12264a;
          font-size: 12px;
          line-height: 1.35;
          font-weight: 800;
        }

        .stop-row p {
          margin-top: 8px;
          color: #455c7b;
          font-size: 11px;
          line-height: 1.25;
          font-weight: 600;
        }

        .summary-block {
          margin-top: 46px;
        }

        .summary-block h3 {
          margin-bottom: 30px;
        }

        .summary-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          color: #455c7b;
          font-size: 11px;
          font-weight: 700;
        }

        .summary-row + .summary-row {
          margin-top: 24px;
        }

        .summary-row strong {
          color: #14284a;
          font-size: 13px;
          font-weight: 900;
          text-align: right;
          white-space: nowrap;
        }

        .route-button {
          width: 100%;
          min-height: 52px;
          margin-top: 38px;
          border: 1px solid #c8d8ec;
          border-radius: 6px;
          color: #0b58d0;
          background: #ffffff;
          font-size: 12px;
          font-weight: 900;
          cursor: pointer;
          transition:
            border-color 160ms ease,
            box-shadow 160ms ease,
            transform 160ms ease;
        }

        .route-button:hover {
          border-color: #0b58d0;
          box-shadow: 0 8px 18px rgba(11, 88, 208, 0.12);
          transform: translateY(-1px);
        }

        @media (max-width: 720px) {
          .route-shell {
            gap: 20px;
            padding: 20px 12px 32px;
            height: auto;
          }

          .page-header {
            gap: 12px;
          }

          .step-badge {
            width: 36px;
            height: 36px;
            font-size: 16px;
          }

          .route-card {
            display: grid;
            min-height: 0;
            border-radius: 12px;
          }

          .map-layer {
            position: relative;
            min-height: 410px;
            order: 2;
          }

          .details-panel {
            order: 1;
            width: 100%;
            min-height: 0;
            padding: 24px 18px 22px;
            border-right: 0;
            border-bottom: 1px solid rgba(224, 233, 242, 0.95);
          }

          .panel-heading {
            margin-bottom: 28px;
          }

          .stop-list {
            gap: 18px;
          }

          .summary-block {
            margin-top: 28px;
          }

          .summary-block h3 {
            margin-bottom: 18px;
          }

          .summary-row + .summary-row {
            margin-top: 14px;
          }

          .route-button {
            margin-top: 24px;
          }
        }

        @media (max-width: 420px) {
          .panel-heading {
            flex-direction: column;
          }

          .status-pill {
            align-self: flex-start;
          }
        }
      `}</style>
    </section>
  );
}

function MapArtwork({ mapLocation }: { mapLocation: string }) {
  return (
    <iframe
      title="Route map"
      src={mapLocation}
      className="absolute map w-full h-screen"
      allowFullScreen={true}
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
    ></iframe>
  );
}

function MapPin({
  x,
  y,
  label,
  color,
}: {
  x: number;
  y: number;
  label: string;
  color: string;
}) {
  return (
    <g transform={`translate(${x} ${y})`} filter="url(#pinShadow)">
      <path
        d="M0-29C-18-29-31-16-31 0C-31 21 0 42 0 42C0 42 31 21 31 0C31-16 18-29 0-29Z"
        fill={color}
      />
      <circle cx="0" cy="0" r="15" fill={color} />
      <text
        x="0"
        y="5"
        fill="#fff"
        textAnchor="middle"
        fontFamily="Inter, Arial, sans-serif"
        fontSize="17"
        fontWeight="900"
      >
        {label}
      </text>
    </g>
  );
}
