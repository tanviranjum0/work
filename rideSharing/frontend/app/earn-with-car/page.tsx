import Image from "next/image";
import React from "react";
import motorcycle from "../../images/vehicleImage/motorcycle.jpeg";
import car from "../../images/vehicleImage/car.jpeg";
import Link from "next/link";
import cycle from "../../images/vehicleImage/cycle.jpeg";
import EarnUsingVehicleBar from "@/components/motion/EarnUsingVehicleBar";

const page = () => {
  return (
    <div className="w-[90vw] mx-auto text-center sm:w-[80vw] pb-10">
      <div className="py-10 px-5">
        <div className="md:text-5xl text-2xl sm:text-3xl font-semibold">
          Earn with Your Bike, Car or Cycle
        </div>
        <div className="md:text-xl text-gray-700 py-3">
          Become a captain, rider or foodman on the highest earning platform!
        </div>
        <div className="h-28 grid-cols-3 bg-gray-200 grid">
          <Link href={"earn-with-motorcycle"} className="cursor-pointer">
            <Image
              className=""
              alt="motorcycle image"
              src={motorcycle}
              width={1000}
              height={1000}
            />
          </Link>
          <Link href={"earn-with-car"} className=" cursor-pointer">
            <Image
              className=""
              alt="car image"
              src={car}
              width={1000}
              height={1000}
            />
            <EarnUsingVehicleBar />
          </Link>
          <Link href={"earn-with-cycle"} className="cursor-pointer">
            <Image
              className=""
              alt="cycle image"
              src={cycle}
              width={1000}
              height={1000}
            />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default page;
