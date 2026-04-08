class TRONetwork {
    constructor() {
        this.chatFlow = document.getElementById('chat-flow');
        this.input = document.getElementById('user-query');
        this.btn = document.getElementById('send-btn');
        this.photoInput = document.getElementById('photo-input');
        this.init();
        
        window.addEventListener('load', () => {
            this.addMessage("TRO UPLINK STABLE. READY FOR COMMAND.", "ai-msg");
        });
    }

    init() {
        this.btn.onclick = () => this.handleInput();
        this.input.onkeydown = (e) => { if (e.key === 'Enter') this.handleInput(); };
        this.photoInput.onchange = (e) => this.handlePhoto(e);
    }

    handleInput() {
        const val = this.input.value.trim();
        if (!val) return;
        this.addMessage(val, 'user-msg');
        this.input.value = '';
        
        setTimeout(() => {
            this.addMessage("COMMAND PROCESSED.", "ai-msg");
        }, 800);
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
        
        // Ensure it scrolls to the newest message
        this.chatFlow.scrollTop = this.chatFlow.scrollHeight;
    }
}
new TRONetwork();
