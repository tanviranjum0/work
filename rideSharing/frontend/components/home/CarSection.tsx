import Image from "next/image";
import React from "react";
import mobileImage from "../../images/carInterface.png";
const CarSection = () => {
  return (
    <div className="">
      <div className="grid grid-cols-1 gap-28 md:grid-cols-2">
        <div className="flex justify-center md:items-baseline items-center flex-col text-center md:text-left">
          <div className="py-7 px-3">
            <div className="md:text-2xl text-xl font-semibold">
              Travel at Your Convenience
            </div>
            <span className="">
              Budget tight? Try Pathao Car Lite! Want to travel in AC? Use
              Pathao Car Plus!
            </span>
          </div>
          <div className="py-7 px-3">
            <div className="md:text-2xl text-xl font-semibold">
              Comfort With Affordability
            </div>
            <span>
              With Pathao’s rate, even if you choose to travel in Car Plus
              you’ll be traveling with ease and comfort that is affordable.
            </span>
          </div>
          <div className="py-7 px-3">
            <div className="md:text-2xl text-xl font-semibold">
              Hasslefree and Quick
            </div>
            <span>
              With just a few clicks on the app, you can find a car easily, in
              minutes.
            </span>
          </div>
          <div className="py-7 px-5">
            <button className="md:px-6 px-4 flex items-center py-2 font-medium md:text-3xl text-2xl z-10 bg-yellow-300 text-black w-fit transition-all shadow-[3px_3px_0px_black] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] active:scale-95">
              Learn More
            </button>
          </div>
        </div>
        <div className="px-20 hidden md:block pt-5 pb-20">
          <Image
            width={500}
            height={500}
            src={mobileImage}
            alt="Map on mobile"
          />
        </div>
      </div>
    </div>
  );
};

export default CarSection;
