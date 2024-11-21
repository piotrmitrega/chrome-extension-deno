// Create a new DevTools panel
chrome.devtools.panels.create(
  "My Deno Extension",
  "/assets/icons/icon-16.png",
  "/devtools/panel.html",
  (panel) => {
    console.log("DevTools panel created");
  }
); 