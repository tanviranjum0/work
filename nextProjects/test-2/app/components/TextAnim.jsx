// import React from "react";
"use client";
import { TypeAnimation } from "react-type-animation";
const TextAnim = () => {
  return (
    <div>
      <TypeAnimation
        sequence={[
          "Tanvir Anjum!!",
          1000,
          "Web Developer!",
          1000,
          "Mobile Developer!",
          1000,
          "UI/UX Designer!",
          1000,
        ]}
        wrapper="span"
        speed={30}
        repeat={Infinity}
      />
    </div>
  );
};

export default TextAnim;
