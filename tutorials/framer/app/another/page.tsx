"use client";

import Link from "next/link";
import React from "react";

const page = () => {
  return (
    <div className="h-[100vh] text-2xl bg-emerald-400 w-[100vw] flex justify-center items-center">
      <ul className="flex gap-3">
        <Link href={"/about"} className="p-5 bg-fuchsia-400">
          Home
        </Link>
      </ul>
    </div>
  );
};

export default page;
