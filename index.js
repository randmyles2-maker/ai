class TRONetwork {
    constructor() {
        this.chatFlow = document.getElementById('chat-flow');
        this.input = document.getElementById('user-query');
        this.btn = document.getElementById('send-btn');
        this.savedList = document.getElementById('saved-list');
        this.init();
        this.loadSavedData();
        
        window.addEventListener('load', () => {
            setTimeout(() => {
                this.addMessage("TRO NETWORK: Intelligence link established. System standalone mode active.", "ai-msg");
            }, 500);
        });
    }

    init() {
        this.btn.onclick = () => this.handleInput();
        this.input.onkeydown = (e) => { if (e.key === 'Enter') { e.preventDefault(); this.handleInput(); } };
    }

    async handleInput() {
        const val = this.input.value.trim();
        if (!val) return;
        this.addMessage(val, 'user-msg');
        this.input.value = '';
        const loader = this.addMessage('Processing...', 'ai-msg');
        const res = await this.processQuery(val);
        loader.innerText = res;
        this.chatFlow.scrollTop = this.chatFlow.scrollHeight;
    }

    async processQuery(q) {
        const query = q.toLowerCase();
        if (/[0-9]/.test(query) && /[+\-*/]/.test(query)) {
            try { return "RESULT: " + eval(query.replace(/[^-()\d/*+.]/g, '')); } catch(e) { return "MATH ERROR"; }
        }
        try {
            const res = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(q)}`);
            const data = await res.json();
            return data.extract || "No direct data match found.";
        } catch(e) { return "System offline or link failed."; }
    }

    saveData(text) {
        let saved = JSON.parse(localStorage.getItem('tro_db') || '[]');
        if (!saved.includes(text)) {
            saved.push(text);
            localStorage.setItem('tro_db', JSON.stringify(saved));
            this.renderSaved();
        }
    }

    loadSavedData() { this.renderSaved(); }

    renderSaved() {
        const saved = JSON.parse(localStorage.getItem('tro_db') || '[]');
        this.savedList.innerHTML = saved.slice().reverse().map(item => 
            `<div class="saved-item" onclick="alert('${item.replace(/'/g, "\\'")}')">${item.substring(0, 25)}...</div>`
        ).join('');
    }

    addMessage(text, type) {
        const div = document.createElement('div');
        div.className = `bubble ${type}`;
        div.innerText = text;
        if(type === 'ai-msg') div.onclick = () => this.saveData(text);
        this.chatFlow.appendChild(div);
        this.chatFlow.scrollTop = this.chatFlow.scrollHeight;
        return div;
    }
}

// REGISTER SERVICE WORKER FOR INSTALLATION
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./sw.js').catch(err => console.log("SW failed", err));
}

new TRONetwork();
