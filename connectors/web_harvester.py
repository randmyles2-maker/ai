from crawl4ai import WebCrawler

async def harvest_web():
    async with WebCrawler() as crawler:
        # Example: Crawl a list of 100 top news/science sites
        result = await crawler.arun(url="https://news.ycombinator.com")
        # Returns clean Markdown that doesn't waste AI tokens
        return result.markdown
