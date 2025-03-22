import React from "react";

const JointRom = () => {
  return (
    <div className="grid w-[90%] md:w-[75%] grid-cols-4 sm:grid-cols-7 mx-auto md:grid-cols-10">
      <div className="col-span-4">
        <div className=" px-2 sm:px-5 md:px-30 text-2xl font-semibold sm:text-3xl sm:py-15 py-10 md:py-20 text-center border-3 rounded-3xl">
          <span className="text-gray-600 ">Ankle</span>
        </div>
        <div className="px-2 sm:px-5 md:px-30 text-2xl py-5 font-semibold sm:text-3xl text-center rounded-3xl border-3 sm:py-7 md:py-10">
          <span className="text-gray-600 ">Subtalar</span>
        </div>
      </div>
      <div className="col-span-3 flex sm:justify-normal justify-center sm:mt-5 md:mt-10">
        <div className="border-3 flex justify-center items-center rounded-4xl w-full">
          <div className="text-center sm:-rotate-90 text-2xl font-semibold sm:text-3xl">
            <span className="text-gray-600">MidTarsal</span>
          </div>
        </div>
        <div className="border-3 flex justify-center items-center rounded-full">
          <div className="text-center sm:-rotate-90 text-2xl font-semibold  sm:text-3xl">
            <span className="text-gray-600">TMT</span>
          </div>
        </div>
      </div>
      <div className="col-span-3 flex sm:justify-normal justify-center sm:mt-5 md:mt-10">
        <div className="">
          <div className="px-2 font-semibold sm:px-3 py-1 text-xl sm:text-2xl  border-3 rounded-full">
            <span className="text-gray-600">MTP1</span>
          </div>
          <div className="px-2 font-semibold sm:px-3 py-1 text-xl sm:text-2xl border-3 rounded-full">
            <span className="text-gray-600">MTP2</span>
          </div>
          <div className="px-2 font-semibold sm:px-3 py-1 text-xl sm:text-2xl border-3 rounded-full">
            <span className="text-gray-600">MTP3</span>
          </div>
          <div className="px-2 font-semibold sm:px-3 py-1 text-xl sm:text-2xl border-3 rounded-full">
            <span className="text-gray-600">MTP4</span>
          </div>
          <div className="px-2 font-semibold sm:px-3 py-1 text-xl sm:text-2xl border-3 rounded-full">
            <span className="text-gray-600">MTP5</span>
          </div>
        </div>
        <div className="">
          <div className="px-2 font-semibold sm:px-3 py-1 text-xl sm:text-2xl  border-3  rounded-full">
            <span className="text-gray-600">PIP</span>
          </div>
          <div className="px-2 font-semibold sm:px-3 py-1 text-xl sm:text-2xl  border-3  rounded-full">
            <span className="text-gray-600">PIP</span>
          </div>
          <div className="px-2 font-semibold sm:px-3 py-1 text-xl sm:text-2xl  border-3  rounded-full">
            <span className="text-gray-600">PIP</span>
          </div>
          <div className="px-2 font-semibold sm:px-3 py-1 text-xl sm:text-2xl  border-3  rounded-full">
            <span className="text-gray-600">PIP</span>
          </div>
          <div className="px-2 font-semibold sm:px-3 py-1 text-xl sm:text-2xl  border-3  rounded-full">
            <span className="text-gray-600">PIP</span>
          </div>
        </div>
        <div className="">
          <div className="px-2 font-semibold sm:px-3 py-1 text-xl sm:text-2xl  border-3  rounded-full">
            <span className="text-gray-600">DIP</span>
          </div>
          <div className="px-2 font-semibold sm:px-3 py-1 text-xl sm:text-2xl  border-3  rounded-full">
            <span className="text-gray-600">DIP</span>
          </div>
          <div className="px-2 font-semibold sm:px-3 py-1 text-xl sm:text-2xl  border-3  rounded-full">
            <span className="text-gray-600">DIP</span>
          </div>
          <div className="px-2 font-semibold sm:px-3 py-1 text-xl sm:text-2xl  border-3  rounded-full">
            <span className="text-gray-600">DIP</span>
          </div>
          <div className="px-2 font-semibold sm:px-3 py-1 text-xl sm:text-2xl  border-3  rounded-full">
            <span className="text-gray-600">DIP</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JointRom;
