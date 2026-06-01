const steps = [
  { number: 1, label: "Pickup" },
  { number: 2, label: "Delivery", active: true },
  { number: 3, label: "Vehicle" },
  { number: 4, label: "Review" },
];

const suggestions = [
  "456 Oak St, Los Angeles, CA, USA",
  "456 Oakwood Ave, Houston, TX, USA",
  "456 Oak Tree Ln, Dallas, TX, USA",
  "456 Oakhill Rd, Chicago, IL, USA",
  "456 Oakridge Dr, Miami, FL, USA",
];

function PinIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 21s7-6.1 7-12A7 7 0 0 0 5 9c0 5.9 7 12 7 12Z" />
      <path d="M12 11.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" />
    </svg>
  );
}

export default function DeliveryLocationPage() {
  return (
    <main className="delivery-shell">
      <style>{styles}</style>

      <section
        className="delivery-card"
        aria-label="Create new shipment delivery step"
      >
        <header className="delivery-header">
          <h1>Create New Shipment</h1>

          <ol className="delivery-steps" aria-label="Shipment progress">
            {steps.map((step) => (
              <li className={step.active ? "is-active" : ""} key={step.label}>
                <span>{step.number}</span>
                <p>{step.label}</p>
              </li>
            ))}
          </ol>
        </header>

        <form className="delivery-form">
          <div className="delivery-section">
            <h2>Delivery Location</h2>

            <label htmlFor="delivery-address">Enter delivery address</label>
            <input
              id="delivery-address"
              name="delivery-address"
              type="text"
              defaultValue="456 oak"
              autoComplete="off"
            />

            <div
              className="delivery-suggestions"
              role="listbox"
              aria-label="Delivery address suggestions"
            >
              {suggestions.map((suggestion) => (
                <button
                  className="delivery-suggestion"
                  type="button"
                  role="option"
                  key={suggestion}
                >
                  <PinIcon />
                  <span>{suggestion}</span>
                </button>
              ))}

              <div className="delivery-powered" aria-label="Powered by Google">
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

          <div className="delivery-actions">
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
.delivery-shell {
  min-height: 100vh;
  display: grid;
  place-items: start center;
  padding: 14px 0;
  background: #f8fbff;
  color: #12213b;
  font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}

.delivery-card {
  width: min(calc(100% - 18px), 530px);
  min-height: calc(100vh - 28px);
  padding: 47px 39px 36px;
  border: 1px solid #bccbdd;
  border-radius: 9px;
  background: #fff;
  box-shadow: 0 20px 64px rgba(15, 35, 66, 0.05);
}

.delivery-header {
  padding-bottom: 31px;
  border-bottom: 1px solid #dce4ef;
}

.delivery-header h1 {
  margin: 0 0 34px;
  font-size: 26px;
  line-height: 1.15;
  letter-spacing: 0;
}

.delivery-steps {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.delivery-steps li {
  min-width: 0;
  display: grid;
  justify-items: center;
  gap: 8px;
  color: #65728a;
  font-size: 13px;
  font-weight: 700;
}

.delivery-steps span {
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

.delivery-steps p {
  margin: 0;
  line-height: 1.2;
}

.delivery-steps .is-active {
  color: #075ee7;
}

.delivery-steps .is-active span {
  background: #075ee7;
  color: #fff;
}

.delivery-form {
  display: grid;
  gap: 40px;
  padding-top: 39px;
}

.delivery-section h2 {
  margin: 0 0 29px;
  font-size: 18px;
  line-height: 1.2;
  letter-spacing: 0;
}

.delivery-section label {
  display: block;
  margin-bottom: 12px;
  color: #41506b;
  font-size: 14px;
  font-weight: 600;
}

.delivery-section input {
  width: 100%;
  height: 56px;
  padding: 0 15px;
  border: 2px solid #075ee7;
  border-radius: 5px;
  outline: 0;
  color: #12213b;
  background: #fff;
  font: inherit;
  font-size: 15px;
  box-shadow: 0 0 0 3px rgba(7, 94, 231, 0.08);
}

.delivery-suggestions {
  width: 100%;
  padding: 5px 0 10px;
  border: 1px solid #e4ebf4;
  border-top: 0;
  border-radius: 0 0 6px 6px;
  background: #fff;
  box-shadow: 0 18px 34px rgba(15, 35, 66, 0.11);
}

.delivery-suggestion {
  width: 100%;
  min-height: 49px;
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

.delivery-suggestion:hover,
.delivery-suggestion:focus-visible {
  background: #f2f6fc;
  outline: 0;
}

.delivery-suggestion svg {
  width: 17px;
  height: 17px;
  fill: none;
  stroke: #5e6b82;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 2;
}

.delivery-suggestion span {
  min-width: 0;
  overflow-wrap: anywhere;
}

.delivery-powered {
  display: flex;
  justify-content: flex-end;
  align-items: baseline;
  gap: 4px;
  padding: 7px 14px 0;
  color: #7a8495;
  font-size: 12px;
  line-height: 1;
}

.delivery-powered strong {
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

.delivery-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
  padding: 0 12px;
}

.delivery-actions button {
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
  .delivery-shell {
    padding: 0;
    background: #fff;
  }

  .delivery-card {
    width: 100%;
    min-height: 100vh;
    padding: 34px 28px 30px;
    border: 0;
    border-radius: 0;
    box-shadow: none;
  }

  .delivery-header h1 {
    margin-bottom: 28px;
    font-size: 24px;
  }

  .delivery-steps {
    gap: 12px;
  }

  .delivery-form {
    gap: 34px;
    padding-top: 32px;
  }

  .delivery-actions {
    gap: 16px;
    padding: 0;
  }
}

@media (max-width: 460px) {
  .delivery-card {
    padding: 28px 18px 26px;
  }

  .delivery-header {
    padding-bottom: 24px;
  }

  .delivery-header h1 {
    font-size: 22px;
  }

  .delivery-steps {
    gap: 8px;
  }

  .delivery-steps li {
    font-size: 11px;
  }

  .delivery-steps span {
    width: 28px;
    height: 28px;
    font-size: 13px;
  }

  .delivery-section h2 {
    margin-bottom: 24px;
    font-size: 17px;
  }

  .delivery-section input {
    height: 54px;
    font-size: 14px;
  }

  .delivery-suggestion {
    min-height: 50px;
    padding: 0 12px;
    font-size: 13px;
  }

  .delivery-actions {
    grid-template-columns: 1fr;
    gap: 12px;
  }
}

@media (max-width: 340px) {
  .delivery-card {
    padding-left: 14px;
    padding-right: 14px;
  }

  .delivery-steps li {
    font-size: 10px;
  }

  .delivery-suggestion {
    grid-template-columns: 18px minmax(0, 1fr);
    gap: 7px;
  }
}
`;
