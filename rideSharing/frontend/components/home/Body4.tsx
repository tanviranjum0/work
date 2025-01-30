import Image from "next/image";
import image from "../../images/bg/bgnew.jpg";
import React from "react";

const Body4 = () => {
  return (
    <div className="relative ">
      <Image
        alt="background image"
        src={image}
        className="w-[100vw]"
        height={500}
        sizes="(max-width: 12000px) 100vw"
      />
    </div>
  );
};

export default Body4;
