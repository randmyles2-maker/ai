async processQuery(query) {
    const q = query.toLowerCase().trim();

    // 1. ETHICS & SAFETY
    if (/(hurt|kill|illegal|hack|steal|bomb)/.test(q)) {
        return "Security Protocol: This query violates safety parameters.";
    }

    // 2. REAL-TIME DATA (Weather/Finance)
    if (q.includes("weather")) return await this.fetchWeather();
    if (q.includes("bitcoin") || q.includes("crypto")) return await this.fetchFinance();

    // 3. WIKIPEDIA KNOWLEDGE (Primary Source)
    // We send the query to the Wikipedia search engine first
    const wikiKnowledge = await this.fetchWiki(query);
    if (wikiKnowledge) return wikiKnowledge;

    // 4. FALLBACK (DuckDuckGo Web Search)
    const webResult = await this.fetchWeb(query);
    return webResult || "I've scanned live sources but couldn't find a direct match. Try rephrasing with a specific name or event.";
}

async fetchWiki(q) {
    try {
        // STEP A: Search for the most relevant page title
        const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(q)}&format=json&origin=*`;
        const searchRes = await fetch(searchUrl);
        const searchData = await searchRes.json();

        if (searchData.query.search.length > 0) {
            // Take the top result title (e.g., "World War II" instead of "ww2")
            const bestTitle = searchData.query.search[0].title;
            
            // STEP B: Fetch the actual summary for that title
            const summaryUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(bestTitle)}`;
            const summaryRes = await fetch(summaryUrl);
            const data = await summaryRes.json();
            
            return `[Wikipedia Insight]: ${data.extract}`;
        }
        return null;
    } catch (e) {
        console.error("Wiki Link Failed", e);
        return null;
    }
}
