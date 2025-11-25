document.addEventListener('DOMContentLoaded', () => {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');

    window.showTab = (id) => {
        tabButtons.forEach(btn => btn.classList.toggle('active', btn.textContent.toLowerCase().includes(id)));
        tabContents.forEach(c => c.classList.toggle('active', c.id === id));
    };

    const fields = {
        description: document.getElementById('sceneDescription'),
        visualStyle: document.getElementById('visualStyle'),
        mood: document.getElementById('mood'),
        camera: document.getElementById('cameraMovement'),
        timeOfDay: document.getElementById('timeOfDay')
    };

    const negativeCheckboxes = Array.from(document.querySelectorAll('.negatives input[type="checkbox"]'));
    const customNegatives = document.getElementById('customNegatives');
    const output = document.getElementById('promptOutput');
    const generateBtn = document.getElementById('generatePrompt');
    const copyBtn = document.getElementById('copyPrompt');

    function buildPrompt() {
        const parts = [];
        if (fields.description.value) parts.push(fields.description.value.trim());
        const meta = [
            fields.visualStyle.value && `Visual Style: ${fields.visualStyle.value}`,
            fields.mood.value && `Mood: ${fields.mood.value}`,
            fields.camera.value && `Camera: ${fields.camera.value}`,
            fields.timeOfDay.value && `Time: ${fields.timeOfDay.value}`
        ].filter(Boolean);
        if (meta.length) parts.push(meta.join(' | '));
        const negatives = [
            ...negativeCheckboxes.filter(cb => cb.checked).map(cb => cb.value),
            ...(customNegatives.value ? [customNegatives.value.trim()] : [])
        ];
        if (negatives.length) parts.push(`--negative: ${negatives.join(', ')}`);
        const prompt = parts.join('
');
        output.value = prompt;
        return prompt;
    }

    generateBtn.addEventListener('click', buildPrompt);
    copyBtn.addEventListener('click', async () => {
        const prompt = output.value || buildPrompt();
        try {
            await navigator.clipboard.writeText(prompt);
            copyBtn.textContent = 'Copied!';
            setTimeout(() => copyBtn.textContent = 'Copy Prompt', 1500);
        } catch {
            alert('Copy failed.');
        }
    });
});
