import { createContext, useState } from "react";
export const StoreContext = createContext();
const StoreContextMain = ({ children }) => {
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

  const increasePain = (itemId) => {
    if (feetZone[itemId] == 3) {
      setFeetZone((prev) => ({ ...prev, [itemId]: 0 }));
    } else {
      setFeetZone((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
    }
  };

  const contextValue = {
    increasePain,
    feetZone,
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {children}
    </StoreContext.Provider>
  );
};
export default StoreContextMain;
