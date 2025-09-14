import React from "react";
import "./Gigapp.css";
import Navbar from "./components/Navbar";
import MarqueeComponent from "./components/MarqueeComponent";
import PseudoScroll from "./components/PseudoScroll";

const Gigapp = () => {
  return (
    <div className="bg-[#003631] overflow-x-hidden scroll-smooth h-screen w-screen  text-white">
      <Navbar />
      <MarqueeComponent />
      <PseudoScroll />
    </div>
  );
};

export default Gigapp;
