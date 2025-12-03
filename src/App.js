import React from "react";
import { Routes, Route } from "react-router-dom";
import PromptGenerator from "./PromptGenerator";
import Dashboard from "./pages/Dashboard";
import Drafts from "./pages/Drafts";
import Navbar from "./components/Navbar";
import "./style.css";

function App() {
  return (
    <div className="container">

      <Navbar />

      <Routes>
        <Route path="/" element={<PromptGenerator />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/drafts" element={<Drafts />} />
      </Routes>

    </div>
  );
}

export default App;