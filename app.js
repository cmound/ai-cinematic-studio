// Simple router for tabs
function navigate(pageId) {
  const pages = document.querySelectorAll('.page');
  const buttons = document.querySelectorAll('.tab-button');
  pages.forEach(p => p.classList.remove('active'));
  buttons.forEach(b => b.classList.remove('active'));
  document.getElementById(pageId).classList.add('active');
  [...buttons].find(b => b.textContent.includes(titleForPage(pageId)))?.classList.add('active');

  // refresh dashboard/library on enter
  if (pageId === 'dashboard') renderDashboard();
  if (pageId === 'library') renderLibrary();
}

function titleForPage(id) {
  switch (id) {
    case 'prompt': return 'Prompt Generator';
    case 'video': return 'Video Creator';
    case 'dashboard': return 'Video Dashboard';
    case 'image': return 'Image Generator';
    case 'library': return 'Generated Library';
    default: return '';
  }
}

// Live char count that follows resizing
function updateCharCount(textarea, counterId) {
  const cnt = document.getElementById(counterId);
  const val = textarea.value || '';
  const label = counterId === 'charCount' ? 'Total Character Count' : 'TOTAL GENERATED CHARACTER COUNT';
  cnt.textContent = `${label} = ${val.length}`;

  // Reposition counter near bottom-right corner
  const wrapper = textarea.parentElement;
  const rect = textarea.getBoundingClientRect();
  const wrapperRect = wrapper.getBoundingClientRect();
  const offsetRight = wrapperRect.right - rect.right + 10;
  const offsetBottom = wrapperRect.bottom - rect.bottom + 10;
  cnt.style.right = `${offsetRight}px`;
  cnt.style.bottom = `${offsetBottom}px`;
}

// Observe resize to keep counter pinned
function watchTextareaResize(id, counterId) {
  const ta = document.getElementById(id);
  const cnt = document.getElementById(counterId);
  const ro = new ResizeObserver(() => {
    updateCharCount(ta, counterId);
  });
  ro.observe(ta);
}

// Toggle custom negative prompts visibility
const negOtherCheckbox = () => document.getElementById('negOther');
const negOtherText = () => document.getElementById('negOtherText');

document.addEventListener('change', (e) => {
  if (e.target && e.target.id === 'negOther') {
    negOtherText().style.display = e.target.checked ? 'block' : 'none';
  }
});

// Transfer prompt to video creator
function addToVideoCreator() {
  const gen = document.getElementById('generatedPrompt').value.trim();
  const vp = document.getElementById('videoPrompt');
  vp.value = gen;
  updateCharCount(vp, 'videoCharCount');
  navigate('video');
}

// Video prompt source toggling
function toggleVideoPromptSource() {
  const usePrompt = document.getElementById('usePrompt').checked;
  const manual = document.getElementById('manualPrompt').checked;
  const vp = document.getElementById('videoPrompt');
  if (usePrompt && !manual) {
    vp.value = document.getElementById('generatedPrompt').value;
  }
}

// Build timeline structure
function buildTimelineText(duration) {
  // Default timeline blocks for 15s; scale naively if duration differs
  const d = Number(duration);
  // Maintain 0–3, 3–6, 6–9, 9–12; if >12s, add 12–d as resolution extension
  const base = [
    { t: '0-3s', label: 'Hook' },
    { t: '3-6s', label: 'Context' },
    { t: '6-9s', label: 'Peak' },
    { t: '9-12s', label: 'CTA / Resolution' }
  ];
  if (d > 12) base.push({ t: `12-${d}s`, label: 'Extended Resolution' });
  return base;
}

function getSelectedNegatives() {
  const boxes = document.querySelectorAll('#negatives input[type="checkbox"]');
  const selected = [];
  boxes.forEach(b => {
    const label = b.parentElement.textContent.trim();
    if (b.checked && label.toLowerCase() !== 'other') {
      selected.push(label);
    }
  });
  const otherChecked = document.getElementById('negOther').checked;
  const otherText = document.getElementById('negOtherText').value.trim();
  if (otherChecked && otherText) selected.push(otherText);
  return selected;
}

function fileInfo(inputId) {
  const f = document.getElementById(inputId).files?.[0];
  if (!f) return null;
  return { name: f.name, type: f.type, size: f.size };
}

// Generate prompt with selected format and tags
function generatePrompt() {
  const scene = document.getElementById('sceneDescription').value.trim();
  const visualStyle = document.getElementById('visualStyle').value;
  const mood = visualStyle.includes('Action Thriller') ? 'Fast-Paced, Intense' : ''; // mood inferred if style chosen
  const timeOfDay = document.getElementById('timeOfDay').value;
  const camera = document.getElementById('cameraMovement').value;
  const contentType = document.getElementById('contentType').value;
  const duration = document.getElementById('duration').value;
  const format = document.getElementById('outputFormat').value;
  const negatives = getSelectedNegatives();
  const imageHelper = fileInfo('uploadImage');

  // Core directive tags (applied per block)
  const tags = ['[CAM]', '[VO]', '[MUSIC]', '[EMOTION]', '[TRANSITION]'];
  const timeline = buildTimelineText(duration);

  // Base descriptor string
  const descriptorLines = [];
  descriptorLines.push(`Scene: ${scene || 'N/A'}`);
  descriptorLines.push(`Visual Style: ${visualStyle}`);
  if (mood) descriptorLines.push(`Mood: ${mood}`);
  if (timeOfDay && timeOfDay !== 'Auto') descriptorLines.push(`Time of Day: ${timeOfDay}`);
  if (camera && camera !== 'Auto') descriptorLines.push(`Camera Movement: ${camera}`);
  descriptorLines.push(`Content Type: ${contentType}`);
  descriptorLines.push(`Duration: ${duration}s`);
  if (imageHelper) descriptorLines.push(`Image Ref: ${imageHelper.name} (${imageHelper.type}, ${imageHelper.size} bytes)`);
  if (negatives.length) descriptorLines.push(`Negative Prompts: ${negatives.join(', ')}`);

  // Construct blocks with tags
  const blocks = timeline.map(b => {
    return {
      time: b.t,
      title: b.label,
      CAM: camera === 'Auto' ? 'Auto' : camera,
      VO: 'Narration aligns with scene intent',
      MUSIC: 'Score complements pacing; dynamic transitions',
      EMOTION: visualStyle.includes('Action Thriller') ? 'Intense, urgent pacing' : 'Tone matches style and scene arc',
      TRANSITION: 'Cohesive flow to next beat'
    };
  });

  // Output construction
  let output = '';
  const header = descriptorLines.join('\n');

  if (format === 'Text Format (Timestamped Cuts)') {
    // Text with timestamps and tags per block
    output += `${header}\n\nTimeline:\n`;
    blocks.forEach(bl => {
      output += `${bl.time} → ${bl.title}\n`;
      output += `${tags[0]} ${bl.CAM}\n`;
      output += `${tags[1]} ${bl.VO}\n`;
      output += `${tags[2]} ${bl.MUSIC}\n`;
      output += `${tags[3]} ${bl.EMOTION}\n`;
      output += `${tags[4]} ${bl.TRANSITION}\n\n`;
    });
  } else if (format === 'Text Format (Standard)') {
    // Text without timestamps, still structured
    output += `${header}\n\nStructure:\n`;
    blocks.forEach(bl => {
      output += `${bl.title}\n`;
      output += `${tags[0]} ${bl.CAM}; ${tags[1]} ${bl.VO}; ${tags[2]} ${bl.MUSIC}; ${tags[3]} ${bl.EMOTION}; ${tags[4]} ${bl.TRANSITION}\n\n`;
    });
  } else if (format === 'JSON Format (Timestamped Cuts)') {
    const json = {
      header: {
        scene,
        visualStyle,
        mood: mood || null,
        timeOfDay: timeOfDay === 'Auto' ? null : timeOfDay,
        cameraMovement: camera === 'Auto' ? null : camera,
        contentType,
        duration: Number(duration),
        imageRef: imageHelper || null,
        negatives
      },
      timeline: blocks.map(bl => ({
        time: bl.time,
        title: bl.title,
        CAM: bl.CAM,
        VO: bl.VO,
        MUSIC: bl.MUSIC,
        EMOTION: bl.EMOTION,
        TRANSITION: bl.TRANSITION
      }))
    };
    output = JSON.stringify(json, null, 2);
  } else if (format === 'JSON Format (Standard)') {
    const json = {
      header: {
        scene,
        visualStyle,
        mood: mood || null,
        timeOfDay: timeOfDay === 'Auto' ? null : timeOfDay,
        cameraMovement: camera === 'Auto' ? null : camera,
        contentType,
        duration: Number(duration),
        imageRef: imageHelper || null,
        negatives
      },
      structure: blocks.map(bl => ({
        title: bl.title,
        CAM: bl.CAM,
        VO: bl.VO,
        MUSIC: bl.MUSIC,
        EMOTION: bl.EMOTION,
        TRANSITION: bl.TRANSITION
      }))
    };
    output = JSON.stringify(json, null, 2);
  }

  const outEl = document.getElementById('generatedPrompt');
  outEl.value = output;
  updateCharCount(outEl, 'genCharCount');
}

// Video generation (stub) with spinner and dashboard integration
function generateVideo() {
  const prompt = document.getElementById('videoPrompt').value.trim();
  const length = document.querySelector('input[name="vlength"]:checked').value;
  const scenario = document.getElementById('scenario').value;
  const ack = document.getElementById('ackRules').checked;
  const status = document.getElementById('videoStatus');

  if (!prompt) {
    status.textContent = 'Please provide a prompt.';
    return;
  }
  if (!ack) {
    status.textContent = 'Please acknowledge the rules.';
    return;
  }

  status.innerHTML = 'Video is being generated... ⏳';
  // Simulate generation
  setTimeout(() => {
    status.innerHTML = 'Draft video created.';
    // Save to drafts
    const drafts = load('drafts');
    const id = `vid_${Date.now()}`;
    drafts.push({
      id,
      title: `Draft ${new Date().toLocaleString()}`,
      prompt,
      length,
      scenario,
      createdAt: Date.now()
    });
    save('drafts', drafts);
    renderDashboard();
    navigate('dashboard');
  }, 1000);
}

// Dashboard rendering and actions
function renderDashboard() {
  const drafts = load('drafts');
  const published = load('published');
  const draftsList = document.getElementById('draftsList');
  const publishedList = document.getElementById('publishedList');

  draftsList.innerHTML = drafts.map(d => cardHTML(d, false)).join('') || '<p>No drafts yet.</p>';
  publishedList.innerHTML = published.map(d => cardHTML(d, true)).join('') || '<p>No published videos yet.</p>';

  // Attach action handlers
  attachCardHandlers();
}

function cardHTML(item, isPublished) {
  return `
    <div class="card" data-id="${item.id}" data-pub="${isPublished ? '1' : '0'}">
      <h4>${item.title}</h4>
      <div class="meta">Length: ${item.length}s • Scenario: ${item.scenario}</div>
      <div class="meta">Preview loops automatically (stub)</div>
      <div class="actions">
        ${isPublished ? '' : '<button class="small" data-action="edit">Edit Prompt</button>'}
        ${isPublished ? '' : '<button class="small" data-action="post">Post Video</button>'}
        <button class="small" data-action="download">Download</button>
        <button class="small" data-action="delete">Delete</button>
      </div>
    </div>
  `;
}

function attachCardHandlers() {
  document.querySelectorAll('.card .actions button').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const action = e.target.getAttribute('data-action');
      const card = e.target.closest('.card');
      const id = card.getAttribute('data-id');
      const isPub = card.getAttribute('data-pub') === '1';
      if (action === 'edit') editDraft(id);
      if (action === 'post') postDraft(id);
      if (action === 'download') downloadItem(id, isPub);
      if (action === 'delete') deleteItem(id, isPub);
    });
  });
}

function editDraft(id) {
  const drafts = load('drafts');
  const item = drafts.find(d => d.id === id);
  if (!item) return;
  // Open inline edit (simple prompt)
  const newPrompt = window.prompt('Edit prompt:', item.prompt);
  if (newPrompt !== null) {
    item.prompt = newPrompt;
    save('drafts', drafts);
    renderDashboard();
  }
}

function postDraft(id) {
  const drafts = load('drafts');
  const published = load('published');
  const idx = drafts.findIndex(d => d.id === id);
  if (idx === -1) return;
  const item = drafts.splice(idx, 1)[0];
  item.title = `Published ${new Date().toLocaleString()}`;
  published.push(item);
  save('drafts', drafts);
  save('published', published);
  renderDashboard();
}

function downloadItem(id, isPublished) {
  const list = load(isPublished ? 'published' : 'drafts');
  const item = list.find(d => d.id === id);
  if (!item) return;
  // Simulate download of prompt as text file
  const blob = new Blob([item.prompt], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${item.title.replace(/\s+/g, '_')}.txt`;
  a.click();
  URL.revokeObjectURL(url);
}

function deleteItem(id, isPublished) {
  const key = isPublished ? 'published' : 'drafts';
  const list = load(key);
  const idx = list.findIndex(d => d.id === id);
  if (idx !== -1) {
    list.splice(idx, 1);
    save(key, list);
    renderDashboard();
  }
}

// Image generator (stub)
function generateImage() {
  const prompt = document.getElementById('imagePrompt').value.trim();
  const file = document.getElementById('imageUpload').files?.[0] || null;
  const style = document.getElementById('imageStyle').value;
  const status = document.getElementById('imageStatus');

  if (!prompt && !file) {
    status.textContent = 'Add a prompt or upload an image.';
    return;
  }

  status.textContent = 'Image is being generated... ⏳';

  setTimeout(() => {
    status.textContent = 'Image generated (stub). Added to Library.';
    const library = load('library');
    library.push({
      id: `img_${Date.now()}`,
      title: `Image ${new Date().toLocaleString()}`,
      style,
      prompt,
      fileName: file ? file.name : null,
      createdAt: Date.now()
    });
    save('library', library);
    renderLibrary();
    navigate('library');
  }, 800);
}

// Library
function renderLibrary() {
  const list = load('library');
  const target = document.getElementById('libraryList');
  target.innerHTML = list.map(item => `
    <div class="card">
      <h4>${item.title}</h4>
      <div class="meta">Style: ${item.style}</div>
      ${item.fileName ? `<div class="meta">Source image: ${item.fileName}</div>` : ''}
      ${item.prompt ? `<pre style="white-space:pre-wrap">${item.prompt}</pre>` : ''}
      <div class="actions">
        <button class="small" data-id="${item.id}" data-action="delete-library">Delete</button>
      </div>
    </div>
  `).join('') || '<p>No library items yet.</p>';

  // Delete handlers
  document.querySelectorAll('#libraryList [data-action="delete-library"]').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      const list = load('library');
      const idx = list.findIndex(i => i.id === id);
      if (idx !== -1) {
        list.splice(idx, 1);
        save('library', list);
        renderLibrary();
      }
    });
  });
}

// Storage helpers
function load(key) {
  const raw = localStorage.getItem(`acs_${key}`);
  return raw ? JSON.parse(raw) : [];
}
function save(key, value) {
  localStorage.setItem(`acs_${key}`, JSON.stringify(value));
}

// Init
document.addEventListener('DOMContentLoaded', () => {
  // Set initial counts and observers
  updateCharCount(document.getElementById('sceneDescription'), 'charCount');
  updateCharCount(document.getElementById('generatedPrompt'), 'genCharCount');
  updateCharCount(document.getElementById('videoPrompt'), 'videoCharCount');
  updateCharCount(document.getElementById('imagePrompt'), 'imageCharCount');

  watchTextareaResize('sceneDescription', 'charCount');
  watchTextareaResize('generatedPrompt', 'genCharCount');
  watchTextareaResize('videoPrompt', 'videoCharCount');
  watchTextareaResize('imagePrompt', 'imageCharCount');

  renderDashboard();
  renderLibrary();
});
