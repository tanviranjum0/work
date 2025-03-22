import { useState } from "react";
import { StoreContext } from "./StoreContext";

const StoreContextMain = ({ children }) => {
  const [footZone, setFootZone] = useState({
    footpath1: 0,
    footpath2: 0,
    footpath3: 0,
    footpath4a: 0,
    footpath4b: 0,
    footpath5a: 0,
    footpath5b: 0,
    footpath6: 0,
    footpath7a: 0,
    footpath7b: 0,
    footpath7c: 0,
    footpath7d: 0,
    footpath7e: 0,
    footpath7f: 0,
    footpath7g: 0,
    footpath7h: 0,
    footpath7i: 0,
    footpath7j: 0,
    footpath7k: 0,
    footpath8: 0,
    footpath9: 0,
    footpath10: 0,
    footpath10a: 0,
    footpath10b: 0,
    footpath10c: 0,
    footpath11: 0,
    footpath12: 0,
    footpath13: 0,
    footpath14: 0,
    footpath15: 0,
    footpath16: 0,
    footpath17: 0,
    footpath18: 0,
    footpath19: 0,
    footpath20a: 0,
    footpath20: 0,
    footpath20b: 0,
    footpath21: 0,
    footpath22: 0,
    footpath22a: 0,
    footpath22b: 0,
    footpath23: 0,
    footpath24: 0,
    footpath25: 0,
    unknown1: 0,
  });

  const [footNailZone, setFootNailZone] = useState({
    footNail1: 0,
    footNail2: 0,
    footNail3: 0,
    footNail4: 0,
    footNail5: 0,
  });
  const [feetZone, setFeetZone] = useState({
    feetpath1: 0,
    feetpath2: 0,
    feetpath3: 0,
    feetpath4: 0,
    feetpath5: 0,
    feetpath6: 0,
    feetpath7: 0,
    feetpath8: 0,
    feetpath9: 0,
    feetpath10: 0,
    feetpath11: 0,
    feetpath12: 0,
    feetpath13: 0,
    feetpath14: 0,
    feetpath15: 0,
    feetpath16: 0,
    feetpath17: 0,
    feetpath18: 0,
    feetpath19: 0,
    feetpath20: 0,
    feetpath21: 0,
    feetpath22: 0,
    feetpath23: 0,
    feetpath24: 0,
    feetpath25: 0,
    feetpath26: 0,
    feetpath27: 0,
    feetpath28: 0,
    feetpath29: 0,
    feetpath30: 0,
    feetpath31: 0,
    feetpath32: 0,
    feetpath33: 0,
    feetpath34: 0,
    feetpath35: 0,
  });

  const increaseFeetPain = (itemId) => {
    if (feetZone[itemId] == 3) {
      setFeetZone((prev) => ({ ...prev, [itemId]: 0 }));
    } else {
      setFeetZone((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
    }
  };
  const increaseFootPain = (itemId) => {
    if (footZone[itemId] == 3) {
      setFootZone((prev) => ({ ...prev, [itemId]: 0 }));
    } else {
      setFootZone((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
    }
  };
  const increaseNailPain = (itemId) => {
    if (footNailZone[itemId] == 3) {
      setFootNailZone((prev) => ({ ...prev, [itemId]: 0 }));
    } else {
      setFootNailZone((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
    }
  };

  const contextValue = {
    increaseFootPain,
    footZone,
    increaseFeetPain,
    increaseNailPain,
    footNailZone,
    feetZone,
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {children}
    </StoreContext.Provider>
  );
};
export default StoreContextMain;
