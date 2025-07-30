import Image from "next/image";
import React from "react";
import mobileImage from "../../images/mobileInterface.png";
const CarSection = () => {
  return (
    <div className="">
      <div className="grid grid-cols-1 gap-28 md:grid-cols-2">
        <div className="flex justify-center md:items-baseline items-center flex-col text-center md:text-left">
          <div className="py-7 px-3">
            <div className="md:text-2xl text-xl font-semibold">
              Beat Traffic, Save Time
            </div>
            <span className="">
              Nothing beats traffic like Pathao Bikes and you know it! Save
              time, save money and reach your destination on time.
            </span>
          </div>
          <div className="py-7 px-3">
            <div className="md:text-2xl text-xl font-semibold">
              We Got You Covered
            </div>
            <span>
              Our rides are insured, so you can rely on us to provide you with
              the safest rides.
            </span>
          </div>
          <div className="py-7 px-3">
            <div className="md:text-2xl text-xl font-semibold">
              Always Available
            </div>
            <span>
              Be it early in the morning or late in the night, our trained
              riders are always available to provide you with the best service!
            </span>
          </div>
          <div className="py-7 px-5">
            <button className="px-6 flex items-center  py-2 font-medium text-3xl  z-10 bg-yellow-300 text-black w-fit transition-all shadow-[3px_3px_0px_black] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] active:scale-95">
              Learn More
            </button>
          </div>
        </div>
        <div className="px-20 hidden md:block pt-5 pb-20">
          <Image
            width={500}
            height={500}
            src={mobileImage}
            alt="Map on mobile"
          />
        </div>
      </div>
    </div>
  );
};

export default CarSection;
