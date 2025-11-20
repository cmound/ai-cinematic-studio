const defaultNegatives = [
  "extra limbs",
  "extra body parts",
  "low quality",
  "blurry",
  "worst quality",
  "low res",
  "jpeg artifacts",
  "grainy",
  "pixelated",
  "color aberration",
  "ugly",
  "deformed",
  "disfigured",
  "distorted",
  "misshapen"
];

window.onload = () => {
  const box = document.getElementById("negativePrompts");
  defaultNegatives.forEach(term => {
    const label = document.createElement("label");
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.value = term;
    checkbox.checked = true;
    label.appendChild(checkbox);
    label.append(" " + term);
    box.appendChild(label);
  });
};

function switchTab(tab) {
  document.querySelectorAll(".tab").forEach(el => el.classList.remove("active"));
  document.getElementById(tab + "Tab").classList.add("active");
}

function generatePrompt() {
  const scene = document.getElementById("scene").value;
  const style = document.getElementById("style").value;
  const mood = document.getElementById("mood").value;
  const camera = document.getElementById("camera").value;
  const time = document.getElementById("time").value;
  const duration = document.getElementById("duration").value;
  const customNegative = document.getElementById("customNegative").value;

  const negatives = [...document.querySelectorAll('#negativePrompts input:checked')]
    .map(cb => cb.value.trim());

  if (customNegative.trim()) {
    negatives.push(customNegative.trim());
  }

  const prompt = `
Create a ${style} video scene that takes place ${scene}.
The mood should feel ${mood} with ${camera} camera movement during ${time}.
Video duration: ${duration} seconds.

Negative prompts: ${negatives.join(", ")}
  `.trim();

  document.getElementById("outputBox").innerText = prompt;
}
