from apscheduler.schedulers.asyncio import AsyncIOScheduler
from core.sync_engine import GlobalSyncEngine
import asyncio

scheduler = AsyncIOScheduler()
sync_engine = GlobalSyncEngine()

# The 10-minute heartbeat
@scheduler.scheduled_job('interval', minutes=10)
async def run_universal_update():
    print("--- 10-Minute Universal Sync Started ---")
    await sync_engine.sync_all()

if __name__ == "__main__":
    scheduler.start()
    asyncio.get_event_loop().run_forever()
