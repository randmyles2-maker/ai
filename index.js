const OPENAI_API_KEY = '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';
const API_URL = 'https://api.openai.com/v1/chat/completions';

class TRONetwork {
    constructor() {
        this.chatFlow = document.getElementById('chat-flow');
        this.input = document.getElementById('user-query');
        this.btn = document.getElementById('send-btn');
        this.photoInput = document.getElementById('photo-input');
        this.init();
        
        window.addEventListener('load', () => {
            this.addMessage("TRO NETWORK: GPT-4o Uplink Established. System online.", "ai-msg");
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
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${OPENAI_API_KEY}`
                },
                body: JSON.stringify({
                    model: "gpt-4o-mini",
                    messages: [
                        { role: "system", content: "You are TRO Network AI. Be concise for short questions and detailed for complex ones." },
                        { role: "user", content: prompt }
                    ],
                    temperature: 0.7
                })
            });

            const data = await response.json();
            if (data.error) throw new Error(data.error.message);
            
            const text = data.choices[0].message.content;
            
            // Format response
            return `<b>SOURCE: CHATGPT</b><br>${text.replace(/\n/g, '<br>')}`;
        } catch (e) {
            console.error(e);
            return "<b>ERROR:</b> Uplink to ChatGPT failed. Check API Key or Credits.";
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
