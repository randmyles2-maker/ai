class TRONetwork {
    constructor() {
        this.chatFlow = document.getElementById('chat-flow');
        this.input = document.getElementById('user-query');
        this.btn = document.getElementById('send-btn');
        this.photoInput = document.getElementById('photo-input');
        this.init();
        
        window.addEventListener('load', () => {
            this.addMessage("TRO INTELLIGENCE: Contextual Link Active. Optimized for efficiency.", "ai-msg");
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
        
        // Smarter decision making based on word count
        const wordCount = val.split(' ').length;
        const result = await this.smartQuery(val, wordCount);
        
        responseBubble.innerHTML = result;
        this.chatFlow.scrollTop = this.chatFlow.scrollHeight;
    }

    async smartQuery(q, length) {
        try {
            const wikiRes = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(q)}`);
            const wikiData = await wikiRes.json();
            
            let source = "WIKIPEDIA";
            let content = wikiData.extract;

            if (!content || wikiData.type === "disambiguation") {
                const ddgRes = await fetch(`https://api.duckduckgo.com/?q=${encodeURIComponent(q)}&format=json&no_html=1`);
                const ddgData = await ddgRes.json();
                content = ddgData.AbstractText;
                source = "DUCKDUCKGO";
            }

            if (!content) return "<b>NOTICE:</b> Data point not found in verified repositories.";

            // SMARTS: If user typed 3 words or less, summarize the response to 1-2 sentences.
            if (length <= 3) {
                const sentences = content.split('. ');
                content = sentences[0] + (sentences[1] ? '. ' + sentences[1] : '.');
            }

            return `<b>SOURCE: ${source}</b><br>${content}`;
        } catch(e) {
            return "<b>ERROR:</b> Intelligence uplink interrupted.";
        }
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
        if (isHTML || content.includes('<br>')) {
            div.innerHTML = content;
        } else {
            div.innerText = content;
        }
        this.chatFlow.appendChild(div);
        this.chatFlow.scrollTop = this.chatFlow.scrollHeight;
        return div;
    }
}
new TRONetwork();
