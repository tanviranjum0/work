"use client";
import { motion } from "motion/react";
import { useRef } from "react";
const Test1 = () => {
  const ref = useRef<HTMLDivElement>(null!);
  return (
    <div className="flex justify-center items-center h-screen w-screen">
      {/* <div ref={ref} className="h-96 w-96 rounded-xl bg-amber-200">
        <motion.div
          // dragMomentum={false}
          drag
          dragConstraints={ref}
          dragElastic={0}
          dragDirectionLock
          // dragConstraints={{ top: -200, bottom: 300 }}
          className="h-20 w-20 rounded-xl bg-amber-400 "
        ></motion.div>
      </div> */}
      {/* <motion.div
        className="h-20 w-20 rounded-xl bg-amber-400 "
        whileTap={{ scale: 2 }}
      >
        <button
          className="text-black bg-amber-200 "
          // onPointerDownCapture={(e) => e.stopPropagation()}
        >
          Hello
        </button>
      </motion.div> */}
      <motion.div
        className="h-20 w-20 rounded-xl bg-amber-400 "
        onPan={(e, pointInfo) => {
          console.log("Hello", e);
        }}
      />
    </div>
  );
};

export default Test1;
