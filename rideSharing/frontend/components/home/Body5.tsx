import React from "react";

const Body5 = () => {
  return (
    <div className="mt-3 grid md:grid-cols-2 gap-5 bg-yellow-50 p-10 md:p-20">
      <div>
        <div className="text-xl text-center md:text-left py-3">
          Start delivering products using AutoLane courier
        </div>
        <div className="text-3xl md:text-left    text-center md:text-6xl">
          Trusted & Reliable Delivery For Your Business
        </div>
      </div>
      <div className="flex justify-center items-center">
        <div className="px-6 flex items-center gap-2 mt-2 py-2 font-medium text-3xl z-10 bg-yellow-300 text-black w-fit transition-all cursor-pointer shadow-[3px_3px_0px_black] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] active:scale-95">
          Explore Courier
        </div>
      </div>
    </div>
  );
};

export default Body5;
