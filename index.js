class TRONetwork {
    constructor() {
        this.chatFlow = document.getElementById('chat-flow');
        this.input = document.getElementById('user-query');
        this.btn = document.getElementById('send-btn');
        this.photoInput = document.getElementById('photo-input');
        this.init();
    }

    init() {
        this.btn.onclick = () => this.handleInput();
        this.input.onkeydown = (e) => { if (e.key === 'Enter') this.handleInput(); };
        
        // Handle Photo Upload
        this.photoInput.onchange = (e) => this.handlePhoto(e);
    }

    handleInput() {
        const val = this.input.value.trim();
        if (!val) return;
        this.addMessage(val, 'user-msg');
        this.input.value = '';
        
        // AI Response Logic
        setTimeout(() => {
            this.addMessage("TRO System: Command received and logged.", "ai-msg");
        }, 600);
    }

    handlePhoto(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const imgTag = `<img src="${e.target.result}" class="chat-img">`;
                this.addMessage(imgTag, 'user-msg', true);
            };
            reader.readAsDataURL(file);
        }
    }

    addMessage(content, type, isHTML = false) {
        const div = document.createElement('div');
        div.className = `bubble ${type}`;
        
        if (isHTML) {
            div.innerHTML = content;
        } else {
            div.innerText = content;
        }

        this.chatFlow.appendChild(div);
        
        // Forced scroll to bottom
        setTimeout(() => {
            this.chatFlow.scrollTo({
                top: this.chatFlow.scrollHeight,
                behavior: 'smooth'
            });
        }, 50);
        
        return div;
    }
}

new TRONetwork();
