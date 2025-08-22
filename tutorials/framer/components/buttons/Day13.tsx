"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function LuxuryGemButton() {
  const [clicked, setClicked] = useState(false);

  const handleClick = () => {
    setClicked(true);
    setTimeout(() => setClicked(false), 1500);
  };

  return (
    <div className="flex items-center justify-center h-screen bg-[#0a0a0a]">
      <motion.button
        onClick={handleClick}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        className="relative px-16 py-6 text-2xl font-extrabold tracking-widest uppercase rounded-2xl overflow-hidden"
        style={{
          border: "2px solid rgba(255,215,0,0.4)",
          boxShadow:
            "inset -4px -4px 10px rgba(255,255,255,0.1), inset 4px 4px 10px rgba(0,0,0,0.6), 0 0 25px rgba(255,215,0,0.3)",
        }}
      >
        {/* Background shimmer layer */}
        <motion.div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(145deg, rgba(255,215,0,0.25), rgba(142,68,173,0.2), rgba(80,200,120,0.2))",
          }}
          animate={{
            backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "linear",
          }}
        />

        {/* Button Label (Gradient Engraved Look) */}
        <motion.span
          className="relative z-10 bg-gradient-to-r from-yellow-400 via-emerald-400 to-purple-500 bg-clip-text text-transparent"
          animate={{
            backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "linear",
          }}
          style={{
            backgroundSize: "300% 300%",
          }}
        >
          Get Surprise
        </motion.span>

        {/* Glow Rings */}
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-yellow-400"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 0.1, 0.5],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Golden Burst on Click */}
        <AnimatePresence>
          {clicked && (
            <motion.div
              className="absolute inset-0 rounded-2xl"
              style={{
                background:
                  "radial-gradient(circle, rgba(255,215,0,0.6), transparent 70%)",
              }}
              initial={{ scale: 0.2, opacity: 0.8 }}
              animate={{ scale: 2, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
            />
          )}
        </AnimatePresence>

        {/* Glitter Particles */}
        {[...Array(10)].map((_, i) => (
          <motion.span
            key={i}
            className="absolute w-1 h-1 rounded-full bg-yellow-300"
            initial={{ top: "50%", left: "50%", opacity: 0 }}
            animate={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              opacity: [0, 1, 0],
              scale: [0.5, 1.2, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: i * 0.4,
            }}
          />
        ))}
      </motion.button>
    </div>
  );
}
