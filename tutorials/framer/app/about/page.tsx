"use client";
import Link from "next/link";
import React from "react";
import { motion, AnimatePresence } from "motion/react";

const page = () => {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial="initialState"
        animate="animateState"
        exit="exitState"
        transition={{
          duration: 0.75,
        }}
        variants={{
          initialState: {
            opacity: 0,
            clipPath: "polygon(0 0, 100% 0, 100% 100%, 0% 100%)",
          },
          animateState: {
            opacity: 1,
            clipPath: "polygon(0 0, 100% 0, 100% 100%, 0% 100%)",
          },
          exitState: {
            clipPath: "polygon(50% 0, 50% 0, 50% 100%, 50% 100%)",
          },
        }}
        className="h-[100vh] text-2xl bg-emerald-400 w-[100vw] flex justify-center items-center"
      >
        <ul className="flex gap-3">
          <Link href={"/another"} className="p-5 bg-fuchsia-400">
            Home
          </Link>
        </ul>
      </motion.div>
    </AnimatePresence>
  );
};

export default page;
