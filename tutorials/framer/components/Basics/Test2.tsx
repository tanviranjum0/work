"use client";
import React from "react";

const Test2 = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="rounded-xl flex items-center justify-center h-36 w-96 bg-[#e2edff]">
        Hello
      </div>
      <div
        className="h-2"
        style={{
          backgroundImage: `url(${"+data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='19' ry='19' stroke='%23333' stroke-width='4' stroke-dasharray='6%2c 14' stroke-dashoffset='13' stroke-linecap='round'/%3e%3c/svg%3e+"})`,
          borderRadius: "19px",
        }}
      ></div>

      <div className="rounded-xl flex items-center justify-center h-36 w-96 bg-[#e2edff]">
        Hello2
      </div>
    </div>
  );
};

export default Test2;
