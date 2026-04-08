// REPLACE THIS with your actual key from https://platform.openai.com/api-keys
const OPENAI_API_KEY = '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'; 

class TRONetwork {
    constructor() {
        this.chatFlow = document.getElementById('chat-flow');
        this.input = document.getElementById('user-query');
        this.btn = document.getElementById('send-btn');
        this.photoInput = document.getElementById('photo-input');
        this.init();
        
        window.addEventListener('load', () => {
            this.addMessage("TRO NETWORK: GPT-4o Uplink Online. Monitoring data streams.", "ai-msg");
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
        
        const responseBubble = this.addMessage("THINKING...", "ai-msg");
        
        const result = await this.askChatGPT(val);
        responseBubble.innerHTML = result;
        this.chatFlow.scrollTop = this.chatFlow.scrollHeight;
    }

    async askChatGPT(prompt) {
        if (OPENAI_API_KEY === 'YOUR_OPENAI_API_KEY') {
            return "<b>CONFIG ERROR:</b> API Key is missing. Please add your key to index.js.";
        }

        try {
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${OPENAI_API_KEY}`
                },
                body: JSON.stringify({
                    model: "gpt-4o-mini",
                    messages: [
                        { role: "system", content: "You are TRO Network, a highly intelligent research AI. Provide precise, academic-tier answers. Be concise for basic facts, but detailed for complex science or math." },
                        { role: "user", content: prompt }
                    ]
                })
            });

            const data = await response.json();
            
            if (!response.ok) {
                console.error("OpenAI Error:", data);
                return `<b>UPLINK ERROR:</b> ${data.error.message}`;
            }
            
            const text = data.choices[0].message.content;
            return `<b>SOURCE: CHATGPT-4o</b><br>${text.replace(/\n/g, '<br>')}`;
            
        } catch (e) {
            console.error("Fetch Error:", e);
            return "<b>CONNECTION FAILED:</b> Check your internet or API limits.";
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
        isHTML || content.includes('<br>') ? div.innerHTML = content : div.innerText = content;
        this.chatFlow.appendChild(div);
        this.chatFlow.scrollTop = this.chatFlow.scrollHeight;
        return div;
    }
}
new TRONetwork();
