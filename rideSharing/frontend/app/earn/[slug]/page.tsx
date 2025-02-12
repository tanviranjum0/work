/* eslint-disable react-hooks/rules-of-hooks */
"use client";
import Image from "next/image";
import React, { useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import motorcycle from "../../../images/vehicleImage/motorcycle.jpeg";
import car from "../../../images/vehicleImage/car.jpeg";
import cycle from "../../../images/vehicleImage/cycle.jpeg";
import EarnUsingVehicleBar from "@/components/motion/EarnUsingVehicleBar";
import Form from "@/components/EarnComponents/Form";
import downLoadImage from "../../../images/appdownloadicon/Google-Play-ds.png";
import mpImage from "../../../images/appRelated/mapshow2.jpg";
import { useParams } from "next/navigation";
import { FaAngleDown } from "react-icons/fa";
import SideFormSection from "@/components/EarnComponents/SideFormSection";

const page = () => {
  const params = useParams<{ slug: string }>();
  const [accordion, setAccordion] = useState({
    one: false,
    two: false,
    three: false,
  });

  return (
    <div className="bg-yellow-50">
      <div className="w-[90vw] pb-10 mx-auto text-center sm:w-[80vw] ">
        <div className="py-20 px-5">
          <div className="md:text-5xl text-2xl sm:text-3xl font-semibold">
            Earn with Your Bike, Car or Cycle
          </div>
          <div className="md:text-xl pb-10 text-gray-700 py-3">
            Become a captain, rider or foodman on the highest earning platform!
          </div>
          <section className="grid grid-cols-1 gap-10 md:grid-cols-2">
            <div className="">
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
                <Link href={"/earn/car"} className="cursor-pointer">
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
            <SideFormSection params={params} />
          </section>
          <section className="grid select-none py-28  grid-cols-1 gap-10 md:grid-cols-2">
            <div className="p-4">
              <div className="text-3xl font-semibold">
                How can you give a ride?
              </div>
              <div
                onClick={() =>
                  setAccordion({
                    one: !accordion.one,
                    two: false,
                    three: false,
                  })
                }
                className=" cursor-pointer shadow-lg"
              >
                <div className="px-12 py-8 flex items-center justify-between ">
                  <div className="flex ">
                    <div className="h-10 w-10 font-bold bg-yellow-800 justify-center items-center flex rounded-full text-white border-rounded">
                      1
                    </div>
                    <div className="text-2xl ml-5">Download drive app</div>
                  </div>
                  <div className={`${accordion.one && "-rotate-90"}`}>
                    <FaAngleDown />
                  </div>
                </div>
                {accordion.one && (
                  <motion.div
                    initial={{
                      y: 20,
                      opacity: 0,
                    }}
                    animate={{
                      y: 0,
                      opacity: 1,
                    }}
                    transition={{
                      duration: 0.5,
                      ease: "easeInOut",
                    }}
                    className="px-4 py-4 text-gray-700 text-lg"
                  >
                    Be sure to download the AutoLane Drive app.
                    <Link href={"/app-download"} className="px-4 w-32">
                      <Image
                        className="ml-16 mt-2"
                        alt="doneload image"
                        src={downLoadImage}
                      />
                    </Link>
                  </motion.div>
                )}
              </div>
              <div
                onClick={() =>
                  setAccordion({
                    one: false,
                    two: !accordion.two,
                    three: false,
                  })
                }
                className=" cursor-pointer  shadow-lg"
              >
                <div className="px-12 mt-3 py-8 flex justify-between items-center ">
                  <div className="flex">
                    <div className="h-10 w-10 font-bold bg-yellow-800 justify-center items-center flex rounded-full text-white border-rounded">
                      2
                    </div>
                    <div className="text-2xl ml-5">Keep your status online</div>
                  </div>
                  <div className={`${accordion.two && "-rotate-90"}`}>
                    <FaAngleDown />
                  </div>
                </div>
                {accordion.two && (
                  <motion.div
                    initial={{
                      y: 20,
                      opacity: 0,
                    }}
                    animate={{
                      y: 0,
                      opacity: 1,
                    }}
                    transition={{
                      duration: 0.5,
                      ease: "easeInOut",
                    }}
                    className="px-4 pb-4 text-gray-700 text-lg"
                  >
                    Sign up on the drive app and keep your status online.
                  </motion.div>
                )}
              </div>
              <div
                onClick={() =>
                  setAccordion({
                    one: false,
                    two: false,
                    three: !accordion.three,
                  })
                }
                className="cursor-pointer shadow-lg"
              >
                <div className="px-12 mt-3 py-8 flex items-center justify-between ">
                  <div className="flex ">
                    <div className="h-10 w-10 font-bold bg-yellow-800 justify-center items-center flex rounded-full text-white border-rounded">
                      3
                    </div>
                    <div className="text-2xl ml-5">Get ride request</div>
                  </div>
                  <div className={`${accordion.three && "-rotate-90"}`}>
                    <FaAngleDown />
                  </div>
                </div>
                {accordion.three && (
                  <motion.div
                    initial={{
                      y: 20,
                      opacity: 0,
                    }}
                    animate={{
                      y: 0,
                      opacity: 1,
                    }}
                    transition={{
                      duration: 0.5,
                      ease: "easeInOut",
                    }}
                    className="px-4 pb-4 text-gray-700 text-lg"
                  >
                    Make sure your GPS is at high accuracy and wait for a ride
                    request.
                  </motion.div>
                )}
              </div>
            </div>
            <div className="p-2 hidden sm:flex justify-center items-center">
              <Image
                className="rounded-[2.4rem]"
                src={mpImage}
                alt="map image"
              />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
export default page;
