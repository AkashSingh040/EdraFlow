from fastapi import FastAPI
from app.routers import rag_router

app = FastAPI(title="EdraBot RAG Service")

app.include_router(rag_router.router, prefix="/api/rag")

@app.get("/health")
def health():
    return {"status": "EdraBot running"}