import React from "react";
import Link from "next/link";
import { RiMoneyDollarCircleFill } from "react-icons/ri";
import Image from "next/image";
import img1 from "../../images/bikePage/bike-feature-1.png";
import img2 from "../../images/bikePage/ic_bike_feature_2.png";
import img3 from "../../images/bikePage/ic_bike_feature_3.png";

const page = () => {
  return (
    <div>
      <div className="bike-bg  mt-20">
        <div className="m-24  opacity-100">
          <div className="text-2xl opacity-100">AutoLane Motorcycle</div>
          <div className="text-5xl">Beat the Traffic, Save Time</div>
          <div className="text-xl">
            Take a Pathao bike and save time! It&apos;s fast, it&apos;s cheap
            and it&apos;s easy!
            <Link
              href={"/earn/motorcycle"}
              className="px-6 flex items-center gap-2 my-5 py-2 font-medium text-3xl  z-10 bg-yellow-300 text-black w-fit transition-all shadow-[3px_3px_0px_black] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] active:scale-95"
            >
              <RiMoneyDollarCircleFill /> Start Earning
            </Link>
          </div>
        </div>
      </div>
      <div className="mt-[100vh]">
        <div className="grid mx-auto w-[80vw] grid-cols-3 gap-24">
          <div className="">
            <Image alt="motorcycle-1" src={img1} width={1000} height={1000} />
            <div className="text-3xl py-1 mt-1 text-center font-semibold">
              Beat Traffic, Save Time
            </div>
            <div className="">
              Nothing beats traffic like Pathao Bikes and you know it! Save time
              and save money by ride-sharing with Pathao Bikes.
            </div>
          </div>
          <div className="">
            <Image alt="motorcycle-2" src={img2} width={1000} height={1000} />
            <div className="text-3xl py-1 mt-1 text-center font-semibold">
              We Got You Covered
            </div>
            <div className="text-lg text-center">
              Our rides are secured, so when ride-sharing with us you get the
              safest rides.
            </div>
          </div>
          <div className="text-lg text-center">
            <Image alt="motorcycle-3" src={img3} width={1000} height={1000} />
            <div className="text-3xl py-1 mt-1 text-center font-semibold">
              Always Available
            </div>
            <div className="text-lg text-center">
              Be it early in the morning or late in the night, our expert riders
              are always available to provide you with the best ride-sharing
              experience!
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
