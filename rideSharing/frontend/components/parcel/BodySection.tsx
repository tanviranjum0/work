import Image from "next/image";
import React from "react";
import womenLooking from "../../images/parcel/women-looking-box.jpg";
const BodySection = () => {
  return (
    <div>
      <div className="py-20 w-[80vw] mx-auto">
        <div className="grid my-20 grid-cols-1 md:grid-cols-2 gap-10">
          <div className="p-5">
            <div className="text-4xl py-5 font-semibold">
              Currently available in Dhaka and Chattogram
            </div>
            <div className="text-xl text-gray-700">
              We are currently available in Dhaka and Chattogram. We are
              constantly expanding to more places! Parcel will cover more places
              soon.
            </div>
          </div>
          <Image
            src={womenLooking}
            alt="women looking in the box "
            height={1000}
            width={1000}
          />
        </div>
      </div>
    </div>
  );
};

export default BodySection;
