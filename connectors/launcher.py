import threading
import os
import time
import subprocess
from datetime import datetime

def run_api():
    """Starts the FastAPI server for instant website interaction."""
    print("🚀 Starting Live API Node...")
    os.system("python api_node.py")

def run_sync_loop():
    """Syncs 'All Knowledge' to GitHub every 10 minutes."""
    while True:
        print(f"[{datetime.now()}] Gathering science, math, and history data...")
        # Simulate data gathering
        # In your real setup, call your sync_engine.py logic here
        
        try:
            subprocess.run(["git", "add", "."], check=True)
            subprocess.run(["git", "commit", "-m", "Auto-update knowledge"], check=True)
            subprocess.run(["git", "push", "origin", "main"], check=True)
            print("✅ GitHub Dashboard Updated.")
        except Exception as e:
            print(f"❌ Sync failed: {e}")
            
        time.sleep(600)

if __name__ == "__main__":
    # Start API in background thread
    api_thread = threading.Thread(target=run_api, daemon=True)
    api_thread.start()
    
    # Start Sync loop in main thread
    run_sync_loop()
