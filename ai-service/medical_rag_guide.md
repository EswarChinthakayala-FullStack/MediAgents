# Medical RAG Implementation Guide

Transforming your LLM into a **Medical RAG (Retrieval-Augmented Generation)** system involves moving from a "static" knowledge base (like a hardcoded dictionary) to a "dynamic" one that can search through thousands of medical documents.

## 1. Architecture Overview

1.  **Knowledge Base**: A collection of medical guidelines (PDFs, Markdown, Text).
2.  **Embeddings**: A model (e.g., `sentence-transformers`) that converts text into numerical vectors.
3.  **Vector Store**: A database (e.g., `ChromaDB`, `FAISS`) that stores vectors and allows "semantic search" (finding meaning, not just keywords).
4.  **Retrieval**: When a patient enters symptoms, the system searches the Vector Store for the most relevant medical passages.
5.  **Augmentation**: These passages are injected into the LLM prompt.
6.  **Generation**: The LLM uses the provided medical context to give a grounded, evidence-based answer.

---

## 2. Requirements

Add these to your `requirements.txt`:
```bash
chromadb==1.0.9
sentence-transformers==4.1.0
```

---

## 3. Implementation Steps

### Step A: Initialize the Vector Database
Create a manager to handle the embedding and retrieval logic.

```python
import chromadb
from chromadb.utils import embedding_functions

# Use a local, free embedding model
embedding_fn = embedding_functions.SentenceTransformerEmbeddingFunction(
    model_name="all-MiniLM-L6-v2"
)

# Connect to local DB folder
client = chromadb.PersistentClient(path="./medical_db")
collection = client.get_or_create_collection(
    name="clinical_guidelines", 
    embedding_function=embedding_fn
)
```

### Step B: Ingest Medical Data
Loop through your medical files and "upsert" them into the database.

```python
def add_document(doc_id, text, source_metadata):
    collection.upsert(
        ids=[doc_id],
        documents=[text],
        metadatas=[source_metadata]
    )
```

### Step C: Retrieve and Augment Prompt
When calling the LLM, first fetch the context.

```python
def get_medical_advice(user_query):
    # 1. Retrieve
    results = collection.query(query_texts=[user_query], n_results=2)
    top_context = "\n\n".join(results['documents'][0])
    
    # 2. Augment Prompt
    prompt = f"""
    <|system|>
    You are a medical assistant. Use the following clinical context to answer the user.
    If the context isn't relevant, rely on your clinical training.
    
    CLINICAL CONTEXT:
    {top_context}
    </s>
    <|user|>
    Patient Symptoms: {user_query}
    </s>
    <|assistant|>
    """
    
    # 3. Generate
    # Call your tinyllama_engine here...
```

---

## 4. Why this is better than Keyword Search?

*   **Synonym Awareness**: If you search for "heart attack", it can find documents about "Myocardial Infarction" or "ACS" because their *vectors* are close in meaning, even if the words are different.
*   **Scalability**: You can store thousands of pages of guidelines without slowing down the system.
*   **Verification**: You can return the `source` metadata to the user so they (or a doctor) can see exactly which guideline the AI is citing.
