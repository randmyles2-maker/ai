const AI_CORE = {
    // Real-Time Finance
    async getCrypto() {
        const res = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana&vs_currencies=usd");
        const d = await res.json();
        return `MARKET DATA: BTC $${d.bitcoin.usd} | ETH $${d.ethereum.usd} | SOL $${d.solana.usd}`;
    },

    // High-Resolution Weather
    async getWeather() {
        const res = await fetch("https://api.open-meteo.com/v1/forecast?latitude=51.5&longitude=-0.1&current=temperature_2m,weather_code&temperature_unit=fahrenheit");
        const d = await res.json();
        return `SATELLITE INTEL: London is currently ${d.current.temperature_2m}°F (Live Sync).`;
    },

    // Deep Knowledge (Wikipedia API)
    async getWiki(q) {
        const res = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(q)}`);
        const d = await res.json();
        return d.extract || null;
    },

    // Live Web Search (Google/DDG Proxy)
    async webSearch(q) {
        const res = await fetch(`https://api.duckduckgo.com/?q=${encodeURIComponent(q)}&format=json&no_html=1`);
        const d = await res.json();
        return d.AbstractText || d.Answer || "Query processed, but no live abstract found. Try a broader term.";
    }
};

async function processIntelligence(input) {
    const q = input.toLowerCase().trim();

    // 1. ETHICS PROTOCOL
    if (/(hurt|kill|illegal|hack|steal|dangerous|exploit)/.test(q)) {
        return "ERROR: Request blocked by safety protocols. I am programmed to be ethical and helpful.";
    }

    // 2. LOGIC ROUTING
    if (q.includes("bitcoin") || q.includes("crypto") || q.includes("price")) return await AI_CORE.getCrypto();
    if (q.includes("weather")) return await AI_CORE.getWeather();
    if (/[0-9]/.test(q) && /[+\-*/]/.test(q)) {
        try { return `COMPUTATION: ${eval(q.replace(/x/g, '*').replace(/[^0-9+\-*/(). ]/g, ''))}`; } catch(e) {}
    }

    // 3. AUTONOMOUS SEARCH (Parallel Attempt)
    const wikiResult = await AI_CORE.getWiki(input);
    if (wikiResult) return wikiResult;

    return await AI_CORE.webSearch(input);
}

async function sendMsg() {
    const input = document.getElementById('user-input');
    const chat = document.getElementById('chat-window');
    const val = input.value.trim();
    if (!val) return;

    chat.innerHTML += `<div class="msg user">${val}</div>`;
    input.value = "";

    const tempId = "ai-" + Date.now();
    chat.innerHTML += `<div class="msg ai" id="${tempId}">Analyzing live repositories...</div>`;
    chat.scrollTop = chat.scrollHeight;

    const response = await processIntelligence(val);
    document.getElementById(tempId).innerText = response;
    chat.scrollTop = chat.scrollHeight;
}
