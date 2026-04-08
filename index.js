// Rule 3: Ethics Filter
const FORBIDDEN = ["hurt", "steal", "illegal", "dangerous", "hack"];

async function getAIResponse(input) {
    const q = input.toLowerCase().trim();

    // 1. Check Ethics
    if (FORBIDDEN.some(word => q.includes(word))) {
        return "I cannot fulfill this request. I am programmed to be safe and ethical.";
    }

    // 2. LIVE WEATHER & SEARCH (Real-Time Rule)
    // If the user asks about weather or "What is...", we use the DuckDuckGo Live API
    if (q.includes("weather") || q.includes("who is") || q.includes("what is") || q.includes("news")) {
        try {
            // This pulls real-time data from the web directly to your GitHub site
            const response = await fetch(`https://api.duckduckgo.com/?q=${encodeURIComponent(q)}&format=json&no_html=1`);
            const data = await response.json();
            
            if (data.AbstractText) {
                return data.AbstractText + " (Source: Live Web)";
            } else if (data.Answer) {
                return data.Answer;
            }
        } catch (e) {
            return "I'm having trouble connecting to live servers right now.";
        }
    }

    // 3. DATE/TIME
    if (q.includes("date") || q.includes("time") || q.includes("today")) {
        return "Currently, it is " + new Date().toLocaleString();
    }

    // 4. MATH
    const mathClean = q.replace(/x/g, '*').replace(/[^0-9+\-*/(). ]/g, '');
    if (mathClean.length > 0 && /[+\-*/]/.test(mathClean)) {
        try { return "The answer is: " + eval(mathClean); } catch(e) {}
    }

    // 5. FALLBACK (Rule 4: Admit limits)
    return "I've processed your message. For real-time info, try asking 'What is the weather in London?' or 'What is the latest news?'";
}

// 4. UI Coordination (Make sure this matches your HTML button)
async function sendMsg() {
    const input = document.getElementById('user-input');
    const container = document.getElementById('chat-container');
    const val = input.value.trim();
    if (!val) return;

    container.innerHTML += `<div class="msg user">${val}</div>`;
    input.value = "";

    // Show 'Thinking' status while searching the web
    const tempId = "ai-" + Date.now();
    container.innerHTML += `<div class="msg ai" id="${tempId}">Searching live sources...</div>`;
    container.scrollTop = container.scrollHeight;

    const reply = await getAIResponse(val);
    document.getElementById(tempId).innerText = reply;
    container.scrollTop = container.scrollHeight;
}
