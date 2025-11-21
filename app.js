document.addEventListener("DOMContentLoaded", () => {
    const tabButtons = document.querySelectorAll(".tab-button");
    const tabContents = document.querySelectorAll(".tab-content");

    tabButtons.forEach(button => {
        button.addEventListener("click", () => {
            const tab = button.textContent.trim().split(" ")[1].toLowerCase();
            showTab(tab);
        });
    });

    function showTab(tab) {
        tabContents.forEach(content => content.classList.remove("active"));
        document.getElementById(tab).classList.add("active");

        tabButtons.forEach(btn => btn.classList.remove("active"));
        tabButtons.forEach(btn => {
            if (btn.textContent.toLowerCase().includes(tab)) btn.classList.add("active");
        });
    }

    const sceneDesc = document.getElementById("sceneDescription");
    const charCountDisplay = document.getElementById("charCountDisplay");
    const generatedCharDisplay = document.getElementById("generatedCharCount");
    const videoCharDisplay = document.getElementById("videoCharCount");
    const videoPromptBox = document.getElementById("videoPromptBox");
    const addToCreator = document.getElementById("addToVideoBtn");
    const generatedPrompt = document.getElementById("generatedPrompt");

    sceneDesc.addEventListener("input", () => {
        charCountDisplay.textContent = "Total Character Count = " + sceneDesc.value.length;
    });

    addToCreator.addEventListener("click", () => {
        videoPromptBox.value = generatedPrompt.textContent;
        videoCharDisplay.textContent = "TOTAL GENERATED CHARACTER COUNT = " + generatedPrompt.textContent.length;
        showTab("creator");
    });
});

function generatePrompt() {
    const desc = document.getElementById("sceneDescription").value;
    const customNeg = document.getElementById("customNegativesToggle")?.checked || false;

    let timeline = `0-3s → Hook\n3-6s → Context\n6-9s → Peak\n9-12s → CTA / Resolution`;
    let tags = `[CAM] Stable\n[VO] Narrated\n[MUSIC] Cinematic\n[EMOTION] Dramatic\n[TRANSITION] Smooth`;

    let fullPrompt = `${desc}\n\nTimeline Breakdown:\n${timeline}\n\nStyle Tags:\n${tags}`;
    if (customNeg) fullPrompt += "\n\nNote: Review for Sora 2 policy violations.";

    document.getElementById("generatedPrompt").textContent = fullPrompt;
    document.getElementById("generatedCharCount").textContent = "TOTAL GENERATED CHARACTER COUNT = " + fullPrompt.length;
}
