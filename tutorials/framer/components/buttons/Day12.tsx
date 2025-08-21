"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function PortalButton() {
  const [warping, setWarping] = useState(false);
  const [arrived, setArrived] = useState(false);

  const handleClick = () => {
    setWarping(true);
    setTimeout(() => {
      setWarping(false);
      setArrived(true);
      setTimeout(() => setArrived(false), 1500);
    }, 2000);
  };

  return (
    <div className="flex items-center justify-center h-screen bg-black">
      <motion.button
        onClick={handleClick}
        whileHover={{ scale: 1.1, boxShadow: "0 0 30px #22d3ee" }}
        className="relative cursor-pointer px-10 py-5 text-xl font-bold text-white rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 overflow-hidden"
        style={{
          border: "2px solid rgba(255,255,255,0.3)",
          perspective: "1000px",
        }}
      >
        {/* Text States */}
        <AnimatePresence mode="wait">
          <motion.span
            key={warping ? "warping" : arrived ? "arrived" : "enter"}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="relative z-10"
          >
            {warping ? "🌀 Warping..." : arrived ? "✅ Arrived" : "🚪 Enter"}
          </motion.span>
        </AnimatePresence>

        {/* Warp Swirl Effect */}
        {warping && (
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{
              background:
                "radial-gradient(circle, rgba(56,189,248,0.8), transparent 70%)",
            }}
            initial={{ scale: 0.3, rotate: 0, opacity: 0.6 }}
            animate={{ scale: 2, rotate: 360, opacity: 0 }}
            transition={{ duration: 2, ease: "easeInOut" }}
          />
        )}

        {/* Shape Morphing */}
        <motion.div
          className="absolute inset-0 border-2 border-cyan-400"
          animate={{
            borderRadius: warping
              ? ["50%", "20%", "5%", "50%"] // circle → square → triangle-like → circle
              : arrived
              ? ["50%", "15%", "50%"]
              : "50%",
            rotate: warping ? [0, 90, 180, 360] : 0,
          }}
          transition={{
            duration: 2,
            ease: "easeInOut",
          }}
        />

        {/* Glitch Particles */}
        {[...Array(6)].map((_, i) => (
          <motion.span
            key={i}
            className="absolute w-1 h-1 bg-cyan-300"
            initial={{ top: "50%", left: "50%", opacity: 0 }}
            animate={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              opacity: [0, 1, 0],
              scale: [0.5, 1.5, 0],
              rotate: [0, 360],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.3,
            }}
          />
        ))}
      </motion.button>
    </div>
  );
}
