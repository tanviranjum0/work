"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Unlock } from "lucide-react";

export default function SquareVaultButton() {
  const [unlocked, setUnlocked] = useState(false);

  const handleClick = () => {
    setUnlocked(true);
    setTimeout(() => setUnlocked(false), 2000);
  };

  return (
    <div className="flex items-center justify-center h-screen bg-[#0A0F1C]">
      <motion.button
        onClick={handleClick}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        className="relative w-24 h-24 cursor-pointer flex items-center justify-center"
      >
        {/* 🔳 Square Base */}
        <motion.div
          className="absolute inset-0 rounded-lg"
          style={{
            background: "linear-gradient(135deg, #1B263B, #0A0F1C)",
            border: "2px solid #FFD700",
            boxShadow: "0 0 20px rgba(255, 215, 0, 0.3)",
          }}
        />

        {/* 🌀 Rotating Grid Inside */}
        <motion.div
          className="absolute inset-1 opacity-20 rounded-md"
          style={{
            background:
              "repeating-linear-gradient(45deg, #00FF9C33 0px, #00FF9C33 2px, transparent 3px, transparent 6px)",
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />

        {/* 🔒 Lock / Unlock */}
        <motion.div
          key={unlocked ? "unlock" : "lock"}
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.5, opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 text-[#FFD700]"
        >
          {unlocked ? <Unlock size={28} /> : <Lock size={28} />}
        </motion.div>

        {/* 🛡 Pulse Animation */}
        <AnimatePresence>
          {unlocked && (
            <motion.div
              className="absolute inset-0 rounded-lg border-2 border-[#00FF9C]"
              initial={{ scale: 0.6, opacity: 0.8 }}
              animate={{ scale: 1.6, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2 }}
            />
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}
