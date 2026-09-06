from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from rag_engine import RAGEngine, KioskResponse

app = FastAPI(
    title="CampusVoice AI RAG Backend",
    description="Standalone zero-hallucination RAG backend engine for campus kiosk receptionist and wayfinding.",
    version="1.0.0"
)

# Enable CORS for local frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:5173",
        "http://localhost:8501",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:8501",
        "*"  # Allow all for local kiosk dev setup
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize RAG Engine
rag_engine = RAGEngine()

class QueryRequest(BaseModel):
    query: str = Field(..., example="Where is the Computer Science department located?")

@app.get("/")
def health_check():
    """Health-check endpoint returning system status."""
    return {
        "status": "ok",
        "service": "CampusVoice AI RAG Backend Engine",
        "version": "1.0.0"
    }

@app.post("/api/query", response_model=KioskResponse)
def query_campus_voice(request: QueryRequest):
    """
    POST endpoint for processing kiosk voice queries.
    Returns typed KioskResponse JSON with speech text, destination ID, route nodes, and fallback status.
    """
    if not request.query or not request.query.strip():
        raise HTTPException(status_code=400, detail="Query parameter cannot be empty.")
    
    try:
        response = rag_engine.query(request.query.strip())
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal RAG engine error: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
