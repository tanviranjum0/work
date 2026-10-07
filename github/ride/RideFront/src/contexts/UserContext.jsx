import { createContext, useContext, useMemo, useState } from "react";
import { getStoredAccount } from "../utils/api";

export const userDataContext = createContext();

const EMPTY_USER = { email: "", fullname: { firstname: "", lastname: "" } };

// Seeded from storage so the first paint after a reload already shows the person's name;
// ProtectedRoute then refreshes it from the server.
export default function UserContext({ children }) {
  const stored = getStoredAccount();
  const [user, setUser] = useState(stored?.type === "user" ? stored.data : EMPTY_USER);
  const value = useMemo(() => ({ user, setUser }), [user]);
  return <userDataContext.Provider value={value}>{children}</userDataContext.Provider>;
}

export const useUser = () => useContext(userDataContext);
