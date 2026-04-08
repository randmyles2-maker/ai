import os, time, json, subprocess
from datetime import datetime

def check_messages():
    # Sync with GitHub
    subprocess.run(["git", "pull", "origin", "main"])

    if os.path.exists("request.txt"):
        with open("request.txt", "r") as f:
            user_msg = f.read().strip()
        
        print(f"New Message Received: {user_msg}")
        
        # --- YOUR AI LOGIC HERE ---
        # Example: Simple echo response
        ai_reply = f"I've processed your request: '{user_msg}'. Everything is synced."

        # Update data.json (The "Bulletin Board")
        with open("data.json", "r") as f:
            data = json.load(f)
        
        # Add reply to the top
        data["updates"].insert(0, {
            "domain": "AI Response",
            "content": ai_reply,
            "time": datetime.now().strftime("%H:%M")
        })
        
        with open("data.json", "w") as f:
            json.dump(data, f, indent=4)

        # Cleanup and Push back
        os.remove("request.txt")
        subprocess.run(["git", "add", "data.json", "request.txt"])
        subprocess.run(["git", "commit", "-m", "AI Reply Sent"])
        subprocess.run(["git", "push", "origin", "main"])
        print("Reply pushed to iPhone UI.")

if __name__ == "__main__":
    print("💬 AI Messenger Backend Active...")
    while True:
        check_messages()
        time.sleep(15) # Check for new "texts" every 15 seconds
