import chromadb

# Initialize local Vector DB for "All Knowledge"
client = chromadb.PersistentClient(path="./knowledge_base")
collection = client.get_or_create_collection(name="universal_knowledge")

def save_to_vector_db(domain, text):
    collection.add(
        documents=[text],
        metadatas=[{"domain": domain}],
        ids=[f"{domain}_{datetime.now().timestamp()}"]
    )
    print(f"Saved {domain} update to database.")
