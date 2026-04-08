/**
 * TRO NETWORK - Integrated OS
 * Features: Math, Wiki, Weather, Finance, Social Hub, and Local Storage Persistence.
 */

class TRONetwork {
    constructor() {
        this.chatFlow = document.getElementById('chat-flow');
        this.input = document.getElementById('user-query');
        this.btn = document.getElementById('send-btn');
        this.savedList = document.getElementById('saved-list');
        
        this.init();
        this.loadSavedData(); // Restores your sidebar on refresh
    }

    init() {
        // App-style interaction: No page refreshes
        this.btn.onclick = () => this.handleInput();
        this.input.onkeydown = (e) => { 
            if (e.key === 'Enter') {
                e.preventDefault();
                this.handleInput(); 
            }
        };
    }

    async handleInput() {
        const val = this.input.value.trim();
        if (!val) return;

        // 1. Immediate UI update
        this.addMessage(val, 'user-msg');
        this.input.value = '';
        
        // 2. Show processing state
        const loaderId = this.addMessage('TRO System: Accessing Repositories...', 'ai-msg loading');
        
        // 3. Process through Logic Gates
        const response = await this.processQuery(val);
        this.updateMessage(loaderId, response);
    }

    async processQuery(query) {
        const q = query.toLowerCase().trim();

        // --- GATE 1: SECURITY ---
        if (/(hurt|kill|illegal|hack|steal|bomb|exploit)/.test(q)) {
            return "SECURITY ALERT: Command blocked. Unethical parameters detected.";
        }

        // --- GATE 2: COMPUTATIONAL (MATH) ---
        if (/[0-9]/.test(q) && /[+\-*/^()]/.test(q)) {
            return this.solveMath(q);
        }

        // --- GATE 3: SENSORS (WEATHER/FINANCE) ---
        if (q.includes("weather")) return await this.fetchWeather();
        if (q.includes("bitcoin") || q.includes("crypto")) return await this.fetchFinance();

        // --- GATE 4: SOCIAL HUB ---
        if (q.includes("trending") || q.includes("social")) {
            return "SOCIAL HUB: Current global trends indicate a massive shift toward Decentralized AI and Quantum Encryption.";
        }

        // --- GATE 5: KNOWLEDGE (WIKIPEDIA) ---
        const wiki = await this.fetchWiki(query);
        if (wiki) return wiki;

        // --- GATE 6: WEB HARVESTER (FALLBACK) ---
        return await this.fetchWeb(query);
    }

    // --- LOGIC MODULES ---

    solveMath(q) {
        try {
            const expression = q.replace(/x/g, '*').replace(/[^-()\d/*+.]/g, '');
            const result = eval(expression);
            return `COMPUTATION COMPLETE: Result is ${result}`;
        } catch (e) { return "MATH ERROR: Malformed expression."; }
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
            return data.AbstractText || "TRO NETWORK: No definitive data match in live repositories.";
        } catch (e) { return "UPLINK ERROR: Web harvester timed out."; }
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

    // --- APP STATE & PERSISTENCE ---

    saveData(text) {
        // Save to LocalStorage so it works like an App
        let saved = JSON.parse(localStorage.getItem('tro_storage') || '[]');
        if (!saved.includes(text)) {
            saved.push(text);
            localStorage.setItem('tro_storage', JSON.stringify(saved));
            this.renderSaved();
        }
    }

    loadSavedData() {
        this.renderSaved();
    }

    renderSaved() {
        const saved = JSON.parse(localStorage.getItem('tro_storage') || '[]');
        // We reverse it so the newest saved item is on top
        this.savedList.innerHTML = saved.reverse().map(item => 
            `<div class="saved-item" onclick="alert('${item.replace(/'/g, "\\'")}')">
                ${item.substring(0, 35)}...
             </div>`
        ).join('');
    }

    // --- UI HELPERS ---

    addMessage(text, type) {
        const div = document.createElement('div');
        div.className = `bubble ${type}`;
        div.innerText = text;
        
        // App Feature: Click an AI message to save it to the sidebar
        if(type.includes('ai-msg')) {
            div.style.cursor = "pointer";
            div.title = "Click to save to Database";
            div.onclick = () => this.saveData(text);
        }

        this.chatFlow.appendChild(div);
        this.chatFlow.scrollTop = this.chatFlow.scrollHeight;
        return div;
    }

    updateMessage(el, text) {
        el.classList.remove('loading');
        el.innerText = text;
        this.chatFlow.scrollTop = this.chatFlow.scrollHeight;
    }
}

// Power on the Network
new TRONetwork();
