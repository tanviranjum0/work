import React from "react";

const Test3 = () => {
  return (
    <div className="h-[100vh] p-10 bg-conic from-blue-600 to-sky-400 to-50%">
      <div className="text-4xl my-3">Spring Setting</div>
      <div className="grid grid-cols-10 gap-4">
        <div className="bg-gray-300 col-span-8  h-[10rem] p-[10px] rounded-xl">
          <div className="h-[4rem] w-[4rem]  bg-radial from-pink-400 from-40% to-fuchsia-700 rounded"></div>
          <div className="flex justify-between">
            <span className="h-[4rem] my-1 w-[4rem] bg-conic/decreasing from-violet-700 via-lime-300 to-violet-700 rounded"></span>
            <span className="h-[4rem] w-[4rem] bg-linear-to-t from-red-500 to-amber-500 rounded"></span>
          </div>
        </div>
        <div className="bg-gray-600 p-[10px] h-[10rem] col-span-2 rounded-xl"></div>
      </div>
      <div className="grid grid-cols-2 gap-5">
        <div className="">
          <div className="text-3xl my-2">Duration and Bounce</div>
          <div className="border-2 rounded-2xl"></div>
        </div>
        <div className="">
          <div className="text-3xl my-2">Stiffness, Damping, Mass...</div>
          <div className="border-2 rounded-2xl"></div>
        </div>
      </div>
    </div>
  );
};

export default Test3;
