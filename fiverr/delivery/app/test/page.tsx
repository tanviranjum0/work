"use client";

import { useState } from "react";

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<1 | 2>(1);

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSendOtp = async () => {
    if (!email) return alert("Enter email");

    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (res.ok) {
        setStep(2);
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleResetPassword = async () => {
    if (!otp || !password || !confirmPassword) {
      return alert("All fields required");
    }

    if (password !== confirmPassword) {
      return alert("Passwords do not match");
    }

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        body: JSON.stringify({
          email,
          otp,
          password,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Password reset successful");
        setStep(1);
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white w-[400px] p-6 rounded-xl shadow-md">
        <h2 className="text-2xl font-semibold mb-4 text-center">
          Forgot Password
        </h2>

        {step === 1 && (
          <>
            <p className="text-gray-500 text-sm mb-4 text-center">
              Enter your email to receive an OTP
            </p>

            <input
              type="email"
              placeholder="Enter email"
              className="w-full border p-2 rounded mb-4"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <button
              onClick={handleSendOtp}
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
            >
              Send OTP
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <p className="text-gray-500 text-sm mb-4 text-center">
              Enter OTP and new password
            </p>

            <input
              type="text"
              placeholder="Enter OTP"
              className="w-full border p-2 rounded mb-3"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />

            <input
              type="password"
              placeholder="New Password"
              className="w-full border p-2 rounded mb-3"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <input
              type="password"
              placeholder="Confirm Password"
              className="w-full border p-2 rounded mb-4"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

            <button
              onClick={handleResetPassword}
              className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
            >
              Verify & Reset Password
            </button>
          </>
        )}
      </div>
    </div>
  );
}
