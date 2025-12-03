import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { VideoProvider } from "./context/VideoContext";
import "./index.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter basename="/ai-cinematic-studio">
    <VideoProvider>
      <App />
    </VideoProvider>
  </BrowserRouter>
);
