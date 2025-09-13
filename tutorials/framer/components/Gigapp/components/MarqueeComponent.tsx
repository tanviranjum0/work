"use client";
import Marquee from "react-fast-marquee";
import React from "react";
import { motion } from "motion/react";
import Image, { StaticImageData } from "next/image";
import img1 from "../../../public/MarqueImages/web1.png";
import img2 from "../../../public/MarqueImages/web2.png";
import img3 from "../../../public/MarqueImages/web3.png";
import img4 from "../../../public/MarqueImages/web4.png";
import img5 from "../../../public/MarqueImages/web5.png";
import img6 from "../../../public/MarqueImages/web6.png";
import img7 from "../../../public/MarqueImages/web7.png";
import img8 from "../../../public/MarqueImages/web8.png";
import img9 from "../../../public/MarqueImages/web9.png";
import img10 from "../../../public/MarqueImages/web10.png";
import img11 from "../../../public/MarqueImages/web11.png";

interface MarqueItem {
  id: number;
  img: StaticImageData;
  height: number;
}

const items: MarqueItem[] = [
  {
    id: 1,
    img: img1,
    height: 200,
  },
  {
    id: 2,
    img: img2,
    height: 535,
  },
  {
    id: 3,
    img: img3,
    height: 274,
  },
  {
    id: 4,
    img: img4,
    height: 200,
  },
  {
    id: 5,
    img: img5,
    height: 200,
  },
  {
    id: 6,
    img: img6,
    height: 497,
  },
  {
    id: 7,
    img: img7,
    height: 200,
  },
  {
    id: 8,
    img: img8,
    height: 497,
  },
  {
    id: 9,
    img: img9,
    height: 200,
  },
  {
    id: 10,
    img: img10,
    height: 273,
  },
  {
    id: 11,
    img: img11,
    height: 200,
  },
];
const MarqueeComponent = () => {
  return (
    <>
      <motion.div className="m-32">
        <motion.div
          initial={{
            y: 50,
            opacity: 0.5,
          }}
          animate={{
            y: 0,
            opacity: 1,
          }}
          transition={{
            duration: 0.5,
            type: "spring",
          }}
          className="uppercase text-center my-5  text-6xl"
        >
          Motion turns static design into living, breathing experiences.
        </motion.div>
        <motion.div
          initial={{
            y: 50,
            opacity: 0.5,
          }}
          animate={{
            y: 0,

            opacity: 1,
          }}
          transition={{
            duration: 0.7,
            type: "spring",
          }}
          className="uppercase text-center text-xl  text-gray-500"
        >
          Get top-tier design in less than a week
        </motion.div>
        <motion.div
          initial={{
            y: 50,
            opacity: 0.5,
          }}
          animate={{
            y: 0,
            opacity: 1,
          }}
          transition={{
            duration: 0.8,
            type: "spring",
          }}
          className=" uppercase text-center text-xl text-gray-500"
        >
          Subscriptions or one-time projects.
        </motion.div>
        <div className="flex w-full my-5 justify-center">
          <div id="contactButton" className="contactButton-contact">
            <span className="contactButtoncircle" aria-hidden="true">
              <span className="icon arrow"></span>
            </span>
            <span className="contact-text">Contact</span>
          </div>
        </div>
      </motion.div>
      <motion.div
        initial={{
          skewY: 0,
        }}
        animate={{
          skewY: -6,
        }}
        transition={{
          duration: 1,
          type: "tween",
        }}
        className="flex mt-28 scale-110 "
      >
        <Marquee
          direction="right"
          className="marquee flex py-4"
          autoFill={true}
          speed={40}
        >
          {items.map((data, index) => {
            return (
              <>
                <Image
                  className="rounded-xl mx-2"
                  src={data.img}
                  alt={`Marque image ${data.id}`}
                  height={`${data.height}`}
                />
              </>
            );
          })}
        </Marquee>
      </motion.div>
    </>
  );
};

export default MarqueeComponent;
