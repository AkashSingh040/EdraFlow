from app.db.chroma_client import collection
from app.services.embedding_service import generate_embeddings
from app.utils.chunking import chunk_text

import google.generativeai as genai
from dotenv import load_dotenv
import os

load_dotenv()

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

model = genai.GenerativeModel("gemini-3-flash-preview")


def embed_procedure(data):

    texts = (
        data["officialSteps"]
        + data["researchInsights"]
        + data.get("commonDelays", [])
        + data.get("tips", [])
    )

    chunks = chunk_text(texts)
    embeddings = generate_embeddings(chunks)

    for i, chunk in enumerate(chunks):

        collection.add(
            documents=[chunk],
            embeddings=[embeddings[i]],
            metadatas=[{
                "university": data["university"],
                "title": data["title"],
                "version": data["version"]
            }],
            ids=[f"{data['id']}_{i}"]
        )


def ask_question(question, university):

    query_embedding = generate_embeddings([question])

    results = collection.query(
        query_embeddings=query_embedding,
        n_results=5
    )

    context = "\n".join(results["documents"][0])

    prompt = f"""
You are EdraBot, a university procedure assistant.

Use the provided context to answer.

Context:
{context}

Question:
{question}

Provide a clear answer based on the context.
"""

    response = model.generate_content(prompt)

    return response.text