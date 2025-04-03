import React from "react";
import LeftFeet from "./components/LeftFeet";
import RightFeet from "./components/RightFeet";
import LeftFootNail from "./components/foot/left/LeftFootNail"
import RightFootNail from "./components/foot/right/RightFootNail"
import Left1 from "./components/foot/left/Left1";
import Left2 from "./components/foot/left/Left2";
import Left3 from "./components/foot/left/Left3";
import Left4 from "./components/foot/left/Left4";
import Left5 from "./components/foot/left/Left5";
import Left6 from "./components/foot/left/Left6";
import Right1 from "./components/foot/right/Right1"
import Right2 from "./components/foot/right/Right2"
import Right3 from "./components/foot/right/Right3"
import Right4 from "./components/foot/right/Right4"
import Right5 from "./components/foot/right/Right5"
import Right6 from "./components/foot/right/Right6"
import JointRom from "./components/ankle/JointRom";
import HindFoot from "./components/ankle/HindFoot";
import ForeFoot from "./components/ankle/ForeFoot";
import SpecialTests from "./components/ankle/SpecialTests";
import Test from "./Test";
import NailSelection from "./components/foot/left/NailSelection";
const App = () => {
  return (
    <div className="grid ">
      <div className="flex w-[70vw] mx-auto"> <RightFeet /> <LeftFeet />
      </div>
      <div className="flex w-[70vw] mx-auto">  <LeftFootNail />
        <RightFootNail /></div>
      <div className="flex w-[70vw] mx-auto">  <NailSelection /></div>
      <div className="flex w-[70vw] mx-auto"> <Left1 />
        <Right1 /></div>
      <div className="flex w-[80vw] ">  <Left2 />
        <Right2 /></div>
      <div className="flex w-[70vw] mx-auto">  <Left3 />
        <Right3 /></div>
      <div className="flex w-[70vw] mx-auto">  <Left4 />
        <Right4 /></div>
      <div className="flex w-[70vw] mx-auto">  <Left5 />
        <Right5 /></div>
      <div className="flex w-[70vw] mx-auto">  <Left6 />
        <Right6 /></div>
      <JointRom />
      <HindFoot />
      <ForeFoot />
      <SpecialTests />
      {/* <div className="w-[70vw] mt-10 mx-auto">  <Test /></div> */}
    </div>
  );
};

export default App;
