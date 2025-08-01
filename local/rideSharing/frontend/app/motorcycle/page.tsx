import React from "react";
import Link from "next/link";
import { RiMoneyDollarCircleFill } from "react-icons/ri";
import Image from "next/image";
import img1 from "../../images/bikePage/bike-feature-1.png";
import img2 from "../../images/bikePage/ic_bike_feature_2.png";
import stepIllustrate from "../../images/BikeRouting/step-illustration.png";
import img3 from "../../images/bikePage/ic_bike_feature_3.png";
import mapImage from "../../images/appRelated//mapshow2.jpg";
import google from "../../images/appdownloadicon/Google-Play-ds.png";
import apple from "../../images/appdownloadicon/App-Store-ds.png";
import { PiMotorcycleFill } from "react-icons/pi";
import manStanding from "../../images/appRelated/standing-man-holding-phone.jpeg";
import passenger from "../../images/appRelated/bike-with-passenger.jpeg";
import standMan from "../../images/appRelated/rider.jpg";
import road from "../../images/BikeRouting/road.png";
import Accordion from "../../components/car/Accordion";
import smallRoad from "../../images/BikeRouting/road-bike-mobile.png";
import pay from "../../images/BikeRouting/pay-info.png";
const page = () => {
  return (
    <div>
      <div className="bike-bg mt-20">
        <div className="m-3 mt-40 sm:mt-0 md:m-24 opacity-100">
          <div className="text-xl md:text-2xl opacity-100">
            AutoLane Motorcycle
          </div>
          <div className="text-2xl md:text-5xl">
            Beat the Traffic, Save Time
          </div>
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
        <div className="grid mx-auto w-[90vw] md:w-[80vw]  grid-cols-1 md:grid-cols-3 gap-24">
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
        <div className="md:w-[80vw] w-[90vw] items-center justify-between my-20 gap-5 grid grid-cols-1 md:grid-cols-2 mx-auto">
          <div className="md:p-14 p-3">
            <div className="flex mb-10 gap-4">
              <div className="">
                <PiMotorcycleFill className="h-20 text-yellow-500 bg-yellow-50 w-20 rounded-md border p-2" />
              </div>
              <div className="">
                <div className="md:text-2xl text-xl ">Get going with</div>
                <div className="text-2xl md:text-3xl text-yellow-400">
                  AutoLane Motorcycle
                </div>
              </div>
            </div>
            <div className="text-3xl text-sky-700">01</div>
            <div className="text-2xl md:text-3xl font-semibold">
              Download the App
            </div>
            <div className="md:my-10 my-7 text-xl">
              Pathao bikes are your fastest solution to the city’s everyday
              traffic. Download the app.
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
          <div className="md:p-14 p-3 hidden md:block md:w-[80%]">
            <Image src={mapImage} alt="map image" width={1000} height={1000} />
          </div>
        </div>
      </div>
      <div className="lg:w-[40vw]  hidden lg:block relative  md:-top-56 md:-bottom-60 mx-auto">
        <Image src={stepIllustrate} alt="map image" width={500} height={100} />
      </div>
      {/* <div className="w-[30vw]  relative lg:hidden mx-auto">
        <Image
          src={smallStepIllustrate}
          alt="map image"
          width={1000}
          height={1000}
        />
      </div> */}
      <div className="w-[80vw]  md:-mt-60  items-center justify-between  gap-5 grid grid-cols-1 md:grid-cols-2 mx-auto">
        <div className="md:p-14 p-3">
          <Image
            src={manStanding}
            alt="man standing image"
            width={400}
            height={1000}
          />
        </div>
        <div className="relative ">
          <div className="text-3xl text-sky-700">02</div>
          <div className="text-3xl font-semibold">Request your Ride</div>
          <div className="my-10 text-xl">
            Select the bike option and set your pickup & destination locations.
          </div>
        </div>
      </div>
      <div className="w-[40vw] hidden md:block relative  mx-auto">
        <Image src={road} alt="road image" width={1000} height={1000} />
      </div>
      <div className="w-[40vw]  md:hidden relative  mx-auto">
        <Image src={smallRoad} alt="road image" width={50} height={1000} />
      </div>
      <div className="w-[90vw] md:w-[80vw] p-3 items-center justify-between  gap-5 grid grid-cols-1 md:grid-cols-2 mx-auto">
        <div className="relative ">
          <div className="text-3xl text-sky-700">03</div>
          <div className="text-3xl font-semibold">Wait for Your Ride</div>
          <div className="my-10 text-xl">
            AutoLane will connect you to a nearby rider. Wait for the rider to
            arrive and start your journey.
          </div>
        </div>
        <div className="md:p-14 p-3">
          <Image src={passenger} alt="map image" width={1000} height={1000} />
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
          <div className="text-3xl font-semibold py-5">Earn with your Bike</div>
          <div className="text-xl">
            <ul className="">
              <li>Fast, Safe & Easy Income for a better lifestyle</li>
              <li>Scope to avail bonus offers</li>
              <li>Hassle free on-time Payment</li>
            </ul>
          </div>
          <Link
            href={"/app-download"}
            className="px-6  flex items-center gap-2 my-5 py-2 font-medium text-3xl  z-10 bg-yellow-300 text-black w-fit transition-all shadow-[3px_3px_0px_black] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] active:scale-95"
          >
            Learn More
          </Link>
        </div>
        <div className="p-3 md:p-14">
          <Image src={standMan} alt="map image" width={1000} height={1000} />
        </div>
      </div>
      <Accordion />
    </div>
  );
};

export default page;
