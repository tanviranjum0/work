import Image from "next/image";
import React from "react";
import apple from "../../images/appdownloadicon/App-Store-ds.png";
import google from "../../images/appdownloadicon/Google-Play-ds.png";
import manStanding from "../../images/appRelated/man-standing.jpg";
import manInCar from "../../images/appRelated/man-in-car.jpeg";

const page = () => {
  return (
    <div className="w-[80vw] mx-auto py-20">
      <div className="text-5xl font-semibold text-center ">
        Download The AutoLane App
      </div>
      <div className="grid grid-cols-1 justify-around items-center md:grid-cols-2 gap-20 md:flex-row p-5">
        <div className="rounded-2xl shadow-2xl flex-col border flex justify-center items-center">
          <Image src={manStanding} alt="man standing" width={5000} />
          <div className="p-6">
            <div className="text-2xl py-2 font-semibold text-center">
              User App
            </div>
            <div className="flex cursor-pointer gap-4">
              <Image alt="google-play-store" src={apple} width={120} />
              <Image alt="apple-app-store" src={google} width={120} />
            </div>
          </div>
        </div>
        <div className="rounded-2xl shadow-xl border flex-col flex justify-center items-center">
          <Image src={manInCar} alt="man standing" width={5000} />
          <div className="p-6">
            <div className="text-2xl font-semibold py-2">Driver App</div>
            <div className="flex cursor-pointer gap-4">
              <Image alt="google-play-store" src={apple} width={120} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
