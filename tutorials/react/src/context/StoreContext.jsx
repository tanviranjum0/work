import { createContext, useState } from "react";

export const StoreContext = createContext();

const StoreContextMain = ({ children }) => {
  const [name, setName] = useState("Tanvir");
  return (
    <StoreContext.Provider value={{ name, setName }}>{children}</StoreContext.Provider>
  );
};

export default StoreContextMain;
