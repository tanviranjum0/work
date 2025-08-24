"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function CurvedBorderButton({ label = "PLAY", onClick }) {
  const [clicked, setClicked] = useState(false);
  const [hovered, setHovered] = useState(false);

  const handleClick = (e) => {
    setClicked(true);
    setTimeout(() => setClicked(false), 600);
    onClick?.(e);
  };

  return (
    <div className="min-h-[100vh] w-full grid place-items-center bg-[#0A0B14]">
      <motion.button
        onClick={handleClick}
        onHoverStart={() => setHovered(true)}
        onHoverEnd={() => setHovered(false)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.92 }}
        className="relative flex items-center justify-center"
        style={{ width: 180, height: 180, borderRadius: "50%" }}
      >
        {/* Curved morphing border */}
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            border: "4px solid transparent",
            background:
              "conic-gradient(from 0deg, #00F5FF, #FF3AF2, #FFE873, #8A5CFF, #00F5FF)",
            maskImage: "radial-gradient(circle, transparent 70%, black 72%)",
            WebkitMaskImage:
              "radial-gradient(circle, transparent 70%, black 72%)",
          }}
          animate={{
            rotate: [0, 360],
            borderRadius: [
              "50% 50% 50% 50%",
              "55% 45% 60% 40%",
              "45% 55% 40% 60%",
              "50% 50% 50% 50%",
            ],
          }}
          transition={{
            rotate: {
              duration: hovered ? 3 : 6,
              ease: "linear",
              repeat: Infinity,
            },
            borderRadius: {
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            },
          }}
        />

        {/* Inner glowing core */}
        <div
          className="absolute rounded-full"
          style={{
            inset: 14,
            background:
              "radial-gradient(circle at 30% 30%, rgba(0,245,255,0.2), rgba(10,11,20,1))",
            boxShadow:
              "inset 0 0 20px rgba(0,245,255,0.4), 0 0 25px rgba(138,92,255,0.35)",
          }}
        />

        {/* Glow ripple when clicked */}
        <AnimatePresence>
          {clicked && (
            <motion.div
              className="absolute rounded-full"
              style={{
                inset: 0,
                background: "rgba(255,232,115,0.15)",
              }}
              initial={{ opacity: 0.6, scale: 0.8 }}
              animate={{ opacity: 0, scale: 1.6 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            />
          )}
        </AnimatePresence>

        {/* Button text */}
        <motion.span
          className="relative z-10 text-xl font-extrabold tracking-widest"
          style={{
            background: "linear-gradient(90deg, #FFE873, #FF3AF2, #00F5FF)",
            WebkitBackgroundClip: "text",
            color: "transparent",
            textShadow:
              "0 0 10px rgba(0,245,255,0.5), 0 0 20px rgba(255,58,242,0.3)",
          }}
        >
          {label}
        </motion.span>
      </motion.button>
    </div>
  );
}
