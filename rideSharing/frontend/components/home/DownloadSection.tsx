import Image from "next/image";
import React from "react";
import image from "../../images/bg/Download-app.jpg";
import google from "../../images/appdownloadicon/Google-Play-ds.png";
import apple from "../../images/appdownloadicon/App-Store-ds.png";
import Link from "next/link";
const DownloadSection = () => {
  return (
    <div className="grid md:grid-cols-2 w-[80vw] mx-auto gap-10">
      <div className="p-5">
        <div className="text-2xl md:text-4xl pb-2 md:pb-4">
          Download the app
        </div>
        <div className=" md:text-xl">
          Download now & avail all of our services through the app
        </div>
        <div className="">
          <div className="text-xl font-semibold mt-4 md:mt-8 py-3">
            Download AutoLane user app
          </div>
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
          <div className="text-xl font-semibold mt-4 md:mt-8 py-3">
            Download AutoLane driver app
          </div>
          <Link href={"/app-download"} className="flex gap-5">
            <Image
              className="cursor-pointer"
              alt="google play store"
              src={google}
              height={100}
              width={200}
            />
          </Link>
        </div>
      </div>
      <div className="hidden md:flex">
        <Image alt="download image" src={image} width={1000} />
      </div>
    </div>
  );
};

export default DownloadSection;
