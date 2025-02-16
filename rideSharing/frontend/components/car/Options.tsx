"use client";

import React, { useState } from "react";

const Options = () => {
  const [selectedOption, setSelectedOption] = useState("basic");
  return (
    <div>
      <div className="text-2xl">Cars for everyone</div>
      <div className="flex">
        <div
          onClick={() => setSelectedOption("basic")}
          className="h-28 w-28 border rounded"
        ></div>
        <div
          onClick={() => setSelectedOption("plus")}
          className="h-28 w-28 border rounded"
        ></div>
        <div
          onClick={() => setSelectedOption("advance")}
          className="h-28 w-28 border rounded"
        ></div>
      </div>
    </div>
  );
};

export default Options;
