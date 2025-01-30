"use client";

import React, { useState } from "react";
import { FaMotorcycle } from "react-icons/fa6";
import { RiEBike2Line } from "react-icons/ri";
import { FaCar } from "react-icons/fa";
import SelectedSections from "./SelectedSections";
type Selection = "car" | "motorcycle" | "delivery";

const SectionSelection = () => {
  const [selection, setSelection] = useState<Selection>("car");
  return (
    <div>
      <div className="grid mt-10 text-lg md:text-2xl grid-cols-3">
        <div
          onClick={() => setSelection("car")}
          className={`flex ${
            selection === "car"
              ? "border-b-2 md:border-b-4 font-bold border-black"
              : ""
          } items-center py-2 justify-center text-center cursor-pointer  transition-all duration-300`}
        >
          <FaCar className="text-red-600 mx-2" />
          <span className="">Car</span>
        </div>
        <div
          onClick={() => setSelection("motorcycle")}
          className={`flex ${
            selection === "motorcycle"
              ? "border-b-2 md:border-b-4 font-bold border-black"
              : ""
          } items-center py-2 justify-center text-center cursor-pointer  transition-all duration-300`}
        >
          <FaMotorcycle className="text-red-600 mx-2" />
          <span>Motorcycle</span>
        </div>
        <div
          onClick={() => setSelection("delivery")}
          className={`flex ${
            selection === "delivery"
              ? "border-b-2 md:border-b-4 font-bold border-black"
              : ""
          } items-center py-2 justify-center text-center cursor-pointer  transition-all duration-300`}
        >
          <RiEBike2Line className="text-red-600 mx-2" />
          <span>Delivery</span>
        </div>
      </div>
      <SelectedSections selection={selection} />
    </div>
  );
};

export default SectionSelection;
