# 💊 Agent 07: Medication & Treatment Management Agent

## Overview
The **Medication & Treatment Management Agent** tracks patient prescriptions and adherence patterns. It identifies gaps in critical medication compliance, flags potential side effects using clinical data, and generates patient-friendly reminders and instructions using **TinyLlama**.

---

## 🏗️ Design & Features
This agent focuses on **Therapeutic Adherence & Safety**:

1.  **Adherence Scoring**: Calculates the percentage of doses taken versus missed for each prescription.
2.  **Side Effect Flagging**: Monitors patient-reported concerns and cross-references them with medication profiles to flag potential adverse reactions (e.g., Lisinopril and dry cough).
3.  **Refill Intelligence**: Monitors the remaining doses and triggers proactive refill alerts when supply falls below a threshold.
4.  **Patient-Centric Communication**: Uses **TinyLlama** to generate empathetic, simple language instructions that improve health literacy and compliance.

---

## 🔄 Workflow
1.  **Ingestion**: Receives a `MedicationReport` including the full prescription list and adherence history.
2.  **Calculation**: Computes adherence scores and checks dose inventory.
3.  **Synthesis**: TinyLlama reviews the patient's performance and generates a personalized instruction narrative.
4.  **Reporting**: Generates a set of physician recommendations for dose adjustments or reviews in case of poor adherence or side effects.
5.  **Output**: Returns a `MedicationAnalysis` object.

---

## 🛠️ Tech Stack
*   **Logic Engine**: Python
*   **Intelligence**: TinyLlama-1.1B
*   **Framework**: FastAPI
*   **Data Models**: Pydantic v2

---

## 🚀 Getting Started

### 1. Running the Agent
Start the microservice on port `8007`:
```bash
export PYTHONPATH=$PYTHONPATH:.
python3 -m agents.agent_07_medication.main
```

### 2. Testing & Endpoint Calling

**Option A: Automated Test Script**
```bash
python3 -m agents.agent_07_medication.test_agent
```

**Option B: Manual Curl Call**
```bash
curl -X POST http://localhost:8007/analyze \
     -H "Content-Type: application/json" \
     -d '{
          "patient_id": "P-MED-123",
          "prescriptions": [
            {"medication_name": "Atorvastatin", "dosage": "20mg", "frequency": "Daily", "remaining_doses": 4, "is_critical": true}
          ],
          "adherence_history": [
            {"medication_name": "Atorvastatin", "taken_timestamp": "2026-03-12T09:00:00Z", "status": "Taken"}
          ],
          "reported_side_effects": ["Muscle pain"]
         }'
```
