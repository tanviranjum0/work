import Image from "next/image";
import React from "react";
import img1 from "../../images/foodPage/Res_logo_2.png";
import img2 from "../../images/foodPage/Res_logo_3.png";
import img3 from "../../images/foodPage/Res_logo_4.png";
import img4 from "../../images/foodPage/Res_logo_9.png";
import img5 from "../../images/foodPage/Res_logo_10.png";
import img6 from "../../images/foodPage/Res_logo_12.png";

const TopPartners = () => {
  return (
    <div className="w-[80vw]">
      <div className="text-4xl text-center my-5">Some of our top partners</div>
      <div className="grid md:grid-cols-6 sm:grid-cols-3 grid-cols-2 my-10">
        <Image
          alt="partener logo"
          className="p-2"
          src={img1}
          height={1000}
          width={1000}
        />
        <Image
          alt="partener logo"
          className="p-2"
          src={img2}
          height={1000}
          width={1000}
        />
        <Image
          alt="partener logo"
          className="p-2"
          src={img3}
          height={1000}
          width={1000}
        />
        <Image
          alt="partener logo"
          className="p-2"
          src={img4}
          height={1000}
          width={1000}
        />
        <Image
          alt="partener logo"
          className="p-2"
          src={img5}
          height={1000}
          width={1000}
        />
        <Image
          alt="partener logo"
          className="p-2"
          src={img6}
          height={1000}
          width={1000}
        />
      </div>
    </div>
  );
};

export default TopPartners;
