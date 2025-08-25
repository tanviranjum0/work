"use client";
import { motion } from "framer-motion";
import { useState } from "react";

export default function LiquidPortalButton({ label = "EXPLORE", onClick }) {
  const [clicked, setClicked] = useState(false);

  const handleClick = () => {
    setClicked(true);
    setTimeout(() => setClicked(false), 600);
    onClick?.();
  };

  return (
    <div className="min-h-[100vh] w-full grid place-items-center bg-[#050510]">
      <motion.button
        onClick={handleClick}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="relative overflow-hidden flex items-center justify-center rounded-full"
        style={{
          width: 220,
          height: 80,
          background:
            "radial-gradient(circle at 30% 30%, #00f5ff, #1a1a40, #5a00a3)",
          boxShadow:
            "0 0 20px rgba(0,245,255,0.5), 0 0 60px rgba(90,0,163,0.5)",
        }}
      >
        {/* Animated liquid waves */}
        <motion.div
          className="absolute inset-0"
          style={{
            background:
              "conic-gradient(from 180deg, #00f5ff, #5a00a3, #1a1a40, #00f5ff)",
            opacity: 0.4,
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        />

        {/* Portal effect when clicked */}
        {clicked && (
          <motion.div
            className="absolute rounded-full bg-cyan-400/30"
            style={{ width: 80, height: 80 }}
            initial={{ scale: 0.8, opacity: 0.8 }}
            animate={{ scale: 2.4, opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
        )}

        {/* Label */}
        <span
          className="relative z-10 text-xl font-bold tracking-wider"
          style={{
            background: "linear-gradient(90deg, #00f5ff, #ae00ff)",
            WebkitBackgroundClip: "text",
            color: "transparent",
          }}
        >
          {label}
        </span>
      </motion.button>
    </div>
  );
}
