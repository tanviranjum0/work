"use client";
import Marquee from "react-fast-marquee";
import { motion } from "motion/react";
const Test2 = () => {
  // const handleHoverStart = (event) => {
  //   const target = document.getElementsByClassName(
  //     "marquee"
  //   ) as HTMLCollectionOf<Element>;
  //   target[1].classList.add("italic");
  //   target[0].classList.add("italic");
  // };
  // const handleHoverEnd = (event) => {
  //   const target = document.getElementsByClassName(
  //     "marquee"
  //   ) as HTMLCollectionOf<Element>;
  //   target[1].classList.remove("italic");
  //   target[0].classList.remove("italic");
  // };
  const textsMain = ["React", "Node.js", "Framer Motion", "Tailwind"];
  return (
    <motion.div>
      {/* <motion.div onHoverStart={handleHoverStart} onHoverEnd={handleHoverEnd}> */}
      <Marquee
        direction="right"
        className="marquee py-4 bg-sky-200"
        autoFill={true}
        speed={20}
      >
        {textsMain.map((text, index) => {
          return (
            <span
              key={index}
              className="mx-8 text-sky-400 text-9xl font-semibold"
            >
              {text}
            </span>
          );
        })}
      </Marquee>
      <Marquee className="marquee py-4 bg-amber-200" autoFill={true} speed={20}>
        {textsMain.map((text, index) => {
          return (
            <span
              key={index}
              className="mx-8 text-amber-400 text-9xl font-semibold"
            >
              {text}
            </span>
          );
        })}
      </Marquee>
      <Marquee
        className="marquee py-4 bg-gray-200"
        direction="right"
        autoFill={true}
        speed={20}
      >
        {textsMain.map((text, index) => {
          return (
            <span
              key={index}
              className="mx-8 text-gray-400 text-9xl font-semibold"
            >
              {text}
            </span>
          );
        })}
      </Marquee>
      <Marquee
        className="marquee py-4 bg-emerald-200"
        autoFill={true}
        speed={20}
      >
        {textsMain.map((text, index) => {
          return (
            <span
              key={index}
              className="mx-8 text-emerald-400 text-9xl font-semibold"
            >
              {text}
            </span>
          );
        })}
      </Marquee>
    </motion.div>
  );
};

export default Test2;
