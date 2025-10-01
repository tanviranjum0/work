"use client";
import React, { useEffect, useRef, useState } from "react";
import { motion, useAnimation } from "motion/react";
import { clsx } from "clsx";
// import LiquidRippleButton from "./buttons/LiquidRippleButton";
import LiquidRippleButton from "../Gigapp/components/buttons/LiquidRippleButton";

const BackgroundRipple = () => {
  return (
    <div className=" bg-slate-700">
      <div className="relative h-screen items-center inset-0 flex overflow-hidden">
        <BackgroundCellCore />
        <div className="relative m-20 w-[800px]">
          <span className="md:text-2xl w-full lg:text-5xl font-medium  bg-clip-text text-transparent  bg-gradient-to-b from-neutral-100 to-neutral-400 ">
            <span className="text-6xl"> Background cell animation</span> <br />
            with framer motions <span className="text-lime-600">.</span>
          </span>
          <div
            onClick={() => console.log("clicked")}
            className="text-2xl cursor-not-allowed flex justify-center items-center text-black h-14 bg-linear-65 from-teal-200 to-teal-400 w-[350px] my-3"
          >
            Click on the right box <span className="font-bold px-2">→</span>
          </div>
          <p className="cursor-text w-[80%] bg-clip-text text-transparent  bg-gradient-to-b from-neutral-100 to-neutral-400 text-lg p-3 leading-7">
            I've spent the last 5 years building and scaling software for some
            pretty cool companies. I also teach people to paint online (incase
            you've got an empty canvas layin' around 🎨).
          </p>
          <div className="">
            <LiquidRippleButton inText={"Let's Connect"} />
          </div>
        </div>
      </div>
    </div>
  );
};

const Pattern = ({
  className,
  cellClassName,
}: {
  className?: string;
  cellClassName?: boolean;
}) => {
  const x = new Array(47).fill(0);
  const y = new Array(30).fill(0);
  const matrix = x.map((_, i) => y.map((_, j) => [i, j]));
  const [clickedCell, setClickedCell] = useState<any>(null);

  return (
    <div
      className={clsx(
        "flex flex-row relative z-30",
        className ? "border-blue-600 relative z-[5]" : "border-neutral-700"
      )}
    >
      {matrix.map((row, rowIdx) => (
        <div
          key={`matrix-row-${rowIdx}`}
          className="flex flex-col  relative z-20 border-b"
        >
          {row.map((column, colIdx) => {
            const controls = useAnimation();

            useEffect(() => {
              if (clickedCell) {
                const distance = Math.sqrt(
                  Math.pow(clickedCell[0] - rowIdx, 2) +
                    Math.pow(clickedCell[1] - colIdx, 2)
                );
                controls.start({
                  opacity: [0, 1 - distance * 0.1, 0],
                  transition: { duration: distance * 0.2 },
                });
              }
            }, [clickedCell]);

            return (
              <div
                key={`matrix-col-${colIdx}`}
                className={clsx(
                  "flex flex-row relative z-30",
                  className
                    ? "border-blue-600 relative z-[6]"
                    : "border-neutral-700"
                )}
                onClick={() => setClickedCell([rowIdx, colIdx])}
              >
                <motion.div
                  initial={{
                    opacity: 0,
                  }}
                  whileHover={{
                    opacity: [0, 1, 0.5],
                  }}
                  transition={{
                    duration: 0.5,
                    ease: "backOut",
                  }}
                  animate={controls}
                  className="bg-[rgba(14,165,233,0.3)] h-12 w-12" //  rgba(14, 165, 233, 0.15) for a more subtle effect
                ></motion.div>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

const BackgroundCellCore = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const ref = useRef<any>(null);

  const handleMouseMove = (event: any) => {
    const rect = ref.current && ref.current.getBoundingClientRect();
    setMousePosition({
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    });
  };

  const size = 300;
  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      className="h-[500px] w-[800px] right-0 absolute cursor-cell overflow-hidden"
    >
      <div className="absolute h-full inset-y-0  overflow-hidden">
        <div className="absolute h-full w-full pointer-events-none -bottom-2 z-40 bg-slate-950 [mask-image:linear-gradient(to_bottom,transparent,black)]"></div>
        <div
          className="absolute inset-0 z-20 bg-transparent"
          style={{
            maskImage: `radial-gradient(
            ${size / 4}px circle at center,
           white, transparent
          )`,
            WebkitMaskImage: `radial-gradient(
          ${size / 4}px circle at center,
          white, transparent
        )`,
            WebkitMaskPosition: `${mousePosition.x - size / 2}px ${
              mousePosition.y - size / 2
            }px`,
            WebkitMaskSize: `${size}px`,
            maskSize: `${size}px`,
            pointerEvents: "none",
            maskRepeat: "no-repeat",
            WebkitMaskRepeat: "no-repeat",
          }}
        >
          <Pattern cellClassName={true} />
        </div>
        <Pattern className="opacity-50" cellClassName={false} />
      </div>
    </div>
  );
};

export default BackgroundRipple;
