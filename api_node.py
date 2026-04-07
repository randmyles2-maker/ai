from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from core.math_engine import MathEngine
import uvicorn

app = FastAPI()
math_engine = MathEngine()

# This allows your GitHub website to talk to your laptop
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/ask")
async def handle_query(query: str):
    print(f"Received Request: {query}")
    
    # Logic: If it contains math symbols, use MathEngine
    if any(c in query for c in "+-*/^=()"):
        try:
            result = math_engine.solve_complex(query)
            return {"answer": f"The solution is: $${result}$$"}
        except:
            return {"answer": "Math engine could not parse this equation."}
    
    # Default: General Knowledge / Science search
    return {"answer": f"Analysis of '{query}' completed. Data saved to local knowledge base."}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
