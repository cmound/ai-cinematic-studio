
const negatives = [
    "extra limbs", "extra body parts", "low quality", "blurry", "worst quality", "low res",
    "jpeg artifacts", "grainy", "pixelated", "color aberration", "ugly", "deformed",
    "disfigured", "distorted", "misshapen"
];

window.onload = () => {
    renderNegativeCheckboxes();
};

function renderNegativeCheckboxes() {
    const container = document.getElementById("negativePrompts");
    negatives.forEach(term => {
        const label = document.createElement("label");
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = true;
        checkbox.value = term;
        label.appendChild(checkbox);
        label.appendChild(document.createTextNode(term));
        container.appendChild(label);
    });
}

function showTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
    document.getElementById(tabId).classList.add('active');
    event.target.classList.add('active');
}

function generatePrompt() {
    const desc = document.getElementById("sceneDescription").value;
    const style = document.getElementById("visualStyle").value;
    const mood = document.getElementById("mood").value;
    const camera = document.getElementById("cameraMovement").value;
    const time = document.getElementById("timeOfDay").value;
    const duration = document.getElementById("duration").value;
    const customNeg = document.getElementById("customNegatives").value;

    const negativeList = Array.from(document.querySelectorAll("#negativePrompts input:checked"))
        .map(input => input.value)
        .concat(customNeg ? customNeg.split(",").map(v => v.trim()) : []);

    const prompt = `
Scene: ${desc}
Style: ${style}
Mood: ${mood}
Camera Movement: ${camera}
Time of Day: ${time}
Duration: ${duration}s
Negative Prompts: ${negativeList.join(", ")}
`.trim();

    document.getElementById("outputPrompt").textContent = prompt;
}
