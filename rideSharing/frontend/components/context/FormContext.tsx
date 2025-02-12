"use client";
import React, { createContext, useState } from "react";
import { data } from "@/@types.context";
export const FormContext = createContext(null);

const FormContextMain: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [data, setData] = useState<data>({
    vehicle: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    bikeRider: false,
    foodDelivery: false,
    parcelDelivary: false,
    autoLaneCar: false,
    state: "",
    terms: false,
  });

  const contextValue = {
    data,
    setData,
  };

  return (
    <FormContext.Provider value={contextValue}>{children}</FormContext.Provider>
  );
};
export default FormContextMain;
