import React, { useState } from "react";

const visualStyles = [
  "Hyper Realistic",
  "Cinematic",
  "POV",
  "Vintage",
  "Anime",
  "Commercial",
  "Black & White"
];

const moods = [
  "Action Thriller",
  "Adventure/Epic",
  "Character-Focused",
  "Comedy",
  "Dark/Suspenseful",
  "Dramatic",
  "Romantic Comedy",
  "Documentary",
  "Music Video",
  "Satire"
];

const cameraMovements = [
  "Stable Shot",
  "Dolly Shot",
  "Tracking Shot",
  "Crane Shot",
  "Handheld",
  "Aerial Drone",
  "Orbit Shot",
  "Push In",
  "Pull Back",
  "Steadicam Follow"
];

const timesOfDay = [
  "Morning",
  "Noon",
  "Night",
  "Natural Sunlight",
  "Golden Hour",
  "Blue Hour",
  "Window Light",
  "Studio Key Light",
  "Neon Lighting",
  "Candlelight",
  "Firelight",
  "LED Panels"
];

const contentTypes = [
  "Horror",
  "War/Combat Realism",
  "Surreal/Abstract Imagery",
  "Hyper Realistic",
  "Mature Audience Only",
  "Intense Themes"
];

const outputFormats = ["Short Format", "Standard", "Extended Cut"];
const durations = ["15s", "30s", "45s", "60s"];
const defaultNegatives = ["blurry", "low res", "jpeg artifacts", "distorted", "worst quality"];

function PromptGenerator() {
  const [sceneDescription, setSceneDescription] = useState("");
  const [visualStyle, setVisualStyle] = useState("");
  const [mood, setMood] = useState("");
  const [cameraMovement, setCameraMovement] = useState("");
  const [timeOfDay, setTimeOfDay] = useState("");
  const [contentType, setContentType] = useState("");
  const [outputFormat, setOutputFormat] = useState("");
  const [duration, setDuration] = useState("");
  const [negatives, setNegatives] = useState([...defaultNegatives]);
  const [customNegatives, setCustomNegatives] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [generatedPrompt, setGeneratedPrompt] = useState("");
  const [buttonText, setButtonText] = useState("Generate Prompt");

  const charCount = sceneDescription.length;

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  const handleNegativeChange = (e) => {
    const value = e.target.value;
    setNegatives((prev) =>
      prev.includes(value) ? prev.filter((n) => n !== value) : [...prev, value]
    );
  };

  const handleGeneratePrompt = () => {
    let promptParts = [];
    if (sceneDescription) promptParts.push(sceneDescription.trim());
    if (visualStyle) promptParts.push(`Visual Style: ${visualStyle}`);
    if (mood) promptParts.push(`Mood: ${mood}`);
    if (cameraMovement) promptParts.push(`Camera Movement: ${cameraMovement}`);
    if (timeOfDay) promptParts.push(`Time of Day: ${timeOfDay}`);
    if (contentType) promptParts.push(`Content Type: ${contentType}`);
    if (outputFormat) promptParts.push(`Output Format: ${outputFormat}`);
    if (duration) promptParts.push(`Duration: ${duration}`);
    if (image) promptParts.push(`Image uploaded: ${image.name}`);
    let allNegatives = [...negatives];
    if (customNegatives.trim()) allNegatives.push(customNegatives.trim());
    if (allNegatives.length) promptParts.push(`--negative: ${allNegatives.join(", ")}`);
    const finalPrompt = promptParts.join("\n");
    setGeneratedPrompt(finalPrompt);
    setButtonText("Generated!");
    setTimeout(() => setButtonText("Generate Prompt"), 1500);
  };

  const handleCopyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(generatedPrompt);
    } catch {
      alert("Copy failed.");
    }
  };

  return (
    <div className="prompt-generator">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleGeneratePrompt();
        }}
        aria-label="Prompt Generator Form"
      >
        <label htmlFor="sceneDescription">
          Scene Description
          <span className="char-count">{`Total Character Count = ${charCount}`}</span>
        </label>
        <textarea
          id="sceneDescription"
          value={sceneDescription}
          onChange={(e) => setSceneDescription(e.target.value)}
          rows={4}
          maxLength={1000}
        />

        <label htmlFor="visualStyle">Visual Style</label>
        <select id="visualStyle" value={visualStyle} onChange={(e) => setVisualStyle(e.target.value)}>
          <option value="">Select...</option>
          {visualStyles.map((style) => (
            <option key={style} value={style}>{style}</option>
          ))}
        </select>

        <label htmlFor="mood">Mood</label>
        <select id="mood" value={mood} onChange={(e) => setMood(e.target.value)}>
          <option value="">Select...</option>
          {moods.map((m) => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>

        <label htmlFor="cameraMovement">Camera Movement</label>
        <select id="cameraMovement" value={cameraMovement} onChange={(e) => setCameraMovement(e.target.value)}>
          <option value="">Select...</option>
          {cameraMovements.map((cm) => (
            <option key={cm} value={cm}>{cm}</option>
          ))}
        </select>

        <label htmlFor="timeOfDay">Time of Day / Lighting</label>
        <select id="timeOfDay" value={timeOfDay} onChange={(e) => setTimeOfDay(e.target.value)}>
          <option value="">Select...</option>
          {timesOfDay.map((td) => (
            <option key={td} value={td}>{td}</option>
          ))}
        </select>

        <label htmlFor="contentType">Content Type (Optional)</label>
        <select id="contentType" value={contentType} onChange={(e) => setContentType(e.target.value)}>
          <option value="">Select...</option>
          {contentTypes.map((ct) => (
            <option key={ct} value={ct}>{ct}</option>
          ))}
        </select>

        <label htmlFor="outputFormat">Output Format (Optional)</label>
        <select id="outputFormat" value={outputFormat} onChange={(e) => setOutputFormat(e.target.value)}>
          <option value="">Select...</option>
          {outputFormats.map((of) => (
            <option key={of} value={of}>{of}</option>
          ))}
        </select>

        <label htmlFor="duration">Duration (Optional)</label>
        <select id="duration" value={duration} onChange={(e) => setDuration(e.target.value)}>
          <option value="">Select...</option>
          {durations.map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>

        <label htmlFor="imageUpload">Upload Image</label>
        <input id="imageUpload" type="file" accept="image/*" onChange={handleImageUpload} />
        {imagePreview && <div className="image-preview"><img src={imagePreview} alt="Preview" width={120} /></div>}

        <fieldset className="negatives">
          <legend>Negative Prompts</legend>
          {defaultNegatives.map((neg) => (
            <label key={neg}>
              <input type="checkbox" value={neg} checked={negatives.includes(neg)} onChange={handleNegativeChange} />
              {neg}
            </label>
          ))}
          <input
            type="text"
            placeholder="Add Custom Negatives"
            value={customNegatives}
            onChange={(e) => setCustomNegatives(e.target.value)}
          />
        </fieldset>

        <div className="actions">
          <button type="submit" className="primary">{buttonText}</button>
          <button type="button" className="secondary" onClick={handleCopyPrompt}>Copy Prompt</button>
        </div>

        <label htmlFor="generatedPrompt">Generated Prompt</label>
        <textarea id="generatedPrompt" value={generatedPrompt} readOnly rows={6} />
      </form>
    </div>
  );
}

export default PromptGenerator;