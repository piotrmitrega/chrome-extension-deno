import React from "react";
import ReactDOM from "react-dom/client";
import { ContentApp } from "./ContentApp.tsx";

export const EXTENSION_ELEMENT_ID = "chrome-extension-container";

function initContentScript() {
  console.log("Content script initialized", new Date().toISOString());

  // Remove existing container if it exists
  const existingContainer = document.getElementById(EXTENSION_ELEMENT_ID);
  if (existingContainer) {
    existingContainer.remove();
    console.log("Removed existing container");
  }

  // Create new container
  const container = document.createElement("div");
  container.id = EXTENSION_ELEMENT_ID;
  document.body.appendChild(container);
  console.log("Created new container");

  const root = ReactDOM.createRoot(container);
  root.render(
    <React.StrictMode>
      <ContentApp />
    </React.StrictMode>,
  );
  console.log("Rendered React app");
}

// Wait for DOM to be ready before injecting our content
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initContentScript);
} else {
  initContentScript();
}
