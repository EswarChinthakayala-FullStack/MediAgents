import chromadb
from chromadb.utils import embedding_functions
import os

# 1. Setup the Embedding Function (Local & Free)
# This converts text into numerical vectors that represent meaning
sentence_transformer_ef = embedding_functions.SentenceTransformerEmbeddingFunction(
    model_name="all-MiniLM-L6-v2"
)

class MedicalRAGManager:
    def __init__(self, db_path="./medical_vector_db"):
        # 2. Initialize ChromaDB (Local Persistent Storage)
        self.client = chromadb.PersistentClient(path=db_path)
        
        # 3. Create or Get a Collection
        self.collection = self.client.get_or_create_collection(
            name="medical_guidelines",
            embedding_function=sentence_transformer_ef
        )

    def add_guidelines(self, guidelines_dict):
        """
        guidelines_dict: { "topic": "text content" }
        """
        ids = list(guidelines_dict.keys())
        documents = list(guidelines_dict.values())
        
        self.collection.upsert(
            ids=ids,
            documents=documents,
            metadatas=[{"source": "internal_kb"} for _ in ids]
        )
        print(f"Upserted {len(ids)} documents into the vector store.")

    def retrieve_context(self, query, n_results=2):
        """
        Search for the most relevant medical context for a patient's symptoms.
        """
        results = self.collection.query(
            query_texts=[query],
            n_results=n_results
        )
        # join the documents into a single context string
        context = "\n\n".join(results['documents'][0])
        return context

# --- Prototype Demo ---
if __name__ == "__main__":
    # Sample data (similar to what's in your medical_kb.py)
    MOCK_GUIDELINES = {
        "chest_pain_aha": "ESI Guideline (AHA 2023): Chest pain with diaphoresis, radiation to arm/jaw, or associated dyspnoea must be treated as ACS until proven otherwise. 12-lead ECG within 10 minutes is mandatory.",
        "stroke_nice": "NICE Stroke Guideline (NG128): Use the FAST test (Face-Arm-Speech-Time). Any positive FAST finding warrants immediate CT head and neurology review.",
        "sepsis_who": "WHO Sepsis Protocol: Fever >38.5 C with rigors or confusion warrants urgent sepsis screening. Calculate NEWS2 score in all febrile adults."
    }

    rag = MedicalRAGManager()
    rag.add_guidelines(MOCK_GUIDELINES)

    # Simulated Query
    query = "I have a sharp pain in my chest and I am sweating a lot."
    relevant_context = rag.retrieve_context(query)

    print("\n--- RETRIEVED CONTEXT ---")
    print(relevant_context)
    print("-------------------------\n")
    
    print("Next step: Inject this context into your LLM prompt!")
