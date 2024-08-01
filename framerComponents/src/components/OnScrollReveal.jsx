"use client";
import React, { useEffect, useRef } from "react";
import { motion, useAnimation, useInView } from "framer-motion";
const OnScrollReveal = ({ children }) => {
  const ref = useRef(null);
  const IsInView = useInView(ref, { once: true });
  const mainControls = useAnimation();
  const slideControls = useAnimation();

  useEffect(() => {
    if (IsInView) {
      mainControls.start("visible");
      slideControls.start("visible");
    }
    // mainControls.stop();
  }, [IsInView]);
  return (
    <div className="relative overflow-hidden w-full" ref={ref}>
      <motion.div
        variants={{
          hidden: { opacity: 0, y: -25 },
          visible: { opacity: 1, y: 0 },
        }}
        initial="hidden"
        animate={mainControls}
        className=" py-36 flex flex-col items-center justify-center"
        transition={{
          duration: 0.5,
          type: "speed",
          delay: 0.5,
          ease: "linear",
        }}
      >
        {children}
      </motion.div>
      <motion.div
        className="absolute top-4 bottom-4 left-0 right-0 bg-slate-800"
        variants={{
          hidden: { left: 0 },
          visible: { left: "100%" },
        }}
        transition={{
          duration: 1,
          type: "tween",
          ease: "easeInOut",
        }}
        initial="hidden"
        animate={slideControls}
      ></motion.div>
    </div>
  );
};

export default OnScrollReveal;
