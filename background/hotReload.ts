/**
 * Content script definition from the manifest.json file
 */
interface ContentScript {
  matches: string[];
  js: string[];
}

/**
 * Parsed change info from the reload-signal.js file
 */
interface ChangeInfo {
  hasBackgroundChanges: boolean;
  hasContentChanges: boolean;
  hasPopupChanges: boolean;
  timestamp: number;
}

let lastReloadTime = Date.now();
let isInitialized = false;

/**
 * Entrypoint for the hot reload logic
 */
export function initializeHotReload() {
  if (isInitialized) {
    console.warn("[HOT RELOAD] Already initialized");
    return;
  }

  console.log("[HOT RELOAD] Initializing...");

  chrome.action.setBadgeText({ text: "" });

  // This is used to reload content scripts when the extension is updated.
  // As content script needs full extension reload, it restarts the worker service.
  // That's why we need to reload the content scripts here.
  chrome.runtime.onInstalled.addListener(async () => {
    const changes = await fetchChangeInfo();
    if (changes?.hasContentChanges) {
      await reloadContentScripts();
    }
  });

  setInterval(checkForChanges, 1000);
  isInitialized = true;
}

/**
 * Checks for changes in the extension and performs a reload if needed
 */
async function checkForChanges() {
  const changes = await fetchChangeInfo();
  if (changes) {
    await handleChanges(changes);
  }
}

/**
 * Fetches the change info from the reload-signal.js file.
 * This file is injected into the extension by the build process and contains list of changed files.
 */
async function fetchChangeInfo(): Promise<ChangeInfo | null> {
  try {
    const response = await fetch(chrome.runtime.getURL("reload-signal.js"));
    const content = await response.text();

    const matches = content.match(/\/\/ (\d+) \[(.*?)\]/);
    if (!matches) return null;

    const [, timestamp, changedFiles] = matches;
    return {
      timestamp: parseInt(timestamp),
      hasBackgroundChanges: changedFiles.includes("background/"),
      hasContentChanges: changedFiles.includes("content/"),
      hasPopupChanges: changedFiles.includes("popup/"),
    };
  } catch (error) {
    console.error("[HOT RELOAD] Error fetching change info:", error);
    return null;
  }
}

/**
 * Handles the hot reload logic
 */
async function handleChanges(changes: ChangeInfo) {
  if (changes.timestamp <= lastReloadTime) {
    return;
  }

  console.log("[HOT RELOAD] Processing changes:", changes);

  lastReloadTime = changes.timestamp;

  if (changes.hasBackgroundChanges || changes.hasContentChanges) {
    await showReloadIndicator("↻");
    // For both background and content changes, we reload the extension
    // Content script reloading will be handled by onInstalled listener
    chrome.runtime.reload();
  } else {
    await showReloadIndicator("✓");
    if (changes.hasPopupChanges) {
      await reloadPopup();
    }
  }
}

/**
 * Reloads the content scripts in tabs that match the patterns defined in the manifest.json file
 */
async function reloadContentScripts() {
  const matches = await getContentScriptMatches();

  console.log("[HOT RELOAD] Content script matches:", matches);

  for (const pattern of matches) {
    const tabs = await chrome.tabs.query({ url: pattern });
    console.log(
      `[HOT RELOAD] Found ${tabs.length} tabs matching pattern: ${pattern}`,
    );

    for (const tab of tabs) {
      if (tab.id) {
        chrome.tabs.reload(tab.id);
      }
    }
  }
}

/**
 * Gets the content script matches from the manifest.json file
 */
async function getContentScriptMatches(): Promise<string[]> {
  try {
    const manifestResponse = await fetch(
      chrome.runtime.getURL("manifest.json"),
    );
    const manifest = await manifestResponse.json();

    const allMatches: string[] = manifest.content_scripts?.map(
      (script: ContentScript) => script.matches,
    ).flat() || [];

    return [...new Set(allMatches)];
  } catch (error) {
    console.error("[HOT RELOAD] Error reading manifest:", error);
    return [];
  }
}

/**
 * Shows the reload indicator as a badge on the extension icon
 */
const showReloadIndicator = async (text: string) => {
  await chrome.action.setBadgeText({ text });
  await chrome.action.setBadgeBackgroundColor({ color: "#4CAF50" });
};

/**
 * Sends a message to the popup to reload it
 */
const reloadPopup = () => {
  chrome.runtime.sendMessage({
    type: "POPUP_RELOAD",
    timestamp: Date.now(),
  });
};
