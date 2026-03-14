# 🩺 Agent 01: Symptom Triage Agent

## Overview
The **Symptom Triage Agent** is the clinical entry point for the ClinicAI system. Its primary role is to analyze patient-reported symptoms and classify them into one of four urgency tiers (Emergency, Urgent, Routine, Self-care). 

By combining a **Local LLM (TinyLlama)** with a **Medical RAG (Retrieval-Augmented Generation)** pipeline and **Deterministic Safety Rules**, the agent provides grounded, evidence-based triage recommendations while maintaining strict patient data privacy.

---

## 🏗️ Design Philosophy: The Hybrid Approach
Unlike standard LLM chatbots, this agent uses a **Hybrid Intelligence** model:

1.  **Deterministic Rules (Safety First)**: Pre-defined clinical logic checks for "Red Flags" (e.g., crushing chest pain), life-threatening drug interactions (e.g., Nitrates + Sildenafil), and high-risk patient demographics (e.g., neonates). This ensures that even if the LLM fails, safety protocols are maintained.
2.  **Semantic Retrieval (RAG)**: The agent uses **ChromaDB** to search through authorized clinical guidelines (AHA, NICE, WHO). This grounds the AI in real medical literature rather than relying on the LLM's "memory."
3.  **Local LLM Reasoning (TinyLlama)**: To ensure 100% data privacy and offline capability, it uses **TinyLlama-1.1B**. It synthesizes the symptom data and RAG context to produce a structured clinical reasoning summary.

---

## 🔄 Workflow
1.  **Input**: Receives `PatientInput` (Symptom text, severity, age, conditions, meds).
2.  **RAG Retrieval**: The `MedicalRAGManager` converts symptoms into vectors and retrieves the top-2 most relevant clinical guidelines from the vector database.
3.  **Safety Checks**:
    *   **ICD-10 Resolver**: Maps symptoms to standard codes.
    *   **Drug Interaction**: Scans for high-risk medication conflicts.
    *   **Escalation Logic**: Automatically adjusts the tier based on age (e.g., infants) or comorbidities (e.g., diabetic heart risk).
4.  **LLM synthesis**: TinyLlama processes the combined prompt (Symptoms + Guidelines) to generate the reasoning and recommended action.
5.  **Output**: Returns a structured `TriageResult` JSON via FastAPI.

---

## 🛠️ Tech Stack
*   **Core Logic**: Python 3.10+
*   **Web Framework**: FastAPI (Uvicorn)
*   **Vector DB**: ChromaDB (Local Persistent Storage)
*   **Embeddings**: `all-MiniLM-L6-v2` (Sentence-Transformers)
*   **LLM Model**: TinyLlama-1.1B-Chat-v1.0 (via HuggingFace Transformers)
*   **Data Validation**: Pydantic v2

---

## 🚀 Getting Started

### 1. Installation
Ensure you have the core dependencies installed:
```bash
pip install fastapi uvicorn chromadb sentence-transformers torch transformers
```

### 2. Running the Agent
Start the microservice on port `8001`:
```bash
export PYTHONPATH=$PYTHONPATH:.
python3 -m agents.agent_01_triage.main
```

### 3. Testing & Endpoint Calling

**Option A: Automated Test Script**
Run the validation script to simulate a clinical case:
```bash
python3 -m agents.agent_01_triage.test_agent
```

**Option B: Manual Curl Call**
You can call the API directly from your terminal while the server is running:
```bash
curl -X POST http://localhost:8001/triage \
     -H "Content-Type: application/json" \
     -d '{
          "patient_id": "P-99",
          "symptom_text": "I have severe abdominal pain and fever.",
          "severity": 8,
          "duration_days": 1,
          "age": 30,
          "sex": "Female",
          "conditions": ["Pregnancy"],
          "medications": []
         }'
```

---

## 📋 API Specification

### `POST /triage`
**Input (`PatientInput`):**
```json
{
  "patient_id": "P-99",
  "symptom_text": "I have severe abdominal pain and fever.",
  "severity": 8,
  "duration_days": 1,
  "age": 30,
  "sex": "Female",
  "conditions": ["Pregnancy"],
  "medications": []
}
```

**Output (`TriageResult`):**
```json
{
  "triage_id": "uuid-v4-string",
  "urgency_tier": 1,
  "urgency_label": "EMERGENCY",
  "triage_summary": "High-risk abdominal pain in pregnancy...",
  "recommended_action": "Go to the Emergency Department immediately.",
  "requires_alert": true
}
```
