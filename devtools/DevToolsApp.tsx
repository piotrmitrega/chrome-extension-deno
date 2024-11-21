import { useEffect, useState } from "react";
import type { Protocol } from "devtools-protocol";

export function DevToolsApp() {
  const [url, setUrl] = useState<string>();
  const [domNodeCount, setDomNodeCount] = useState<number>(0);

  useEffect(() => {
    chrome.devtools.inspectedWindow.eval(
      "window.location.href",
      (result: string | undefined, isException: boolean) => {
        if (!isException && typeof result === "string") {
          setUrl(result);
        }
      },
    );

    chrome.devtools.network.onNavigated.addListener((newUrl: string) => {
      setUrl(newUrl);
    });

    // Example of using Protocol to get DOM node count
    const getDomStats = () => {
      const tabId = chrome.devtools.inspectedWindow.tabId;
      if (!tabId) {
        console.error("No tab ID available");
        return;
      }

      chrome.debugger.attach(
        { tabId },
        "1.3",
        () => {
          chrome.debugger.sendCommand(
            { tabId },
            "DOM.getDocument",
            {},
            (root: Protocol.DOM.GetDocumentResponse) => {
              chrome.debugger.sendCommand(
                { tabId },
                "DOM.querySelectorAll",
                {
                  nodeId: root.root.nodeId,
                  selector: "*",
                },
                (response: Protocol.DOM.QuerySelectorAllResponse) => {
                  setDomNodeCount(response.nodeIds.length);
                  chrome.debugger.detach({ tabId });
                },
              );
            },
          );
        },
      );
    };

    getDomStats();
  }, []);

  return (
    <div style={{ padding: "16px", color: "black" }}>
      <h1>
        Inspecting {url}
      </h1>
      <div>
        <h2>Page Statistics:</h2>
        <p>Total DOM Nodes: {domNodeCount}</p>
      </div>
    </div>
  );
}
