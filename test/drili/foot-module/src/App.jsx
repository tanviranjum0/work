import React from "react";
import "./App.css";
import Test from "./componets/Test";
import Left1 from "./componets/Left1";
import Left2 from "./componets/Left2";
import Left4 from "./componets/Left4";
import Left5 from "./componets/Left5";
import Left6 from "./componets/Left6";
import Left3 from "./componets/Left3";

import Right2 from "./componets/Right2";
import Right1 from "./componets/Right1";
import Right4 from "./componets/Right4";
import Right5 from "./componets/Right5";
import Right6 from "./componets/Right6";
import Right3 from "./componets/Right3";

const App = () => {
  return (
    <>
      <div className="flex flex-col">
        <div className="text-4xl text-center">Left Foot </div>
        <div className="grid">
          <Left1 />
          <Left2 />
          <Left3 />
          <Left4 />
          <Left5 />
          <Left6 />
        </div>
        <div className="text-4xl text-center">Right Foot </div>
        <div className="grid">
          <Right1 />
          <Right2 />
          <Right3 />
          <Right4 />
          <Right5 />
          <Right6 />
        </div>
      </div>
    </>
  );
};

export default App;
