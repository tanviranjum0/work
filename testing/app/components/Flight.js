"use client";
import Image from "next/image";
import { useState } from "react";
import { MdOutlineArrowRightAlt } from "react-icons/md";
import img from "../images/turkish-logo.jpg";
import FlightDetails from "./FlightDetails";
import FareSummary from "./FareSummary";
import FareRules from "./FareRules";
const Flight = () => {
  const [details, setDetails] = useState("");
  return (
    <div className="my-5">
      <div className="grid grid-cols-6 border py-5 rounded-lg bg-sky-100 ">
        <div className="p-1 pl-5">
          <Image src={img} width={80} height={80} className="py-5" />
          <div className="text-sm">Turkish Airline</div>
          <div className="text-green-600">Partially Refundable</div>
        </div>
        <div className="p-2 mt-10">
          {" "}
          <div className="text-sm"> Depart</div>
          <div className="pt-2 text-lg">16 : 00</div>
          <div className="">Wed, 11 Sep 2024</div>
          <div className="text-lg">Dhaka (DAC)</div>
        </div>
        <div className="p-2 mt-10 flex items-center justify-center flex-col">
          {" "}
          <div className="text-sm"> 45 Minutes</div>
          <div className="text-7xl ">
            {" "}
            <MdOutlineArrowRightAlt />
          </div>
          <div className="">Non Stop</div>
        </div>
        <div className="p-2 mt-10">
          {" "}
          <div className="text-sm"> Arrive</div>
          <div className="pt-2 text-lg">16 : 00</div>
          <div className="">Wed, 11 Sep 2024</div>
          <div className="text-lg">Dhaka (DAC)</div>
        </div>
        <div className="p-2 mt-10 ">
          <div className="text-sm ">Price</div>
          <div className="text-xl pt-5">BDT 4,500</div>
        </div>
        <div className="mt-5">
          <button className="mt-5 text-center bg-sky-300 hover:bg-sky-800 hover:text-sky-200 px-5 py-3 rounded-md transition-all duration-200 active:scale-95">
            Book Now!
          </button>
        </div>
      </div>
      <div className="absolute right-20 ">
        <div
          onClick={() => {
            if (details == "") setDetails("details");
            else {
              setDetails("");
            }
          }}
          className="relative bottom-10 hover:text-black cursor-pointer semi-bold text-sky-800"
        >
          Flight Details &#8595;
        </div>
      </div>
      {details == "details" && (
        <FlightDetails details={details} setDetails={setDetails} />
      )}
      {details == "fare" && (
        <FareSummary details={details} setDetails={setDetails} />
      )}
      {details == "rule" && (
        <FareRules details={details} setDetails={setDetails} />
      )}
    </div>
  );
};

export default Flight;
