"use client";

import Image from "next/image";
import React, { useState } from "react";
import basic from "../../images/carPage/bg-white-car.jpg";
import plus from "../../images/carPage/bg-white-carplus.jpeg";
import max from "../../images/carPage/bg-white-van.jpeg";

const Options = () => {
  const [selectedOption, setSelectedOption] = useState("basic");
  return (
    <div className="w-[80vw] gap-5 grid grid-cols-5 mx-auto">
      <div className="col-span-5 md:col-span-2">
        <div className="text-4xl font-semibold py-5">Cars for everyone</div>
        <div className="flex justify-between">
          <div
            className={` transition-all duration-200 cursor-pointer hover:shadow-xl  ${
              selectedOption == "basic" && "shadow-md"
            }`}
          >
            <div
              onClick={() => setSelectedOption("basic")}
              className="h-28 w-28  rounded-2xl"
            >
              <Image alt="basic car" src={basic} width={1000} height={1000} />
            </div>
            <div className="text-center text-lg font-semibold">Basic</div>
          </div>
          <div
            className={` transition-all duration-200 cursor-pointer hover:shadow-xl  ${
              selectedOption == "plus" && "shadow-md"
            }`}
          >
            <div
              onClick={() => setSelectedOption("plus")}
              className="h-28 w-28  rounded-2xl"
            >
              <Image alt="basic car" src={plus} width={1000} height={1000} />
            </div>
            <div className="text-center text-lg font-semibold">Plus</div>
          </div>
          <div
            className={` transition-all duration-200 cursor-pointer hover:shadow-xl  ${
              selectedOption == "max" && "shadow-md"
            }`}
          >
            <div
              onClick={() => setSelectedOption("max")}
              className="h-28 w-28  rounded-2xl"
            >
              <Image alt="basic car" src={max} width={1000} height={1000} />
            </div>
            <div className="text-center text-lg font-semibold">Max</div>
          </div>
        </div>
        <div className="p-10 text-lg shadow-md">
          {selectedOption == "plus" &&
            `Experience peak comfort and safety with our well-maintained cars
          ideal for small groups of 4 or individuals.`}
          {selectedOption == "basic" &&
            `Our affordable AC cars can host up to 4 people and it's perfect for your daily commute`}
          {selectedOption == "max" &&
            `7-seater vehicles that can host up to 6 passengers comfortably, making them perfect for group outings & hangouts.`}
        </div>
      </div>
      <div className=" col-span-5 md:col-span-3 p-5">
        {selectedOption == "basic" && (
          <Image alt="selected car" src={basic} width={1000} height={1000} />
        )}
        {selectedOption == "plus" && (
          <Image alt="selected car" src={plus} width={1000} height={1000} />
        )}
        {selectedOption == "max" && (
          <Image alt="selected car" src={max} width={1000} height={1000} />
        )}
      </div>
    </div>
  );
};

export default Options;
