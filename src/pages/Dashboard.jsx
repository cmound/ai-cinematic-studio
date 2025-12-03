import React from "react";
import { useVideos } from "../context/VideoContext";

export default function Dashboard() {
  const { posted } = useVideos();

  // Ensure we always have a clean array and strip out any undefined entries
  const safePosted = Array.isArray(posted) ? posted.filter(Boolean) : [];

  return (
    <div style={{ padding: "20px", color: "white" }}>
      <h1>Video Dashboard</h1>

      {safePosted.length === 0 ? (
        <p>No posted videos yet.</p>
      ) : (
        safePosted.map((video) => {
          const previewText =
            typeof video.preview === "string"
              ? video.preview.slice(0, 160)
              : "No preview text available.";

          const timestampText = video.timestamp
            ? new Date(video.timestamp).toLocaleString()
            : "";

          return (
            <div
              key={video.id || Math.random()}
              style={{
                border: "1px solid gray",
                padding: "15px",
                borderRadius: "8px",
                marginBottom: "12px",
              }}
            >
              <h3>{video.title || "Untitled video"}</h3>
              <p>{previewText}</p>
              {timestampText && <small>{timestampText}</small>}
            </div>
          );
        })
      )}
    </div>
  );
}
