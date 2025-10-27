import React from "react";
import ReactDOM from "react-dom/client";
import "@/index.css";
import App from "@/App";
import { Toaster } from "@/components/ui/sonner";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
    <Toaster
      position="top-right"
      expand={true}
      richColors
      closeButton
      toastOptions={{
        style: {
          background: "rgba(0, 0, 0, 0.95)",
          backdropFilter: "blur(10px)",
          border: "2px solid #00ff41",
          boxShadow:
            "0 0 10px rgba(0, 255, 65, 0.3), 0 0 20px rgba(0, 255, 65, 0.2)",
          borderRadius: "0.25rem",
          fontFamily:
            "'JetBrains Mono', 'Share Tech Mono', 'Courier New', monospace",
          fontSize: "0.875rem",
          fontWeight: "500",
          color: "#00ff41",
        },
        className: "animate-slide-in",
      }}
    />
  </React.StrictMode>,
);
