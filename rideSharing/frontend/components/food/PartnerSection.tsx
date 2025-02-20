import Link from "next/link";
import React from "react";

const PartnerSection = () => {
  return (
    <div className="w-[80vw] flex-col sm:flex-row flex mx-auto">
      <div className="px-10 my-20 sm:border-r-2">
        <div className="text-2xl md:text-4xl my-4 font-semibold">
          Got a Restaurant? Become a Partner
        </div>
        <ul className="list-disc marker::text-xl marker:text-yellow-700 ">
          <li className="px-3 text-lg md:text-xl py-2">
            Get your food featured
          </li>
          <li className="px-3 text-lg md:text-xl py-2">
            Enjoy an exposure to a huge customer base
          </li>
          <li className="px-3 text-lg md:text-xl py-2">
            Increase your sales through collaborative campaigns{" "}
          </li>
        </ul>
        <Link
          className="px-6 flex items-center gap-2 my-5 py-2 font-medium text-3xl  z-10 bg-yellow-300 text-black w-fit transition-all shadow-[3px_3px_0px_black] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] active:scale-95"
          href={"/"}
        >
          Partner with us
        </Link>
      </div>
      <div className="px-10 my-20">
        <div className="text-2xl md:text-4xl my-4 font-semibold">
          Got a Bike or a Cycle? Earn with us
        </div>
        <ul className="list-disc marker::text-xl marker:text-yellow-700 ">
          <li className="px-3 text-lg md:text-xl py-2">
            The freedom to give the service whenever you want
          </li>
          <li className="px-3 text-lg md:text-xl py-2">
            Earn extra with daily quests and special offers
          </li>
          <li className="px-3 text-lg md:text-xl py-2">
            Always get your payment right on time!
          </li>
        </ul>
        <Link
          className="px-6 flex items-center gap-2 my-5 py-2 font-medium text-3xl  z-10 bg-yellow-300 text-black w-fit transition-all shadow-[3px_3px_0px_black] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] active:scale-95"
          href={"/"}
        >
          Become a foodman
        </Link>
      </div>
    </div>
  );
};

export default PartnerSection;
