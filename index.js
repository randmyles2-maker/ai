// Rule 3: Ethics & Right vs Wrong
const FORBIDDEN = ["hurt", "steal", "illegal", "dangerous", "hack", "kill"];

// Rule 1 & 6: Knowledge Base
const FACTS = {
    "gravity": "Gravity is the force that pulls objects toward each other. It keeps us on the ground and planets in orbit.",
    "history": "History is the study of past events, helping us understand cause and effect to make better future decisions.",
    "science": "Science is the systematic study of the structure and behavior of the physical world through observation.",
    "ai": "AI needs high-quality data, robust algorithms, and powerful infrastructure like GPUs to function.",
    "ethics": "AI ethics ensure technology is fair, transparent, and avoids causing harm to people."
};

function getResponse(input) {
    const q = input.toLowerCase().trim();

    // Rule 3: Ethics Filter
    if (FORBIDDEN.some(word => q.includes(word))) {
        return "I cannot fulfill this request. I am programmed to follow ethical guidelines that prioritize safety and avoid harm.";
    }

    // Rule 1: Math Logic (Cause and Effect)
    const mathClean = q.replace(/x/g, '*').replace(/[^0-9+\-*/(). ]/g, '');
    if (mathClean.length > 0 && /[+\-*/]/.test(mathClean)) {
        try {
            return "Based on mathematical logic, the result is: " + eval(mathClean);
        } catch (e) {
            return "I tried to calculate that, but the math expression is invalid.";
        }
    }

    // Rule 2: Human Feelings & Communication
    if (q.includes("sad") || q.includes("struggle") || q.includes("feel")) {
        return "I understand that humans have complex feelings and goals. While I don't have emotions, I can offer a respectful space to discuss topics or provide helpful information.";
    }

    // Rule 1: Science & History Facts
    for (let key in FACTS) {
        if (q.includes(key)) return FACTS[key];
    }

    // Rule 4: Admitting Limits
    if (q.length < 2) return "I need a bit more information to give a helpful answer.";

    // Rule 5: Adaptation (Fallback)
    return "I've processed your message. I am still learning and adapting, but I can help you with math, science facts, or explaining AI principles!";
}

function sendMsg() {
    const input = document.getElementById('user-input');
    const container = document.getElementById('chat-container');
    const val = input.value.trim();

    if (!val) return;

    // Add User Message
    container.innerHTML += `<div class="msg user">${val}</div>`;
    input.value = "";

    // Rule 6: Practical Usefulness (Timed Response)
    setTimeout(() => {
        const reply = getResponse(val);
        container.innerHTML += `<div class="msg ai">${reply}</div>`;
        container.scrollTop = container.scrollHeight;
    }, 400);
}
