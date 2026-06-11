"use client";
import { useState } from "react";

export default function ClientForm() {
  const [form, setForm] = useState({
    name: "",
    phone: "+31 ",
    shift: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(form);
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen"
      style={{
        backgroundColor: "#f1f5f9",
        padding: "16px",
      }}
    >
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md"
        style={{
          backgroundColor: "#ffffff",
          padding: "24px",
          borderRadius: "16px",
          boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
        }}
      >
        <h2
          style={{
            fontSize: "20px",
            fontWeight: 600,
            color: "#1e293b",
            marginBottom: "20px",
          }}
        >
          Client Details
        </h2>

        {/* Client Name */}
        <div style={{ marginBottom: "16px" }}>
          <label
            style={{
              display: "block",
              fontSize: "14px",
              color: "#475569",
              marginBottom: "6px",
              fontWeight: 500,
            }}
          >
            Client Name
          </label>
          <input
            type="text"
            name="name"
            placeholder="Enter client name"
            value={form.name}
            onChange={handleChange}
            style={{
              width: "100%",
              padding: "10px 14px",
              border: "1px solid #cbd5e1",
              borderRadius: "8px",
              outline: "none",
              fontSize: "14px",
            }}
          />
        </div>

        {/* Phone Number */}
        <div style={{ marginBottom: "16px" }}>
          <label
            style={{
              display: "block",
              fontSize: "14px",
              color: "#475569",
              marginBottom: "6px",
              fontWeight: 500,
            }}
          >
            Phone Number (Netherlands)
          </label>
          <input
            type="tel"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            style={{
              width: "100%",
              padding: "10px 14px",
              border: "1px solid #cbd5e1",
              borderRadius: "8px",
              outline: "none",
              fontSize: "14px",
            }}
          />
        </div>

        {/* Availability */}
        <div style={{ marginBottom: "20px" }}>
          <label
            style={{
              display: "block",
              fontSize: "14px",
              color: "#475569",
              marginBottom: "6px",
              fontWeight: 500,
            }}
          >
            Availability Shift
          </label>

          <select
            name="shift"
            value={form.shift}
            onChange={handleChange}
            style={{
              width: "100%",
              padding: "10px 14px",
              border: "1px solid #cbd5e1",
              borderRadius: "8px",
              backgroundColor: "#ffffff",
              outline: "none",
              fontSize: "14px",
              cursor: "pointer",
            }}
          >
            <option value="">Select shift</option>
            <option value="morning">Morning (6AM - 12PM)</option>
            <option value="afternoon">Afternoon (12PM - 6PM)</option>
            <option value="evening">Evening (6PM - 12AM)</option>
            <option value="night">Night (12AM - 6AM)</option>
          </select>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          style={{
            width: "100%",
            backgroundColor: "#2563eb",
            color: "#ffffff",
            padding: "11px",
            borderRadius: "8px",
            border: "none",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Submit
        </button>
      </form>
    </div>
  );
}
