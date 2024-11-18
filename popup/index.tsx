import React from "react";
import ReactDOM from "react-dom/client";
import PopupApp from "./PopupApp.tsx";

const root = ReactDOM.createRoot(document.getElementById("root")!);
root.render(
  <React.StrictMode>
    <PopupApp />
  </React.StrictMode>,
);
