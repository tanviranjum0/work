"use client";
import React from "react";

export default function Loading() {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-slate-50 z-50">
      {/* Container for Content */}
      <div className="flex flex-col items-center max-w-sm w-full px-6 text-center animate-fade-in">
        {/* Brand Logo & Icon Wrapper */}
        <div className="relative mb-6">
          {/* Animated Glow/Pulse Effect behind the logo */}
          <div className="absolute inset-0 bg-blue-500 rounded-xl blur-xl opacity-20 animate-pulse"></div>

          {/* Styled ShipSwift Geometric Box Icon */}
          <div className="relative bg-gradient-to-br from-blue-600 to-indigo-700 text-white p-4 rounded-2xl shadow-lg shadow-blue-500/20">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-10 h-10 animate-bounce"
              style={{ animationDuration: "1s" }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9"
              />
            </svg>
          </div>
        </div>

        {/* Brand Name */}
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-1">
          Feitsma<span className="text-blue-600">Verhuizingen</span>
        </h1>
        <p className="text-xs font-medium text-slate-400 uppercase tracking-widest mt-1">
          Delivering Reliability
        </p>
      </div>

      {/* Decorative Minimalist Background Elements matching Dashboard aesthetics */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-blue-200 rounded-full filter blur-3xl opacity-20 mix-blend-multiply animate-pulse"></div>
      <div className="absolute bottom-10 right-10 w-40 h-40 bg-indigo-200 rounded-full filter blur-3xl opacity-20 mix-blend-multiply animate-pulse delay-75"></div>
    </div>
  );
}
