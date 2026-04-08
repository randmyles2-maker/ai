let knowledge = {};

// 1. Initialize local JSON files
async function loadLocalKnowledge() {
    const categories = ["science", "history", "math", "general"];
    for (let cat of categories) {
        try {
            const res = await fetch(`knowledge/${cat}.json`);
            knowledge[cat] = await res.json();
        } catch (e) { knowledge[cat] = []; }
    }
}

// 2. THE REAL-TIME SEARCH ENGINE
async function fetchRealTimeData(query) {
    try {
        // This hits the web to find real-time answers (Google/Twitter/News results)
        const url = `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_html=1`;
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.AbstractText) return data.AbstractText;
        if (data.Answer) return data.Answer;
        if (data.RelatedTopics && data.RelatedTopics.length > 0) return data.RelatedTopics[0].Text;
        
        return null;
    } catch (e) {
        return null;
    }
}

// 3. Logic Controller
async function getAIResponse(text) {
    const q = text.toLowerCase().trim();

    // RULE 3: ETHICS
    if (/(hurt|kill|illegal|steal|hack)/.test(q)) {
        return "My ethical programming prevents me from assisting with harmful or illegal requests.";
    }

    // RULE 1: LIVE DATE/TIME
    if (q.includes("date") || q.includes("today") || q.includes("time")) {
        return "It is currently " + new Date().toLocaleString();
    }

    // RULE 1: MATH
    if (/[0-9]/.test(q) && /[+\-*/]/.test(q)) {
        try { return "Calculation result: " + eval(q.replace(/x/g, '*').replace(/[^0-9+\-*/(). ]/g, '')); } catch(e){}
    }

    // STEP A: Check your 98% Knowledge Files first
    for (let cat in knowledge) {
        const match = knowledge[cat].find(f => q.includes(f.fact.toLowerCase().split(' ')[0]));
        if (match) return match.fact + " (Local Knowledge)";
    }

    // STEP B: FETCH REAL-TIME DATA (The Web)
    const webResult = await fetchRealTimeData(text);
    if (webResult) return webResult + " (Real-time Source)";

    // RULE 4: ADMIT LIMITS
    return "I couldn't find a live source for that. I am programmed to avoid making things up.";
}

// 4. UI Connection
async function sendMsg() {
    const input = document.getElementById('user-input');
    const container = document.getElementById('chat-container');
    const val = input.value.trim();
    if (!val) return;

    container.innerHTML += `<div class="msg user">${val}</div>`;
    input.value = "";

    // Show "Searching..." so you know it's going to the web
    const tempId = "ai-" + Date.now();
    container.innerHTML += `<div class="msg ai" id="${tempId}">Connecting to live sources...</div>`;
    container.scrollTop = container.scrollHeight;

    const reply = await getAIResponse(val);
    document.getElementById(tempId).innerText = reply;
    container.scrollTop = container.scrollHeight;
}

loadLocalKnowledge();
