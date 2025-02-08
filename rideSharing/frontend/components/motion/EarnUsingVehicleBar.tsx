"use client";
import React from "react";
import { AnimatePresence, motion } from "motion/react";
const EarnUsingVehicleBar = () => {
  return (
    <AnimatePresence key={"bar slider animate presence"}>
      <motion.div
        initial={{
          x: "-50%",
          scale: 0,
        }}
        animate={{
          x: 0,
          scale: 1,
        }}
        exit={{
          x: "-50%",
          scale: 0,
        }}
        transition={{
          duration: 1,
          ease: "easeInOut",
        }}
        className="w-full h-2 bg-yellow-500"
      ></motion.div>
    </AnimatePresence>
  );
};

export default EarnUsingVehicleBar;
