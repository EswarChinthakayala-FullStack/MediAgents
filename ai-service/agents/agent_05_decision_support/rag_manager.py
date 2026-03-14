import chromadb
from chromadb.utils import embedding_functions
import os

MOCK_GUIDELINES = {
    "asthma_nice": "NICE NG80: For acute asthma exacerbation, start high-flow oxygen, inhaled SABA (Salbutamol 5mg), and oral corticosteroids (Prednisolone 40mg). Monitor PEFR.",
    "chf_aha": "AHA 2022: New onset heart failure with reduced ejection fraction (HFrEF) requires 'Four Pillars': Beta-blocker, ACEi/ARNI, MRA, and SGLT2i. Diuretics if congested.",
    "pnuemonia_bts": "BTS Community-Acquired Pneumonia: Use CURB-65 score to decide admission. First-line for low-risk: Amoxicillin. High-risk: Co-amoxiclav + Clarithromycin.",
    "chest_pain_differential": "Differential for acute chest pain: Acute Coronary Syndrome (ACS), Pulmonary Embolism (PE), Aortic Dissection, Tension Pneumothorax, Esophageal Spasm.",
    "diabetes_ada": "ADA 2023: First-line for Type 2 DM is Metformin + lifestyle. If ASCVD high risk, add SGLT2i or GLP-1 RA regardless of HbA1c.",
}

class DecisionRAGManager:
    def __init__(self, db_path="./agents/agent_05_decision_support/medical_db"):
        self.embedding_fn = embedding_functions.SentenceTransformerEmbeddingFunction(
            model_name="all-MiniLM-L6-v2"
        )
        self.client = chromadb.PersistentClient(path=db_path)
        self.collection = self.client.get_or_create_collection(
            name="decision_clinical_guidelines",
            embedding_function=self.embedding_fn
        )
        
        if self.collection.count() == 0:
            self._ingest_data()

    def _ingest_data(self):
        ids = list(MOCK_GUIDELINES.keys())
        docs = list(MOCK_GUIDELINES.values())
        self.collection.upsert(ids=ids, documents=docs)

    def search(self, query: str, n_results: int = 2) -> str:
        results = self.collection.query(query_texts=[query], n_results=n_results)
        return "\n\n".join(results['documents'][0]) if results['documents'] else ""
