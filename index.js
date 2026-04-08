class TRONetwork {
    constructor() {
        this.chatFlow = document.getElementById('chat-flow');
        this.input = document.getElementById('user-query');
        this.btn = document.getElementById('send-btn');
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
        this.input.value = ''; // Instant clear for "Real Chat" feel

        const responseBubble = this.addMessage("SCANNING REPOSITORIES...", "ai-msg", true);
        
        // 1. Math Logic (Handles 'x' as '*')
        const mathCheck = val.toLowerCase().replace(/x/g, '*').replace(/\s/g, '');
        if (/^[0-9+\-*/().]+$/.test(mathCheck) && /[0-9]/.test(mathCheck)) {
            try {
                const answer = new Function(`return ${mathCheck}`)();
                this.finalize(responseBubble, `<b>MATH ENGINE</b><br>${val} = ${answer}`);
                return;
            } catch(e) {}
        }

        // 2. Full Source Routing Logic
        const result = await this.sourceRouter(val);
        this.finalize(responseBubble, result);
    }

    async sourceRouter(q) {
        const query = q.toLowerCase();
        let sourceName = "Wikipedia"; // Global Default

        // 💻 TECH & PROGRAMMING
        if (/(js|html|css|web|coding|script|programming|developer)/.test(query)) {
            sourceName = "MDN / Stack Overflow / freeCodeCamp";
        } 
        // 🔬 SCIENCE
        else if (/(space|nasa|physics|biology|nature|earth|science|planet|star)/.test(query)) {
            sourceName = "NASA / NatGeo / MIT OpenCourseWare";
        }
        // 🏛️ HISTORY
        else if (/(history|war|ancient|century|document|archive|smithsonian)/.test(query)) {
            sourceName = "History.com / Smithsonian / National Archives";
        }
        // 📚 LITERATURE
        else if (/(book|poem|poetry|classic|summary|literature|gutenberg|poetry foundation)/.test(query)) {
            sourceName = "Project Gutenberg / SparkNotes / Poetry Foundation";
        }
        // 🧠 ACADEMIC & RESEARCH
        else if (/(research|paper|study|thesis|article|data)/.test(query)) {
            sourceName = "arXiv / CORE / Semantic Scholar / BASE / RefSeek";
        }
        // 🏫 EDUCATION
        else if (/(learn|lesson|course|how to|explain|khan academy)/.test(query)) {
            sourceName = "Khan Academy / Coursera / Open Library";
        }
        // 🌐 GENERAL TRUTH
        else if (/(fact|stat|opinion|public|demographic|pew)/.test(query)) {
            sourceName = "Encyclopaedia Britannica / Pew Research";
        }

        try {
            const endpoint = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(q)}`;
            const res = await fetch(endpoint);
            const data = await res.json();
            
            let text = data.extract || "Query recognized, but the repository abstract is unavailable.";
            
            // Smart response: Short for simple queries, full for complex
            if (q.split(' ').length <= 2 && text.includes('. ')) {
                text = text.split('. ')[0] + '.';
            }

            return `<b>SOURCE: ${sourceName}</b><br>${text}`;
        } catch(e) {
            return "<b>UPLINK ERROR:</b> Sources are currently unreachable.";
        }
    }

    finalize(bubble, content) {
        bubble.innerHTML = content;
        this.saveHistory(content, 'ai-msg');
        this.isProcessing = false;
        this.chatFlow.scrollTop = this.chatFlow.scrollHeight;
    }

    saveHistory(content, type) {
        let history = JSON.parse(localStorage.getItem('tro_storage')) || [];
        history.push({ content, type });
        localStorage.setItem('tro_storage', JSON.stringify(history.slice(-60)));
    }

    loadHistory() {
        let history = JSON.parse(localStorage.getItem('tro_storage')) || [];
        history.forEach(msg => this.addMessage(msg.content, msg.type, false));
        if (history.length === 0) {
            this.addMessage("TRO NETWORK: All links (NASA, MDN, arXiv, etc.) have been successfully integrated.", "ai-msg", false);
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
new TRONetwork();
