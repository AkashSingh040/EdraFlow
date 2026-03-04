from fastapi import APIRouter
from pydantic import BaseModel
from app.services.rag_service import embed_procedure, ask_question

router = APIRouter()


class EmbedRequest(BaseModel):
    id: str
    title: str
    university: str
    officialSteps: list[str]
    researchInsights: list[str]
    commonDelays: list[str] = []
    tips: list[str] = []
    version: str


class AskRequest(BaseModel):
    question: str
    university: str


@router.post("/embed-procedure")
def embed(data: EmbedRequest):

    embed_procedure(data.dict())

    return {"message": "Procedure embedded successfully"}


@router.post("/ask")
def ask(data: AskRequest):

    answer = ask_question(data.question, data.university)

    return {"answer": answer}