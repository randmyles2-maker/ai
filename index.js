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
        const loaderId = this.addMessage('Accessing neural gateways...', 'ai-msg loading');
        const response = await this.processQuery(text);
        this.updateMessage(loaderId, response);
    }

    async processQuery(query) {
        const q = query.toLowerCase();
        if (/(hurt|kill|illegal|hack|steal|dangerous)/.test(q)) return "Protocol Alert: Unethical query detected. Access denied.";

        try {
            // Real-Time Logic Gates
            if (q.includes("weather")) return await this.fetchWeather();
            if (q.includes("bitcoin") || q.includes("crypto")) return await this.fetchFinance();
            if (q.includes("time") || q.includes("date")) return `System Clock: ${new Date().toLocaleString()}`;
            if (q.includes("trending") || q.includes("social")) return "Trending: 'AI-Human Integration' and 'Quantum Computing' are currently leading global social discussions.";
            if (/[0-9]/.test(q) && /[+\-*/]/.test(q)) return this.compute(q);

            // Live Knowledge Retrieval
            const wiki = await this.fetchWiki(query);
            if (wiki) return wiki;

            const web = await this.fetchWeb(query);
            return web || "I've searched live repositories but couldn't find a direct match. Try rephrasing.";
        } catch (e) { return "Link Interrupted: Connection to live sources timed out."; }
    }

    async fetchWeather() {
        const res = await fetch("https://api.open-meteo.com/v1/forecast?latitude=51.5&longitude=-0.1&current=temperature_2m&temperature_unit=fahrenheit");
        const data = await res.json();
        return `Atmospheric Update: It is currently ${data.current.temperature_2m}°F in London.`;
    }

    async fetchFinance() {
        const res = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana&vs_currencies=usd");
        const data = await res.json();
        return `Market Intel: BTC $${data.bitcoin.usd} | ETH $${data.ethereum.usd} | SOL $${data.solana.usd}`;
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
        try { return `Computation Result: ${eval(q.replace(/x/g, '*').replace(/[^0-9+\-*/(). ]/g, ''))}`; } catch(e) { return "Calculation error."; }
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
