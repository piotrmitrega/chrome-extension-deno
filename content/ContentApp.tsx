import React, { useEffect, useState } from "react";

const styles: Record<string, React.CSSProperties> = {
  container: {
    position: "fixed",
    top: "20px",
    right: "20px",
    padding: "10px 20px",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    color: "white",
    borderRadius: "5px",
    border: "2px solid #ff0000",
    zIndex: 9999,
    fontSize: "14px",
    fontFamily: "Arial, sans-serif",
    boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
    transition: "opacity 0.3s ease",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottom: "1px solid rgba(255, 255, 255, 0.2)",
    paddingBottom: "8px",
  },
  closeButton: {
    background: "none",
    border: "none",
    color: "white",
    cursor: "pointer",
    padding: "4px 8px",
    marginLeft: "16px",
    fontSize: "16px",
    opacity: 0.7,
    transition: "opacity 0.2s ease",
    "&:hover": {
      opacity: 1,
    },
  },
  time: {
    textAlign: "center" as const,
  },
};

export function ContentApp() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const messageListener = (message: any, _sender: any, sendResponse: any) => {
      console.log("Content script received message:", message);

      if (message.action === "modifyPage") {
        // Example: Modify the page content
        const elements = document.querySelectorAll("div");
        elements.forEach((element) => {
          element.style.color = message.color || "yellow";
        });
        sendResponse({ success: true });
      }

      return true;
    };

    chrome.runtime.onMessage.addListener(messageListener);

    return () => {
      chrome.runtime.onMessage.removeListener(messageListener);
    };
  }, []);

  if (!isVisible) {
    return null;
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <span>Deno Chrome Extension</span>
        <button
          style={styles.closeButton}
          onClick={() => setIsVisible(false)}
        >
          ×
        </button>
      </div>
      <div style={styles.time}>
        {new Date().toLocaleTimeString()}
      </div>
    </div>
  );
}
