"use client";
import { motion } from "motion/react";
const Test = () => {
  return (
    <motion.div
      initial={{
        opacity: 0,
        scale: 0,
      }}
      animate={{
        opacity: 1,
        scale: 1,
      }}
      transition={{
        duration: 1,
        ease: "linear",
      }}
    >
      Nice and attractive
    </motion.div>
  );
};

export default Test;
