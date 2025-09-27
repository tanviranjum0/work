"use client";
import Marquee from "react-fast-marquee";
import { motion } from "motion/react";
const Test4 = () => {
  const textsMain = ["React", "Node.js", "Framer Motion", "Tailwind"];
  return (
    <div className="h-[100vh] font-boldonse bg-gray-300 w-[100vw]">
      <Marquee
        direction="right"
        className="marquee uppercase font-extrabold overflow-hidden "
        autoFill={true}
        speed={20}
      >
        {textsMain.map((text, index) => {
          return (
            <span
              key={index}
              className="mx-8 text-gray-400 text-9xl leading-40 tracking-wide"
            >
              {text}
            </span>
          );
        })}
      </Marquee>
      <Marquee
        className="marquee uppercase font-extrabold overflow-hidden "
        autoFill={true}
        speed={20}
      >
        {textsMain.map((text, index) => {
          return (
            <span
              key={index}
              className="mx-8 text-gray-400 text-9xl leading-40 tracking-wide"
            >
              {text}
            </span>
          );
        })}
      </Marquee>
      <Marquee
        className="marquee uppercase font-extrabold overflow-hidden"
        direction="right"
        autoFill={true}
        speed={20}
      >
        {textsMain.map((text, index) => {
          return (
            <span
              key={index}
              className="mx-8 text-gray-400 text-9xl leading-40 tracking-wide"
            >
              {text}
            </span>
          );
        })}
      </Marquee>
      <Marquee
        className="marquee uppercase font-extrabold overflow-hidden"
        autoFill={true}
        speed={20}
      >
        {textsMain.map((text, index) => {
          return (
            <span
              key={index}
              className="mx-8 text-gray-400 font-extrabold text-9xl leading-40 tracking-wide "
            >
              {text}
            </span>
          );
        })}
      </Marquee>
    </div>
  );
};

export default Test4;
