import React from "react";
import { FaGift } from "react-icons/fa";
import { GrDocumentText } from "react-icons/gr";
import { LuPackageOpen } from "react-icons/lu";
import { VscChecklist } from "react-icons/vsc";
import { FcElectronics } from "react-icons/fc";
const Services = () => {
  return (
    <div>
      <div className="w-[80vw] mx-auto">
        <div className="text-4xl text-center font-semibold my-10">
          What Can You Send?
        </div>
        <div className="grid my-10 gap-10 grid-cols-2 md:grid-cols-5 justify-around  items-center">
          <div className="text-8xl flex-col flex justify-center items-center bg-yellow-50 p-4 rounded-md">
            <FaGift />
            <div className="text-2xl">Gift</div>
          </div>
          <div className="text-8xl flex-col flex justify-center items-center bg-yellow-50 p-4 rounded-md">
            <GrDocumentText />
            <div className="text-2xl">Document</div>
          </div>
          <div className="text-8xl flex-col flex justify-center items-center bg-yellow-50 p-4 rounded-md">
            <LuPackageOpen />
            <div className="text-2xl">Package</div>
          </div>
          <div className="text-8xl flex-col flex justify-center items-center bg-yellow-50 p-4 rounded-md">
            <VscChecklist />
            <div className="text-2xl">Accessories</div>
          </div>
          <div className="text-8xl flex-col flex justify-center items-center bg-yellow-50 p-4 rounded-md">
            <FcElectronics />
            <div className="text-2xl">Eletronics</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Services;
