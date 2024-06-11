import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./App.css";
import StoreContextMain from "./components/context/StoreContextMain.jsx";
import { BrowserRouter } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <StoreContextMain>
      <App />
    </StoreContextMain>
  </BrowserRouter>
);
