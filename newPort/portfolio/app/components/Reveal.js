"use client";
import { motion, useInView, useAnimation, delay } from "framer-motion";
import { useEffect, useRef } from "react";

const Reveal = ({ children }) => {
  const ref = useRef();
  const isInView = useInView(ref, { once: true });
  const mainControls = useAnimation();
  const slideControls = useAnimation();

  useEffect(() => {
    if (isInView) {
      mainControls.start("visible");
      slideControls.start("visible");
    }
  }, [isInView]);

  return (
    <div ref={ref} className="w-full relative overflow-hidden">
      <motion.div
        variants={{
          hidden: { y: 50, opacity: 0 },
          visible: { y: 0, opacity: 1 },
        }}
        transition={{
          type: "tween",
          duration: 0.5,
          delay: 0.4,
          ease: "easeInOut",
        }}
        initial="hidden"
        animate={mainControls}
      >
        {children}
      </motion.div>
      <motion.div
        variants={{
          hidden: { left: 0 },
          visible: { left: "100%" },
        }}
        initial="hidden"
        animate={slideControls}
        transition={{ duration: 0.5, ease: "easeIn" }}
        style={{
          borderRadius: "10px",
          position: "absolute",
          top: 4,
          bottom: 4,
          left: 0,
          right: 0,
          background: "rgba(50, 168, 82)",
          zIndex: 20,
        }}
      />
    </div>
  );
};

export default Reveal;
