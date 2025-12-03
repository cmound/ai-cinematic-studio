import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const VideoContext = createContext();

export function VideoProvider({ children }) {
  const [drafts, setDrafts] = useState([]);
  const [posted, setPosted] = useState([]);

  // Load saved videos from localStorage when app starts
  useEffect(() => {
    const savedDrafts = JSON.parse(
      localStorage.getItem("videoDrafts") || "[]"
    );
    const savedPosted = JSON.parse(
      localStorage.getItem("videoPosted") || "[]"
    );

    setDrafts(Array.isArray(savedDrafts) ? savedDrafts : []);
    setPosted(Array.isArray(savedPosted) ? savedPosted : []);
  }, []);

  // Save drafts automatically
  useEffect(() => {
    localStorage.setItem("videoDrafts", JSON.stringify(drafts));
  }, [drafts]);

  // Save posted videos automatically
  useEffect(() => {
    localStorage.setItem("videoPosted", JSON.stringify(posted));
  }, [posted]);

  const addDraft = (video) => {
    setDrafts((prev) => [...prev, video]);
  };

  const deleteDraft = (id) => {
    setDrafts((prev) => prev.filter((v) => v.id !== id));
  };

  const editDraft = (id, updated) => {
    setDrafts((prev) =>
      prev.map((v) => (v.id === id ? { ...v, ...updated } : v))
    );
  };

  const postVideo = (id) => {
    const video = drafts.find((v) => v.id === id);
    if (!video) return; // guard, do not add undefined

    setPosted((prev) => [...prev, video]);
    deleteDraft(id);
  };

  return (
    <VideoContext.Provider
      value={{ drafts, posted, addDraft, deleteDraft, editDraft, postVideo }}
    >
      {children}
    </VideoContext.Provider>
  );
}

export function useVideos() {
  return useContext(VideoContext);
}
