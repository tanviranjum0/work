"use client";

import { motion } from "motion/react";
import React from "react";
const texts = [
  "Hello",
  "Welcome",
  "To",
  "Framer",
  "Tutorials",
  "By",
  "CodeWithKalyan",
  "Enjoy",
  "Learning",
  "And",
  "Building",
  "Amazing",
  "Projects",
];
const Test2 = () => {
  return (
    <div>
      <div className="w-[100vw] overflow-hidden flex justify-center items-center gap-4 h-20 bg-amber-200 text-xl">
        {texts.map((text, index) => {
          return (
            <motion.div
              initial={{
                left: 0,
              }}
              animate={{
                left: "100vw",
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                repeatType: "loop",
                delay: index * 0.5,
              }}
              key={index}
            >
              {text}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default Test2;
