"use client";
import Image from "next/image";
import React from "react";
import Link from "next/link";
import motorcycle from "../../../images/vehicleImage/motorcycle.jpeg";
import car from "../../../images/vehicleImage/car.jpeg";
import cycle from "../../../images/vehicleImage/cycle.jpeg";
import EarnUsingVehicleBar from "@/components/motion/EarnUsingVehicleBar";
import Form from "@/components/EarnComponents/Form";
import { useParams } from "next/navigation";

const page = () => {
  const params = useParams();

  console.log(params);
  return (
    <div className="w-[90vw] mx-auto text-center sm:w-[80vw] pb-10">
      <div className="py-10 px-5">
        <div className="md:text-5xl text-2xl sm:text-3xl font-semibold">
          Earn with Your Bike, Car or Cycle
        </div>
        <div className="md:text-xl text-gray-700 py-3">
          Become a captain, rider or foodman on the highest earning platform!
        </div>
        <div className="grid grid-cols-1  md:grid-cols-2">
          <div>
            <div className="h-28 flex gap-8">
              <Link href={"/earn/motorcycle"} className="cursor-pointer">
                <Image
                  className=""
                  alt="motorcycle image"
                  src={motorcycle}
                  width={1000}
                  height={1000}
                />
                {params.slug == "motorcycle" && <EarnUsingVehicleBar />}
              </Link>
              <Link href={"/earn/car"} className=" cursor-pointer">
                <Image
                  className=""
                  alt="car image"
                  src={car}
                  width={1000}
                  height={1000}
                />
                {params.slug == "car" && <EarnUsingVehicleBar />}
              </Link>
              <Link href={"/earn/cycle"} className="cursor-pointer">
                <Image
                  className=""
                  alt="cycle image"
                  src={cycle}
                  width={1000}
                  height={1000}
                />
                {params.slug == "cycle" && <EarnUsingVehicleBar />}
              </Link>
            </div>
            <Form params={params} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
