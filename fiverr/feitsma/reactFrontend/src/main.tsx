import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

// const GOOGLE_MAPS_API = import.meta.env.VITE_GOOGLE_MAPS_API;
// console.log(GOOGLE_MAPS_API);
{
  /* Your application */
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
