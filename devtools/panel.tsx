import React from "react";
import { createRoot } from "react-dom/client";
import { DevToolsApp } from "./DevToolsApp.tsx";

declare const __DEV__: boolean;

// Initialize hot reload if in development mode
if (__DEV__) {
  const script = document.createElement("script");
  script.src = "../devtoolsHotReload/index.js";
  script.type = "module";
  document.head.appendChild(script);
}

const container = document.getElementById("root");
if (!container) {
  throw new Error("Root element not found");
}

const root = createRoot(container);
root.render(
  <React.StrictMode>
    <DevToolsApp />
  </React.StrictMode>
); 