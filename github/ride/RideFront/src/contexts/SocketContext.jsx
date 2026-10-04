import { createContext, useEffect } from "react";
import { io } from "socket.io-client";
import Console from "../utils/console";

export const SocketDataContext = createContext();

// Exported so screens and the shared API client (utils/api.js) can connect/disconnect
// this socket directly — on login, logout and session refresh — without needing to be
// inside the React tree.
export const socket = io(import.meta.env.VITE_SERVER_URL, {
  autoConnect: false,
  // A function, not a plain object: socket.io calls it again on every (re)connect
  // attempt, including automatic retries, so it always sends the current token rather
  // than whatever was in localStorage when this module first loaded.
  auth: (callback) => callback({ token: localStorage.getItem("token") }),
});

// A guest with no token should never attempt a connection the server will just reject.
if (localStorage.getItem("token")) socket.connect();

function SocketContext({ children }) {
  useEffect(() => {
    socket.on("connect", () => {
      Console.log("Connected to server");
    });

    socket.on("connect_error", (error) => {
      Console.log("Socket connection rejected:", error.message);
    });

    socket.on("disconnect", () => {
      Console.log("Disconnected from server");
    });
  }, []);

  return (
    <SocketDataContext.Provider value={{ socket }}>
      {children}
    </SocketDataContext.Provider>
  );
}

export default SocketContext;
