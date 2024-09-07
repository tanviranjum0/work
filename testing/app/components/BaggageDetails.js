"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import { HiMiniXMark } from "react-icons/hi2";
import img from "../images/turkish-logo.jpg";

export const handleDetails = () => {
  const baggage = document.getElementById("baggageDetails");
  baggage.classList.toggle("hidden");
};
const BaggageDetails = () => {
  return (
    <div id="baggageDetails" className="absolute hidden inset-0 backdrop-blur">
      {" "}
      <motion.div
        initial={{
          scale: 0.8,
          opacity: 0,
          skewX: 5,
        }}
        whileInView={{
          scale: 1,
          opacity: 1,
          skewX: 0,
        }}
        transition={{
          duration: 1,
          type: "spring",
          stiffness: 50,
        }}
        className="flex justify-center h-screen w-screen inset-0 items-center"
      >
        <div className="w-[90vw]  py-5 bg-sky-50 md:w-[40vw] shadow-2xl">
          <div className="relative ">
            <HiMiniXMark
              onClick={() => handleDetails()}
              className="absolute top-0 right-0 mr-3 cursor-pointer text-3xl"
            />
          </div>

          <div className="text-lg py-3 px-4">
            Dhaka to Chittagong, 4 Sep 2024
          </div>
          <div className="border mx-3 p-4">
            <div className="flex">
              <Image
                alt="airline-logo"
                className="p-5"
                src={img}
                height={80}
                width={80}
              />
              <div>
                <div className="text-xs pb-3">Turkish Airline</div>
                <div className="text-md">BG | 121</div>
                <div className="text-sm font-semibold">
                  {" "}
                  Aircraft : Boeing 737-800 Operated by : BG
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-3 p-2 mx-auto justify-center">
            <div className="text-center">
              <div className="text-md py-3">Baggage</div>
              <div className="text-sm">Adult</div>
            </div>
            <div className="text-center">
              <div className="text-md py-3">Check In</div>
              <div className="text-sm">20kg(s)</div>
            </div>
            <div className="text-center">
              <div className="text-md py-3">Cabin</div>
              <div className="text-sm">7kg(s)</div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default BaggageDetails;
