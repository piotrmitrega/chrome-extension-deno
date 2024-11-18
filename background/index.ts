import { initializeHotReload } from "./hotReload.ts";

// Check if we're in development mode using the injected value
declare const __DEV__: boolean;

// Background script runs in the extension's background context
console.log("Background script loaded, dev mode:", __DEV__);

// Initialize hot reload in development mode
if (__DEV__) {
    console.log(
        "[HOT RELOAD] Development mode detected, initializing hot reload...",
    );
    initializeHotReload();
}

// Listen for messages from popup or content scripts
chrome.runtime.onMessage.addListener((
    message,
    _sender,
    sendResponse,
) => {
    console.log("Background script received message:", message);

    if (message.action === "performAction") {
        // Example: Send a message to the active tab
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            const activeTab = tabs[0];
            if (activeTab?.id) {
                chrome.tabs.sendMessage(
                    activeTab.id,
                    { action: "modifyPage", color: "#ff0000" },
                );
            }
        });
        sendResponse({ result: "success" });
    }
    return true; // Keep the message channel open for async responses
});
