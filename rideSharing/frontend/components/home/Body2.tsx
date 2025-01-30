import React from "react";
import SectionSelection from "./SectionSelection";

const Body2 = () => {
  return (
    <div className="mt-20">
      <div className="md:w-[60vw] mx-auto w-[90vw] bg-yellow-300 rounded-md shadow-2xl shadow-stone-950">
        <div className="grid md:grid-cols-3 gap-0 justify-around">
          <div className="px-5 border-b-2 md:border-b-0 md:border-r-2 border-black py-5 md:py-0 md:px-10 md:my-10">
            <div className="text-xl md:text-2xl font-semibold">240000+ </div>
            <div className="text-base md:text-xl">Users</div>
          </div>
          <div className="px-5 border-b-2 md:border-b-0 md:border-r-2 border-black py-5 md:py-0 md:px-10 md:my-10">
            <div className="text-xl md:text-2xl font-semibold">40000+</div>
            <div className="text-base md:text-xl">Riders/Captains</div>
          </div>
          <div className="px-5 py-5 md:p-10">
            <div className="text-xl md:text-2xl font-semibold">320000+</div>
            <div className="text-base md:text-xl">Successful Rides</div>
          </div>
        </div>
      </div>
      <div className="w-[70vw] mx-auto mt-20">
        <div className="md:text-5xl font-semibold text-2xl text-center">
          AutoLane Platform
        </div>
        <div className="md:text-3xl text-xl mt-4 text-center">
          AutoLane provides all the benefits only for you.
        </div>
        <SectionSelection />
      </div>
    </div>
  );
};

export default Body2;
