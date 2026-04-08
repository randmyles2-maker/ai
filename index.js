class TRONetwork {
    constructor() {
        this.chatFlow = document.getElementById('chat-flow');
        this.input = document.getElementById('user-query');
        this.btn = document.getElementById('send-btn');
        this.photoInput = document.getElementById('photo-input');
        this.init();
        
        window.addEventListener('load', () => {
            this.addMessage("TRO UPLINK STABLE. SYSTEM READY.", "ai-msg");
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
        
        // Show initial loading state
        const responseBubble = this.addMessage("ANALYZING...", "ai-msg");
        
        // Actually fetch data
        const result = await this.query(val);
        
        // Update the SAME bubble with the real answer
        responseBubble.innerText = result;
        this.chatFlow.scrollTop = this.chatFlow.scrollHeight;
    }

    async query(q) {
        try {
            const res = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(q)}`);
            const data = await res.json();
            return data.extract || "Command recognized but no external data found.";
        } catch(e) {
            return "ERROR: Uplink interrupted.";
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
        isHTML ? div.innerHTML = content : div.innerText = content;
        this.chatFlow.appendChild(div);
        
        this.chatFlow.scrollTop = this.chatFlow.scrollHeight;
        return div; // Return the element so we can update it later
    }
}
new TRONetwork();
