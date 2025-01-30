import React from "react";
import { RiMoneyDollarCircleFill } from "react-icons/ri";
const Body1 = () => {
  return (
    <div className=" mx-auto w-[80vw]">
      <div className="text-4xl md:text-7xl mt-20">
        Take it easy, Take{" "}
        <div className="italic text-5xl text-black ">AutoLane</div>
      </div>
      <div className="text-4xl">One stop solution</div>
      <button className="px-6 flex items-center gap-2 mt-2 py-2 font-medium text-3xl  z-10 bg-yellow-300 text-black w-fit transition-all shadow-[3px_3px_0px_black] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] active:scale-95">
        <RiMoneyDollarCircleFill /> Start Earning
      </button>
    </div>
  );
};

export default Body1;
