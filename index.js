class TRONetwork {
    constructor() {
        this.chatFlow = document.getElementById('chat-flow');
        this.input = document.getElementById('user-query');
        this.btn = document.getElementById('send-btn');
        this.photoInput = document.getElementById('photo-input');
        this.init();
        
        window.addEventListener('load', () => {
            this.addMessage("TRO NETWORK: Intelligence Uplink Active. Sourcing from verified global repositories.", "ai-msg");
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
        
        const responseBubble = this.addMessage("SEARCHING REPOSITORIES...", "ai-msg");
        
        // Execute the "Smarter" Search
        const result = await this.smartQuery(val);
        
        responseBubble.innerHTML = result;
        this.chatFlow.scrollTop = this.chatFlow.scrollHeight;
    }

    async smartQuery(q) {
        try {
            // 1. Try Wikipedia for deep knowledge
            const wikiRes = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(q)}`);
            const wikiData = await wikiRes.json();
            
            if (wikiData.extract && wikiData.type !== "disambiguation") {
                return `<b>SOURCE: WIKIPEDIA</b><br>${wikiData.extract}`;
            }

            // 2. Fallback to DuckDuckGo for live/general facts
            const ddgRes = await fetch(`https://api.duckduckgo.com/?q=${encodeURIComponent(q)}&format=json&no_html=1`);
            const ddgData = await ddgRes.json();
            
            if (ddgData.AbstractText) {
                return `<b>SOURCE: DUCKDUCKGO</b><br>${ddgData.AbstractText}`;
            }

            return "<b>NOTICE:</b> No verified source match found for this command.";
        } catch(e) {
            return "<b>ERROR:</b> External uplink timed out.";
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
