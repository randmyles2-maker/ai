import os
import time
import json
import subprocess
from datetime import datetime

def sync_to_github():
    print(f"--- Starting Sync {datetime.now().strftime('%H:%M')} ---")
    
    # 1. Pull latest (just in case)
    subprocess.run(["git", "pull", "origin", "main"])

    # 2. Generate "Knowledge" (This simulates your Math/Science/Social updates)
    # In a real run, you'd replace these strings with output from your other scripts
    updates = [
        {"domain": "MATH", "time": "Now", "content": "Calculated New Prime Number sequence for encryption."},
        {"domain": "SCIENCE", "time": "Now", "content": "NASA's latest Mars telemetry indexed into local storage."},
        {"domain": "SOCIAL", "time": "5m ago", "content": "Trending: Global shift in renewable energy policy detected."}
    ]

    # 3. Save to data.json
    payload = {
        "last_updated": datetime.now().strftime("%Y-%m-%d %H:%M"),
        "updates": updates
    }
    
    with open("data.json", "w") as f:
        json.dump(payload, f, indent=4)

    # 4. Push to GitHub (This makes it "Live" on the website)
    print("Pushing updates to GitHub Website...")
    subprocess.run(["git", "add", "data.json"])
    subprocess.run(["git", "commit", "-m", "AI Knowledge Refresh"])
    subprocess.run(["git", "push", "origin", "main"])
    print("Done. Check your website!")

if __name__ == "__main__":
    while True:
        sync_to_github()
        print("Sleeping for 10 minutes...")
        time.sleep(600)
