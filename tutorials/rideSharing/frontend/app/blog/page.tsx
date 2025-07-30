import Image from "next/image";
import React from "react";
import title from "../../images/blog/blog-title.png";
import firstBlog from "../../images/blog/food-delivery.jpeg";
const page = () => {
  return (
    <div>
      <div className="w-[80vw] text-center mx-auto">
        <div className="my-10 border-b-2 justify-between flex">
          <div className="p-4">
            <div className="text-3xl font-semibold">AutoLane Blog</div>
            <div className="text-xl text-gray-700">
              Announcements, updates, releases, and more
            </div>
          </div>
          <Image src={title} height={180} width={250} alt="blog title image" />
        </div>
        <div className="grid  gap-5 grid-cols-2">
          <div className="p-5 shadow border bg-yellow-50">
            <Image
              src={firstBlog}
              height={1000}
              width={1000}
              alt="first blog image"
            />
            <div className="flex items-center gap-3 font-semibold py-8">
              <div className="text-sm">AutoLane Food</div>
              <div className="h-1 w-1 bg-black rounded-full"></div>
              <div className="text-sm">September 9, 2024</div>
            </div>
            <div className="text-2xl p-3">
              How to Save Money on Your Next Pathao Food Order!
            </div>
          </div>
          <div>
            <div className="flex flex-col gap-5 my-5 shadow">
              <div className="grid bg-yellow-50 p-3 grid-cols-3">
                <div className="col-span-2">
                  <div className="flex items-center gap-3 font-semibold py-5">
                    <div className="text-sm">AutoLane Food</div>
                    <div className="h-1 w-1 bg-black rounded-full"></div>
                    <div className="text-sm">September 9, 2024</div>
                  </div>
                  <div className="text-3xl">Courier Tracking Is Here!</div>
                </div>
                <Image
                  src={firstBlog}
                  height={1000}
                  width={1000}
                  alt="first blog image"
                />
              </div>
            </div>
            <div className="flex flex-col gap-5 my-5 shadow">
              <div className="grid bg-yellow-50 p-3 grid-cols-3">
                <div className="col-span-2">
                  <div className="flex items-center gap-3 font-semibold py-5">
                    <div className="text-sm">AutoLane Food</div>
                    <div className="h-1 w-1 bg-black rounded-full"></div>
                    <div className="text-sm">September 9, 2024</div>
                  </div>
                  <div className="text-3xl">Courier Tracking Is Here!</div>
                </div>
                <Image
                  src={firstBlog}
                  height={1000}
                  width={1000}
                  alt="first blog image"
                />
              </div>
            </div>
            <div className="flex flex-col gap-5 my-5 shadow">
              <div className="grid bg-yellow-50 p-3 grid-cols-3">
                <div className="col-span-2">
                  <div className="flex items-center gap-3 font-semibold py-5">
                    <div className="text-sm">AutoLane Food</div>
                    <div className="h-1 w-1 bg-black rounded-full"></div>
                    <div className="text-sm">September 9, 2024</div>
                  </div>
                  <div className="text-3xl">Courier Tracking Is Here!</div>
                </div>
                <Image
                  src={firstBlog}
                  height={1000}
                  width={1000}
                  alt="first blog image"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
