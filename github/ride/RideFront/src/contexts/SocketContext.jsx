import { createContext, useMemo } from "react";
import { io } from "socket.io-client";

export const SocketDataContext = createContext();

// Exported so the shared API client (utils/api.js) can connect/disconnect this socket
// directly on sign-in, sign-out and session refresh, without needing the React tree.
// Socket.IO cannot ride through the Vercel /api rewrite, so it connects to the API host.
export const socket = io(import.meta.env.VITE_SOCKET_URL || import.meta.env.VITE_SERVER_URL, {
  autoConnect: false,
  // A function, not an object: socket.io calls it again on every (re)connect attempt, so a
  // refreshed access token is picked up without rebuilding the socket.
  auth: (callback) => callback({ token: localStorage.getItem("token") }),
  reconnectionDelayMax: 8000,
  transports: ["websocket", "polling"],
});

// A visitor with no token should never attempt a connection the server will just reject.
try {
  if (localStorage.getItem("token")) socket.connect();
} catch {
  /* storage unavailable */
}

export default function SocketContext({ children }) {
  const value = useMemo(() => ({ socket }), []);
  return <SocketDataContext.Provider value={value}>{children}</SocketDataContext.Provider>;
}
