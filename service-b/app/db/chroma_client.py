import chromadb
from chromadb.config import Settings

client = chromadb.Client(
    Settings(
        persist_directory="./chroma_storage",
        anonymized_telemetry=False
    )
)

collection = client.get_or_create_collection(
    name="edraflow_procedures",
    embedding_function=None   # VERY IMPORTANT
)