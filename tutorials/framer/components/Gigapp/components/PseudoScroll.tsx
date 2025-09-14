"use client";
import React from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
} from "motion/react";

export default function StickyScrollGallery() {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"], // maps full section scroll
  });
  // console.log(scrollYProgress);
  // Transform scroll progress (0 → 1) into vertical translation
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "-80%"]);
  useMotionValueEvent(y, "change", (latest) => {
    console.log("Latest Value", latest);
  });
  return (
    <div
      ref={containerRef}
      className="relative flex w-full min-h-[200vh] bg-gradient-to-br from-gray-100 to-gray-200"
    >
      {/* Left sticky side */}
      <div className="w-2/4 relative overflow-hidden">
        <motion.div style={{ y }} className="flex flex-col gap-8 py-20 px-8">
          {[
            "https://framerusercontent.com/images/NYXSuNHIqB6GMw7IXSDSqYLr8FM.gif",
            "https://framerusercontent.com/images/YTx0Nilb6NZn0z5EnXtsE4s78.gif",
          ].map((src, i) => (
            <motion.img
              key={i}
              src={src}
              alt={`Scenery ${i + 1}`}
              className="rounded-2xl shadow-lg"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
            />
          ))}
        </motion.div>
      </div>
      <div className="w-2/4 sticky top-0 h-screen flex items-center justify-center p-8">
        <motion.div
          className="text-4xl font-bold text-gray-900"
          style={{ y: useTransform(scrollYProgress, [0, 1], ["0%", "-10%"]) }}
        >
          Explore Stunning Visuals 🌍
        </motion.div>
      </div>

      {/* Right scrollable side */}
    </div>
  );
}
