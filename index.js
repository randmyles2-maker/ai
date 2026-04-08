class TRONetwork {
    constructor() {
        this.chatFlow = document.getElementById('chat-flow');
        this.input = document.getElementById('user-query');
        this.btn = document.getElementById('send-btn');
        this.photoInput = document.getElementById('photo-input');
        this.init();
        
        window.addEventListener('load', () => {
            this.addMessage("TRO UNIVERSAL INTELLIGENCE: Math, Science, and Fact-Check modules online.", "ai-msg");
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
        
        const responseBubble = this.addMessage("...", "ai-msg");
        
        // 1. Check if it's a Math Question
        if (/[0-9]/.test(val) && /[+\-*/^()]/.test(val)) {
            try {
                // Basic math solver logic
                const calculation = val.replace(/[^-()\d/*+.]/g, '');
                const result = Function('"use strict";return (' + calculation + ')')();
                responseBubble.innerHTML = `<b>MODULE: MATHEMATICS</b><br>Result: ${result}`;
                return;
            } catch(e) { /* Fallthrough to search if math fails */ }
        }

        // 2. Clean query for Science/Facts
        const cleanQuery = val.toLowerCase()
            .replace(/whats|what is|who is|define|how does|tell me about/g, "")
            .trim();

        const result = await this.universalSearch(cleanQuery, val.split(' ').length);
        responseBubble.innerHTML = result;
        this.chatFlow.scrollTop = this.chatFlow.scrollHeight;
    }

    async universalSearch(q, length) {
        try {
            // Priority 1: Wikipedia (Best for Science/History)
            const wikiRes = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(q)}`);
            const wikiData = await wikiRes.json();
            
            if (wikiData.extract && wikiData.type !== "disambiguation") {
                return this.formatResponse("KNOWLEDGE BASE", wikiData.extract, length);
            }

            // Priority 2: DuckDuckGo (Best for general/quick questions)
            const ddgRes = await fetch(`https://api.duckduckgo.com/?q=${encodeURIComponent(q)}&format=json&no_html=1`);
            const ddgData = await ddgRes.json();
            
            if (ddgData.AbstractText) {
                return this.formatResponse("WEB SOURCE", ddgData.AbstractText, length);
            }

            return "<b>NOTICE:</b> Query remains outside known repositories. Rephrase for uplink.";
        } catch(e) {
            return "<b>ERROR:</b> System Uplink Timeout.";
        }
    }

    formatResponse(source, text, length) {
        let content = text;
        // If query is 3 words or less, give a shorter, "smarter" answer
        if (length <= 3) {
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
