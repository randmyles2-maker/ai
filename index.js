class IntelligenceNode {
    constructor() {
        this.chatFlow = document.getElementById('chat-flow');
        this.input = document.getElementById('user-query');
        this.btn = document.getElementById('send-btn');
        this.init();
    }

    init() {
        this.btn.addEventListener('click', () => this.handleInput());
        this.input.addEventListener('keypress', (e) => e.key === 'Enter' && this.handleInput());
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

        // 1. Safety Filter
        if (/(hurt|kill|illegal|hack|steal|dangerous)/.test(q)) return "Security Protocol: Access denied for unethical queries.";

        // 2. Specialized Real-Time Modules (Weather/Finance)
        if (q.includes("weather")) return await this.fetchWeather();
        if (q.includes("bitcoin") || q.includes("crypto")) return await this.fetchFinance();

        // 3. WIKIPEDIA CORE (History, Science, General Knowledge)
        const wikiKnowledge = await this.fetchWiki(query);
        if (wikiKnowledge) return wikiKnowledge;

        // 4. WEB SEARCH FALLBACK
        const webResult = await this.fetchWeb(query);
        return webResult || "I've scanned all live repositories but couldn't find a definitive match. Try a more specific topic.";
    }

    async fetchWiki(q) {
        try {
            // STEP 1: Search Wikipedia for the most relevant article title
            const searchRes = await fetch(`https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(q)}&format=json&origin=*`);
            const searchData = await searchRes.json();

            if (searchData.query.search.length > 0) {
                // Take the most accurate title (e.g., "World War II" instead of "ww2")
                const bestTitle = searchData.query.search[0].title;
                
                // STEP 2: Get the summary of that specific title
                const summaryRes = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(bestTitle)}`);
                const data = await summaryRes.json();
                
                return data.extract;
            }
            return null;
        } catch (e) { return null; }
    }

    async fetchWeather() {
        const res = await fetch("https://api.open-meteo.com/v1/forecast?latitude=51.5&longitude=-0.1&current=temperature_2m&temperature_unit=fahrenheit");
        const data = await res.json();
        return `Atmospheric Data: Currently ${data.current.temperature_2m}°F in London.`;
    }

    async fetchFinance() {
        const res = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd");
        const data = await res.json();
        return `Market Intel: BTC $${data.bitcoin.usd} | ETH $${data.ethereum.usd}.`;
    }

    async fetchWeb(q) {
        const res = await fetch(`https://api.duckduckgo.com/?q=${encodeURIComponent(q)}&format=json&no_html=1`);
        const data = await res.json();
        return data.AbstractText || null;
    }

    addMessage(text, className) {
        const id = 'msg-' + Date.now();
        const div = document.createElement('div');
        div.id = id; div.className = `bubble ${className}`;
        div.innerText = text;
        this.chatFlow.appendChild(div);
        this.chatFlow.scrollTop = this.chatFlow.scrollHeight;
        return id;
    }

    updateMessage(id, text) {
        const el = document.getElementById(id);
        if(el) { el.classList.remove('loading'); el.innerText = text; }
    }
}
new IntelligenceNode();
