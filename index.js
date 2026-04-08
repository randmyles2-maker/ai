let knowledge = {};

// 1. Load your local 98% Knowledge files
async function initializeKnowledge() {
    const categories = ["math", "science", "technology", "socialMedia", "history", "general"];
    for (let cat of categories) {
        try {
            const res = await fetch(`knowledge/${cat}.json`);
            knowledge[cat] = await res.json();
        } catch (e) {
            knowledge[cat] = [];
        }
    }
}

// 2. THE GOOGLE/TWITTER SEARCHER (The "Web Brain")
async function searchWeb(query) {
    try {
        // This uses a public proxy to get "Google-like" results and news
        const response = await fetch(`https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_html=1&skip_disambig=1`);
        const data = await response.json();
        
        if (data.AbstractText) {
            return data.AbstractText + " (Source: Web Search)";
        } else if (data.RelatedTopics && data.RelatedTopics.length > 0) {
            return data.RelatedTopics[0].Text + " (Source: Web Results)";
        }
        return null;
    } catch (e) {
        return null;
    }
}

// 3. Logic Controller
async function getAIResponse(input) {
    const q = input.toLowerCase().trim();

    // Rule 3: Ethics
    const forbidden = ["hurt", "steal", "illegal", "dangerous"];
    if (forbidden.some(word => q.includes(word))) return "I cannot assist with that request for safety reasons.";

    // STEP A: Check Local Knowledge (Your JSON files)
    let localMatches = [];
    for (let cat in knowledge) {
        let found = knowledge[cat].filter(f => f.fact.toLowerCase().includes(q));
        if (found.length > 0) localMatches.push(...found);
    }
    if (localMatches.length > 0) return localMatches[0].fact;

    // STEP B: Check the Live Web (Google/Twitter/News)
    const webResult = await searchWeb(input);
    if (webResult) return webResult;

    // STEP C: Fallback
    return "I am currently unable to find a live source for that. I am programmed to admit my limits rather than making things up.";
}

// 4. UI Coordination
async function sendMsg() {
    const input = document.getElementById('user-input');
    const container = document.getElementById('chat-container');
    const val = input.value.trim();
    if (!val) return;

    container.innerHTML += `<div class="msg user">${val}</div>`;
    input.value = "";

    // Show a "Thinking" state while it searches the web
    const loadingId = "loading-" + Date.now();
    container.innerHTML += `<div class="msg ai" id="${loadingId}">Searching live sources...</div>`;
    container.scrollTop = container.scrollHeight;

    const reply = await getAIResponse(val);
    
    document.getElementById(loadingId).innerText = reply;
    container.scrollTop = container.scrollHeight;
}

initializeKnowledge();
