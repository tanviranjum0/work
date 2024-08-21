import { createContext, useState } from "react";
export const StoreContext = createContext(null);
const StoreContextMain = ({ children }) => {
  const [zone, setZone] = useState({
    id1: 0,
    id2: 0,
    id3: 0,
    id4: 0,
    id5: 0,
    id6: 0,
    id7: 0,
    id8: 0,
    id9: 0,
    id10: 0,
    id11: 0,
    id12: 0,
    id13: 0,
    id14: 0,
    id15: 0,
    id16: 0,
    id17: 0,
    id18: 0,
    id19: 0,
    id20: 0,
    id21: 0,
    id22: 0,
    id23: 0,
    id24: 0,
    id25: 0,
  });

  // else if (!zone[itemId]) {
  //   setZone((prev) => ({ ...prev, [itemId]: 1 }));
  // }
  const increasePain = (itemId) => {
    if (zone[itemId] == 3) {
      setZone((prev) => ({ ...prev, [itemId]: 0 }));
    } else {
      setZone((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
    }
  };

  const contextValue = {
    increasePain,
    zone,
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {children}
    </StoreContext.Provider>
  );
};
export default StoreContextMain;
