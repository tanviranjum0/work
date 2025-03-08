import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
// import './index.css'
import App from "./App.jsx";
import Test1 from "./Test1.jsx";
import Test2 from "./Test2.jsx";
import Test4 from "./Test4.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    {/* <App /> */}
    {/* <Test1 /> */}
    <Test2 />
    {/* <Test4 /> */}
  </StrictMode>
);
