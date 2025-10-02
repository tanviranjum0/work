"use client";
import React, { useEffect, useState } from "react";
import { DualRangeSlider } from "./Test5";

export default function index() {
  const [widthPercentage, setWidthPercentage] = useState(25);
  useEffect(() => {
    console.log(widthPercentage);
  }, [widthPercentage]);
  return (
    <>
      <div className="w-3/5 mx-auto  px-10 gap-10 py-16">
        <div>
          <h1>Width</h1>
          <DualRangeSlider
            label
            lableContenPos={"left"}
            value={[widthPercentage]}
            onValueChange={([widthPercentage]) =>
              widthPercentage != null && setWidthPercentage(widthPercentage)
            }
            min={0}
            max={50}
            step={1}
          />
        </div>
      </div>
    </>
  );
}
