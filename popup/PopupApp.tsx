import { useState } from "react";

export default function PopupApp() {
  const [status, setStatus] = useState<string>("");

  const handleClick = async () => {
    try {
      const response = await chrome.runtime.sendMessage({
        action: "performAction",
      });
      setStatus(`Action completed: ${response.result}`);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error
        ? error.message
        : "Unknown error";
      setStatus(`Error: ${errorMessage}`);
    }
  };

  return (
    <div>
      <button onClick={handleClick}>
        Perform Action
      </button>
      <div>{status}</div>
    </div>
  );
}
