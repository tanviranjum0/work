"use client";
import Marquee from "react-fast-marquee";
import React from "react";
import Image from "next/image";
import img1 from "../../../public/MarqueImages/web1.png";
import img2 from "../../../public/MarqueImages/web2.png";
import img3 from "../../../public/MarqueImages/web3.png";
import img4 from "../../../public/MarqueImages/web4.png";
import img5 from "../../../public/MarqueImages/web5.png";
import img6 from "../../../public/MarqueImages/web6.png";
import img7 from "../../../public/MarqueImages/web7.png";
import img8 from "../../../public/MarqueImages/web8.png";
import img9 from "../../../public/MarqueImages/web9.png";
import img10 from "../../../public/MarqueImages/web10.png";
import img11 from "../../../public/MarqueImages/web11.png";

const MarqueeComponent = () => {
  return (
    <div className="flex -skew-y-6">
      <Marquee
        direction="right"
        className="marquee overflow-hidden py-4"
        autoFill={true}
        speed={20}
      >
        <Image src={img1} alt="main" height={"150"} />
      </Marquee>
      <Marquee
        direction="right"
        className="marquee overflow-hidden py-4"
        autoFill={true}
        speed={20}
      >
        <Image src={img2} alt="main" height={"150"} />
      </Marquee>
      <Marquee
        direction="right"
        className="marquee overflow-hidden py-4"
        autoFill={true}
        speed={20}
      >
        <Image src={img4} alt="main" height={"150"} />
      </Marquee>
      <Marquee
        direction="right"
        className="marquee overflow-hidden py-4"
        autoFill={true}
        speed={20}
      >
        <Image src={img5} alt="main" height={"150"} />
      </Marquee>
      <Marquee
        direction="right"
        className="marquee overflow-hidden py-4"
        autoFill={true}
        speed={20}
      >
        <Image src={img6} alt="main" height={"150"} />
      </Marquee>
      <Marquee
        direction="right"
        className="marquee overflow-hidden py-4"
        autoFill={true}
        speed={20}
      >
        <Image src={img7} alt="main" height={"150"} />
      </Marquee>
      <Marquee
        direction="right"
        className="marquee overflow-hidden py-4"
        autoFill={true}
        speed={20}
      >
        <Image src={img8} alt="main" height={"150"} />
      </Marquee>
      <Marquee
        direction="right"
        className="marquee overflow-hidden py-4"
        autoFill={true}
        speed={20}
      >
        <Image src={img9} alt="main" height={"150"} />
      </Marquee>
      <Marquee
        direction="right"
        className="marquee overflow-hidden py-4"
        autoFill={true}
        speed={20}
      >
        <Image src={img10} alt="main" height={"150"} />
      </Marquee>
      <Marquee
        direction="right"
        className="marquee overflow-hidden py-4"
        autoFill={true}
        speed={20}
      >
        <Image src={img11} alt="main" height={"150"} />
      </Marquee>
    </div>
  );
};

export default MarqueeComponent;
