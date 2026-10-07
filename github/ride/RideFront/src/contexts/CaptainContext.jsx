import { createContext, useContext, useMemo, useState } from "react";
import { getStoredAccount } from "../utils/api";

export const captainDataContext = createContext();

const EMPTY_CAPTAIN = {
  email: "",
  fullname: { firstname: "", lastname: "" },
  vehicle: { color: "", number: "", capacity: 0, type: "" },
  rides: [],
  status: "inactive",
};

export default function CaptainContext({ children }) {
  const stored = getStoredAccount();
  const [captain, setCaptain] = useState(stored?.type === "captain" ? stored.data : EMPTY_CAPTAIN);
  const value = useMemo(() => ({ captain, setCaptain }), [captain]);
  return <captainDataContext.Provider value={value}>{children}</captainDataContext.Provider>;
}

export const useCaptain = () => useContext(captainDataContext);
