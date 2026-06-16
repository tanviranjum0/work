/* eslint-disable react-hooks/set-state-in-effect */

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

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
type IconName =
  | "box"
  | "grid"
  | "ship"
  | "plus"
  | "warehouse"
  | "truck"
  | "users"
  | "report"
  | "settings"
  | "logout"
  | "calendar"
  | "trend";

const navItems: {
  label: string;
  icon: IconName;
  active?: boolean;
  link: string;
}[] = [
  { label: "Dashboard", icon: "grid", active: true, link: "/home" },
  { label: "Shipments", icon: "ship", link: "/shipments" },
  { label: "Create Shipment", icon: "plus", link: "/new-shipment" },
  { label: "Warehouses", icon: "warehouse", link: "/" },
  { label: "Vehicles", icon: "truck", link: "/" },
  { label: "Drivers", icon: "users", link: "/" },
  { label: "Reports", icon: "report", link: "/" },
  { label: "Settings", icon: "settings", link: "/" },
];

// const shipments = [
//   {
//     id: "SHP123456",
//     route: "New York, NY -> Los Angeles, CA",
//     status: "In Transit",
//     tone: "blue",
//   },
//   {
//     id: "SHP123455",
//     route: "Chicago, IL -> Houston, TX",
//     status: "Delivered",
//     tone: "green",
//   },
//   {
//     id: "SHP123454",
//     route: "Miami, FL -> Atlanta, GA",
//     status: "Pending",
//     tone: "neutral",
//   },
//   {
//     id: "SHP123453",
//     route: "Dallas, TX -> Seattle, WA",
//     status: "In Transit",
//     tone: "blue",
//   },
//   {
//     id: "SHP123452",
//     route: "Boston, MA -> Denver, CO",
//     status: "Delivered",
//     tone: "green",
//   },
// ];

const iconPaths: Record<IconName, string[]> = {
  box: [
    "M12 2 4.5 6.2 12 10.4l7.5-4.2L12 2Z",
    "M4.5 6.2v8.7L12 19l7.5-4.1V6.2",
    "M12 10.4V19",
  ],
  grid: ["M4 4h6v6H4z", "M14 4h6v6h-6z", "M4 14h6v6H4z", "M14 14h6v6h-6z"],
  ship: ["M4 14h16l-2 5H6l-2-5Z", "M7 14V8h7l3 6", "M9 8V5h4v3"],
  plus: ["M12 5v14", "M5 12h14"],
  warehouse: ["M3 10 12 4l9 6", "M5 10v10h14V10", "M8 20v-6h8v6"],
  truck: [
    "M3 7h11v9H3z",
    "M14 10h4l3 3v3h-7",
    "M7 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z",
    "M17 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z",
  ],
  users: [
    "M8 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z",
    "M16 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z",
    "M3 20a5 5 0 0 1 10 0",
    "M11 20a5 5 0 0 1 10 0",
  ],
  report: ["M6 3h9l3 3v15H6z", "M14 3v4h4", "M9 12h6", "M9 16h6"],
  settings: [
    "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z",
    "M19 12a7 7 0 0 0-.1-1l2-1.5-2-3.4-2.4 1a7 7 0 0 0-1.7-1L14.5 3h-5l-.3 3.1a7 7 0 0 0-1.7 1l-2.4-1-2 3.4 2 1.5a7 7 0 0 0 0 2l-2 1.5 2 3.4 2.4-1a7 7 0 0 0 1.7 1l.3 3.1h5l.3-3.1a7 7 0 0 0 1.7-1l2.4 1 2-3.4-2-1.5c.1-.3.1-.7.1-1Z",
  ],
  logout: ["M10 17l5-5-5-5", "M15 12H3", "M21 3v18"],
  calendar: ["M5 4h14v16H5z", "M8 2v4", "M16 2v4", "M5 9h14"],
  trend: ["M4 16l5-5 4 4 7-8", "M15 7h5v5"],
};

function Icon({ name }: { name: IconName }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      {iconPaths[name].map((path) => (
        <path key={path} d={path} />
      ))}
    </svg>
  );
}
export default function FeitsmaVerhuizingenDashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState([
    { label: "Total Shipments", value: "0", tone: "blue" },
    { label: "In Transit", value: "0", tone: "green" },
  ]);
  const [user, setUser] = useState<{
    _id: string;
    fullName: string;
    email: string;
  } | null>(null);
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const getInitialData = async () => {
    const result = await fetch(
      process.env.NEXT_PUBLIC_BACKEND_URL + "/api/shipments/home",
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      },
    );
    const data = await result.json();
    if (result.ok) {
      console.log(data);
      setStats([
        { label: "Total Shipments", value: data.total, tone: "blue" },
        { label: "In Transit", value: data.inTransitCount, tone: "green" },
      ]);
      setShipments(data.shipments);
    }
  };

  useEffect(() => {
    const cachedUser = localStorage.getItem("user");
    if (cachedUser) {
      getInitialData();
      setUser(JSON.parse(cachedUser));
    } else {
      router.push("/login");
    }
  }, [router]);

  const handleLogout = async () => {
    const res = await fetch(
      process.env.NEXT_PUBLIC_BACKEND_URL + "/api/users/logout",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email: user?.email }),
      },
    );
    const data = await res.json();
    if (data.message == "Logged out successfully") {
      setUser(null);
      localStorage.clear();
      router.push("/login");
    }
  };
  return (
    <main className="ship-shell ">
      <style>{dashboardStyles}</style>

      <section
        className="ship-dashboard"
        aria-label="Feitsma Verhuizingen dashboard"
      >
        <aside className="ship-sidebar">
          <nav className="ship-nav" aria-label="Main navigation">
            {navItems.map((item) => (
              <Link
                className={`ship-nav-item ${item.active ? "is-active" : ""}`}
                href={item.link}
                key={item.label}
              >
                <Icon name={item.icon} />
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>

          <div onClick={handleLogout} className="cursor-pointer ship-logout">
            <Icon name="logout" />
            <span>Logout</span>
          </div>
        </aside>

        <div className="ship-content">
          <header className="ship-header">
            <div>
              <h1>Dashboard</h1>
              <p>Welcome back, {user?.fullName || "User"}!</p>
            </div>
            {/* 
            <button className="ship-date-button" type="button">
              <Icon name="calendar" />
              <span>May 20 - May 26, 2034</span>
            </button> */}
          </header>

          <section className="ship-stats-grid" aria-label="Shipment metrics">
            {stats.map((stat) => (
              <article className="ship-stat-card" key={stat.label}>
                <p>{stat.label}</p>
                <div>
                  <strong>{stat.value}</strong>
                  <span className={`ship-metric-icon ${stat.tone}`}>
                    <Icon name="trend" />
                  </span>
                </div>
              </article>
            ))}
          </section>

          <section className="ship-main-grid">
            <article className="ship-panel">
              <h2>Recent Shipments</h2>

              <div className="ship-shipment-list">
                {shipments.toReversed().map((shipment) => (
                  <div
                    onClick={() => {
                      localStorage.setItem(
                        "shipment",
                        JSON.stringify(shipment),
                      );
                      router.push(`/best-route/${shipment._id}`);
                    }}
                    className="ship-shipment-row flex justify-between items-center cursor-pointer px-3 py-1 transition-all duration-300 rounded-md select-none hover:bg-gray-300"
                    key={shipment._id}
                  >
                    <div>
                      <strong>{shipment?._id?.slice(-7)}</strong>
                      <span>
                        {shipment.pickupAddress} -&gt;{" "}
                        {shipment.deliveryAddress}
                      </span>
                    </div>
                    <span className={`ship-badge ${shipment.status}`}>
                      {shipment.status}
                    </span>
                  </div>
                ))}
              </div>

              <Link href={"/shipments"} className="ship-view-all">
                View all
              </Link>
            </article>

            <div className="ship-side-stack">
              <article className="ship-panel">
                <h2>Shipment Overview</h2>
                <div className="ship-chart-wrap">
                  <div className="ship-donut" aria-label="128 shipments">
                    <span>{stats[0].value}</span>
                  </div>
                </div>

                <div className="ship-legend">
                  <div>
                    <span className="ship-dot blue" />
                    In Transit
                  </div>
                  <div>
                    <span className="ship-dot green" />
                    Created
                  </div>
                </div>
              </article>

              <article className="ship-panel">
                <h2>Quick Actions</h2>
                <div className="ship-actions">
                  <button
                    className="cursor-pointer"
                    onClick={(e) => {
                      e.preventDefault();
                      router.push("/new-shipment");
                    }}
                  >
                    Create Shipment
                  </button>
                  {/* <button type="button">Add Vehicle</button> */}
                </div>
              </article>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}

const dashboardStyles = `
.ship-shell {
  min-height: 100vh;
  display: grid;
  place-items: center;
  background: linear-gradient(135deg, #f8fbff 0%, #eef4fb 100%);
  color: #0f2342;
  font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}

.ship-dashboard {
  width: min(100%, 1120px);
  min-height: 760px;
  display: grid;
  grid-template-columns: 250px minmax(0, 1fr);
  overflow: hidden;
  background: rgba(255, 255, 255, 0.88);
  box-shadow: 0 24px 80px rgba(15, 35, 66, 0.14);
}

.ship-sidebar {
  display: flex;
  flex-direction: column;
  gap: 26px;
  padding: 34px 18px;
  background: linear-gradient(180deg, #063b83 0%, #012e69 100%);
  color: #fff;
}

.ship-nav-item,
.ship-logout {
  display: flex;
  align-items: center;
  gap: 10px;
  color: inherit;
  text-decoration: none;
}


.ship-brand-mark {
  width: 28px;
  height: 28px;
  display: grid;
  place-items: center;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.16);
}

.ship-shell svg {
  width: 18px;
  height: 18px;
  fill: none;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 1.9;
}

.ship-nav {
  display: grid;
  gap: 8px;
}

.ship-nav-item,
.ship-logout {
  min-height: 42px;
  padding: 0 12px;
  border-radius: 7px;
  font-size: 14px;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.9);
}

.ship-nav-item:hover,
.ship-logout:hover,
.ship-nav-item.is-active {
  background: #0a5ada;
  color: #fff;
}

.ship-logout {
  margin-top: auto;
}

.ship-content {
  min-width: 0;
  padding: 38px;
  background: #fff;
}

.ship-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 36px;
}

.ship-header h1 {
  margin: 0 0 8px;
  font-size: clamp(26px, 3vw, 34px);
  line-height: 1.05;
  letter-spacing: 0;
}

.ship-header p,
.ship-stat-card p {
  margin: 0;
  color: #61708a;
}

.ship-date-button {
  flex: 0 0 auto;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  min-height: 42px;
  padding: 0 16px;
  border: 1px solid #dfe7f2;
  border-radius: 7px;
  background: #fff;
  color: #263b5d;
  font: inherit;
  font-size: 13px;
  font-weight: 700;
  box-shadow: 0 10px 26px rgba(15, 35, 66, 0.06);
}

.ship-stats-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 18px;
  margin-bottom: 22px;
}

.ship-stat-card,
.ship-panel {
  border: 1px solid #e7edf5;
  border-radius: 8px;
  background: #fff;
  box-shadow: 0 16px 36px rgba(15, 35, 66, 0.06);
}

.ship-stat-card {
  min-height: 126px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 22px;
}

.ship-stat-card p {
  font-size: 13px;
  font-weight: 700;
}

.ship-stat-card div {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.ship-stat-card strong {
  font-size: 34px;
  line-height: 1;
  letter-spacing: 0;
}

.ship-metric-icon {
  width: 24px;
  height: 24px;
  display: grid;
  place-items: center;
  border-radius: 6px;
}

.ship-main-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.55fr) minmax(270px, 0.85fr);
  gap: 22px;
  align-items: start;
}

.ship-panel {
  padding: 24px;
}

.ship-panel h2 {
  margin: 0 0 22px;
  font-size: 17px;
  line-height: 1.25;
  letter-spacing: 0;
}

.ship-shipment-list {
  display: grid;
  gap: 18px;
}

.ship-shipment-row {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 14px;
  align-items: start;
}

.ship-shipment-row strong {
  display: block;
  margin-bottom: 5px;
  font-size: 14px;
}

.ship-shipment-row span {
  color: #61708a;
  font-size: 13px;
}

.ship-badge {
  align-self: center;
  padding: 5px 9px;
  margin-right:5px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 800;
  white-space: nowrap;
}

.ship-view-all {
  display: block;
  width: fit-content;
  margin: 24px 0 0 auto;
  color: #075ee7;
  font-size: 13px;
  font-weight: 800;
  text-decoration: none;
}

.ship-side-stack {
  display: grid;
  gap: 22px;
}

.ship-chart-wrap {
  display: grid;
  place-items: center;
  padding: 6px 0 18px;
}

.ship-donut {
  width: 150px;
  aspect-ratio: 1;
  display: grid;
  place-items: center;
  border-radius: 999px;
  background: conic-gradient(#0b5ee5 0 52%, #14a76c 52% 84%, #d7e0ec 84% 100%);
  position: relative;
}

.ship-donut::after {
  content: "";
  position: absolute;
  inset: 22px;
  border-radius: inherit;
  background: #fff;
}

.ship-donut span {
  position: relative;
  z-index: 1;
  font-size: 22px;
  font-weight: 800;
}

.ship-legend {
  display: grid;
  gap: 14px;
}

.ship-legend div {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #4d5d78;
  font-size: 13px;
  font-weight: 700;
}

.ship-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.ship-actions {
  display: grid;
  gap: 12px;
}

.ship-actions button {
  min-height: 44px;
  border: 0;
  border-radius: 7px;
  background: #075ee7;
  color: #fff;
  font: inherit;
  font-size: 14px;
  font-weight: 800;
  box-shadow: 0 12px 24px rgba(7, 94, 231, 0.22);
}

.ship-actions button:hover {
  background: #004fc8;
}

.pending {
  background: #eef5ff;
  color: #075ee7;
}

.transit {
  background: #eaf9f2;
  color: #0b9b63;
}

.neutral {
  background: #f3f6fa;
  color: #53627a;
}

.ship-dot.blue {
  background: #075ee7;
}

.ship-dot.green {
  background: #0b9b63;
}

.ship-dot.neutral {
  background: #b7c2d2;
}

@media (max-width: 1000px) {
  .ship-shell {
    padding: 0;
    place-items: start center;
  }

  .ship-dashboard {
    min-height: auto;
    grid-template-columns: 1fr;
  }

  .ship-sidebar {
    display: grid;
    grid-template-columns: auto minmax(0, 1fr) auto;
    align-items: center;
    gap: 16px;
    padding: 18px;
  }

  .ship-nav {
    grid-auto-flow: column;
    grid-auto-columns: max-content;
    overflow-x: auto;
    overscroll-behavior-inline: contain;
    scrollbar-width: thin;
  }

  .ship-nav-item,
  .ship-logout {
    min-height: 40px;
    white-space: nowrap;
  }

  .ship-logout {
    margin-top: 0;
  }

  .ship-content {
    padding: 28px;
  }

  .ship-stats-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .ship-main-grid {
    grid-template-columns: 1fr;
  }

  .ship-side-stack {
    grid-template-columns: minmax(0, 1fr) minmax(240px, 0.75fr);
  }
}

@media (max-width: 680px) {
  .ship-shell {
    padding: 0;
    background: #f4f7fb;
  }

  .ship-dashboard {
    width: 100%;
    border: 0;
    border-radius: 0;
    box-shadow: none;
  }

  .ship-sidebar {
    grid-template-columns: 1fr;
    gap: 14px;
    padding: 18px 14px;
  }

  

  .ship-nav {
    padding-bottom: 4px;
  }

  .ship-logout {
    display: none;
  }

  .ship-content {
    padding: 22px 14px 28px;
  }

  .ship-header {
    display: grid;
    gap: 14px;
    margin-bottom: 22px;
  }

  .ship-date-button {
    width: 100%;
    justify-content: center;
  }

  .ship-stats-grid,
  .ship-side-stack {
    grid-template-columns: 1fr;
  }

  .ship-stat-card {
    min-height: 104px;
    padding: 18px;
  }

  .ship-stat-card strong {
    font-size: 30px;
  }

  .ship-panel {
    padding: 18px;
  }

  .ship-shipment-row {
    grid-template-columns: 1fr;
    gap: 8px;
    padding-bottom: 14px;
    border-bottom: 1px solid #edf2f8;
  }

  .ship-shipment-row:last-child {
    border-bottom: 0;
    padding-bottom: 0;
  }

  .ship-badge {
    width: fit-content;
  }

  .ship-donut {
    width: min(150px, 54vw);
  }
}

@media (max-width: 380px) {
  .ship-nav-item {
    padding: 0 10px;
    font-size: 13px;
  }

  .ship-date-button span {
    white-space: normal;
  }
}
`;
