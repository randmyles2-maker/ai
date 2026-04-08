class TRONetwork {
    constructor() {
        this.chatFlow = document.getElementById('chat-flow');
        this.input = document.getElementById('user-query');
        this.btn = document.getElementById('send-btn');
        this.photoInput = document.getElementById('photo-input');
        this.init();
        
        window.addEventListener('load', () => {
            this.addMessage("TRO NETWORK: Free Academic Uplink Active. Sourcing Math & Science.", "ai-msg");
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
        
        const responseBubble = this.addMessage("PROCESSING...", "ai-msg");
        
        // Step 1: Try Math/Science via WolframAlpha (Free Tier)
        const result = await this.universalBrain(val);
        
        responseBubble.innerHTML = result;
        this.chatFlow.scrollTop = this.chatFlow.scrollHeight;
    }

    async universalBrain(q) {
        try {
            // Clean the query
            const cleanQ = encodeURIComponent(q.toLowerCase().replace(/whats|what is|calculate/g, "").trim());

            // 1. Try Wikipedia first (Best for definitions/science)
            const wikiRes = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${cleanQ}`);
            const wikiData = await wikiRes.json();

            if (wikiData.extract && wikiData.type !== "disambiguation") {
                return `<b>SOURCE: ACADEMIC REPOSITORY</b><br>${this.smartTruncate(wikiData.extract, q)}`;
            }

            // 2. Fallback to DuckDuckGo for general knowledge
            const ddgRes = await fetch(`https://api.duckduckgo.com/?q=${cleanQ}&format=json&no_html=1`);
            const ddgData = await ddgRes.json();
            
            if (ddgData.AbstractText) {
                return `<b>SOURCE: WEB KNOWLEDGE</b><br>${this.smartTruncate(ddgData.AbstractText, q)}`;
            }

            return "<b>NOTICE:</b> Could not find a free data match. Rephrase the command.";
        } catch (e) {
            return "<b>UPLINK ERROR:</b> Connection timed out.";
        }
    }

    // Logic to make it "Smarter" - short answers for short questions
    smartTruncate(text, original) {
        const words = original.split(' ').length;
        if (words <= 3) {
            return text.split('. ')[0] + '.';
        }
        return text;
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
