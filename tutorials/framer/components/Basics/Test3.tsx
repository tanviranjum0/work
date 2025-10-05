"use client";
import React, { useEffect, useRef, useState } from "react";
import { DualRangeSlider } from "./Test5";
import { motion, useAnimate } from "motion/react";
interface SDMTypes {
  type?: string | null;
  stiffness: number;
  mass: number;
  damping: number;
  velocity: number;
  restDelta: number;
  restSpeed: number;
}
const Test3 = () => {
  const isFirstRender = useRef<boolean>(true);
  const [scope, animate] = useAnimate();
  const [leftSection, setLeftSection] = useState<boolean>(false);
  const [alreadyAnimated, setAlreadyAnimated] = useState<boolean>(false);
  const [db, setDb] = useState<{
    bounce: number;
    duration: number;
  }>({
    bounce: 0.25,
    duration: 0.8,
  });
  const [sdm, setSdm] = useState<SDMTypes>({
    stiffness: 100,
    mass: 1,
    damping: 10,
    velocity: 0,
    restDelta: 0.01,
    restSpeed: 0.01,
  });

  // useEffect(() => {
  //   if (!leftSection) {
  //     setLeftSection(true);
  //   }
  //   if (!alreadyAnimated) {
  //     animate(
  //       "#leftRightMovingBox",
  //       { left: "calc(100% - 4rem)" },
  //       { duration: db.duration, type: "spring", bounce: db.bounce }
  //     );
  //     animate(
  //       "#scalingBox",
  //       { scale: 1 },
  //       { duration: db.duration, type: "spring", bounce: db.bounce }
  //     );
  //     animate(
  //       "#rotatingBox",
  //       { rotate: 360 },
  //       { duration: db.duration, type: "spring", bounce: db.bounce }
  //     );
  //     setAlreadyAnimated(true);
  //     return;
  //   }
  //   if (alreadyAnimated) {
  //     animate(
  //       "#leftRightMovingBox",
  //       { left: "0%" },
  //       { duration: db.duration, type: "spring", bounce: db.bounce }
  //     );
  //     animate(
  //       "#scalingBox",
  //       { scale: 0.3 },
  //       { duration: db.duration, type: "spring", bounce: db.bounce }
  //     );
  //     animate(
  //       "#rotatingBox",
  //       { rotate: 0 },
  //       { duration: db.duration, type: "spring", bounce: db.bounce }
  //     );
  //     setAlreadyAnimated(false);
  //     return;
  //   }
  //   console.log(db);
  // }, [db]);
  //Mass, Velocity, Stiffness
  useEffect(() => {
    // if (isFirstRender.current) {
    //   isFirstRender.current = false;
    //   return;
    // }
    console.log("Started");
    if (leftSection) {
      setLeftSection(false);
    }
    if (!alreadyAnimated) {
      console.log(sdm);
      // console.log("Not Already Animated");
      animate("#leftRightMovingBox", { left: "calc(100% - 4rem)" }, sdm);
      // console.log("Animated Left Right");
      animate("#scalingBox", { scale: 1 }, sdm);
      // console.log("Animated Scale Box");

      animate("#rotatingBox", { rotate: 360 }, sdm);

      // console.log("Setting Already Animated");

      setAlreadyAnimated(true);
    } else if (alreadyAnimated) {
      console.log(sdm);
      // console.log("Already Animated");

      animate("#leftRightMovingBox", { left: "0%" }, sdm);
      animate("#scalingBox", { scale: 0.3 }, sdm);
      animate("#rotatingBox", { rotate: 0 }, sdm);
      // console.log("Setting Not Animated");
      setAlreadyAnimated(false);
    }
    // console.log(sdm);
  }, [sdm]);

  return (
    <motion.div
      ref={scope}
      className="h-[100vh] p-10 bg-conic from-blue-600 to-sky-400 to-50%"
    >
      <div className="text-4xl my-3">Spring Setting</div>
      <div className="grid grid-cols-10 gap-4">
        <div className="bg-gray-300 w-full col-span-8 h-[10rem] p-[10px] rounded-xl">
          <div className="flex relative">
            <motion.div
              initial={{
                left: "0%",
              }}
              id="leftRightMovingBox"
              className="h-[4rem] relative w-[4rem] self-end  bg-radial from-pink-400 from-40% to-fuchsia-700 rounded"
            ></motion.div>
          </div>
          <div className="flex justify-between">
            <motion.span
              id="scalingBox"
              initial={{
                scale: 0,
              }}
              className="h-[4rem] my-1 w-[4rem] bg-conic/decreasing from-violet-700 via-lime-300 to-violet-700 rounded"
            ></motion.span>
            <motion.span
              initial={{
                rotate: 0,
              }}
              id="rotatingBox"
              className="h-[4rem] w-[4rem] bg-linear-to-t from-red-500 to-amber-500 rounded"
            ></motion.span>
          </div>
        </div>
        <div className="bg-gray-600 p-[10px] h-[10rem] col-span-2 rounded-xl"></div>
      </div>
      <div className="grid grid-cols-2 gap-5">
        <div onClick={() => setLeftSection(true)}>
          <div className="text-3xl my-2">Duration and Bounce</div>
          <div
            className={`border-2 p-3 ${leftSection && "border-4"} rounded-2xl`}
          >
            <div className="mx-5 grid grid-cols-12 py-1.5">
              <span className="col-span-2 font-semibold">Duration</span>
              <div className="flex gap-4 col-span-10 ml-1">
                <DualRangeSlider
                  label
                  lableContenPos={"left"}
                  value={[db.duration]}
                  onValueChange={([duration]) =>
                    setDb({
                      duration,
                      bounce: db.bounce,
                    })
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
                    setDb({
                      duration: db.duration,
                      bounce,
                    })
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
          <div
            className={`border-2 ${
              !leftSection && "border-4"
            }  p-3 rounded-2xl`}
          >
            <div className="mx-5 grid grid-cols-12 py-1.5">
              <span className="col-span-2 font-semibold">Stiffness</span>
              <div className="flex gap-4 col-span-10 ml-2">
                <DualRangeSlider
                  label
                  lableContenPos={"left"}
                  value={[sdm.stiffness]}
                  onValueChange={([stiffness]) =>
                    setSdm({
                      type: "spring",
                      stiffness,
                      mass: sdm.mass,
                      damping: sdm.damping,
                      velocity: sdm.velocity,
                      restDelta: sdm.restDelta,
                      restSpeed: sdm.restSpeed,
                    })
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
                  value={[sdm.damping]}
                  onValueChange={([damping]) =>
                    setSdm({
                      type: "spring",
                      stiffness: sdm.stiffness,
                      mass: sdm.mass,
                      damping,
                      velocity: sdm.velocity,
                      restDelta: sdm.restDelta,
                      restSpeed: sdm.restSpeed,
                    })
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
                  value={[sdm.mass]}
                  onValueChange={([mass]) =>
                    setSdm({
                      type: "spring",
                      stiffness: sdm.stiffness,
                      mass,
                      damping: sdm.damping,
                      velocity: sdm.velocity,
                      restDelta: sdm.restDelta,
                      restSpeed: sdm.restSpeed,
                    })
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
                  value={[sdm.velocity]}
                  onValueChange={([velocity]) =>
                    setSdm({
                      type: "spring",
                      stiffness: sdm.stiffness,
                      mass: sdm.mass,
                      damping: sdm.damping,
                      velocity,
                      restDelta: sdm.restDelta,
                      restSpeed: sdm.restSpeed,
                    })
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
                  value={[sdm.restDelta]}
                  onValueChange={([restDelta]) =>
                    setSdm({
                      type: "spring",
                      stiffness: sdm.stiffness,
                      mass: sdm.mass,
                      damping: sdm.damping,
                      velocity: sdm.velocity,
                      restDelta,
                      restSpeed: sdm.restSpeed,
                    })
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
                  value={[sdm.restSpeed]}
                  onValueChange={([restSpeed]) =>
                    setSdm({
                      type: "spring",
                      stiffness: sdm.stiffness,
                      mass: sdm.mass,
                      damping: sdm.damping,
                      velocity: sdm.velocity,
                      restDelta: sdm.restDelta,
                      restSpeed,
                    })
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
    </motion.div>
  );
};

export default Test3;
