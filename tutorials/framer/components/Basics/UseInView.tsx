"use client";
import { motion, useInView } from "motion/react";
import { useEffect, useRef } from "react";
const UseInView = () => {
  const ref = useRef<HTMLDivElement>(null);
  const container = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, {
    root: container,
    amount: 0.5,
  });
  useEffect(() => {
    console.log(isInView);
  }, [isInView]);
  return (
    <div>
      <div className="bg-amber-300 text-2xl grid place-content-center h-screen">
        Hello World
      </div>
      <div
        ref={container}
        style={{ overflow: "scroll" }}
        className="bg-amber-500 text-2xl grid place-content-center h-[150vh]"
      >
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          ref={ref}
          className="h-screen text-2xl grid place-content-center"
        >
          Nice and Attractive
        </motion.div>
      </div>
    </div>
  );
};

export default UseInView;
