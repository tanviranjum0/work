const steps = [
  { number: 1, label: "Pickup", active: true },
  { number: 2, label: "Delivery" },
  { number: 3, label: "Vehicle" },
  { number: 4, label: "Review" },
];

const suggestions = [
  "123 Main St, New York, NY, USA",
  "123 Market St, San Francisco, CA, USA",
  "123 Madison Ave, New York, NY, USA",
  "123 Magnolia Ave, Los Angeles, CA, USA",
  "123 Mahogany Rd, Austin, TX, USA",
];

function PinIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 21s7-6.1 7-12A7 7 0 0 0 5 9c0 5.9 7 12 7 12Z" />
      <path d="M12 11.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" />
    </svg>
  );
}

export default function CreateNewShipmentPage() {
  return (
    <main className="shipment-shell">
      <style>{styles}</style>

      <section className="shipment-card" aria-label="Create new shipment">
        <header className="shipment-header">
          <h1>Create New Shipment</h1>

          <ol className="shipment-steps" aria-label="Shipment progress">
            {steps.map((step) => (
              <li className={step.active ? "is-active" : ""} key={step.label}>
                <span>{step.number}</span>
                <p>{step.label}</p>
              </li>
            ))}
          </ol>
        </header>

        <form className="shipment-form">
          <div className="form-section">
            <h2>Pickup Location</h2>

            <label htmlFor="pickup-address">Enter pickup address</label>
            <input
              id="pickup-address"
              name="pickup-address"
              type="text"
              defaultValue="123 ma"
              autoComplete="off"
            />

            <div
              className="suggestion-box"
              role="listbox"
              aria-label="Pickup address suggestions"
            >
              {suggestions.map((suggestion) => (
                <button
                  className="suggestion-item"
                  type="button"
                  role="option"
                  key={suggestion}
                >
                  <PinIcon />
                  <span>{suggestion}</span>
                </button>
              ))}

              <div className="powered-by" aria-label="Powered by Google">
                <span>powered by</span>
                <strong>
                  <span className="g-blue">G</span>
                  <span className="g-red">o</span>
                  <span className="g-yellow">o</span>
                  <span className="g-blue">g</span>
                  <span className="g-green">l</span>
                  <span className="g-red">e</span>
                </strong>
              </div>
            </div>
          </div>

          <button className="next-button" type="button">
            Next
          </button>
        </form>
      </section>
    </main>
  );
}

const styles = `
.shipment-shell {
  min-height: 100vh;
  display: grid;
  place-items: start center;
  padding: 0;
  background: #f8fbff;
  color: #12213b;
  font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}

.shipment-card {
  width: min(100%, 590px);
  min-height: 100vh;
  padding: 46px 42px 34px;
  border-left: 1px solid #c7d3e3;
  border-right: 1px solid #c7d3e3;
  background: #fff;
  box-shadow: 0 24px 70px rgba(15, 35, 66, 0.06);
}

.shipment-header {
  padding-bottom: 28px;
  border-bottom: 1px solid #dce4ef;
}

.shipment-header h1 {
  margin: 0 0 34px;
  font-size: 26px;
  line-height: 1.15;
  letter-spacing: 0;
}

.shipment-steps {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 20px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.shipment-steps li {
  min-width: 0;
  display: grid;
  justify-items: center;
  gap: 8px;
  color: #65728a;
  font-size: 13px;
  font-weight: 700;
}

.shipment-steps span {
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

.shipment-steps p {
  margin: 0;
  line-height: 1.2;
}

.shipment-steps .is-active {
  color: #075ee7;
}

.shipment-steps .is-active span {
  background: #075ee7;
  color: #fff;
}

.shipment-form {
  display: grid;
  gap: 40px;
  padding-top: 38px;
}

.form-section h2 {
  margin: 0 0 28px;
  font-size: 18px;
  line-height: 1.2;
  letter-spacing: 0;
}

.form-section label {
  display: block;
  margin-bottom: 12px;
  color: #41506b;
  font-size: 14px;
  font-weight: 600;
}

.form-section input {
  width: 100%;
  height: 56px;
  padding: 0 15px;
  border: 2px solid #075ee7;
  border-radius: 6px;
  outline: 0;
  color: #12213b;
  background: #fff;
  font: inherit;
  font-size: 15px;
  box-shadow: 0 0 0 3px rgba(7, 94, 231, 0.08);
}

.suggestion-box {
  width: 100%;
  padding: 5px 0 10px;
  border: 1px solid #e4ebf4;
  border-top: 0;
  border-radius: 0 0 6px 6px;
  background: #fff;
  box-shadow: 0 18px 34px rgba(15, 35, 66, 0.11);
}

.suggestion-item {
  width: 100%;
  min-height: 48px;
  display: grid;
  grid-template-columns: 22px minmax(0, 1fr);
  align-items: center;
  gap: 9px;
  padding: 0 15px;
  border: 0;
  background: transparent;
  color: #172842;
  font: inherit;
  font-size: 14px;
  font-weight: 600;
  text-align: left;
  cursor: pointer;
}

.suggestion-item:hover,
.suggestion-item:focus-visible {
  background: #f2f6fc;
  outline: 0;
}

.suggestion-item svg {
  width: 17px;
  height: 17px;
  fill: none;
  stroke: #5e6b82;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 2;
}

.suggestion-item span {
  min-width: 0;
  overflow-wrap: anywhere;
}

.powered-by {
  display: flex;
  justify-content: flex-end;
  align-items: baseline;
  gap: 4px;
  padding: 7px 14px 0;
  color: #7a8495;
  font-size: 12px;
  line-height: 1;
}

.powered-by strong {
  font-size: 14px;
  font-weight: 800;
}

.g-blue {
  color: #4285f4;
}

.g-red {
  color: #ea4335;
}

.g-yellow {
  color: #fbbc05;
}

.g-green {
  color: #34a853;
}

.next-button {
  justify-self: center;
  width: min(100%, 320px);
  min-height: 51px;
  border: 0;
  border-radius: 6px;
  background: #075ee7;
  color: #fff;
  font: inherit;
  font-size: 14px;
  font-weight: 800;
  box-shadow: 0 13px 24px rgba(7, 94, 231, 0.22);
  cursor: pointer;
}

.next-button:hover {
  background: #004fc8;
}

@media (max-width: 720px) {
  .shipment-shell {
    background: #fff;
  }

  .shipment-card {
    width: 100%;
    padding: 34px 28px 30px;
    border: 0;
    box-shadow: none;
  }

  .shipment-header h1 {
    margin-bottom: 28px;
    font-size: 24px;
  }

  .shipment-steps {
    gap: 12px;
  }

  .shipment-form {
    gap: 34px;
    padding-top: 32px;
  }
}

@media (max-width: 480px) {
  .shipment-card {
    padding: 28px 18px 26px;
  }

  .shipment-header {
    padding-bottom: 24px;
  }

  .shipment-header h1 {
    font-size: 22px;
  }

  .shipment-steps {
    gap: 8px;
  }

  .shipment-steps li {
    font-size: 11px;
  }

  .shipment-steps span {
    width: 28px;
    height: 28px;
    font-size: 13px;
  }

  .form-section h2 {
    margin-bottom: 24px;
    font-size: 17px;
  }

  .form-section input {
    height: 54px;
    font-size: 14px;
  }

  .suggestion-item {
    min-height: 50px;
    padding: 0 12px;
    font-size: 13px;
  }

  .next-button {
    width: 100%;
  }
}

@media (max-width: 340px) {
  .shipment-card {
    padding-left: 14px;
    padding-right: 14px;
  }

  .shipment-steps li {
    font-size: 10px;
  }

  .suggestion-item {
    grid-template-columns: 18px minmax(0, 1fr);
    gap: 7px;
  }
}
`;
