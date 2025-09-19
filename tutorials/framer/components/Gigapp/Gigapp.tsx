import React from "react";
import "./Gigapp.css";
import Navbar from "./components/Navbar";
import MarqueeComponent from "./components/MarqueeComponent";
import PseudoScroll from "./components/PseudoScroll";
import MadTexts from "./components/MadTexts";
import ScrollAnimatedImages from "./components/ScrollAnimatedImages";

const Gigapp = () => {
  return (
    <div className="bg-[#003631] box-border  text-white">
      <Navbar />
      <MarqueeComponent />
      <PseudoScroll />
      <MadTexts />
      <ScrollAnimatedImages />
    </div>
  );
};

export default Gigapp;
