import os
import time
import json
import subprocess
from datetime import datetime

def check_for_requests():
    # 1. Pull latest changes from GitHub
    subprocess.run(["git", "pull", "origin", "main"])

    # 2. Check if the website dropped a request file
    if os.path.exists("request.txt"):
        with open("request.txt", "r") as f:
            query = f.read()
        
        print(f"Processing Query: {query}")
        
        # 3. Simple Math/Science Logic (built-in)
        answer = f"Laptop processed '{query}' at {datetime.now()}"
        
        # 4. Update data.json
        with open("data.json", "r") as f:
            data = json.load(f)
        
        data["updates"].insert(0, {"domain": "AI Response", "content": answer, "time": "Just Now"})
        
        with open("data.json", "w") as f:
            json.dump(data, f, indent=4)

        # 5. Cleanup and Push
        os.remove("request.txt")
        subprocess.run(["git", "add", "data.json", "request.txt"])
        subprocess.run(["git", "commit", "-m", "AI Answered Query"])
        subprocess.run(["git", "push", "origin", "main"])
        return True
    return False

if __name__ == "__main__":
    print("AI Laptop Node: Watching GitHub for requests...")
    while True:
        did_work = check_for_requests()
        # If no request, wait 30 seconds. If worked, wait 10 mins.
        time.sleep(30 if not did_work else 600)
