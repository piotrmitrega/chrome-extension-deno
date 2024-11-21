import type { ChangeInfo } from "./types.ts";

export async function fetchChangeInfo(): Promise<ChangeInfo | null> {
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
      hasDevToolsChanges: changedFiles.includes("devtools/"),
    };
  } catch (error) {
    console.error("[HOT RELOAD] Error fetching change info:", error);
    return null;
  }
} 