"use client";
import "./day3.css";
import { motion } from "motion/react";
const day3 = () => {
  const handleHover = () => {
    const day3texts: HTMLCollectionOf<Element> =
      document.getElementsByClassName("day3texts");
    Array.from(day3texts).forEach((el) => {
      (el as HTMLElement).innerText = "Reveal";
    });
  };
  const handleHoverEnds = () => {
    const day3texts: HTMLCollectionOf<Element> =
      document.getElementsByClassName("day3texts");
    Array.from(day3texts).forEach((el) => {
      (el as HTMLElement).innerText = "Locked";
    });
  };
  return (
    <div className="bg-black flex justify-center items-center h-screen w-screen">
      <motion.button
        onHoverStart={handleHover}
        onHoverEnd={handleHoverEnds}
        className="button"
        data-text="Awesome"
      >
        <span className="day3texts actual-text">&nbsp;Locked&nbsp;</span>
        <span aria-hidden="true" className="hover-text day3texts">
          &nbsp;Locked&nbsp;
        </span>
      </motion.button>
    </div>
  );
};

export default day3;
