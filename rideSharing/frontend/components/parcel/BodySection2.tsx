import React from "react";
import Image from "next/image";
import handOver from "../../images/parcel/parcel-handover.jpeg";
import Link from "next/link";
const BodySection2 = () => {
  return (
    <div className="w-[80vw] mx-auto">
      <div className="grid my-32 grid-cols-1 md:grid-cols-2 gap-10">
        <Image
          src={handOver}
          alt="women looking in the box "
          height={1000}
          width={1000}
        />
        <div className="p-5">
          <div className="text-4xl py-5 font-semibold">Deliver & Earn</div>
          <div className="">
            <ul className="list-disc marker:text-yellow-500">
              <li className="text-xl text-gray-700 py-2">
                More solvency with a safe & secure income
              </li>
              <li className="text-xl text-gray-700 py-2">
                Exciting Bonus offers are given regularly
              </li>
              <li className="text-xl text-gray-700 py-2">
                Hassle-free On-time payment
              </li>
            </ul>
            <Link
              href={"/earn/cycle"}
              className="px-6 cursor-pointer flex items-center gap-2 my-5 py-2 font-medium text-3xl  z-10 bg-yellow-300 text-black w-fit transition-all shadow-[3px_3px_0px_black] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] active:scale-95"
            >
              Start Earning
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BodySection2;
