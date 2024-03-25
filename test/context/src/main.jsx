import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "bootstrap/dist/css/bootstrap.min.css";
import { Provider } from "react";
import store from "./store/ContextStore";
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider value={store}>
      <App />
    </Provider>
  </React.StrictMode>
);
