import { useVideos } from "../context/VideoContext";

export default function Drafts() {
  const { drafts, postVideo, deleteDraft } = useVideos();

  return (
    <div style={{ padding: "20px", color: "white" }}>
      <h1>Video Drafts</h1>

      {drafts.length === 0 && <p>No drafts yet.</p>}

      {drafts.map((draft) => (
        <div
          key={draft.id}
          style={{
            padding: "10px",
            border: "1px solid gray",
            marginBottom: "10px",
            borderRadius: "8px"
          }}
        >
          <h3>{draft.title}</h3>
          <p>{draft.preview}</p>
          <small>{new Date(draft.timestamp).toLocaleString()}</small>

          <div style={{ marginTop: "10px" }}>
            <button onClick={() => postVideo(draft.id)}>Post Video</button>

            <button
              onClick={() => deleteDraft(draft.id)}
              style={{ marginLeft: "10px" }}
            >
              Delete Draft
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
