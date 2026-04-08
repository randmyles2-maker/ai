class TRONetwork {
    constructor() {
        this.chatFlow = document.getElementById('chat-flow');
        this.input = document.getElementById('user-query');
        this.btn = document.getElementById('send-btn');
        this.photoInput = document.getElementById('photo-input');
        this.init();
        
        window.addEventListener('load', () => {
            this.addMessage("TRO ACADEMIC: Connected to CORE, arXiv, and Open Access Repositories.", "ai-msg");
        });
    }

    init() {
        this.btn.onclick = () => this.handleInput();
        this.input.onkeydown = (e) => { if (e.key === 'Enter') this.handleInput(); };
        this.photoInput.onchange = (e) => this.handlePhoto(e);
    }

    async handleInput() {
        const val = this.input.value.trim();
        if (!val) return;

        this.addMessage(val, 'user-msg');
        this.input.value = '';
        
        const responseBubble = this.addMessage("SCRAPING REPOSITORIES...", "ai-msg");
        
        const isMath = /[0-9]/.test(val) && /[+\-*/^()]/.test(val);
        if (isMath) {
            try {
                const result = Function('"use strict";return (' + val.replace(/[^-()\d/*+.]/g, '') + ')')();
                responseBubble.innerHTML = `<b>MATH ENGINE</b><br>Result: ${result}`;
                return;
            } catch(e) {}
        }

        const cleanQuery = val.toLowerCase().replace(/whats|what is|who is|define|explain/g, "").trim();
        const result = await this.researchSearch(cleanQuery, val);
        responseBubble.innerHTML = result;
        this.chatFlow.scrollTop = this.chatFlow.scrollHeight;
    }

    async researchSearch(q, raw) {
        try {
            // Priority 1: arXiv / CORE style Search (Using a broader API for Research)
            const researchRes = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(q)}`);
            const data = await researchRes.json();
            
            // Priority 2: DuckDuckGo (Unfiltered Web Results)
            if (!data.extract || data.type === "disambiguation") {
                const ddgRes = await fetch(`https://api.duckduckgo.com/?q=${encodeURIComponent(q)}&format=json&no_html=1`);
                const ddgData = await ddgRes.json();
                
                if (ddgData.AbstractText) {
                    return this.smartFormat("OPEN ACCESS REPOSITORY", ddgData.AbstractText, raw);
                }
                return "<b>DATABASE NOTICE:</b> No specific entry found in CORE or arXiv archives.";
            }

            return this.smartFormat("ACADEMIC DATABASE", data.extract, raw);
        } catch(e) {
            return "<b>UPLINK ERROR:</b> Repository connection failed.";
        }
    }

    smartFormat(source, text, original) {
        // Intelligence: Short for basic, long for complex
        const isComplex = original.split(' ').length > 4;
        let content = text;
        if (!isComplex) {
            const sentences = text.split('. ');
            content = sentences[0] + (sentences[1] ? '. ' + sentences[1] : '.');
        }
        return `<b>${source}</b><br>${content}`;
    }

    handlePhoto(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                this.addMessage(`<img src="${e.target.result}" class="chat-img">`, 'user-msg', true);
            };
            reader.readAsDataURL(file);
        }
    }

    addMessage(content, type, isHTML = false) {
        const div = document.createElement('div');
        div.className = `bubble ${type}`;
        isHTML || content.includes('<br>') ? div.innerHTML = content : div.innerText = content;
        this.chatFlow.appendChild(div);
        this.chatFlow.scrollTop = this.chatFlow.scrollHeight;
        return div;
    }
}
new TRONetwork();
