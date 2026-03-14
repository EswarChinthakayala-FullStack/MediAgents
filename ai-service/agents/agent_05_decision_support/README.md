# 🧠 Agent 05: Doctor Decision Support Agent

## Overview
The **Doctor Decision Support Agent** acts as a co-pilot for clinicians at the point of care. It provides ranked differential diagnoses, recommends investigations, and flags potential drug-drug or drug-condition interactions.

**Disclaimer**: *For physician review only — not a substitute for clinical judgement.*

---

## 🏗️ Design & Features
This agent is built as a **Medical Information Aggregator**:

1.  **Ranked Differential Diagnoses**: It cross-references patient symptoms and history against clinical patterns to suggest probable conditions.
2.  **Safety Surveillance**: Integrated with the drug interaction engine to immediately flag high-risk medication combinations (e.g., Warfarin + Aspirin).
3.  **Guideline-Based Investigation Path**: Recommends tests (ECG, Labs, Imaging) based on established clinical pathways (NICE, AHA).
4.  **Local Knowledge Retrieval (RAG)**: Uses **ChromaDB** to ensure suggestions are grounded in legitimate medical documentation.

---

## 🔄 Workflow
1.  **Aggregation**: Collects triage outcomes, risk scores (from Agent 04), and EHR history.
2.  **Retrieval**: Searches the internal medical library for relevant clinical guidelines.
3.  **Synthesis**: TinyLlama processes the data to build a comprehensive recommendation report.
4.  **Safety Overlay**: Independent logic layer checks for drug interactions.
5.  **Output**: Returns a structured `ClinicalRecommendation` report.

---

## 🛠️ Tech Stack
*   **Reasoning Engine**: TinyLlama-1.1B
*   **Vector Library**: ChromaDB
*   **Framework**: FastAPI
*   **Interaction Logic**: Internal medical rules (simulating OpenFDA)

---

## 🚀 Getting Started

### 1. Running the Agent
Start the microservice on port `8005`:
```bash
export PYTHONPATH=$PYTHONPATH:.
python3 -m agents.agent_05_decision_support.main
```

### 2. Testing & Endpoint Calling

**Option A: Automated Test Script**
```bash
python3 -m agents.agent_05_decision_support.test_agent
```

**Option B: Manual Curl Call**
```bash
curl -X POST http://localhost:8005/advise \
     -H "Content-Type: application/json" \
     -d '{
          "patient_id": "P-55",
          "chief_complaint": "Acute shortness of breath",
          "triage_summary": "Tier 2 Urgent",
          "history": ["Hypertension", "AFib"],
          "current_medications": ["Warfarin", "Ibuprofen"],
          "lab_results": {},
          "risk_scores": {"deterioration": 0.45}
         }'
```
