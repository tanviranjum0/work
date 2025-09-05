"use client";
// import React from "react";
import "./oldTVGlitch.css";

const OldTVGlitch = () => {
  return (
    <div className="relative overflow-hidden bg-black text-white">
      <div className="grid place-content-center h-screen w-screen relative z-50">
        <h2 className="text-8xl">📺</h2>
        <div className="fuzzy-overlay"></div>
      </div>
    </div>
  );
};

export default OldTVGlitch;
