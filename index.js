/**
 * AURA v3.0 - Autonomous Intelligence Node
 * Real-time Math, Literature, and Global Search
 */

class IntelligenceNode {
    constructor() {
        this.chatFlow = document.getElementById('chat-flow');
        this.input = document.getElementById('user-query');
        this.btn = document.getElementById('send-btn');
        this.init();
    }

    init() {
        // Fix: Explicitly listen for the Enter key on the input field
        this.input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault(); // Stop page from refreshing
                this.handleInput();
            }
        });

        // Handle the button click
        this.btn.addEventListener('click', () => this.handleInput());
    }

    async handleInput() {
        const text = this.input.value.trim();
        if (!text) return;

        // Display user message
        this.addMessage(text, 'user-msg');
        this.input.value = '';

        // Add a temporary "Thinking" bubble
        const loaderId = this.addMessage('Syncing with Global Neural Repositories...', 'ai-msg loading');
        
        // Process the actual intelligence
        const response = await this.processQuery(text);
        
        // Update the thinking bubble with the real answer
        this.updateMessage(loaderId, response);
    }

    async processQuery(query) {
        const q = query.toLowerCase().trim();

        // 1. SAFETY & ETHICS PROTOCOL
        if (/(hurt|kill|illegal|hack|steal|dangerous|bomb|exploit)/.test(q)) {
            return "Protocol Error: Access denied for unethical or dangerous parameters.";
        }

        // 2. MATH ENGINE (Common sense logic for numbers)
        // Checks if query has numbers and math operators
        if (/[0-9]/.test(q) && /[+\-*/^()]/.test(q)) {
            return this.solveMath(q);
        }

        // 3. REAL-TIME DATA GATES (Weather/Finance)
        if (q.includes("weather")) return await this.fetchWeather();
        if (q.includes("bitcoin") || q.includes("crypto")) return await this.fetchFinance();

        // 4. LITERATURE & KNOWLEDGE (Deep Wikipedia Search)
        // This handles "What began WW2", "Themes of Hamlet", etc.
        const wiki = await this.fetchWiki(query);
        if (wiki) return wiki;

        // 5. WEB SEARCH FALLBACK (DuckDuckGo Live)
        const web = await this.fetchWeb(query);
        return web || "Search depth exceeded. No definitive match found in live repositories.";
    }

    // --- COMPUTATIONAL MODULE ---
    solveMath(q) {
        try {
            // Converts 'x' to '*' and removes illegal characters for safety
            const expression = q.replace(/x/g, '*').replace(/[^-()\d/*+.]/g, '');
            const result = eval(expression);
            return `Computation Complete: The result is ${result}`;
        } catch (e) {
            return "Mathematical Error: Expression is too complex or malformed.";
        }
    }

    // --- KNOWLEDGE MODULES ---
    async fetchWiki(q) {
        try {
            // Search Wikipedia to find the most accurate page title
            const searchRes = await fetch(`https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(q)}&format=json&origin=*`);
            const searchData = await searchRes.json();
            
            if (searchData.query.search.length > 0) {
                const bestTitle = searchData.query.search[0].title;
                // Fetch the summary for the best title found
                const summaryRes = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(bestTitle)}`);
                const data = await summaryRes.json();
                return data.extract;
            }
            return null;
        } catch (e) { return null; }
    }

    async fetchWeb(q) {
        try {
            const res = await fetch(`https://api.duckduckgo.com/?q=${encodeURIComponent(q)}&format=json&no_html=1`);
            const data = await res.json();
            return data.AbstractText || null;
        } catch (e) { return null; }
    }

    // --- SENSOR MODULES ---
    async fetchWeather() {
        const res = await fetch("https://api.open-meteo.com/v1/forecast?latitude=51.5&longitude=-0.1&current=temperature_2m&temperature_unit=fahrenheit");
        const data = await res.json();
        return `Atmospheric Update: It is currently ${data.current.temperature_2m}°F in London.`;
    }

    async fetchFinance() {
        const res = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd");
        const data = await res.json();
        return `Market Intel: BTC $${data.bitcoin.usd} | ETH $${data.ethereum.usd}.`;
    }

    // --- UI HELPERS ---
    addMessage(text, className) {
        const id = 'msg-' + Date.now();
        const div = document.createElement('div');
        div.id = id;
        div.className = `bubble ${className}`;
        div.innerText = text;
        this.chatFlow.appendChild(div);
        this.chatFlow.scrollTop = this.chatFlow.scrollHeight;
        return id;
    }

    updateMessage(id, text) {
        const el = document.getElementById(id);
        if (el) {
            el.classList.remove('loading');
            el.innerText = text;
        }
    }
}

// Start Engine
new IntelligenceNode();
