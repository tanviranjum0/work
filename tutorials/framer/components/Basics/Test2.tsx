"use client";

import {
  MotionValue,
  motion,
  useScroll,
  useTransform,
  useSpring,
} from "motion/react";

const Test2 = () => {
  const { scrollYProgress } = useScroll();
  const scaleXcount = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });
  const backgroundColor = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    ["#f00", "#0f0", "#00f"]
  );
  return (
    <div>
      <motion.div
        id="scroll-indicator"
        style={{
          scaleX: scaleXcount,
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          height: 10,
          originX: 0,
          backgroundColor: "#ff0088",
        }}
      />
      <motion.div
        initial={{
          fontSize: 0,
          opacity: 0,
        }}
        whileInView={{
          fontSize: "50px",
          opacity: 1,
        }}
        transition={{
          duration: 2,
          type: "spring",
        }}
        key={"1"}
        className="h-screen bg-amber-200 grid place-content-center"
      >
        Hello
      </motion.div>
      <motion.div
        initial={{
          fontSize: 0,
          opacity: 0,
        }}
        whileInView={{
          fontSize: "50px",
          opacity: 1,
        }}
        transition={{
          duration: 2,
          type: "spring",
        }}
        key={"2"}
        className="h-screen bg-violet-200 grid place-content-center"
      >
        Hello
      </motion.div>
      <motion.div
        style={{ backgroundColor }}
        initial={{
          fontSize: 0,
          opacity: 0,
        }}
        whileInView={{
          fontSize: "50px",
          opacity: 1,
        }}
        transition={{
          duration: 2,
          type: "spring",
        }}
        key={"3"}
        className="h-screen bg-red-200 grid place-content-center"
      >
        Hello
      </motion.div>
      <motion.div
        style={{ backgroundColor }}
        initial={{
          fontSize: 0,
          opacity: 0,
        }}
        whileInView={{
          fontSize: "50px",
          opacity: 1,
        }}
        transition={{
          duration: 2,
          type: "spring",
        }}
        key={"4"}
        className="h-screen bg-red-200 grid place-content-center"
      >
        Hello
      </motion.div>
      <motion.div
        style={{ backgroundColor }}
        initial={{
          fontSize: 0,
          opacity: 0,
        }}
        whileInView={{
          fontSize: "50px",
          opacity: 1,
        }}
        transition={{
          duration: 2,
          type: "spring",
        }}
        key={"5"}
        className="h-screen bg-red-200 grid place-content-center"
      >
        Hello
      </motion.div>
    </div>
  );
};

export default Test2;
