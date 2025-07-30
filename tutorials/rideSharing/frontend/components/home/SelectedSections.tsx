import React from "react";
import CarSection from "./CarSection";
import BikeSection from "./BikeSection";
import DeliverySection from "./DeliverySection";

const SelectedSections = ({ selection }: { selection: string }) => {
  if (selection === "car") {
    return <CarSection />;
  } else if (selection === "motorcycle") {
    return <BikeSection />;
  } else if (selection === "delivery") {
    return <DeliverySection />;
  }
};

export default SelectedSections;
