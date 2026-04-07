import json
import time
import subprocess
from datetime import datetime
from core.orchestrator import run_universal_sync # Adjust based on your actual function names

def push_to_github():
    try:
        subprocess.run(["git", "add", "data.json"], check=True)
        subprocess.run(["git", "commit", "-m", f"Sync: {datetime.now().strftime('%H:%M')}"], check=True)
        subprocess.run(["git", "push", "origin", "main"], check=True)
        print("✅ Dashboard updated on GitHub Pages.")
    except Exception as e:
        print(f"❌ Git push failed: {e}")

def main_loop():
    print("🚀 Universal AI Laptop Node Started...")
    while True:
        # 1. Run your complex logic (Math, Science, Social)
        # This is where you call the code you already uploaded to GitHub
        print("Scraping and Calculating...")
        # For testing, we generate a structured list:
        updates = [
            {"domain": "Physics", "time": "Just Now", "title": "Quantum Entanglement", "content": "Updated local database with latest arXiv papers on non-locality."},
            {"domain": "Math", "time": "2m ago", "title": "Calculus Solver", "content": "Solved complex integration for real-time trajectory analysis."},
            {"domain": "Social", "time": "5m ago", "title": "Trending Trends", "content": "X (Twitter) is currently focused on 'Energy-Efficient LLMs'."}
        ]

        # 2. Save to the JSON file the website reads
        payload = {
            "last_updated": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            "updates": updates
        }
        with open("data.json", "w") as f:
            json.dump(payload, f, indent=4)

        # 3. Push to GitHub
        push_to_github()

        print("Sleeping for 10 minutes...")
        time.sleep(600)

if __name__ == "__main__":
    main_loop()
