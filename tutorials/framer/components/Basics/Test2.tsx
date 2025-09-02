"use client";
import Marquee from "react-fast-marquee";
import { motion } from "motion/react";
const Test2 = () => {
  const handleHoverStart = (event) => {
    const target = document.getElementsByClassName(
      "marquee"
    ) as HTMLCollectionOf<Element>;
    target[1].classList.add("italic", "text-4xl", "rotate-30");
    target[0].classList.add("italic", "text-4xl");
  };
  const handleHoverEnd = (event) => {
    const target = document.getElementsByClassName(
      "marquee"
    ) as HTMLCollectionOf<Element>;
    target[1].classList.remove("italic", "text-4xl");
    target[0].classList.remove("italic", "text-4xl");
  };
  const textsMain = ["React", "Node.js", "Framer Motion", "Tailwind"];
  return (
    <motion.div onHoverStart={handleHoverStart} onHoverEnd={handleHoverEnd}>
      <Marquee
        direction="right"
        className="text-3xl marquee py-4 bg-sky-300"
        autoFill={true}
        speed={50}
      >
        {textsMain.map((text, index) => {
          return (
            <span key={index} className="mx-8 text-xl font-semibold">
              {text}
            </span>
          );
        })}
      </Marquee>{" "}
      <Marquee
        className="text-3xl marquee py-4 bg-amber-200"
        autoFill={true}
        speed={50}
      >
        {textsMain.map((text, index) => {
          return (
            <span key={index} className="mx-8 text-xl font-semibold">
              {text}
            </span>
          );
        })}
      </Marquee>
    </motion.div>
  );
};

export default Test2;
