import os
import time
import json
import subprocess
from datetime import datetime

# Initialize data.json if it doesn't exist
def ensure_data_file():
    if not os.path.exists("data.json"):
        initial_data = {
            "last_updated": str(datetime.now()),
            "updates": [{"domain": "System", "content": "Node Initialized.", "time": "Now"}]
        }
        with open("data.json", "w") as f:
            json.dump(initial_data, f, indent=4)
        print("📁 Created missing data.json file.")

def check_for_requests():
    # 1. Pull latest changes from GitHub to see if there's a new request
    print("Checking GitHub for updates...")
    subprocess.run(["git", "pull", "origin", "main"])

    # 2. Check if the website dropped a request file
    if os.path.exists("request.txt"):
        with open("request.txt", "r") as f:
            query = f.read()
        
        print(f"🚀 Processing User Query: {query}")
        
        # 3. Logic: This is where your AI 'thinks'
        # For now, it just confirms. You can plug your Math/Science engines here.
        answer = f"Laptop processed '{query}' at {datetime.now().strftime('%H:%M:%S')}"
        
        # 4. Update data.json
        ensure_data_file() # Make sure it exists before opening
        with open("data.json", "r") as f:
            try:
                data = json.load(f)
            except json.JSONDecodeError:
                data = {"last_updated": "", "updates": []}
        
        # Add the new answer to the top of the list
        data["updates"].insert(0, {
            "domain": "AI Response", 
            "title": "Query Result",
            "content": answer, 
            "time": "Just Now"
        })
        data["last_updated"] = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        
        with open("data.json", "w") as f:
            json.dump(data, f, indent=4)

        # 5. Cleanup the request and push the answer back to GitHub
        print("📤 Pushing answer to GitHub Dashboard...")
        os.remove("request.txt")
        subprocess.run(["git", "add", "data.json", "request.txt"])
        subprocess.run(["git", "commit", "-m", "AI Answered Query"])
        subprocess.run(["git", "push", "origin", "main"])
        return True
    
    return False

if __name__ == "__main__":
    ensure_data_file()
    print("🤖 AI Laptop Node Active: Watching GitHub every 30 seconds...")
    while True:
        did_work = check_for_requests()
        # If we did work, wait 10 mins. If not, check again in 30 seconds.
        time.sleep(600 if did_work else 30)
