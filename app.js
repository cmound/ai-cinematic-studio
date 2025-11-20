function showTab(tab) {
  document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
  document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));

  document.getElementById(tab).classList.add('active');
  document.querySelector(`[onclick="showTab('${tab}')"]`).classList.add('active');
}

function generatePrompt() {
  const scene = document.getElementById('sceneDescription').value;
  const style = document.getElementById('visualStyle').value;
  const mood = document.getElementById('mood').value;
  const movement = document.getElementById('cameraMovement').value;
  const time = document.getElementById('timeOfDay').value;
  const duration = document.getElementById('duration').value;

  const negatives = [];
  document.querySelectorAll('#negativePrompts input[type="checkbox"]').forEach(cb => {
    if (cb.checked) negatives.push(cb.value);
  });

  const customNeg = document.getElementById('customNegatives').value;
  if (customNeg) negatives.push(...customNeg.split(',').map(s => s.trim()));

  const prompt = `
Scene: ${scene}
Visual Style: ${style}
Mood: ${mood}
Camera: ${movement}
Time: ${time}
Duration: ${duration}
Negative Prompts: ${negatives.join(', ')}
  `.trim();

  document.getElementById('output').innerText = prompt;
}

const defaultNegatives = [
  "extra limbs", "extra body parts", "low quality", "blurry", "worst quality",
  "low res", "jpeg artifacts", "grainy", "pixelated", "color aberration",
  "ugly", "deformed", "disfigured", "distorted", "misshapen"
];

window.onload = () => {
  const container = document.getElementById('negativePrompts');
  defaultNegatives.forEach(item => {
    const label = document.createElement('label');
    const cb = document.createElement('input');
    cb.type = 'checkbox';
    cb.value = item;
    cb.checked = true;
    label.appendChild(cb);
    label.appendChild(document.createTextNode(` ${item}`));
    container.appendChild(label);
  });
};
