/* eslint-disable react/prop-types */
import { createContext, useEffect, useState } from "react";

export const StoreContext = createContext(null);

const ContextContainer = ({ children }) => {
  const [userListings, setUserListings] = useState({ data: [], progress: 0 });
  const [initialListings, setInitialListings] = useState([]);
  const [initialListingsLoading, setInitialListingsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [isAlreadyLoggedIn, setIsAlreadyLoggedIn] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    const fetchInitialListings = async () => {
      setInitialListingsLoading(true);
      try {
        const response = await fetch("/api/listing/get?limit=24", { signal: controller.signal });
        if (!response.ok) throw new Error("Could not load listings");
        const data = await response.json();
        setInitialListings(Array.isArray(data) ? data : []);
      } catch (error) {
        if (error.name !== "AbortError") setInitialListings([]);
      } finally {
        if (!controller.signal.aborted) setInitialListingsLoading(false);
      }
    };

    const checkAlreadyLoggedIn = async () => {
      try {
        const response = await fetch("/api/auth/check-login", {
          credentials: "include",
          signal: controller.signal,
        });
        if (!response.ok) throw new Error("Session expired");
        const data = await response.json();
        if (data.userObject?.id) {
          const safeUser = { userObject: data.userObject, avatar: data.avatar || null };
          setCurrentUser(safeUser);
          setIsAlreadyLoggedIn(true);
        } else {
          throw new Error("No active session");
        }
      } catch (error) {
        if (error.name !== "AbortError") {
          setCurrentUser(null);
          setIsAlreadyLoggedIn(false);
        }
      } finally {
        if (!controller.signal.aborted) setAuthLoading(false);
      }
    };

    fetchInitialListings();
    checkAlreadyLoggedIn();
    return () => controller.abort();
  }, []);

  const contextValue = {
    currentUser,
    setCurrentUser,
    authLoading,
    isAlreadyLoggedIn,
    setIsAlreadyLoggedIn,
    setInitialListings,
    initialListings,
    initialListingsLoading,
    userListings,
    setUserListings,
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {children}
    </StoreContext.Provider>
  );
};

export default ContextContainer;
