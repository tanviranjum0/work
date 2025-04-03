import React, { useContext, useEffect } from "react";
import { StoreContext } from "../../context/StoreContext";
const JointRom = () => {
  const { increaseJointRom, jointRom } = useContext(StoreContext);
  useEffect(() => {
    const iterator = async () => {
      for (const id in jointRom) {
        if (jointRom[id] == 1) {
          let point = document.querySelectorAll(`#${id}`);
          point.forEach((newPoint) => {
            newPoint.classList.add("bg-green-500");
          });
        } else if (jointRom[id] == 2) {
          let point = document.querySelectorAll(`#${id}`);
          point.forEach((newPoint) => {
            newPoint.classList.remove("bg-green-500");
            newPoint.classList.add("bg-yellow-500");
          });
        } else if (jointRom[id] == 3) {
          let point = document.querySelectorAll(`#${id}`);
          point.forEach((newPoint) => {
            newPoint.classList.remove("bg-yellow-500");
            newPoint.classList.add("bg-orange-500");

          });
        } else if (jointRom[id] == 4) {
          let point = document.querySelectorAll(`#${id}`);
          point.forEach((newPoint) => {
            newPoint.classList.remove("bg-orange-500");
            newPoint.classList.add("bg-red-500");

          });
        } else if (jointRom[id] == 0) {
          let point = document.querySelectorAll(`#${id}`);
          point.forEach((newPoint) => {
            newPoint.classList.remove("bg-red-500");
          });
        }
      }
    };
    iterator();
  }, [jointRom]);

  const handleClick = async (e) => {
    increaseJointRom(e.target.getAttribute("id"));
  };
  const handleMouseEnter = (e) => {
    e.target.classList.add("opacity-80");
  };
  const handleMouseLeave = (e) => {
    e.target.classList.remove("opacity-80");
  };
  return (
    <div className="grid select-none w-[90%] md:w-[75%] grid-cols-4 sm:grid-cols-7 mx-auto md:grid-cols-10">
      <div className="col-span-4">
        <div
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onClick={handleClick}
          id="ankle"
          className=" px-2 sm:px-5 md:px-30 text-2xl font-semibold sm:text-3xl sm:py-15 py-10 md:py-20 text-center border-3 rounded-3xl"
        >
          Ankle
        </div>
        <div
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onClick={handleClick}
          id="subtalar"
          className="px-2 sm:px-5 md:px-30 text-2xl py-5 font-semibold sm:text-3xl text-center rounded-3xl border-3 sm:py-7 md:py-10"
        >
          Subtalar
        </div>
      </div>
      <div className="col-span-3 flex sm:justify-normal justify-center sm:mt-5 md:mt-10">
        <div onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onClick={handleClick}
          id="midtarsal" className="border-3 text-center text-2xl font-semibold sm:text-3xl flex justify-center items-center rounded-4xl w-full">
          MidTarsal
        </div>
        <div onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onClick={handleClick}
          id="tmt" className="border-3 text-center text-2xl font-semibold  sm:text-3xl flex justify-center items-center rounded-full">
          TMT
        </div>
      </div>
      <div className="col-span-3 flex sm:justify-normal justify-center sm:mt-5 md:mt-10">
        <div className="">
          <div
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={handleClick}
            id="mtp1"
            className="px-2 font-semibold text-gray-600 sm:px-3 py-1 text-xl sm:text-2xl  border-3 rounded-full"
          >
            MTP1
          </div>
          <div
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={handleClick}
            id="mtp2"
            className="px-2 font-semibold text-gray-600 sm:px-3 py-1 text-xl sm:text-2xl border-3 rounded-full"
          >
            MTP2
          </div>
          <div
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={handleClick}
            id="mtp3"
            className="px-2 font-semibold text-gray-600 sm:px-3 py-1 text-xl sm:text-2xl border-3 rounded-full"
          >
            MTP3
          </div>
          <div
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={handleClick}
            id="mtp4"
            className="px-2 font-semibold text-gray-600 sm:px-3 py-1 text-xl sm:text-2xl border-3 rounded-full"
          >
            MTP4
          </div>
          <div
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={handleClick}
            id="mtp5"
            className="px-2 font-semibold text-gray-600 sm:px-3 py-1 text-xl sm:text-2xl border-3 rounded-full"
          >
            MTP5
          </div>
        </div>
        <div className="">
          <div
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={handleClick}
            id="pip1"
            className="px-2 font-semibold text-gray-600 sm:px-3 py-1 text-xl sm:text-2xl  border-3  rounded-full"
          >
            PIP
          </div>
          <div
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={handleClick}
            id="pip2"
            className="px-2 font-semibold text-gray-600 sm:px-3 py-1 text-xl sm:text-2xl  border-3  rounded-full"
          >
            PIP
          </div>
          <div
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={handleClick}
            id="pip3"
            className="px-2 font-semibold text-gray-600 sm:px-3 py-1 text-xl sm:text-2xl  border-3  rounded-full"
          >
            PIP
          </div>
          <div
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={handleClick}
            id="pip4"
            className="px-2 font-semibold text-gray-600 sm:px-3 py-1 text-xl sm:text-2xl  border-3  rounded-full"
          >
            PIP
          </div>
          <div
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={handleClick}
            id="pip5"
            className="px-2 font-semibold text-gray-600 sm:px-3 py-1 text-xl sm:text-2xl  border-3  rounded-full"
          >
            PIP
          </div>
        </div>
        <div className="">
          <div
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={handleClick}
            id="dip1"
            className="px-2 font-semibold text-gray-600 sm:px-3 py-1 text-xl sm:text-2xl  border-3  rounded-full"
          >
            DIP
          </div>
          <div
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={handleClick}
            id="dip2"
            className="px-2 font-semibold text-gray-600 sm:px-3 py-1 text-xl sm:text-2xl  border-3  rounded-full"
          >
            DIP
          </div>
          <div
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={handleClick}
            id="dip3"
            className="px-2 font-semibold text-gray-600 sm:px-3 py-1 text-xl sm:text-2xl  border-3  rounded-full"
          >
            DIP
          </div>
          <div
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={handleClick}
            id="dip4"
            className="px-2 font-semibold text-gray-600 sm:px-3 py-1 text-xl sm:text-2xl  border-3  rounded-full"
          >
            DIP
          </div>
          <div
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={handleClick}
            id="dip5"
            className="px-2 font-semibold text-gray-600 sm:px-3 py-1 text-xl sm:text-2xl  border-3  rounded-full"
          >
            DIP
          </div>
        </div>
      </div>
    </div>
  );
};

export default JointRom;
