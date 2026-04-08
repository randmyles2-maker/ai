class IntelligenceNode {
    constructor() {
        this.chatFlow = document.getElementById('chat-flow');
        this.input = document.getElementById('user-query');
        this.btn = document.getElementById('send-btn');
        this.init();
    }

    init() {
        // Handle Mouse Click
        this.btn.addEventListener('click', () => this.handleInput());

        // Handle ENTER Key Press
        this.input.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                event.preventDefault(); // Prevents page refresh
                this.handleInput();
            }
        });
    }

    async handleInput() {
        const text = this.input.value.trim();
        if (!text) return;

        this.addMessage(text, 'user-msg');
        this.input.value = '';

        const loaderId = this.addMessage('Syncing with Wikipedia & Live Sources...', 'ai-msg loading');
        
        const response = await this.processQuery(text);
        this.updateMessage(loaderId, response);
    }

    async processQuery(query) {
        const q = query.toLowerCase().trim();

        // Safety Protocol
        if (/(hurt|kill|illegal|hack|steal|dangerous)/.test(q)) return "Security Protocol: Access denied.";

        // Real-Time Modules
        if (q.includes("weather")) return await this.fetchWeather();
        if (q.includes("bitcoin") || q.includes("crypto")) return await this.fetchFinance();

        // Wikipedia Deep Search (Common Sense / History)
        const wikiKnowledge = await this.fetchWiki(query);
        if (wikiKnowledge) return wikiKnowledge;

        // Web Fallback
        return await this.fetchWeb(query);
    }

    async fetchWiki(q) {
        try {
            const searchRes = await fetch(`https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(q)}&format=json&origin=*`);
            const searchData = await searchRes.json();
            if (searchData.query.search.length > 0) {
                const bestTitle = searchData.query.search[0].title;
                const summaryRes = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(bestTitle)}`);
                const data = await summaryRes.json();
                return data.extract;
            }
            return null;
        } catch (e) { return null; }
    }

    async fetchWeb(q) {
        const res = await fetch(`https://api.duckduckgo.com/?q=${encodeURIComponent(q)}&format=json&no_html=1`);
        const data = await res.json();
        return data.AbstractText || "I've searched live repositories but couldn't find a direct match.";
    }

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

// Start the intelligence engine
new IntelligenceNode();
