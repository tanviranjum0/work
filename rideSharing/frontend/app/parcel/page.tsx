import React from "react";
import Link from "next/link";
import { RiMoneyDollarCircleFill } from "react-icons/ri";
import Image from "next/image";
import img1 from "../../images/parcel/ic_Parcel_Feature_1.png";
import img2 from "../../images/parcel/ic_Parcel_Feature_2.png";
import img3 from "../../images/parcel/ic_Car_Feature_3.png";
import Services from "@/components/parcel/Services";
import HowItWorks from "@/components/parcel/HowItWorks";
import BodySection from "@/components/parcel/BodySection";
import BodySection2 from "@/components/parcel/BodySection2";

const page = () => {
  return (
    <div>
      <div className="parcel-bg mt-20">
        <div className="m-3 text-yellow-50 mt-40 sm:mt-0 md:m-24 opacity-100">
          <div className="text-xl md:text-2xl opacity-100">AutoLane Food</div>
          <div className="text-2xl md:text-5xl">
            On Demand Delivery at Your Doorstep
          </div>
          <div className="text-xl">
            Need to send something on an emergency basis? Parcel is what you
            need!
            <Link
              href={"/earn/cycle"}
              className="px-6 flex items-center gap-2 my-5 py-2 font-medium text-3xl  z-10 bg-yellow-300 text-black w-fit transition-all shadow-[3px_3px_0px_black] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] active:scale-95"
            >
              <RiMoneyDollarCircleFill /> Start Earning
            </Link>
          </div>
        </div>
      </div>
      <div className="mt-[100vh]">
        <Services />
        <HowItWorks />
        <div className="grid mx-auto w-[90vw] md:w-[80vw]  grid-cols-1 md:grid-cols-3 gap-24">
          <div className="">
            <Image alt="motorcycle-1" src={img1} width={1000} height={1000} />
            <div className="text-3xl py-1 mt-1 text-center font-semibold">
              On Demand Delivery
            </div>
            <div className="">
              Left your charger or keys at home? Have it delivered to you on
              Pathao Parcel, without any hassle!
            </div>
          </div>
          <div className="">
            <Image alt="motorcycle-2" src={img2} width={1000} height={1000} />
            <div className="text-3xl py-1 mt-1 text-center font-semibold">
              Trust Us
            </div>
            <div className="text-lg text-center">
              You can trust us to deliver your most confidential documents to
              the desired place absolutely intact right on time!
            </div>
          </div>
          <div className="text-lg text-center">
            <Image alt="motorcycle-3" src={img3} width={1000} height={1000} />
            <div className="text-3xl py-1 mt-1 text-center font-semibold">
              Emergency? Deliver via Parcel!
            </div>
            <div className="text-lg text-center">
              With Pathao Parcel, you can get your item in the quickest time.
              Because your emergencies are Parcel’s biggest concern!
            </div>
          </div>
        </div>
        <div className=" my-10  bg-yellow-50 ">
          <BodySection />
        </div>
        <div className=" my-10  ">
          <BodySection2 />
        </div>
      </div>
    </div>
  );
};

export default page;
