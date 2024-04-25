"use client";
import React from "react";

const page = () => {
  const handleClick = async () => {
    let data = {
      name: "Harry",
      role: "Coder",
    };
    let a = await fetch("/api/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    let res = await a.json();
    console.log(res);
  };
  return (
    <div>
      <h1 className="font-bold text-xl">Next js api Route demo</h1>
      <button onClick={handleClick}>Click ME!</button>
    </div>
  );
};

export default page;
