import asyncio
import wikipediaapi
import yfinance as yf
from core.db_handler import save_to_vector_db

class GlobalSyncEngine:
    def __init__(self):
        self.wiki = wikipediaapi.Wikipedia('UniversalAI/1.0', 'en')

    async def sync_history(self):
        # Fetches "Current Events" from Wiki
        page = self.wiki.page("Portal:Current_events")
        return save_to_vector_db("History", page.summary)

    async def sync_science(self):
        # Fetch latest Physics/Math papers or data
        # Logic for arXiv or NASA API goes here
        return save_to_vector_db("Science", "Latest Scientific Data...")

    async def sync_all(self):
        # Multitasking: Runs everything at once
        await asyncio.gather(
            self.sync_history(),
            self.sync_science()
        )
