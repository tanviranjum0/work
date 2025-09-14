"use client";
import React from "react";
import nature1 from "../../../public/Nature/nature1.jpeg";
import nature2 from "../../../public/Nature/nature2.jpeg";
import nature3 from "../../../public/Nature/nature3.jpeg";
import Image from "next/image";
const PseudoScroll = () => {
  return (
    <div className="mt-32">
      <div className="grid grid-cols-12 ">
        <div className="col-span-4 h-[90vh] flex justify-center items-center border">
          Hello
        </div>
        <div className="col-span-8 h-[90vh]  overflow-y-scroll">
          <Image src={nature1} alt="nature1" height={500} />
          <Image src={nature2} alt="nature1" height={500} />
          <Image src={nature3} alt="nature1" height={500} />
        </div>
      </div>
    </div>
  );
};

export default PseudoScroll;
