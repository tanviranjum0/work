"use client";
import { motion } from "framer-motion";

export default function MarqueeText() {
  const texts = [
    "Frontend",
    "Backend",
    "Fullstack",
    "JavaScript",
    "React",
    "Node.js",
  ];

  return (
    <div className="relative overflow-hidden w-full h-20 bg-gray-700 flex items-center">
      <motion.div
        className="flex gap-20  text-3xl font-bold text-white whitespace-nowrap"
        animate={{ x: ["100%", "-100%"] }}
        transition={{
          repeat: Infinity,
          duration: 5,
          repeatType: "loop",
          ease: "linear",
        }}
      >
        {/* Duplicate text sequence for seamless looping */}
        {[...texts, ...texts].map((text, i) => (
          <span key={i}>{text}</span>
        ))}
      </motion.div>
    </div>
  );
}
