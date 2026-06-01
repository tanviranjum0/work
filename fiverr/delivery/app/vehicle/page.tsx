const steps = [
  { number: 1, label: "Pickup" },
  { number: 2, label: "Delivery" },
  { number: 3, label: "Vehicle", active: true },
  { number: 4, label: "Review" },
];

function ChevronIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function TruckImage() {
  return (
    <svg
      className="vehicle-truck"
      viewBox="0 0 210 120"
      aria-label="Medium truck illustration"
      role="img"
    >
      <rect
        x="77"
        y="25"
        width="102"
        height="57"
        rx="3"
        fill="#f5f8fc"
        stroke="#c5cfdb"
      />
      <path d="M30 52h47v30H25l5-30Z" fill="#f8fbff" stroke="#9aa8ba" />
      <path
        d="M39 32h37l1 50H30l4-34c1-8 2-12 5-16Z"
        fill="#eef3f8"
        stroke="#8795a8"
      />
      <path d="M45 39h25l1 20H38l3-13c1-4 2-6 4-7Z" fill="#1d2938" />
      <path d="M28 82h151" stroke="#7e8b9d" strokeWidth="3" />
      <circle cx="48" cy="89" r="12" fill="#1f2937" />
      <circle cx="48" cy="89" r="5" fill="#d7dde6" />
      <circle cx="154" cy="89" r="12" fill="#1f2937" />
      <circle cx="154" cy="89" r="5" fill="#d7dde6" />
      <path d="M83 45h42" stroke="#0b5ee5" strokeWidth="3" />
      <path d="M87 55h30" stroke="#7fa5e9" strokeWidth="3" />
      <text x="129" y="57" fill="#2c5fae" fontSize="14" fontWeight="700">
        ShipSwift
      </text>
    </svg>
  );
}

export default function VehicleCapacityPage() {
  return (
    <main className="vehicle-shell">
      <style>{styles}</style>

      <div className="vehicle-page-title">
        <span>5</span>
        <h1>Vehicle Capacity Input</h1>
      </div>

      <section
        className="vehicle-card"
        aria-label="Create new shipment vehicle step"
      >
        <header className="vehicle-header">
          <ol className="vehicle-steps" aria-label="Shipment progress">
            {steps.map((step) => (
              <li className={step.active ? "is-active" : ""} key={step.label}>
                <span>{step.number}</span>
                <p>{step.label}</p>
              </li>
            ))}
          </ol>
        </header>

        <form className="vehicle-form">
          <div className="vehicle-section">
            <h2>Vehicle & Capacity</h2>

            <label htmlFor="vehicle-select">Select Vehicle</label>
            <div className="select-wrap">
              <select id="vehicle-select" name="vehicle">
                <option>Medium Truck (Box)</option>
                <option>Small Van</option>
                <option>Large Freight Truck</option>
              </select>
              <ChevronIcon />
            </div>

            <label htmlFor="capacity">Capacity</label>
            <div className="capacity-wrap">
              <input
                id="capacity"
                name="capacity"
                type="number"
                defaultValue={50}
              />
              <span>m³</span>
            </div>

            <article className="vehicle-summary">
              <div className="truck-frame">
                <TruckImage />
              </div>
              <div>
                <h3>Medium Truck (Box)</h3>
                <p>Capacity: 60 m³</p>
                <p>Max Load: 10,000 kg</p>
                <p>Dimensions: 6.2m x 2.4m x 2.4m</p>
              </div>
            </article>
          </div>

          <div className="vehicle-actions">
            <button className="back-button" type="button">
              Back
            </button>
            <button className="next-button" type="button">
              Next
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}

const styles = `
.vehicle-shell {
  min-height: 100vh;
  display: grid;
  align-content: start;
  justify-items: center;
  gap: 52px;
  padding: 31px 12px 0;
  background: #f8fbff;
  color: #12213b;
  font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}

.vehicle-page-title {
  width: min(100%, 530px);
  display: flex;
  align-items: center;
  gap: 20px;
}

.vehicle-page-title span {
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

.vehicle-page-title h1 {
  margin: 0;
  font-size: 27px;
  line-height: 1.15;
  letter-spacing: 0;
}

.vehicle-card {
  width: min(100%, 530px);
  padding: 63px 36px 39px;
  border: 1px solid #bccbdd;
  border-radius: 9px 9px 0 0;
  background: #fff;
  box-shadow: 0 20px 64px rgba(15, 35, 66, 0.05);
}

.vehicle-header {
  padding-bottom: 31px;
  border-bottom: 1px solid #dce4ef;
}

.vehicle-steps {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.vehicle-steps li {
  min-width: 0;
  display: grid;
  justify-items: center;
  gap: 8px;
  color: #65728a;
  font-size: 13px;
  font-weight: 700;
}

.vehicle-steps span {
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

.vehicle-steps p {
  margin: 0;
  line-height: 1.2;
}

.vehicle-steps .is-active {
  color: #075ee7;
}

.vehicle-steps .is-active span {
  background: #075ee7;
  color: #fff;
}

.vehicle-form {
  display: grid;
  gap: 44px;
  padding-top: 40px;
}

.vehicle-section h2 {
  margin: 0 0 34px;
  font-size: 18px;
  line-height: 1.2;
  letter-spacing: 0;
}

.vehicle-section label {
  display: block;
  margin: 0 0 12px;
  color: #41506b;
  font-size: 14px;
  font-weight: 600;
}

.select-wrap,
.capacity-wrap {
  width: 100%;
  height: 56px;
  display: flex;
  align-items: center;
  margin-bottom: 34px;
  border: 1px solid #cfd9e7;
  border-radius: 5px;
  background: #fff;
}

.select-wrap {
  position: relative;
}

.select-wrap select {
  width: 100%;
  height: 100%;
  appearance: none;
  border: 0;
  outline: 0;
  padding: 0 48px 0 16px;
  background: transparent;
  color: #12213b;
  font: inherit;
  font-size: 14px;
  font-weight: 600;
}

.select-wrap svg {
  position: absolute;
  right: 16px;
  width: 18px;
  height: 18px;
  fill: none;
  stroke: #253852;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 2;
  pointer-events: none;
}

.capacity-wrap {
  padding: 0 15px;
}

.capacity-wrap input {
  width: 100%;
  min-width: 0;
  border: 0;
  outline: 0;
  color: #12213b;
  font: inherit;
  font-size: 15px;
  font-weight: 600;
}

.capacity-wrap span {
  color: #12213b;
  font-size: 14px;
  font-weight: 700;
}

.vehicle-summary {
  display: grid;
  grid-template-columns: 150px minmax(0, 1fr);
  align-items: center;
  gap: 22px;
  padding: 25px 23px;
  border: 1px solid #dce4ef;
  border-radius: 7px;
  background: #fff;
  box-shadow: 0 12px 26px rgba(15, 35, 66, 0.04);
}

.truck-frame {
  min-width: 0;
}

.vehicle-truck {
  display: block;
  width: 100%;
  height: auto;
}

.vehicle-summary h3 {
  margin: 0 0 11px;
  font-size: 14px;
  line-height: 1.2;
}

.vehicle-summary p {
  margin: 0 0 8px;
  color: #41506b;
  font-size: 13px;
  font-weight: 600;
  line-height: 1.25;
}

.vehicle-summary p:last-child {
  margin-bottom: 0;
}

.vehicle-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;
  padding: 0 8px;
}

.vehicle-actions button {
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

.next-button {
  border: 0;
  background: #075ee7;
  color: #fff;
  box-shadow: 0 13px 24px rgba(7, 94, 231, 0.22);
}

.next-button:hover {
  background: #004fc8;
}

@media (max-width: 680px) {
  .vehicle-shell {
    gap: 34px;
    padding: 24px 0 0;
    background: #fff;
  }

  .vehicle-page-title {
    width: 100%;
    padding: 0 24px;
    gap: 14px;
  }

  .vehicle-page-title span {
    width: 38px;
    height: 38px;
    font-size: 19px;
  }

  .vehicle-page-title h1 {
    font-size: 24px;
  }

  .vehicle-card {
    width: 100%;
    padding: 42px 28px 34px;
    border-left: 0;
    border-right: 0;
    border-bottom: 0;
    border-radius: 9px 9px 0 0;
    box-shadow: none;
  }

  .vehicle-steps {
    gap: 12px;
  }

  .vehicle-form {
    gap: 36px;
    padding-top: 34px;
  }

  .vehicle-actions {
    gap: 16px;
    padding: 0;
  }
}

@media (max-width: 480px) {
  .vehicle-page-title {
    padding: 0 18px;
  }

  .vehicle-page-title h1 {
    font-size: 22px;
  }

  .vehicle-card {
    padding: 34px 18px 28px;
  }

  .vehicle-header {
    padding-bottom: 24px;
  }

  .vehicle-steps {
    gap: 8px;
  }

  .vehicle-steps li {
    font-size: 11px;
  }

  .vehicle-steps span {
    width: 28px;
    height: 28px;
    font-size: 13px;
  }

  .vehicle-section h2 {
    margin-bottom: 28px;
    font-size: 17px;
  }

  .select-wrap,
  .capacity-wrap {
    height: 54px;
    margin-bottom: 28px;
  }

  .vehicle-summary {
    grid-template-columns: 1fr;
    justify-items: center;
    gap: 16px;
    padding: 22px 16px;
    text-align: center;
  }

  .truck-frame {
    width: min(170px, 100%);
  }

  .vehicle-actions {
    grid-template-columns: 1fr;
    gap: 12px;
  }
}

@media (max-width: 340px) {
  .vehicle-page-title,
  .vehicle-card {
    padding-left: 14px;
    padding-right: 14px;
  }

  .vehicle-page-title span {
    width: 34px;
    height: 34px;
    font-size: 17px;
  }

  .vehicle-steps li {
    font-size: 10px;
  }
}
`;
