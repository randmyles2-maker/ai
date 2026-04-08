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

        const loaderId = this.addMessage('Syncing with live repositories...', 'ai-msg loading');
        
        const response = await this.processQuery(text);
        this.updateMessage(loaderId, response);
    }

    async processQuery(query) {
        const q = query.toLowerCase();

        // 1. Safety Protocols
        if (/(hurt|kill|illegal|hack|steal|bomb)/.test(q)) {
            return "Security Protocol: This query violates my safety parameters. I cannot assist.";
        }

        // 2. Specialized Real-Time Modules
        try {
            if (q.includes("weather")) return await this.fetchWeather();
            if (q.includes("crypto") || q.includes("bitcoin")) return await this.fetchFinance();
            if (/[0-9]/.test(q) && /[+\-*/]/.test(q)) return this.compute(q);

            // 3. Multi-Source Retrieval (Wiki -> Web)
            const wiki = await this.fetchWiki(query);
            if (wiki) return wiki;

            const web = await this.fetchWeb(query);
            return web || "Live data unavailable. Try a more specific query.";
        } catch (err) {
            return "Connection error: Unable to reach live sources.";
        }
    }

    // --- MODULES ---
    async fetchWeather() {
        const res = await fetch("https://api.open-meteo.com/v1/forecast?latitude=51.5&longitude=-0.1&current=temperature_2m&temperature_unit=fahrenheit");
        const data = await res.json();
        return `Current London Weather: ${data.current.temperature_2m}°F.`;
    }

    async fetchFinance() {
        const res = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd");
        const data = await res.json();
        return `Market Report: BTC $${data.bitcoin.usd} | ETH $${data.ethereum.usd}.`;
    }

    async fetchWiki(q) {
        const res = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(q)}`);
        const data = await res.json();
        return data.extract || null;
    }

    async fetchWeb(q) {
        const res = await fetch(`https://api.duckduckgo.com/?q=${encodeURIComponent(q)}&format=json&no_html=1`);
        const data = await res.json();
        return data.AbstractText || null;
    }

    compute(q) {
        try {
            const math = q.replace(/x/g, '*').replace(/[^0-9+\-*/(). ]/g, '');
            return `Computation: ${eval(math)}`;
        } catch(e) { return "Logic error in math expression."; }
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
        el.classList.remove('loading');
        el.innerText = text;
    }
}

new IntelligenceNode();
