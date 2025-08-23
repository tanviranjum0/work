"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

export default function ElegantTravelButton() {
  const [clicked, setClicked] = useState(false);

  const handleClick = () => {
    setClicked(true);
    setTimeout(() => setClicked(false), 1500);
  };

  return (
    <div className="flex items-center justify-center h-screen bg-[#0D1B2A]">
      <motion.button
        onClick={handleClick}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        className="relative w-44 h-44 rounded-full flex items-center justify-center overflow-hidden"
        style={{
          background: "radial-gradient(circle at 30% 30%, #00C9A7, #004E92)",
          boxShadow: "0 0 25px rgba(0,201,167,0.5)",
        }}
      >
        {/* 🌍 Rotating Subtle Globe Gradient */}
        <motion.div
          className="absolute inset-0 rounded-full opacity-60"
          style={{
            background:
              "conic-gradient(from 0deg, #00C9A7, #FFD93D, #00C9A7, #004E92)",
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        />

        {/* ✨ Horizon Glow */}
        <motion.div
          className="absolute w-full h-1 top-1/2 left-0"
          style={{
            background:
              "linear-gradient(90deg, transparent, #FFD93D, transparent)",
          }}
          animate={{ x: ["-50%", "50%", "-50%"] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Elegant EXPLORE Text */}
        <motion.span
          className="relative z-10 text-xl font-bold tracking-widest text-[#F1FAEE]"
          animate={{ opacity: clicked ? 1 : 0.9 }}
        >
          EXPLORE
        </motion.span>

        {/* Ripple Burst on Click */}
        <AnimatePresence>
          {clicked && (
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{
                border: "2px solid rgba(255,217,61,0.5)",
              }}
              initial={{ scale: 0.3, opacity: 0.8 }}
              animate={{ scale: 2, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2 }}
            />
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}
