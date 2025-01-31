import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { AppProvider } from "./context/AppContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <AppProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </AppProvider>
);

document.querySelectorAll(".my-range").forEach((slider) => {
  slider.addEventListener("input", (event) => {
    const value =
      ((event.target.value - event.target.min) /
        (event.target.max - event.target.min)) *
      100;
    event.target.style.background = `linear-gradient(to right, #51adf6 ${value}%, #e0e0e0 ${value}%)`;
  });
});
