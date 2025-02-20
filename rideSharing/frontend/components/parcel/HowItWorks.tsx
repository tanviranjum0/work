"use client";
import Image from "next/image";
import React, { useState } from "react";
import mapImage from "../../images/appRelated/mapshow2.jpg";
import { motion } from "motion/react";
import Link from "next/link";
import google from "../../images/appdownloadicon/Google-Play-ds.png";
import apple from "../../images/appdownloadicon/App-Store-ds.png";
import { FaAngleDown } from "react-icons/fa";
const HowItWorks = () => {
  const [accordion, setAccordion] = useState({
    one: false,
    two: false,
    three: false,
  });
  return (
    <div>
      <div className="w-[80vw] mx-auto ">
        <div className="grid gap-20 justify-center items-center md:grid-cols-2 grid-cols-1">
          <div>
            <div className="text-center text-3xl font-semibold">
              How It Works
            </div>
            <div
              onClick={() =>
                setAccordion({
                  one: !accordion.one,
                  two: false,
                  three: false,
                })
              }
              className="cursor-pointer shadow-lg font-semibold"
            >
              <div className="px-12 py-8 flex items-center justify-between ">
                <div className="flex ">
                  <div className="h-10 w-10 font-bold bg-yellow-800 justify-center items-center flex rounded-full text-white border-rounded">
                    1
                  </div>
                  <div className="text-2xl ml-5">Download drive app</div>
                </div>
                <div className={`${accordion.one && "-rotate-90"}`}>
                  <FaAngleDown />
                </div>
              </div>
              {accordion.one && (
                <motion.div
                  initial={{
                    y: 20,
                    opacity: 0,
                  }}
                  animate={{
                    y: 0,
                    opacity: 1,
                  }}
                  transition={{
                    duration: 0.5,
                    ease: "easeInOut",
                  }}
                  className="px-4 py-4 text-gray-700 text-lg"
                >
                  #1 Platfrom for All Services
                  <Link href={"/app-download"} className="px-4 gap-5 flex">
                    <Image
                      className=" mt-2"
                      alt="doneload image"
                      src={google}
                    />
                    <Image className=" mt-2" alt="doneload image" src={apple} />
                  </Link>
                </motion.div>
              )}
            </div>
            <div
              onClick={() =>
                setAccordion({
                  one: false,
                  two: !accordion.two,
                  three: false,
                })
              }
              className=" cursor-pointer  font-semibold shadow-lg"
            >
              <div className="px-12 mt-3 py-8 flex justify-between items-center ">
                <div className="flex">
                  <div className="h-10 w-10 font-bold bg-yellow-800 justify-center items-center flex rounded-full text-white border-rounded">
                    2
                  </div>
                  <div className="text-2xl ml-5">
                    Select the Parcel option and Location
                  </div>
                </div>
                <div className={`${accordion.two && "-rotate-90"}`}>
                  <FaAngleDown />
                </div>
              </div>
              {accordion.two && (
                <motion.div
                  initial={{
                    y: 20,
                    opacity: 0,
                  }}
                  animate={{
                    y: 0,
                    opacity: 1,
                  }}
                  transition={{
                    duration: 0.5,
                    ease: "easeInOut",
                  }}
                  className="px-4 pb-4 text-gray-700 text-lg"
                >
                  Open the App and select the parcel option. Set your pickup and
                  destination locations.
                </motion.div>
              )}
            </div>
            <div
              onClick={() =>
                setAccordion({
                  one: false,
                  two: false,
                  three: !accordion.three,
                })
              }
              className="cursor-pointer shadow-lg font-semibold"
            >
              <div className="px-12 mt-3 py-8 flex items-center justify-between ">
                <div className="flex ">
                  <div className="h-10 w-10 font-bold bg-yellow-800 justify-center items-center flex rounded-full text-white border-rounded">
                    3
                  </div>
                  <div className="text-2xl ml-5">Fill in the indormation</div>
                </div>
                <div className={`${accordion.three && "-rotate-90"}`}>
                  <FaAngleDown />
                </div>
              </div>
              {accordion.three && (
                <motion.div
                  initial={{
                    y: 20,
                    opacity: 0,
                  }}
                  animate={{
                    y: 0,
                    opacity: 1,
                  }}
                  transition={{
                    duration: 0.5,
                    ease: "easeInOut",
                  }}
                  className="px-4 pb-4 text-gray-700 text-lg"
                >
                  Fill in the receiver’s information and the type of product
                  being delivered and wait for your parcel to be picked up!
                </motion.div>
              )}
            </div>
          </div>
          <div className=" p-28 rounded-xl hidden md:flex">
            <Image
              className=""
              src={mapImage}
              alt="map image"
              height={1000}
              width={1000}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;
