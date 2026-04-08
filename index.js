let knowledge = {};

// 1. Load Knowledge from GitHub Folders
async function initializeKnowledge() {
    const categories = ["math", "science", "technology", "socialMedia", "history", "general"];
    for (let cat of categories) {
        try {
            const res = await fetch(`knowledge/${cat}.json`);
            knowledge[cat] = await res.json();
        } catch (e) {
            console.log(`Missing file: ${cat}.json`);
            knowledge[cat] = []; // Fallback to empty if file doesn't exist yet
        }
    }
}

// 2. The Smart Search Brain
function getAIResponse(input) {
    const q = input.toLowerCase().trim();

    // Rule 3: Ethics Filter
    const forbidden = ["hurt", "steal", "illegal", "dangerous"];
    if (forbidden.some(word => q.includes(word))) {
        return "I cannot assist with that request. I am programmed to be safe and ethical.";
    }

    // Rule: Live Date/Time
    if (q.includes("date") || q.includes("today")) {
        return "Today is " + new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    }

    // Search through your JSON files
    let matches = [];
    for (let cat in knowledge) {
        let found = knowledge[cat].filter(f => f.fact.toLowerCase().includes(q));
        if (found.length > 0) matches.push(...found);
    }

    if (matches.length > 0) {
        // Return the best match found in your files
        return matches[0].fact;
    }

    // Rule 1: Math Fallback
    const mathClean = q.replace(/x/g, '*').replace(/[^0-9+\-*/(). ]/g, '');
    if (mathClean.length > 0 && /[+\-*/]/.test(mathClean)) {
        try { return "The result is: " + eval(mathClean); } catch(e) {}
    }

    // Rule 4: Admitting Limits
    return "I don't have that specific fact in my database yet. I am still learning and adapting!";
}

// 3. UI Coordination
async function sendMsg() {
    const input = document.getElementById('user-input');
    const container = document.getElementById('chat-container');
    const val = input.value.trim();
    if (!val) return;

    container.innerHTML += `<div class="msg user">${val}</div>`;
    input.value = "";

    const reply = getAIResponse(val);
    
    setTimeout(() => {
        container.innerHTML += `<div class="msg ai">${reply}</div>`;
        container.scrollTop = container.scrollHeight;
    }, 300);
}

// Startup
initializeKnowledge();
