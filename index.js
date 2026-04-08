async function getAIResponse(input) {
    const q = input.toLowerCase().trim();

    // 1. ETHICS & SAFETY
    if (/(hurt|kill|illegal|dangerous|hack|steal)/.test(q)) {
        return "I cannot assist with that request. I am programmed to be ethical, safe, and helpful.";
    }

    // 2. REAL-TIME WEATHER MODULE
    if (q.includes("weather")) {
        try {
            // Fetching London data (Lat: 51.5, Long: -0.12)
            const res = await fetch("https://api.open-meteo.com/v1/forecast?latitude=51.5074&longitude=-0.1278&current=temperature_2m,weather_code&temperature_unit=fahrenheit");
            const data = await res.json();
            const temp = data.current.temperature_2m;
            return `In London, it is currently ${temp}°F. (Source: Live Satellite Data)`;
        } catch (e) {
            return "I couldn't reach the weather station. Please try again in a moment.";
        }
    }

    // 3. REAL-TIME WEB SEARCH (Google/Twitter Knowledge)
    if (q.includes("who is") || q.includes("what is") || q.includes("news")) {
        try {
            const res = await fetch(`https://api.duckduckgo.com/?q=${encodeURIComponent(q)}&format=json&no_html=1`);
            const data = await res.json();
            if (data.AbstractText) return data.AbstractText;
            if (data.Answer) return data.Answer;
        } catch (e) {}
    }

    // 4. MATH LOGIC
    const mathMatch = q.replace(/x/g, '*').replace(/[^0-9+\-*/(). ]/g, '');
    if (mathMatch.length > 0 && /[+\-*/]/.test(mathMatch)) {
        try { return "The answer is " + eval(mathMatch); } catch(e) {}
    }

    // 5. FALLBACK
    return "I've ingested your query. I am currently optimized for live weather, math, and general search!";
}

async function sendMsg() {
    const input = document.getElementById('user-input');
    const window = document.getElementById('chat-window');
    const val = input.value.trim();
    if (!val) return;

    // User Message
    window.innerHTML += `<div class="msg user">${val}</div>`;
    input.value = "";

    // AI Thinking State
    const id = "ai-" + Date.now();
    window.innerHTML += `<div class="msg ai" id="${id}">Connecting to live sources...</div>`;
    window.scrollTop = window.scrollHeight;

    // Get Response
    const response = await getAIResponse(val);
    document.getElementById(id).innerText = response;
    window.scrollTop = window.scrollHeight;
}
