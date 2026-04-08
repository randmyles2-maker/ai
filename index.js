/**
 * TRO NETWORK - Integrated OS Engine
 * Optimized for App-style Layout and Persistent Storage
 */

class TRONetwork {
    constructor() {
        // DOM References
        this.chatFlow = document.getElementById('chat-flow');
        this.input = document.getElementById('user-query');
        this.btn = document.getElementById('send-btn');
        this.savedList = document.getElementById('saved-list');
        
        this.init();
        this.loadSavedData();

        // APP INITIALIZATION GREETING
        // This ensures the screen isn't black/empty when you first open the app
        window.addEventListener('load', () => {
            setTimeout(() => {
                this.addMessage("TRO NETWORK: Neural link established. System status optimal. Database synchronized.", "ai-msg");
            }, 500);
        });
    }

    init() {
        // Handle User Input via Mouse or Enter Key
        this.btn.onclick = () => this.handleInput();
        
        this.input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault(); // Prevents page refresh or focus loss
                this.handleInput();
            }
        });
    }

    async handleInput() {
        const val = this.input.value.trim();
        if (!val) return;

        // 1. Post User Command
        this.addMessage(val, 'user-msg');
        this.input.value = '';

        // 2. Initial Thinking State
        const loaderId = this.addMessage('TRO System: Querying Repositories...', 'ai-msg loading');
        
        // 3. Process Command
        const response = await this.processQuery(val);
        this.updateMessage(loaderId, response);
    }

    async processQuery(query) {
        const q = query.toLowerCase().trim();

        // Math Logic
        if (/[0-9]/.test(q) && /[+\-*/^()]/.test(q)) {
            return this.solveMath(q);
        }

        // Live Data Logic
        if (q.includes("weather")) return await this.fetchWeather();
        if (q.includes("bitcoin") || q.includes("crypto")) return await this.fetchFinance();

        // Knowledge Base Logic
        const wiki = await this.fetchWiki(query);
        if (wiki) return wiki;

        // Fallback Web Harvester
        return await this.fetchWeb(query);
    }

    // --- COMPUTATIONAL METHODS ---

    solveMath(q) {
        try {
            const result = eval(q.replace(/x/g, '*').replace(/[^-()\d/*+.]/g, ''));
            return `COMPUTATION RESULT: ${result}`;
        } catch (e) { return "COMPUTATION ERROR: Expression invalid."; }
    }

    async fetchWiki(q) {
        try {
            const search = await fetch(`https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(q)}&format=json&origin=*`);
            const sData = await search.json();
            if (sData.query.search.length > 0) {
                const title = sData.query.search[0].title;
                const sum = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`);
                const d = await sum.json();
                return d.extract;
            }
            return null;
        } catch(e) { return null; }
    }

    async fetchWeb(q) {
        try {
            const res = await fetch(`https://api.duckduckgo.com/?q=${encodeURIComponent(q)}&format=json&no_html=1`);
            const data = await res.json();
            return data.AbstractText || "TRO NETWORK: No data match found in live repositories.";
        } catch (e) { return "UPLINK ERROR: Connection failed."; }
    }

    async fetchWeather() {
        const res = await fetch("https://api.open-meteo.com/v1/forecast?latitude=51.5&longitude=-0.1&current=temperature_2m&temperature_unit=fahrenheit");
        const data = await res.json();
        return `ATMOSPHERIC DATA: Current Temp: ${data.current.temperature_2m}°F (London Station).`;
    }

    async fetchFinance() {
        const res = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd");
        const data = await res.json();
        return `MARKET INTEL: BTC $${data.bitcoin.usd.toLocaleString()} | ETH $${data.ethereum.usd.toLocaleString()}.`;
    }

    // --- PERSISTENCE & SIDEBAR STORAGE ---

    saveData(text) {
        let saved = JSON.parse(localStorage.getItem('tro_db') || '[]');
        if (!saved.includes(text)) {
            saved.push(text);
            localStorage.setItem('tro_db', JSON.stringify(saved));
            this.renderSaved();
        }
    }

    loadSavedData() {
        this.renderSaved();
    }

    renderSaved() {
        const saved = JSON.parse(localStorage.getItem('tro_db') || '[]');
        // We show the most recent saves at the top
        this.savedList.innerHTML = saved.slice().reverse().map(item => 
            `<div class="saved-item" onclick="alert('${item.replace(/'/g, "\\'")}')">
                ${item.substring(0, 30)}...
             </div>`
        ).join('');
    }

    // --- INTERFACE HELPERS ---

    addMessage(text, type) {
        const div = document.createElement('div');
        div.className = `bubble ${type}`;
        div.innerText = text;
        
        // Save functionality for AI responses
        if (type.includes('ai-msg')) {
            div.style.cursor = "pointer";
            div.title = "Save to Database";
            div.onclick = () => this.saveData(text);
        }

        this.chatFlow.appendChild(div);
        
        // Auto-scroll logic: ensures user always sees the newest message
        this.chatFlow.scrollTop = this.chatFlow.scrollHeight;
        return div;
    }

    updateMessage(el, text) {
        el.classList.remove('loading');
        el.innerText = text;
        this.chatFlow.scrollTop = this.chatFlow.scrollHeight;
    }
}

// Start TRO Engine
new TRONetwork();
