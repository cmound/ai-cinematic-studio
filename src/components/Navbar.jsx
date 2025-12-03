import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav style={{
      display: "flex",
      gap: "20px",
      padding: "15px 0",
      borderBottom: "1px solid gray",
      marginBottom: "20px"
    }}>
      <Link to="/" style={{ color: "white" }}>Prompt Generator</Link>
      <Link to="/drafts" style={{ color: "white" }}>Video Drafts</Link>
      <Link to="/dashboard" style={{ color: "white" }}>Video Dashboard</Link>
    </nav>
  );
}
