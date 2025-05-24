import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx"; // Assuming App.jsx contains your Routes
import "./index.css";
import { BrowserRouter } from "react-router-dom"; // Import BrowserRouter

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <App /> {/* Only render your main application component here */}
    </BrowserRouter>
  </React.StrictMode>
);
