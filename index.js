class TRONetwork {
    constructor() {
        this.chatFlow = document.getElementById('chat-flow');
        this.input = document.getElementById('user-query');
        this.btn = document.getElementById('send-btn');
        this.photoInput = document.getElementById('photo-input');
        this.init();
        
        window.addEventListener('load', () => {
            this.addMessage("TRO CORE: Global Knowledge Base Linked. Ready for complex analysis.", "ai-msg");
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
        
        const responseBubble = this.addMessage("ACCESSING REPOSITORIES...", "ai-msg");
        
        // Clean the query for better API matching
        const cleanQuery = val.toLowerCase()
            .replace(/whats|what is|who is|define|how does|explain|tell me about/g, "")
            .trim();

        const result = await this.deepSearch(cleanQuery, val);
        responseBubble.innerHTML = result;
        this.chatFlow.scrollTop = this.chatFlow.scrollHeight;
    }

    async deepSearch(q, rawQuery) {
        try {
            // Attempt 1: Scientific/Factual Deep Dive (Wikipedia)
            const wikiRes = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(q)}`);
            const wikiData = await wikiRes.json();
            
            if (wikiData.extract && wikiData.type !== "disambiguation") {
                return this.smartFormat("KNOWLEDGE BASE", wikiData.extract, rawQuery);
            }

            // Attempt 2: General/Complex Web Summary (DuckDuckGo)
            const ddgRes = await fetch(`https://api.duckduckgo.com/?q=${encodeURIComponent(q)}&format=json&no_html=1`);
            const ddgData = await ddgRes.json();
            
            if (ddgData.AbstractText) {
                return this.smartFormat("GLOBAL SOURCE", ddgData.AbstractText, rawQuery);
            }

            return "<b>SYSTEM NOTICE:</b> No verified data match found in the current uplink. Try rephrasing for deep analysis.";
        } catch(e) {
            return "<b>UPLINK ERROR:</b> Failed to reach external knowledge centers.";
        }
    }

    smartFormat(source, text, originalQuery) {
        // COMPLEXITY LOGIC: 
        // If the user's query contains "explain" or is longer than 5 words, give the full detail.
        // Otherwise, provide a punchy, smarter summary.
        const isComplexRequest = originalQuery.toLowerCase().includes('explain') || originalQuery.split(' ').length > 5;
        
        let content = text;
        if (!isComplexRequest) {
            const sentences = text.split('. ');
            content = sentences[0] + (sentences[1] ? '. ' + sentences[1] : '.');
        }

        return `<b>SOURCE: ${source}</b><br>${content}`;
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
