import React from "react";
import background from "@/public/Nature/sky.png";
import Image from "next/image";

const HiddenImages = () => {
  return (
    <div className="object-cover  w-full h-full">
      <div
        className="m-5"
        style={{
          backgroundImage: `url(${background})`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* <Image
          className="rounded-xl shadow-2xl "
          src={skyImage}
          height={1000}
          loading="lazy"
          alt="sky image"
        />
        <div className="relative -top-[136vh]">
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Porro
          doloremque rem laboriosam nobis voluptas repudiandae modi amet
          officiis, accusantium explicabo labore temporibus recusandae ex minima
          iusto! Recusandae ex fugiat accusamus. Tempore voluptates, molestiae
          adipisci velit corporis eaque, magnam animi hic ullam accusantium quam
          fugit quidem et. Dignissimos, ullam! Accusamus eligendi exercitationem
          minima atque voluptatibus sint esse alias possimus nihil facilis
          soluta enim laboriosam consequatur, illum cumque necessitatibus at
          corporis, est officiis nostrum. Corporis minima, nemo vitae at
          deleniti officiis voluptate eaque, quia, enim sed expedita. Veniam
          dolorum quaerat esse in quidem voluptatum, ducimus vero excepturi
          nihil, error ut nobis laboriosam!
        </div> */}
      </div>
    </div>
  );
};

export default HiddenImages;
