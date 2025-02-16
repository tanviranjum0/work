import React from "react";
import Link from "next/link";
import { RiMoneyDollarCircleFill } from "react-icons/ri";
import Image from "next/image";
import img1 from "../../images/carPage/ic_Car_Feature_1.png";
import img2 from "../../images/carPage/ic_Car_Feature_2.png";
import stepIllustrate from "../../images/BikeRouting/step-illustration.png";
import img3 from "../../images/carPage/ic_Car_Feature_3.png";
import mapImage from "../../images/appRelated//mapshow2.jpg";
import google from "../../images/appdownloadicon/Google-Play-ds.png";
import apple from "../../images/appdownloadicon/App-Store-ds.png";
import womenUsingPhone from "../../images/carPage/smiling-women-in-car.jpg";
import passenger from "../../images/carPage/passenger-in-car.jpeg";
import standMan from "../../images/appRelated/rider.jpg";
import road from "../../images/BikeRouting/road.png";
import { FaCar } from "react-icons/fa";
import smallRoad from "../../images/BikeRouting/road-bike-mobile.png";
import pay from "../../images/BikeRouting/pay-info.png";
import Options from "@/components/car/Options";
const page = () => {
  return (
    <div>
      <div className="car-bg mt-20">
        <div className="m-3 mt-40 sm:mt-0 md:m-24 opacity-100">
          <div className="text-xl md:text-2xl opacity-100">AutoLane Car</div>
          <div className="text-2xl md:text-5xl">
            Travel in comfort, at your Convenience
          </div>
          <div className="text-xl">
            Want a comfortable ride home from work? AutoLane cars have you
            covered!
            <Link
              href={"/earn/car"}
              className="px-6 flex items-center gap-2 my-5 py-2 font-medium text-3xl  z-10 bg-yellow-300 text-black w-fit transition-all shadow-[3px_3px_0px_black] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] active:scale-95"
            >
              <RiMoneyDollarCircleFill /> Earn with your car
            </Link>
          </div>
        </div>
      </div>
      <div className="mt-[100vh]">
        <Options />
        <div className="grid mx-auto w-[90vw] md:w-[80vw]  grid-cols-1 md:grid-cols-3 gap-24">
          <div className="">
            <Image alt="motorcycle-1" src={img1} width={1000} height={1000} />
            <div className="text-3xl py-1 mt-1 text-center font-semibold">
              Travel at Your Convenience
            </div>
            <div className="">
              Ride-sharing, but budget is tight? Try AutoLane Car Lite! Want to
              travel in extra comfort? Use AutoLane Car Plus!
            </div>
          </div>
          <div className="">
            <Image alt="motorcycle-2" src={img2} width={1000} height={1000} />
            <div className="text-3xl py-1 mt-1 text-center font-semibold">
              Comfort With Affordability
            </div>
            <div className="text-lg text-center">
              With AutoLane’s competitive rates, even when you ride-share with
              Car Plus you’ll be travelling with ease and comfort that is
              affordable.
            </div>
          </div>
          <div className="text-lg text-center">
            <Image alt="motorcycle-3" src={img3} width={1000} height={1000} />
            <div className="text-3xl py-1 mt-1 text-center font-semibold">
              Hasslefree and Quick
            </div>
            <div className="text-lg text-center">
              With just a few clicks on the app, you can find a car quickly and
              start ride-sharing.
            </div>
          </div>
        </div>
        <div className="md:w-[80vw] w-[90vw] items-center justify-between my-20 gap-5 grid grid-cols-1 md:grid-cols-2 mx-auto">
          <div className="p-14 hidden md:block ">
            <Image src={mapImage} alt="map image" width={250} height={300} />
          </div>
          <div className="md:p-14 p-3">
            <div className="flex mb-10 gap-4">
              <div className="">
                <FaCar className="h-20 text-yellow-500 bg-yellow-50 w-20 rounded-md border p-2" />
              </div>
              <div className="">
                <div className="md:text-2xl text-xl ">Get going with</div>
                <div className="text-2xl md:text-3xl text-yellow-400">
                  AutoLane Car
                </div>
              </div>
            </div>
            <div className="text-3xl text-sky-700">01</div>
            <div className="text-2xl md:text-3xl font-semibold">
              Download the App
            </div>
            <div className="md:my-10 my-7 text-xl">
              AutoLane cars serve according to your need. Download the app and
              select Car option.
            </div>
            <div className="flex h-12">
              <Link href={"/app-download"} className="flex gap-2 md:gap-5">
                <Image
                  alt="google play store"
                  src={google}
                  height={100}
                  width={200}
                  className="cursor-pointer"
                />
                <Image
                  className="cursor-pointer"
                  height={100}
                  alt="app store"
                  src={apple}
                  width={200}
                />
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className="lg:w-[40vw] -scale-x-100 hidden lg:block relative  md:-top-56 md:-bottom-60 mx-auto">
        <Image src={stepIllustrate} alt="map image" width={500} height={100} />
      </div>

      <div className="w-[80vw]  md:-mt-60  items-center justify-between  gap-5 grid grid-cols-1 md:grid-cols-2 mx-auto">
        <div className="relative ">
          <div className="text-3xl text-sky-700">02</div>
          <div className="text-3xl font-semibold">Request your Ride</div>
          <div className="my-10 text-xl">
            Set your pickup and destination locations. Select Car Lite or Car
            Plus.
          </div>
        </div>
        <div className="md:p-14 p-3">
          <Image
            src={womenUsingPhone}
            alt="man standing image"
            width={400}
            height={1000}
          />
        </div>
      </div>
      <div className="w-[40vw] -scale-x-100 hidden md:block relative  mx-auto">
        <Image src={road} alt="road image" width={1000} height={1000} />
      </div>
      <div className="w-[40vw] -scale-x-100 md:hidden relative  mx-auto">
        <Image src={smallRoad} alt="road image" width={50} height={1000} />
      </div>
      <div className="w-[90vw] md:w-[80vw] p-3 items-center justify-between  gap-5 grid grid-cols-1 md:grid-cols-2 mx-auto">
        <div className="md:p-14 p-3">
          <Image src={passenger} alt="map image" width={1000} height={1000} />
        </div>
        <div className="relative ">
          <div className="text-3xl text-sky-700">03</div>
          <div className="text-3xl font-semibold">Start your Ride</div>
          <div className="my-10 text-xl">
            AutoLane will connect you to a nearby captain. Wait for your Car to
            arrive and start your ride.
          </div>
        </div>
      </div>
      <div className="w-[75vw] mx-auto border-b-2 my-5"></div>
      <div className="w-[80vw] items-center justify-between gap-5 grid grid-cols-1 md:grid-cols-2 mx-auto">
        <div className="md:p-14 p-3">
          <div className="text-3xl font-semibold py-5">
            Pay Cashless for your Ride
          </div>
          <div className="text-xl">
            Enjoy hassle-free payment with the option to pay with your card,
            Digital pay or PayPal.
          </div>
        </div>
        <div className="p-3 md:p-14">
          <Image src={pay} alt="map image" width={1000} height={1000} />
        </div>
      </div>
      <div className="w-[75vw] mx-auto border-b-2 my-5"></div>
      <div className="w-[80vw] items-center justify-between gap-5 grid grid-cols-1 md:grid-cols-2 mx-auto">
        <div className="p-3 md:p-14">
          <div className="text-3xl font-semibold py-5">Earn with your Car</div>
          <div className="text-xl">
            <ul className="list-disc">
              <li>More solvency with a safe & secure income</li>
              <li>Exciting Bonus offers are given regularly</li>
              <li>Hassle-free On-time payment</li>
            </ul>
          </div>
          <Link
            href={"/earn/car"}
            className="px-6  flex items-center gap-2 my-5 py-2 font-medium text-3xl  z-10 bg-yellow-300 text-black w-fit transition-all shadow-[3px_3px_0px_black] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] active:scale-95"
          >
            Learn More
          </Link>
        </div>
        <div className="p-3 md:p-14">
          <Image
            src={standMan}
            alt="Standing man image"
            width={1000}
            height={1000}
          />
        </div>
      </div>
    </div>
  );
};

export default page;
