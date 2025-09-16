"use client";
import { motion, useAnimate } from "motion/react";
import { useEffect, useRef } from "react";
const MadTexts = () => {
  const [scope, animate] = useAnimate();
  const handleHover = (e) => {
    console.log(e);
    animate(
      `#${e}`,
      {
        rotate: [10, 0, -10, 0, 10],
      },
      {
        duration: 0.5,
        repeat: Infinity,
        repeatType: "mirror",
        ease: "easeInOut",
        delay: 0.5,
      }
    );
  };
  return (
    <div>
      <ul
        ref={scope}
        className="flex justify-center items-center w-full flex-col"
      >
        <motion.li
          id="text1"
          whileHover={() => handleHover("text1")}
          //   initial={{
          //     rotate: 0,
          //   }}
          //   animate={{
          //     rotate: [10, 0, -10, 0, 10],
          //   }}
          //   transition={{
          //     duration: 0.5,
          //     repeat: Infinity,
          //     repeatType: "mirror",
          //     ease: "easeInOut",
          //     delay: 0.2,
          //   }}
          className="p-4 text-xl my-5 rounded bg-yellow-100 text-black inline-block"
        >
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Laboriosam,
          nobis.
        </motion.li>
        <motion.li
          id="text2"
          whileHover={() => handleHover("text2")}
          //   initial={{
          //     rotate: 0,
          //   }}
          //   animate={{
          //     rotate: [10, 0, -10, 0, 10],
          //   }}
          //   transition={{
          //     duration: 0.5,
          //     repeat: Infinity,
          //     repeatType: "mirror",
          //     ease: "easeInOut",
          //     delay: 0.2,
          //   }}
          className="p-4 text-xl my-5 rounded bg-yellow-100 text-black inline-block"
        >
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Laboriosam,
          nobis.
        </motion.li>
      </ul>
    </div>
  );
};

export default MadTexts;
