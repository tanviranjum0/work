"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function PowerUpButton() {
  const [charging, setCharging] = useState(false);
  const [charged, setCharged] = useState(false);

  // auto-release after 2s of charging
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (charging) {
      timer = setTimeout(() => {
        setCharged(true);
        setCharging(false);
        setTimeout(() => setCharged(false), 1500); // reset after blast
      }, 2000);
    }
    return () => clearTimeout(timer);
  }, [charging]);

  return (
    <div className="flex items-center justify-center h-screen bg-gray-900">
      <motion.button
        className="relative px-10 py-4 text-xl font-bold text-white rounded-2xl overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #4ade80, #22d3ee)",
          boxShadow: "0 0 20px rgba(34,211,238,0.6)",
        }}
        whileHover={{ scale: 1.05, rotate: [0, -1, 1, -1, 0] }}
        whileTap={{ scale: 0.95 }}
        onMouseDown={() => setCharging(true)}
        onMouseUp={() => setCharging(false)}
      >
        {/* Text States */}
        <motion.span
          key={charging ? "charging" : charged ? "blast" : "ready"}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="relative z-10"
        >
          {charged ? "💥 BLAST!" : charging ? "⚡ Charging..." : "▶ Ready"}
        </motion.span>

        {/* Charging Bar */}
        {charging && (
          <motion.div
            className="absolute bottom-0 left-0 h-1 bg-yellow-400"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 2 }}
          />
        )}

        {/* Shockwave when Charged */}
        <AnimatePresence>
          {charged && (
            <motion.div
              className="absolute inset-0 rounded-2xl"
              style={{
                background:
                  "radial-gradient(circle, #facc15 10%, transparent 60%)",
              }}
              initial={{ scale: 0.2, opacity: 0.8 }}
              animate={{ scale: 2, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
            />
          )}
        </AnimatePresence>

        {/* Floating Sparks */}
        {[...Array(5)].map((_, i) => (
          <motion.span
            key={i}
            className="absolute w-2 h-2 bg-white rounded-full"
            initial={{
              top: "50%",
              left: "50%",
              opacity: 0,
            }}
            animate={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              opacity: [0, 1, 0],
              scale: [0.5, 1.5, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.4,
            }}
          />
        ))}
      </motion.button>
    </div>
  );
}
