"use client";
import React, { useEffect, useState } from "react";
import { DualRangeSlider } from "./Test5";

const Test3 = () => {
  const [leftSection, setLeftSection] = useState(false);
  const [db, setDb] = useState({
    bounce: 0,
    duration: 0,
  });
  const [sdm, setSdm] = useState({
    stiffness: 0,
    mass: 0,
    damping: 0,
    velocity: 0,
    restDelta: 0,
    restSpeed: 0,
  });
  const [widthPercentage, setWidthPercentage] = useState(25);
  useEffect(() => {
    console.log(widthPercentage);
  }, [widthPercentage]);
  return (
    <div className="h-[100vh] p-10 bg-conic from-blue-600 to-sky-400 to-50%">
      <div className="text-4xl my-3">Spring Setting</div>
      <div className="grid grid-cols-10 gap-4">
        <div className="bg-gray-300 col-span-8  h-[10rem] p-[10px] rounded-xl">
          <div className="h-[4rem] w-[4rem]  bg-radial from-pink-400 from-40% to-fuchsia-700 rounded"></div>
          <div className="flex justify-between">
            <span className="h-[4rem] my-1 w-[4rem] bg-conic/decreasing from-violet-700 via-lime-300 to-violet-700 rounded"></span>
            <span className="h-[4rem] w-[4rem] bg-linear-to-t from-red-500 to-amber-500 rounded"></span>
          </div>
        </div>
        <div className="bg-gray-600 p-[10px] h-[10rem] col-span-2 rounded-xl"></div>
      </div>
      <div className="grid grid-cols-2 gap-5">
        <div onClick={() => setLeftSection(true)} className="">
          <div className="text-3xl my-2">Duration and Bounce</div>
          <div className="border-2 p-3 rounded-2xl">
            <div className="mx-5 grid grid-cols-12 py-1.5">
              <span className="col-span-2 font-semibold">Duration</span>
              <div className="flex gap-4 col-span-10 ml-1">
                <DualRangeSlider
                  label
                  lableContenPos={"left"}
                  value={[db.duration]}
                  onValueChange={([widthPercentage]) =>
                    widthPercentage != null &&
                    setWidthPercentage(widthPercentage)
                  }
                  min={0}
                  max={3}
                  step={0.03}
                />
              </div>
            </div>
            <div className="mx-5 grid grid-cols-12 py-1.5">
              <span className="col-span-2 font-semibold">Bounce</span>
              <div className="flex gap-4 col-span-10 ml-1">
                <DualRangeSlider
                  label
                  lableContenPos={"left"}
                  value={[db.bounce]}
                  onValueChange={([bounce]) =>
                    bounce != null &&
                    setDb((prev)=>{...prev})
                  }
                  min={0}
                  max={1}
                  step={0.01}
                />
              </div>
            </div>
          </div>
        </div>
        <div onClick={() => setLeftSection(false)} className="">
          <div className="text-3xl my-2">Stiffness, Damping, Mass...</div>
          <div className="border-2 p-3 rounded-2xl">
            <div className="mx-5 grid grid-cols-12 py-1.5">
              <span className="col-span-2 font-semibold">Stiffness</span>
              <div className="flex gap-4 col-span-10 ml-2">
                <DualRangeSlider
                  label
                  lableContenPos={"left"}
                  value={[widthPercentage]}
                  onValueChange={([widthPercentage]) =>
                    widthPercentage != null &&
                    setWidthPercentage(widthPercentage)
                  }
                  min={0}
                  max={300}
                  step={3}
                />
              </div>
            </div>
            <div className="mx-5 grid grid-cols-12 py-1.5">
              <span className="col-span-2 font-semibold">Damping</span>
              <div className="flex gap-4 col-span-10 ml-2">
                <DualRangeSlider
                  label
                  lableContenPos={"left"}
                  value={[widthPercentage]}
                  onValueChange={([widthPercentage]) =>
                    widthPercentage != null &&
                    setWidthPercentage(widthPercentage)
                  }
                  min={0}
                  max={100}
                  step={1}
                />
              </div>
            </div>
            <div className="mx-5 grid grid-cols-12 py-1.5">
              <span className="col-span-2 font-semibold">Mass</span>
              <div className="flex gap-4 col-span-10 ml-2">
                <DualRangeSlider
                  label
                  lableContenPos={"left"}
                  value={[widthPercentage]}
                  onValueChange={([widthPercentage]) =>
                    widthPercentage != null &&
                    setWidthPercentage(widthPercentage)
                  }
                  min={0}
                  max={10}
                  step={0.1}
                />
              </div>
            </div>
            <div className="mx-5 grid grid-cols-12 py-1.5">
              <span className="col-span-2 font-semibold">Velocity</span>
              <div className="flex gap-4 col-span-10 ml-2">
                <DualRangeSlider
                  label
                  lableContenPos={"left"}
                  value={[widthPercentage]}
                  onValueChange={([widthPercentage]) =>
                    widthPercentage != null &&
                    setWidthPercentage(widthPercentage)
                  }
                  min={0}
                  max={50}
                  step={1}
                />
              </div>
            </div>
            <div className="mx-5 grid grid-cols-12 py-1.5">
              <span className="col-span-2 font-semibold">Rest Delta</span>
              <div className="flex gap-4 col-span-10 ml-2">
                <DualRangeSlider
                  label
                  lableContenPos={"left"}
                  value={[widthPercentage]}
                  onValueChange={([widthPercentage]) =>
                    widthPercentage != null &&
                    setWidthPercentage(widthPercentage)
                  }
                  min={0}
                  max={1}
                  step={0.01}
                />
              </div>
            </div>
            <div className="mx-5 grid grid-cols-12 py-1.5">
              <span className="col-span-2 font-semibold">Rest Speed</span>
              <div className="flex gap-4 col-span-10 ml-2">
                <DualRangeSlider
                  label
                  lableContenPos={"left"}
                  value={[widthPercentage]}
                  onValueChange={([widthPercentage]) =>
                    widthPercentage != null &&
                    setWidthPercentage(widthPercentage)
                  }
                  min={0}
                  max={1}
                  step={0.01}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Test3;
