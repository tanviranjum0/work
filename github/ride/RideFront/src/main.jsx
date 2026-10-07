import { createRoot } from "react-dom/client";
import "./styles/tokens.css";
import "./styles/ui.css";
import App from "./App.jsx";
import UserContext from "./contexts/UserContext.jsx";
import CaptainContext from "./contexts/CaptainContext.jsx";
import SocketContext from "./contexts/SocketContext.jsx";
import { ToastProvider } from "./components/ui";

createRoot(document.getElementById("root")).render(
  <SocketContext>
    <UserContext>
      <CaptainContext>
        <ToastProvider>
          <App />
        </ToastProvider>
      </CaptainContext>
    </UserContext>
  </SocketContext>,
);
