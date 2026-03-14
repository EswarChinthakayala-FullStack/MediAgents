import chromadb
from chromadb.utils import embedding_functions
import os
import sys

# Add data folder to path to import medical_kb
sys.path.append(os.path.join(os.path.dirname(__file__), "data"))
try:
    from medical_kb import GUIDELINE_RAG
except ImportError:
    GUIDELINE_RAG = {}

class MedicalRAGManager:
    def __init__(self, db_path="./medical_vector_db"):
        # Setup local embedding function (MiniLM is fast and local)
        self.embedding_fn = embedding_functions.SentenceTransformerEmbeddingFunction(
            model_name="all-MiniLM-L6-v2"
        )
        
        # Connect to local DB
        self.client = chromadb.PersistentClient(path=db_path)
        self.collection = self.client.get_or_create_collection(
            name="medical_guidelines",
            embedding_function=self.embedding_fn
        )
        
        # Auto-ingest existing guidelines if collection is empty
        if self.collection.count() == 0:
            self._ingest_kb()

    def _ingest_kb(self):
        if not GUIDELINE_RAG:
            return
            
        ids = list(GUIDELINE_RAG.keys())
        documents = list(GUIDELINE_RAG.values())
        metadatas = [{"topic": k} for k in ids]
        
        self.collection.upsert(
            ids=ids,
            documents=documents,
            metadatas=metadatas
        )
        print(f"Ingested {len(ids)} guidelines into Vector DB.")

    def retrieve_context(self, query: str, n_results: int = 2) -> str:
        if self.collection.count() == 0:
            return "No medical guidelines available."
            
        results = self.collection.query(
            query_texts=[query],
            n_results=n_results
        )
        
        if not results['documents'] or not results['documents'][0]:
            return "No relevant guidelines found."
            
        return "\n\n".join(results['documents'][0])
