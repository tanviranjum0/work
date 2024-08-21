import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./App.css";
import StoreContextMain from "./context/StoreContextMain";
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <StoreContextMain>
      <App />
    </StoreContextMain>
  </React.StrictMode>
);
