"use client";
import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useAnimate,
  useScroll,
  useSpring,
  useMotionTemplate,
  useTransform,
} from "motion/react";
import { useRef } from "react";
// https://www.scalefast.design/?ref=onepagelove
const ScrollAnimatedImages = () => {
  const [scope, animate] = useAnimate();
  const container = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start end", "end start"],
  });

  // const transformableValue = useSpring(scrollYProgress);
  const left1 = useTransform(scrollYProgress, [0.4, 0.5], [30, 0]);
  const left2 = useTransform(scrollYProgress, [0.4, 0.5], [28, 0]);
  const left3 = useTransform(scrollYProgress, [0.4, 0.5], [26, 0]);
  const topValue = useTransform(scrollYProgress, [0.4, 0.5], [-16, 0]);
  const rotateValue1 = useTransform(scrollYProgress, [0.4, 0.5], [-12, 0]);
  const rotateValue2 = useTransform(scrollYProgress, [0.4, 0.5], [12, 0]);
  const rotateValue3 = useTransform(scrollYProgress, [0.4, 0.5], [24, 0]);
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    animate(scope.current, { gap: `${latest * 100}px` }, { duration: 0.1 });
    // console.log("Page scroll: ", latest);
    animate(
      "#img1",
      {
        left: `${left1.get()}rem`,
        top: `${topValue.get()}rem`,
        rotate: rotateValue1.get(),
        scale: 1 + latest / 3.5,
      },
      { duration: 0.1 }
    );
    animate(
      "#img2",
      {
        left: `${left2.get()}rem`,
        top: `${topValue.get()}rem`,
        scale: 1 + latest / 3.5,
        rotate: rotateValue2.get(),
      },
      { duration: 0.1 }
    );
    animate(
      "#img3",
      {
        left: `${left3.get()}rem`,
        top: `${topValue.get()}rem`,
        rotate: rotateValue3.get(),
        scale: 1 + latest / 3.5,
      },
      { duration: 0.1 }
    );
  });

  return (
    <div
      ref={container}
      className="rounded-xl text-black p-20 bg-gray-400 w-full h-[100vh]"
    >
      <div className="text-5xl bg-orange-200   col-span-12 my-3">
        Your design needs:{" "}
      </div>
      <div
        style={{
          fontSize: "5rem",
          position: "relative",
          fontWeight: "bold",
          lineHeight: 1.2,
          background: "linear-gradient(90deg, #FF0080, #7928CA)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          display: "inline-block",
        }}
        className="text-5xl col-span-12 my-3"
      >
        covered
      </div>

      <div className="text-xl col-span-12 my-3">
        Your marketing design success starts here - everything you need to stand
        out, covered.
      </div>
      <div ref={scope} className="flex -gap-10">
        <div className="w-80 h-80 bg-linear-to-r from-cyan-500 to-blue-500 border-2 border-black rounded relative flex items-center justify-center">
          <motion.img
            id="img1"
            className="w-60 h-60 shadow rounded  relative left-[30rem] -top-80"
            src="https://framerusercontent.com/images/pCTYQqNTGptGPVwm4XQcjvVJVYA.jpg"
            alt="1"
          />
        </div>
        <div className="w-80 h-80 bg-linear-to-t from-sky-500 to-indigo-500 border-2 border-black rounded relative flex items-center justify-center">
          <motion.img
            id="img2"
            className="w-60 h-60  shadow rounded  relative left-[28rem] -top-80"
            src="https://framerusercontent.com/images/RFtM8rexwdQmv6rPx25in8tYVjc.jpg"
            alt="2"
          />
        </div>
        <div className="w-80 h-80 bg-linear-to-bl from-violet-500 to-fuchsia-500 border-2 border-black rounded relative flex items-center justify-center">
          <motion.img
            id="img3"
            className="w-60 h-60 shadow rounded  relative left-[26rem] -top-80"
            src="https://framerusercontent.com/images/X1bg7snSGmkNHOwDktMFzIghDI.jpg"
            alt="3"
          />
        </div>
      </div>
    </div>
  );
};

export default ScrollAnimatedImages;
