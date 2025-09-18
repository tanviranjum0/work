import React from "react";
import "./Gigapp.css";
import Navbar from "./components/Navbar";
import MarqueeComponent from "./components/MarqueeComponent";
import PseudoScroll from "./components/PseudoScroll";
import MadTexts from "./components/MadTexts";

const Gigapp = () => {
  return (
    <div className="bg-[#003631] box-border  text-white">
      hello
      <Navbar />
      <MarqueeComponent />
      <PseudoScroll />
      <MadTexts />
    </div>
  );
};

export default Gigapp;
