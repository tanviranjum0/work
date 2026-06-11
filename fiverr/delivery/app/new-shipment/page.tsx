/* eslint-disable react-hooks/use-memo */
/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { debounce } from "lodash";
// ─── Types ────────────────────────────────────────────────────────────────────

type Step = 1 | 2 | 3 | 4;

interface AddressSuggestion {
  id: string;
  display: string;
  secondary: string;
}

interface Vehicle {
  id: string;
  label: string;
  capacity: number;
  maxLoad: number;
  dimensions: string;
}

interface FormState {
  pickupAddress: string;
  pickupSelected: AddressSuggestion | null;
  deliveryAddress: string;
  deliverySelected: AddressSuggestion | null;
  vehicleId: string;
  capacity: number;
}

// ─── Static Data ──────────────────────────────────────────────────────────────

const VEHICLES: Vehicle[] = [
  {
    id: "small-van",
    label: "Small Van",
    capacity: 10,
    maxLoad: 1000,
    dimensions: "2.5m × 1.8m × 1.8m",
  },
  {
    id: "medium-truck-box",
    label: "Medium Truck (Box)",
    capacity: 60,
    maxLoad: 10000,
    dimensions: "6.2m × 2.4m × 2.4m",
  },
  {
    id: "large-truck",
    label: "Large Truck",
    capacity: 120,
    maxLoad: 24000,
    dimensions: "13.6m × 2.4m × 2.7m",
  },
  {
    id: "flatbed",
    label: "Flatbed Truck",
    capacity: 80,
    maxLoad: 20000,
    dimensions: "12.0m × 2.5m × 0m",
  },
];

// ─── Stepper ──────────────────────────────────────────────────────────────────

function Stepper({ current }: { current: Step }) {
  const steps: { num: Step; label: string }[] = [
    { num: 1, label: "Pickup" },
    { num: 2, label: "Delivery" },
    { num: 3, label: "Vehicle" },
    { num: 4, label: "Review" },
  ];

  return (
    <div className="stepper">
      {steps.map((s, i) => (
        <React.Fragment key={s.num}>
          <div className="step-item">
            <div
              className={`step-circle ${
                current === s.num ? "active" : current > s.num ? "done" : "idle"
              }`}
            >
              {current > s.num ? (
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path
                    d="M2 7l4 4 6-6"
                    stroke="#fff"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ) : (
                s.num
              )}
            </div>
            <span
              className={`step-label ${current === s.num ? "active-label" : current > s.num ? "done-label" : ""}`}
            >
              {s.label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div
              className={`step-connector ${current > s.num ? "done-line" : ""}`}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

// ─── Address Autocomplete ─────────────────────────────────────────────────────

function AddressInput({
  label,
  placeholder,
  value,
  onChange,
  onSelect,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  onSelect: (s: AddressSuggestion) => void;
}) {
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const getSuggestions = useCallback(
    debounce(async (inputValue: string) => {
      setOpen(false);
      if (inputValue.length >= 3) {
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/maps/get-suggestions?input=${inputValue}`,
          );
          const data = await response.json();

          setSuggestions(data);
          setOpen(data.length > 0 && data.length > 0);
        } catch (error) {
          console.error(error);
        }
      }
    }, 700),
    [],
  );

  // useEffect(() => {
  //   getSuggestions(value);
  // }, [value]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="address-field" ref={wrapperRef}>
      <label className="field-label">{label}</label>
      <input
        type="text"
        className="address-input"
        placeholder={placeholder}
        value={value}
        onChange={(e) => {
          getSuggestions(e.target.value);
          onChange(e.target.value);
        }}
        onFocus={() => suggestions.length > 0 && setOpen(true)}
        autoComplete="off"
      />
      {open && (
        <ul className="suggestions-list">
          {suggestions.map((s) => (
            <li
              key={s.id}
              className="suggestion-item"
              onClick={() => {
                onSelect(s);
                onChange(`${s.display}, ${s.secondary}`);
                setOpen(false);
              }}
            >
              <svg className="pin-svg" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z"
                  fill="#94a3b8"
                />
              </svg>
              <span className="suggestion-text">
                <strong>
                  {s.display}
                  {",  "}
                </strong>
                <span
                  style={{
                    paddingLeft: "5px",
                  }}
                  className="suggestion-secondary "
                >
                  {s.secondary}
                </span>
              </span>
            </li>
          ))}
          <li className="powered-by">
            powered by{" "}
            <span>
              <span style={{ color: "#4285F4" }}>G</span>
              <span style={{ color: "#EA4335" }}>o</span>
              <span style={{ color: "#FBBC05" }}>o</span>
              <span style={{ color: "#4285F4" }}>g</span>
              <span style={{ color: "#34A853" }}>l</span>
              <span style={{ color: "#EA4335" }}>e</span>
            </span>
          </li>
        </ul>
      )}
    </div>
  );
}

// ─── Step 1 – Pickup ──────────────────────────────────────────────────────────

function StepPickup({
  form,
  setForm,
  onNext,
}: {
  form: FormState;
  setForm: React.Dispatch<React.SetStateAction<FormState>>;
  onNext: () => void;
}) {
  return (
    <div className="card">
      <div className="card-header">
        <h2 className="card-title">Create New Shipment</h2>
      </div>
      <Stepper current={1} />
      <div className="section-divider" />
      <h3 className="section-heading">Pickup Location</h3>
      <AddressInput
        label="Enter pickup address"
        placeholder="e.g. 123 Main St…"
        value={form.pickupAddress}
        onChange={(v) => {
          setForm((f) => ({ ...f, pickupAddress: v, pickupSelected: null }));
        }}
        onSelect={(s) => {
          setForm((f) => ({ ...f, pickupSelected: s }));
        }}
      />
      <div className="btn-row single">
        <button
          className="btn-primary"
          onClick={onNext}
          disabled={!form.pickupAddress}
        >
          Next
        </button>
      </div>
    </div>
  );
}

// ─── Step 2 – Delivery ────────────────────────────────────────────────────────

function StepDelivery({
  form,
  setForm,
  onBack,
  onNext,
}: {
  form: FormState;
  setForm: React.Dispatch<React.SetStateAction<FormState>>;
  onBack: () => void;
  onNext: () => void;
}) {
  // console.log(form);
  return (
    <div className="card">
      <div className="card-header">
        <h2 className="card-title">Create New Shipment</h2>
      </div>
      <Stepper current={2} />
      <div className="section-divider" />
      <h3 className="section-heading">Delivery Location</h3>
      <AddressInput
        label="Enter delivery address"
        placeholder="e.g. 456 Oak St…"
        value={form.deliveryAddress}
        onChange={(v) =>
          setForm((f) => ({ ...f, deliveryAddress: v, deliverySelected: null }))
        }
        onSelect={(s) => setForm((f) => ({ ...f, deliverySelected: s }))}
      />
      <div className="btn-row">
        <button className="btn-outline" onClick={onBack}>
          Back
        </button>
        <button
          className="btn-primary"
          onClick={onNext}
          disabled={!form.deliverySelected}
        >
          Next
        </button>
      </div>
    </div>
  );
}

// ─── Step 3 – Vehicle ─────────────────────────────────────────────────────────

function StepVehicle({
  form,
  setForm,
  onBack,
  onNext,
}: {
  form: FormState;
  setForm: React.Dispatch<React.SetStateAction<FormState>>;
  onBack: () => void;
  onNext: () => void;
}) {
  const vehicle = VEHICLES.find((v) => v.id === form.vehicleId) ?? VEHICLES[1];

  return (
    <div className="card">
      <div className="card-header">
        <h2 className="card-title">Vehicle &amp; Capacity</h2>
      </div>
      <Stepper current={3} />
      <div className="section-divider" />

      <div className="field-group">
        <label className="field-label" htmlFor="vehicle-select">
          Select Vehicle
        </label>
        <div className="select-wrap">
          <select
            id="vehicle-select"
            className="select-input"
            value={form.vehicleId}
            onChange={(e) =>
              setForm((f) => ({
                ...f,
                vehicleId: e.target.value,
                capacity:
                  VEHICLES.find((v) => v.id === e.target.value)?.capacity ??
                  f.capacity,
              }))
            }
          >
            {VEHICLES.map((v) => (
              <option key={v.id} value={v.id}>
                {v.label}
              </option>
            ))}
          </select>
          <svg className="select-chevron" viewBox="0 0 20 20" fill="none">
            <path
              d="M5 7.5l5 5 5-5"
              stroke="#64748b"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>

      <div className="field-group" style={{ marginTop: 18 }}>
        <label className="field-label">Capacity</label>
        <div className="capacity-input-wrap">
          <input
            placeholder="Enter Vehicle capacity"
            type="number"
            className="capacity-input"
            min={1}
            max={vehicle.capacity}
            value={form.capacity}
            onChange={(e) =>
              setForm((f) => ({ ...f, capacity: Number(e.target.value) }))
            }
          />
          <span className="capacity-unit">m³</span>
        </div>
        <p className="capacity-hint">
          Max for this vehicle: {vehicle.capacity} m³
        </p>
      </div>

      <div className="vehicle-info-card">
        <div className="vehicle-icon-wrap">
          <svg viewBox="0 0 64 40" fill="none" className="truck-svg">
            <rect x="2" y="12" width="40" height="24" rx="3" fill="#cbd5e1" />
            <rect x="4" y="14" width="36" height="20" rx="2" fill="#e2e8f0" />
            <path d="M42 18h8l8 8v10H42V18z" fill="#94a3b8" />
            <rect x="44" y="20" width="10" height="8" rx="1" fill="#bfdbfe" />
            <circle cx="12" cy="36" r="4" fill="#475569" />
            <circle cx="12" cy="36" r="2" fill="#94a3b8" />
            <circle cx="50" cy="36" r="4" fill="#475569" />
            <circle cx="50" cy="36" r="2" fill="#94a3b8" />
          </svg>
        </div>
        <div className="vehicle-details">
          <strong>{vehicle.label}</strong>
          <span>Capacity: {vehicle.capacity} m³</span>
          <span>Max Load: {vehicle.maxLoad.toLocaleString()} kg</span>
          <span>Dimensions: {vehicle.dimensions}</span>
        </div>
      </div>

      <div className="btn-row">
        <button className="btn-outline" onClick={onBack}>
          Back
        </button>
        <button className="btn-primary" onClick={onNext}>
          Next
        </button>
      </div>
    </div>
  );
}

// ─── Step 4 – Review ──────────────────────────────────────────────────────────

function ReviewRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="review-row">
      <div className="review-icon">{icon}</div>
      <div className="review-content">
        <div className="review-label">{label}</div>
        <div className="review-value">{value}</div>
      </div>
    </div>
  );
}

const IconPin = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path
      d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z"
      fill="#1e40af"
    />
  </svg>
);

const IconTruck = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path
      d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5-9l1.96 2.5H17V9.5h2.5zm-1.5 9c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"
      fill="#1e40af"
    />
  </svg>
);

const IconBox = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path
      d="M20.54 5.23l-1.39-1.68C18.88 3.21 18.47 3 18 3H6c-.47 0-.88.21-1.16.55L3.46 5.23C3.17 5.57 3 6.02 3 6.5V19c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6.5c0-.48-.17-.93-.46-1.27zM12 17.5L6.5 12H10v-2h4v2h3.5L12 17.5zM5.12 5l.81-1h12l.94 1H5.12z"
      fill="#1e40af"
    />
  </svg>
);

function StepReview({
  form,
  onBack,
  onConfirm,
}: {
  form: FormState;
  onBack: () => void;
  onConfirm: () => void;
}) {
  const vehicle = VEHICLES.find((v) => v.id === form.vehicleId) ?? VEHICLES[1];

  return (
    <div className="card">
      <div className="card-header">
        <h2 className="card-title">Review &amp; Confirm</h2>
      </div>
      <Stepper current={4} />
      <div className="section-divider" />

      <ReviewRow
        icon={<IconPin />}
        label="Pickup Location"
        value={form.pickupAddress}
      />
      <div className="review-divider" />
      <ReviewRow
        icon={<IconPin />}
        label="Delivery Location"
        value={form.deliveryAddress}
      />
      <div className="review-divider" />
      <ReviewRow icon={<IconTruck />} label="Vehicle" value={vehicle.label} />
      <div className="review-divider" />
      <ReviewRow
        icon={<IconBox />}
        label="Capacity"
        value={`${form.capacity} m³`}
      />

      <div className="btn-row">
        <button className="btn-outline" onClick={onBack}>
          Back
        </button>
        <button className="btn-primary confirm-btn" onClick={onConfirm}>
          Confirm Shipment
        </button>
      </div>
    </div>
  );
}

// ─── Success Screen ───────────────────────────────────────────────────────────

function SuccessScreen({
  form,
  onReset,
}: {
  form: FormState;
  onReset: () => void;
}) {
  return (
    <div className="card success-card">
      <div className="success-icon-wrap">
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
          <circle cx="24" cy="24" r="24" fill="#dcfce7" />
          <path
            d="M14 24l8 8 12-12"
            stroke="#16a34a"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <h2 className="card-title" style={{ textAlign: "center" }}>
        Shipment Confirmed!
      </h2>
      <p className="success-sub">
        Your shipment has been created successfully and is ready for processing.
      </p>
      <div className="success-summary">
        <div className="success-row">
          <span className="success-key">From</span>
          <span className="success-val">{form.pickupAddress}</span>
        </div>
        <div className="success-row">
          <span className="success-key">To</span>
          <span className="success-val">{form.deliveryAddress}</span>
        </div>
        <div className="success-row">
          <span className="success-key">Vehicle</span>
          <span className="success-val">
            {VEHICLES.find((v) => v.id === form.vehicleId)?.label}
          </span>
        </div>
      </div>
      <button
        className="btn-primary"
        style={{ width: "100%", marginTop: 8 }}
        onClick={onReset}
      >
        Create Another Shipment
      </button>
    </div>
  );
}

// ─── Root Component ───────────────────────────────────────────────────────────

const DEFAULT_FORM: FormState = {
  pickupAddress: "",
  pickupSelected: null,
  deliveryAddress: "",
  deliverySelected: null,
  vehicleId: "medium-truck-box",
  capacity: 50,
};

export default function CreateShipmentForm() {
  const [step, setStep] = useState<Step>(1);
  const [confirmed, setConfirmed] = useState(false);
  const [form, setForm] = useState<FormState>(DEFAULT_FORM);

  const next = () => setStep((s) => Math.min(s + 1, 4) as Step);
  const back = () => setStep((s) => Math.max(s - 1, 1) as Step);

  const reset = () => {
    setConfirmed(false);
    setStep(1);
    setForm(DEFAULT_FORM);
  };

  return (
    <>
      <GlobalStyles />
      <div className="page-wrapper">
        <div className="page-inner">
          {confirmed ? (
            <SuccessScreen form={form} onReset={reset} />
          ) : (
            <>
              {step === 1 && (
                <StepPickup form={form} setForm={setForm} onNext={next} />
              )}
              {step === 2 && (
                <StepDelivery
                  form={form}
                  setForm={setForm}
                  onBack={back}
                  onNext={next}
                />
              )}
              {step === 3 && (
                <StepVehicle
                  form={form}
                  setForm={setForm}
                  onBack={back}
                  onNext={next}
                />
              )}
              {step === 4 && (
                <StepReview
                  form={form}
                  onBack={back}
                  onConfirm={() => setConfirmed(true)}
                />
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}

// ─── Global Styles ────────────────────────────────────────────────────────────

function GlobalStyles() {
  return (
    <style>{`
      /* ── Google Font ── */
      @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&display=swap');

      /* ── Reset ── */
      *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

      /* ── CSS Custom Properties ── */
      :root {
        --brand:       #1e40af;
        --brand-hover: #1d3a9e;
        --brand-light: #eff6ff;
        --brand-ring:  rgba(30,64,175,0.12);

        --text-primary:   #0f172a;
        --text-secondary: #475569;
        --text-muted:     #94a3b8;

        --border:      #e2e8f0;
        --border-focus:#93c5fd;
        --surface:     #f8fafc;
        --bg:          #f0f4f8;
        --card-bg:     #ffffff;

        --radius-sm:  6px;
        --radius-md:  10px;
        --radius-lg:  16px;
        --radius-xl:  20px;

        --shadow-card: 0 4px 6px -1px rgba(0,0,0,0.07), 0 2px 4px -2px rgba(0,0,0,0.05);
        --shadow-drop: 0 10px 30px rgba(0,0,0,0.10);

        --font: 'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;

        /* fluid type scale (clamp: min, preferred vw, max) */
        --text-xs:   clamp(11px, 1.8vw, 12px);
        --text-sm:   clamp(12px, 2vw,   13px);
        --text-base: clamp(14px, 2.2vw, 15px);
        --text-md:   clamp(15px, 2.5vw, 16px);
        --text-lg:   clamp(17px, 3vw,   20px);
        --text-xl:   clamp(20px, 3.5vw, 24px);

        /* spacing */
        --sp-1: 4px;   --sp-2: 8px;   --sp-3: 12px;
        --sp-4: 16px;  --sp-5: 20px;  --sp-6: 24px;
        --sp-7: 28px;  --sp-8: 32px;
      }

      /* ── Base ── */
      html { font-size: 16px; -webkit-text-size-adjust: 100%; }

      body {
        font-family: var(--font);
        background: var(--bg);
        color: var(--text-primary);
        min-height: 100vh;
        line-height: 1.5;
      }

      /* ── Page layout ── */
      .page-wrapper {
        min-height: 100vh;
        display: flex;
        align-items: flex-start;
        justify-content: center;
        padding: clamp(16px, 5vw, 56px) clamp(12px, 4vw, 24px);
      }

      .page-inner {
        width: 100%;
        max-width: 480px;
      }

      /* ── Card ── */
      .card {
        background: var(--card-bg);
        border-radius: var(--radius-xl);
        border: 1px solid var(--border);
        padding: clamp(20px, 5vw, 36px);
        box-shadow: var(--shadow-card);
        animation: slideUp 0.26s cubic-bezier(0.22, 1, 0.36, 1) both;
      }

      @keyframes slideUp {
        from { opacity: 0; transform: translateY(14px); }
        to   { opacity: 1; transform: translateY(0);    }
      }

      .card-header { margin-bottom: var(--sp-5); }

      .card-title {
        font-size: var(--text-xl);
        font-weight: 700;
        color: var(--text-primary);
        letter-spacing: -0.4px;
        line-height: 1.2;
      }

      /* ── Stepper ── */
      .stepper {
        display: flex;
        align-items: center;
        width: 100%;
        gap: 0;
      }

      .step-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: var(--sp-1);
        flex-shrink: 0;
      }

      .step-circle {
        width: clamp(30px, 7vw, 38px);
        height: clamp(30px, 7vw, 38px);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: var(--text-sm);
        font-weight: 700;
        transition: background 0.25s, border-color 0.25s;
        flex-shrink: 0;
      }

      .step-circle.active {
        background: var(--brand);
        color: #fff;
        box-shadow: 0 0 0 4px var(--brand-ring);
      }

      .step-circle.done {
        background: var(--brand);
        color: #fff;
      }

      .step-circle.idle {
        background: var(--surface);
        color: var(--text-muted);
        border: 1.5px solid var(--border);
      }

      .step-label {
        font-size: var(--text-xs);
        color: var(--text-muted);
        font-weight: 500;
        white-space: nowrap;
      }

      .step-label.active-label {
        color: var(--brand);
        font-weight: 700;
      }

      .step-label.done-label {
        color: var(--brand);
        opacity: 0.7;
      }

      .step-connector {
        flex: 1;
        height: 2px;
        background: var(--border);
        margin: 0 var(--sp-1);
        margin-bottom: clamp(16px, 4vw, 22px);
        border-radius: 2px;
        transition: background 0.35s;
        min-width: 8px;
      }

      .step-connector.done-line { background: var(--brand); }

      /* ── Dividers & headings ── */
      .section-divider {
        height: 1px;
        background: var(--border);
        margin: clamp(14px, 3vw, 20px) 0;
      }

      .section-heading {
        font-size: var(--text-md);
        font-weight: 700;
        color: var(--text-primary);
        margin-bottom: var(--sp-4);
      }

      /* ── Field ── */
      .field-group { display: flex; flex-direction: column; }

      .field-label {
        display: block;
        font-size: var(--text-sm);
        color: var(--text-secondary);
        margin-bottom: 6px;
        font-weight: 500;
      }

      /* ── Address input ── */
      .address-field { position: relative; }

      .address-input {
        width: 100%;
        padding: clamp(11px, 2.5vw, 13px) 14px;
        border: 1.5px solid var(--border-focus);
        border-radius: var(--radius-md);
        font-size: var(--text-base);
        font-family: var(--font);
        color: var(--text-primary);
        outline: none;
        background: #fff;
        transition: border-color 0.2s, box-shadow 0.2s;
        /* min touch target */
        min-height: 48px;
      }

      .address-input:focus {
        border-color: var(--brand);
        box-shadow: 0 0 0 3px var(--brand-ring);
      }

      .address-input::placeholder { color: var(--text-muted); }

      /* ── Suggestions dropdown ── */
      .suggestions-list {
        position: absolute;
        top: calc(100% + 4px);
        left: 0;
        right: 0;
        background: #fff;
        border: 1px solid var(--border);
        border-radius: var(--radius-md);
        box-shadow: var(--shadow-drop);
        z-index: 100;
        list-style: none;
        overflow: hidden;
        animation: dropIn 0.15s ease both;
      }

      @keyframes dropIn {
        from { opacity: 0; transform: translateY(-6px); }
        to   { opacity: 1; transform: translateY(0);    }
      }

      .suggestion-item {
        display: flex;
        align-items: center;
        gap: var(--sp-3);
        padding: clamp(10px, 2.5vw, 13px) var(--sp-4);
        font-size: var(--text-base);
        cursor: pointer;
        transition: background 0.12s;
        color: var(--text-primary);
        /* touch-friendly */
        min-height: 48px;
      }

      .suggestion-item:hover,
      .suggestion-item:focus { background: var(--brand-light); }

      .pin-svg { width: 16px; height: 16px; flex-shrink: 0; }

      .suggestion-text { display: flex; flex-wrap: wrap; gap: 0; align-items: baseline; }

      .suggestion-secondary { color: var(--text-muted); font-size: var(--text-xs); }

      .powered-by {
        padding: 6px var(--sp-4);
        font-size: var(--text-xs);
        color: var(--text-muted);
        text-align: right;
        border-top: 1px solid var(--border);
        letter-spacing: 0.2px;
      }

      /* ── Select ── */
      .select-wrap {
        position: relative;
        display: flex;
        align-items: center;
      }

      .select-input {
        width: 100%;
        padding: clamp(11px, 2.5vw, 13px) 40px clamp(11px, 2.5vw, 13px) 14px;
        border: 1.5px solid var(--border);
        border-radius: var(--radius-md);
        font-size: var(--text-base);
        font-family: var(--font);
        color: var(--text-primary);
        background: #fff;
        outline: none;
        cursor: pointer;
        appearance: none;
        -webkit-appearance: none;
        transition: border-color 0.2s, box-shadow 0.2s;
        min-height: 48px;
      }

      .select-input:focus {
        border-color: var(--brand);
        box-shadow: 0 0 0 3px var(--brand-ring);
      }

      .select-chevron {
        position: absolute;
        right: 12px;
        width: 20px;
        height: 20px;
        pointer-events: none;
        flex-shrink: 0;
      }

      /* ── Capacity ── */
      .capacity-input-wrap {
        display: flex;
        align-items: stretch;
        border: 1.5px solid var(--border);
        border-radius: var(--radius-md);
        overflow: hidden;
        background: #fff;
        transition: border-color 0.2s, box-shadow 0.2s;
        min-height: 48px;
      }

      .capacity-input-wrap:focus-within {
        border-color: var(--brand);
        box-shadow: 0 0 0 3px var(--brand-ring);
      }

      .capacity-input {
        flex: 1;
        padding: clamp(11px, 2.5vw, 13px) 14px;
        font-size: var(--text-base);
        font-family: var(--font);
        border: none;
        outline: none;
        color: var(--text-primary);
        min-width: 0;
        background: transparent;
      }

      .capacity-unit {
        display: flex;
        align-items: center;
        padding: 0 var(--sp-4);
        font-size: var(--text-sm);
        color: var(--text-secondary);
        font-weight: 600;
        border-left: 1px solid var(--border);
        background: var(--surface);
        white-space: nowrap;
      }

      .capacity-hint {
        font-size: var(--text-xs);
        color: var(--text-muted);
        margin-top: 5px;
      }

      /* ── Vehicle Info Card ── */
      .vehicle-info-card {
        display: flex;
        align-items: flex-start;
        gap: var(--sp-4);
        background: var(--surface);
        border: 1px solid var(--border);
        border-radius: var(--radius-md);
        padding: clamp(12px, 3vw, 18px);
        margin-top: var(--sp-5);
        flex-wrap: wrap;
      }

      .vehicle-icon-wrap {
        flex-shrink: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        width: clamp(56px, 14vw, 80px);
        height: clamp(36px, 9vw, 50px);
      }

      .truck-svg { width: 100%; height: 100%; }

      .vehicle-details {
        display: flex;
        flex-direction: column;
        gap: 3px;
        font-size: var(--text-sm);
        color: var(--text-secondary);
        min-width: 0;
      }

      .vehicle-details strong {
        font-size: var(--text-base);
        font-weight: 700;
        color: var(--text-primary);
        margin-bottom: 2px;
      }

      /* ── Review ── */
      .review-row {
        display: flex;
        align-items: flex-start;
        gap: var(--sp-3);
        padding: clamp(12px, 3vw, 16px) 0;
      }

      .review-icon {
        flex-shrink: 0;
        margin-top: 1px;
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .review-content { flex: 1; min-width: 0; }

      .review-label {
        font-size: var(--text-sm);
        color: var(--brand);
        font-weight: 600;
        margin-bottom: 2px;
      }

      .review-value {
        font-size: var(--text-base);
        color: var(--text-primary);
        word-break: break-word;
        line-height: 1.4;
      }

      .review-divider { height: 1px; background: var(--border); }

      /* ── Buttons ── */
      .btn-row {
        display: flex;
        gap: var(--sp-3);
        margin-top: clamp(20px, 5vw, 32px);
      }

      .btn-row.single { justify-content: flex-end; }

      /* Shared button base */
      .btn-primary,
      .btn-outline {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        border-radius: var(--radius-md);
        font-size: var(--text-base);
        font-weight: 600;
        font-family: var(--font);
        cursor: pointer;
        transition: background 0.18s, border-color 0.18s, transform 0.1s, box-shadow 0.18s;
        /* WCAG touch target */
        min-height: 48px;
        padding: 0 clamp(16px, 4vw, 24px);
        white-space: nowrap;
        user-select: none;
        -webkit-tap-highlight-color: transparent;
        text-decoration: none;
      }

      .btn-primary {
        flex: 1;
        background: var(--brand);
        color: #fff;
        border: none;
        box-shadow: 0 1px 3px rgba(30,64,175,0.3);
      }

      .btn-primary:hover:not(:disabled) {
        background: var(--brand-hover);
        box-shadow: 0 4px 12px rgba(30,64,175,0.35);
      }

      .btn-primary:active:not(:disabled) { transform: scale(0.97); }

      .btn-primary:disabled {
        opacity: 0.4;
        cursor: not-allowed;
        box-shadow: none;
      }

      .btn-outline {
        flex: 0 0 auto;
        background: #fff;
        color: var(--text-primary);
        border: 1.5px solid var(--border);
        min-width: clamp(72px, 18vw, 96px);
      }

      .btn-outline:hover {
        background: var(--surface);
        border-color: #cbd5e1;
      }

      .btn-outline:active { transform: scale(0.97); }

      .confirm-btn { background: var(--brand); }

      /* ── Success Screen ── */
      .success-card {
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        gap: var(--sp-4);
      }

      .success-icon-wrap {
        width: clamp(56px, 14vw, 72px);
        height: clamp(56px, 14vw, 72px);
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .success-icon-wrap svg {
        width: 100%;
        height: 100%;
      }

      .success-sub {
        font-size: var(--text-base);
        color: var(--text-secondary);
        line-height: 1.6;
        max-width: 340px;
      }

      .success-summary {
        width: 100%;
        background: var(--surface);
        border: 1px solid var(--border);
        border-radius: var(--radius-md);
        overflow: hidden;
      }

      .success-row {
        display: flex;
        gap: var(--sp-3);
        padding: clamp(10px, 2.5vw, 13px) var(--sp-4);
        font-size: var(--text-base);
        border-bottom: 1px solid var(--border);
        text-align: left;
        flex-wrap: wrap;
      }

      .success-row:last-child { border-bottom: none; }

      .success-key {
        font-weight: 600;
        color: var(--brand);
        flex-shrink: 0;
        min-width: 60px;
      }

      .success-val {
        color: var(--text-primary);
        word-break: break-word;
        flex: 1;
      }

      /* ══════════════════════════════════════════════
         RESPONSIVE BREAKPOINTS
         320px  – small phones  (iPhone SE)
         375px  – standard phones
         414px  – large phones  (iPhone Plus/Max)
         600px  – small tablets / large phones landscape
         768px  – tablets portrait
         1024px – tablets landscape / small laptops
         1280px – desktops
      ══════════════════════════════════════════════ */

      /* ── Extra-small phones (< 360px) ── */
      @media (max-width: 359px) {
        .page-wrapper { padding: 10px 10px; }
        .card { padding: 16px 14px; border-radius: var(--radius-lg); }
        .card-title { font-size: 17px; }
        .step-circle { width: 28px; height: 28px; font-size: 11px; }
        .step-label { display: none; } /* hide labels on tiny screens, circles enough */
        .btn-row { flex-direction: column-reverse; gap: var(--sp-2); }
        .btn-outline { width: 100%; min-width: unset; }
        .btn-primary { width: 100%; }
        .vehicle-info-card { flex-direction: column; }
        .vehicle-icon-wrap { width: 100%; height: 40px; }
        .truck-svg { width: 64px; margin: 0 auto; }
      }

      /* ── Standard phones 360–599px ── */
      @media (min-width: 360px) and (max-width: 599px) {
        .page-wrapper { padding: 14px 14px 32px; }
        .card { border-radius: var(--radius-lg); }
        /* Stack buttons on narrow screens */
        .btn-row:not(.single) { flex-direction: column-reverse; gap: var(--sp-2); }
        .btn-outline { width: 100%; min-width: unset; }
        /* Vehicle card adapts */
        .vehicle-info-card { flex-wrap: nowrap; }
      }

      /* ── Tablets portrait 600–767px ── */
      @media (min-width: 600px) and (max-width: 767px) {
        .page-wrapper { padding: 32px 24px; }
        .page-inner { max-width: 520px; }
        .card { padding: 28px 28px; }
        .btn-row:not(.single) { flex-direction: row; }
        .btn-outline { min-width: 100px; }
      }

      /* ── Tablets landscape 768–1023px ── */
      @media (min-width: 768px) and (max-width: 1023px) {
        .page-wrapper { padding: 48px 32px; align-items: center; min-height: 100vh; }
        .page-inner { max-width: 540px; }
        .card { padding: 36px; border-radius: var(--radius-xl); }
        .btn-row { gap: var(--sp-4); }
        .btn-outline { min-width: 110px; }
        /* Slightly larger step circles */
        .step-circle { width: 40px; height: 40px; }
      }

      /* ── Desktop 1024px+ ── */
      @media (min-width: 1024px) {
        .page-wrapper { padding: 64px 40px; align-items: center; min-height: 100vh; }
        .page-inner { max-width: 480px; }
        .card { padding: 40px; }
        /* Hover effects only meaningful on devices with pointer */
        .suggestion-item { min-height: 42px; }
        .btn-primary, .btn-outline { min-height: 46px; }
      }

      /* ── Large desktop 1280px+ ── */
      @media (min-width: 1280px) {
        .page-inner { max-width: 500px; }
      }

      /* ── Landscape phones ── */
      @media (max-height: 500px) and (orientation: landscape) {
        .page-wrapper { padding: 12px 20px; align-items: flex-start; }
        .card { padding: 18px 24px; }
        .section-divider { margin: 10px 0; }
        .step-label { display: none; }
        .review-row { padding: 8px 0; }
      }

      /* ── Touch devices: bigger targets, no hover tricks ── */
      @media (hover: none) and (pointer: coarse) {
        .suggestion-item { min-height: 52px; }
        .btn-primary, .btn-outline { min-height: 52px; }
        .address-input, .select-input, .capacity-input { min-height: 52px; }
        .btn-primary:hover:not(:disabled) { box-shadow: 0 1px 3px rgba(30,64,175,0.3); }
      }

      /* ── Reduced motion ── */
      @media (prefers-reduced-motion: reduce) {
        .card { animation: none; }
        .suggestions-list { animation: none; }
        * { transition-duration: 0.01ms !important; }
      }

      /* ── Dark mode ── */
      @media (prefers-color-scheme: light) {
        :root {
          --bg:        #0f172a;
          --card-bg:   #1e293b;
          --surface:   #263347;
          --border:    #334155;
          --border-focus: #3b82f6;

          --text-primary:   #f1f5f9;
          --text-secondary: #94a3b8;
          --text-muted:     #64748b;

          --brand:       #3b82f6;
          --brand-hover: #2563eb;
          --brand-light: rgba(59,130,246,0.12);
          --brand-ring:  rgba(59,130,246,0.2);
        }

        .address-input,
        .select-input,
        .capacity-input { background: #1e293b; color: #f1f5f9; }

        .capacity-unit { background: #263347; border-left-color: #334155; }

        .suggestions-list { background: #1e293b; border-color: #334155; }

        .suggestion-item:hover { background: #263347; }

        .powered-by { border-top-color: #334155; }

        .btn-outline { background: #1e293b; color: #f1f5f9; border-color: #334155; }
        .btn-outline:hover { background: #263347; }

        .success-summary { background: #263347; border-color: #334155; }
        .success-row { border-bottom-color: #334155; }
      }

      /* ── Print ── */
      @media print {
        .page-wrapper { padding: 0; background: #fff; }
        .card { box-shadow: none; border: 1px solid #000; }
        .btn-row { display: none; }
        .stepper { margin-bottom: 12px; }
      }
    `}</style>
  );
}
