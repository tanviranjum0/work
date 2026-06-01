type IconName = "pickup" | "delivery" | "vehicle" | "capacity";

const steps = [
  { number: 1, label: "Pickup" },
  { number: 2, label: "Delivery" },
  { number: 3, label: "Vehicle" },
  { number: 4, label: "Review", active: true },
];

const details: { label: string; value: string; icon: IconName }[] = [
  {
    label: "Pickup Location",
    value: "123 Main St, New York, NY, USA",
    icon: "pickup",
  },
  {
    label: "Delivery Location",
    value: "456 Oak St, Los Angeles, CA, USA",
    icon: "delivery",
  },
  { label: "Vehicle", value: "Medium Truck (Box)", icon: "vehicle" },
  { label: "Capacity", value: "50 m\u00b3", icon: "capacity" },
];

const iconPaths: Record<IconName, string[]> = {
  pickup: [
    "M12 21s7-6.1 7-12A7 7 0 0 0 5 9c0 5.9 7 12 7 12Z",
    "M12 11.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z",
  ],
  delivery: [
    "M12 21s7-6.1 7-12A7 7 0 0 0 5 9c0 5.9 7 12 7 12Z",
    "M12 11.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z",
  ],
  vehicle: [
    "M3 7h11v9H3z",
    "M14 10h4l3 3v3h-7",
    "M7 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z",
    "M17 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z",
  ],
  capacity: ["M7 7h10", "M7 11h10", "M9 3h6", "M6 5h12v15H6z"],
};

function DetailIcon({ name }: { name: IconName }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      {iconPaths[name].map((path) => (
        <path key={path} d={path} />
      ))}
    </svg>
  );
}

export default function ReviewShipmentPage() {
  return (
    <main className="review-shell">
      <style>{styles}</style>

      <div className="review-page-title">
        <span>6</span>
        <h1>Review Shipment Details</h1>
      </div>

      <section className="review-card" aria-label="Review shipment details">
        <header className="review-header">
          <ol className="review-steps" aria-label="Shipment progress">
            {steps.map((step) => (
              <li className={step.active ? "is-active" : ""} key={step.label}>
                <span>{step.number}</span>
                <p>{step.label}</p>
              </li>
            ))}
          </ol>
        </header>

        <div className="review-content">
          <h2>Review & Confirm</h2>

          <div className="review-details">
            {details.map((detail) => (
              <article className="review-row" key={detail.label}>
                <DetailIcon name={detail.icon} />
                <div>
                  <h3>{detail.label}</h3>
                  <p>{detail.value}</p>
                </div>
              </article>
            ))}
          </div>

          <div className="review-actions">
            <button className="back-button" type="button">
              Back
            </button>
            <button className="confirm-button" type="button">
              Confirm Shipment
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}

const styles = `
.review-shell {
  min-height: 100vh;
  display: grid;
  align-content: start;
  justify-items: center;
  gap: 37px;
  padding: 31px 24px 70px;
  background: #f8fbff;
  color: #12213b;
  font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}

.review-page-title {
  width: min(100%, 516px);
  display: flex;
  align-items: center;
  gap: 20px;
}

.review-page-title span {
  width: 43px;
  height: 43px;
  flex: 0 0 auto;
  display: grid;
  place-items: center;
  border-radius: 999px;
  background: #082b5f;
  color: #fff;
  font-size: 22px;
  font-weight: 800;
}

.review-page-title h1 {
  margin: 0;
  font-size: 27px;
  line-height: 1.15;
  letter-spacing: 0;
}

.review-card {
  width: min(100%, 516px);
  min-height: 838px;
  padding: 51px 31px 40px;
  border: 1px solid #bccbdd;
  border-radius: 9px;
  background: #fff;
  box-shadow: 0 20px 64px rgba(15, 35, 66, 0.05);
}

.review-header {
  padding-bottom: 58px;
}

.review-steps {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
  margin: 0;
  padding: 0;
  list-style: none;
  position: relative;
}

.review-steps::before {
  content: "";
  position: absolute;
  top: 15px;
  left: 12.5%;
  right: 12.5%;
  height: 2px;
  background: #e5ebf3;
}

.review-steps li {
  min-width: 0;
  display: grid;
  justify-items: center;
  gap: 8px;
  color: #65728a;
  font-size: 13px;
  font-weight: 700;
  position: relative;
  z-index: 1;
}

.review-steps span {
  width: 31px;
  height: 31px;
  display: grid;
  place-items: center;
  border-radius: 999px;
  background: #edf1f6;
  color: #283852;
  font-size: 14px;
  font-weight: 800;
}

.review-steps p {
  margin: 0;
  line-height: 1.2;
}

.review-steps .is-active {
  color: #075ee7;
}

.review-steps .is-active span {
  background: #075ee7;
  color: #fff;
}

.review-content h2 {
  margin: 0 0 18px;
  font-size: 18px;
  line-height: 1.2;
  letter-spacing: 0;
}

.review-details {
  overflow: hidden;
  border: 1px solid #dce4ef;
  border-radius: 7px;
  background: #fff;
  box-shadow: 0 12px 26px rgba(15, 35, 66, 0.04);
}

.review-row {
  min-height: 107px;
  display: grid;
  grid-template-columns: 25px minmax(0, 1fr);
  gap: 14px;
  align-items: start;
  padding: 27px 18px 19px;
  border-bottom: 1px solid #dce4ef;
}

.review-row:last-child {
  border-bottom: 0;
}

.review-row svg {
  width: 18px;
  height: 18px;
  margin-top: 1px;
  fill: none;
  stroke: #075ee7;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 2;
}

.review-row h3 {
  margin: 0 0 11px;
  color: #075ee7;
  font-size: 14px;
  line-height: 1.2;
}

.review-row p {
  margin: 0;
  color: #12213b;
  font-size: 14px;
  font-weight: 600;
  line-height: 1.35;
  overflow-wrap: anywhere;
}

.review-actions {
  display: grid;
  grid-template-columns: 1fr 1.28fr;
  gap: 31px;
  margin-top: 51px;
}

.review-actions button {
  min-height: 50px;
  border-radius: 6px;
  font: inherit;
  font-size: 14px;
  font-weight: 800;
  cursor: pointer;
}

.back-button {
  border: 1px solid #dce4ef;
  background: #fff;
  color: #12213b;
}

.back-button:hover {
  background: #f7faff;
}

.confirm-button {
  border: 0;
  background: #075ee7;
  color: #fff;
  box-shadow: 0 13px 24px rgba(7, 94, 231, 0.22);
}

.confirm-button:hover {
  background: #004fc8;
}

@media (max-width: 680px) {
  .review-shell {
    gap: 30px;
    padding: 24px 0 0;
    background: #fff;
  }

  .review-page-title {
    width: 100%;
    padding: 0 24px;
    gap: 14px;
  }

  .review-page-title span {
    width: 38px;
    height: 38px;
    font-size: 19px;
  }

  .review-page-title h1 {
    font-size: 24px;
  }

  .review-card {
    width: 100%;
    min-height: auto;
    padding: 42px 28px 34px;
    border-left: 0;
    border-right: 0;
    border-bottom: 0;
    border-radius: 9px 9px 0 0;
    box-shadow: none;
  }

  .review-header {
    padding-bottom: 44px;
  }

  .review-steps {
    gap: 12px;
  }

  .review-actions {
    gap: 16px;
    margin-top: 36px;
  }
}

@media (max-width: 480px) {
  .review-page-title {
    padding: 0 18px;
  }

  .review-page-title h1 {
    font-size: 22px;
  }

  .review-card {
    padding: 34px 18px 28px;
  }

  .review-header {
    padding-bottom: 36px;
  }

  .review-steps {
    gap: 8px;
  }

  .review-steps li {
    font-size: 11px;
  }

  .review-steps span {
    width: 28px;
    height: 28px;
    font-size: 13px;
  }

  .review-steps::before {
    top: 14px;
  }

  .review-content h2 {
    font-size: 17px;
  }

  .review-row {
    min-height: 96px;
    grid-template-columns: 22px minmax(0, 1fr);
    gap: 11px;
    padding: 22px 14px 17px;
  }

  .review-row h3,
  .review-row p {
    font-size: 13px;
  }

  .review-actions {
    grid-template-columns: 1fr;
    gap: 12px;
  }
}

@media (max-width: 340px) {
  .review-page-title,
  .review-card {
    padding-left: 14px;
    padding-right: 14px;
  }

  .review-page-title span {
    width: 34px;
    height: 34px;
    font-size: 17px;
  }

  .review-steps li {
    font-size: 10px;
  }
}
`;
