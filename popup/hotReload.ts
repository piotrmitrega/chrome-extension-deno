console.log("[HOT RELOAD] Initializing hot reload for popup");

// Listen for reload messages
chrome.runtime.onMessage.addListener((message: ChromeMessage) => {
  if (message.type === "POPUP_RELOAD") {
    console.log("[HOT RELOAD] Reloading popup");

    globalThis.location.reload();
  }
});
