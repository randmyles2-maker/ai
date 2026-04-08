/**
 * TRO NETWORK - INFINITE BRAIN SYSTEM
 * Architecture: Tiered Knowledge (Lvl 1-5) + Auto-Learning + Persistent Memory
 */

class TRONetwork {
    constructor() {
        this.chatFlow = document.getElementById('chat-flow');
        this.input = document.getElementById('user-query');
        this.btn = document.getElementById('send-btn');
        
        // 1. INITIALIZE TIERED BRAIN (Levels 1-4)
        // If nothing is in LocalStorage, load the starter architecture
        this.brain = JSON.parse(localStorage.getItem('tro_brain')) || {
            level1: [
                {topic: "Addition", link: "Addition"},
                {topic: "Subtraction", link: "Subtraction"},
                {topic: "Fractions", link: "Fraction"},
                {topic: "PEMDAS", link: "Order_of_operations"},
                {topic: "Gravity", link: "Gravity"},
                {topic: "Human Body", link: "Human_body"},
                {topic: "Plants", link: "Plant"}
            ],
            level2: [
                {topic: "Algebra", link: "Algebra"},
                {topic: "Geometry", link: "Geometry"},
                {topic: "Probability", link: "Probability"},
                {topic: "Statistics", link: "Statistics"},
                {topic: "Genetics", link: "Genetics"},
                {topic: "Electricity", link: "Electricity"}
            ],
            level3: [
                {topic: "Calculus", link: "Calculus"},
                {topic: "Trigonometry", link: "Trigonometry"},
                {topic: "Thermodynamics", link: "Thermodynamics"},
                {topic: "Relativity", link: "General_relativity"},
                {topic: "Quantum Mechanics", link: "Quantum_mechanics"},
                {topic: "Cold War", link: "Cold_War"}
            ],
            level4: [
                {topic: "Linear Algebra", link: "Linear_algebra"},
                {topic: "Complex Numbers", link: "Complex_number"},
                {topic: "Biochemistry", link: "Biochemistry"},
                {topic: "Deep Learning", link: "Deep_learning"},
                {topic: "Neural Network", link: "Artificial_neural_network"},
                {topic: "Metaphysics", link: "Metaphysics"}
            ],
            level5: [] // Infinite Expansion Layer
        };

        this.isProcessing = false;
        this.init();
        this.loadHistory();
    }

    init() {
        this.btn.onclick = () => this.handleInput();
        this.input.onkeydown = (e) => { if (e.key === 'Enter') this.handleInput(); };
    }

    async handleInput() {
        const val = this.input.value.trim();
        if (!val || this.isProcessing) return;

        this.isProcessing = true;
        this.addMessage(val, 'user-msg', true);
        this.input.value = ''; // Instant clear input for real chat feel

        const responseBubble = this.addMessage("THINKING...", "ai-msg", true);
        
        // 2. MATH ENGINE (Handles 'x' for multiplication)
        const mathClean = val.toLowerCase().replace(/x/g, '*').replace(/\s/g, '');
        if (/^[0-9+\-*/().]+$/.test(mathClean) && /[0-9]/.test(mathClean)) {
            try {
                const answer = new Function(`return ${mathClean}`)();
                this.finalize(responseBubble, `<b>MATH ENGINE (LVL 1)</b><br>${val} = ${answer}`);
                return;
            } catch(e) { /* Fallback to search if math fails */ }
        }

        // 3. KNOWLEDGE ROUTING (Lvl 1-4 vs Lvl 5)
        let found = null;
        for (const [lvl, items] of Object.entries(this.brain)) {
            let match = items.find(i => val.toLowerCase().includes(i.topic.toLowerCase()));
            if (match) { 
                found = { lvl, ...match }; 
                break; 
            }
        }

        if (found) {
            // Found in Local Levels
            const data = await this.fetchWiki(found.link);
            this.finalize(responseBubble, `<b>KNOWLEDGE ${found.lvl.toUpperCase()}</b><br>${data}`);
        } else {
            // Level 5: Infinite Expansion & Auto-Learning
            const data = await this.fetchWiki(val);
            this.learn(val);
            this.finalize(responseBubble, `<b>INFINITE EXPANSION (LVL 5)</b><br>${data}`);
        }
    }

    async fetchWiki(topic) {
        try {
            const cleanTopic = topic.replace(/\s+/g, '_');
            const res = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(cleanTopic)}`);
            const data = await res.json();
            return data.extract || "Information retrieved, but no summary available.";
        } catch(e) {
            return "Connection Error: Failed to reach external repository.";
        }
    }

    // Auto-grows the brain.json (via LocalStorage)
    learn(topic) {
        const exists = this.brain.level5.some(t => t.topic.toLowerCase() === topic.toLowerCase());
        if (!exists) {
            this.brain.level5.push({ topic: topic, link: topic });
            localStorage.setItem('tro_brain', JSON.stringify(this.brain));
        }
    }

    finalize(bubble, content) {
        bubble.innerHTML = content;
        this.saveHistory(content, 'ai-msg');
        this.isProcessing = false;
        this.chatFlow.scrollTop = this.chatFlow.scrollHeight;
    }

    saveHistory(content, type) {
        let history = JSON.parse(localStorage.getItem('tro_chat_log')) || [];
        history.push({ content, type });
        localStorage.setItem('tro_chat_log', JSON.stringify(history.slice(-50)));
    }

    loadHistory() {
        let history = JSON.parse(localStorage.getItem('tro_chat_log')) || [];
        if (history.length > 0) {
            history.forEach(msg => this.addMessage(msg.content, msg.type, false));
        } else {
            this.addMessage("TRO NETWORK: Uplink Established. All Knowledge Levels (1-5) are active.", "ai-msg", false);
        }
    }

    addMessage(content, type, shouldSave = false) {
        const div = document.createElement('div');
        div.className = `bubble ${type}`;
        div.innerHTML = content;
        this.chatFlow.appendChild(div);
        if (shouldSave) this.saveHistory(content, type);
        this.chatFlow.scrollTop = this.chatFlow.scrollHeight;
        return div;
    }
}

// Start AI
new TRONetwork();
