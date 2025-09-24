import React from "react";
import "./Gigapp.css";
import Navbar from "./components/Navbar";
import MarqueeComponent from "./components/MarqueeComponent";
import PseudoScroll from "./components/PseudoScroll";
import MadTexts from "./components/MadTexts";
import ScrollAnimatedImages from "./components/ScrollAnimatedImages";
import HiddenImages from "./components/HiddenImages";
import SwipeCards from "./components/SwipeCards";

const Gigapp = () => {
  return (
    <div className="bg-[#003631] box-border  text-white">
      <Navbar />
      <MarqueeComponent />
      <PseudoScroll />
      <MadTexts />
      <ScrollAnimatedImages />
      <HiddenImages />
      <SwipeCards />
      <div className="h-[100vh] bg-amber-300"></div>
    </div>
  );
};

export default Gigapp;
