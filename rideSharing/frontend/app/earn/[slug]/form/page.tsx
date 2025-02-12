"use client";
import { FormContext } from "@/components/context/FormContext";
import React, { useContext } from "react";

const app = () => {
  const { data, setData } = useContext(FormContext);
  return (
    <div className="bg-yellow-50">
      <div className="w-[50vw] pt-20 rounded-md border mx-auto">
        <div className="h-14 bg-gray-200 p-2 font-semibold text-2xl">
          01 Personal Information
        </div>
        <div className="p-1">
          <div className="flex w-full gap-4">
            <div className="flex  w-full flex-col">
              <label
                className="text-semibold  w-full text-md pb-1"
                htmlFor="First Name:*"
              >
                First Name*
              </label>
              <input type="text" className="  w-full rounded" />
            </div>
            <div className="flex  w-full flex-col">
              <label
                className="text-semibold  w-full text-md pb-1"
                htmlFor="Last Name:*"
              >
                Last Name
              </label>
              <input type="text" className="  w-full rounded" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default app;
