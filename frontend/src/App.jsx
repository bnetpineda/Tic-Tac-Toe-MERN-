// src/App.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./Home"; // Assuming Home.jsx contains your home component
import Game from "./Game";
// ... other imports

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/game" element={<Game />} />
      <Route path="*" element={<h2>Not Found</h2>} /> {/* Add this */}
    </Routes>
  );
}

export default App;
