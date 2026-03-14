# 📅 Agent 02: Appointment Prioritisation Agent

## Overview
The **Appointment Prioritisation Agent** is responsible for dynamically managing clinical queues. It balances patient urgency (tier and severity) with physical resources (rooms, doctors, nurses) and waiting times to ensure that the most critical patients are seen first while maintaining fairness and efficiency.

---

## 🏗️ Design & Logic
The agent uses a **Bi-modal Optimization** approach:

1.  **Weighted Scoring Algorithm**: 
    Each appointment request is assigned a priority score based on:
    *   **Clinical Tier**: Tier 1 (Emergency) gets the highest base weight.
    *   **Severity Score**: Higher pain/distress scores add extra priority.
    *   **Wait Time Penalty**: As patients wait longer, their priority score gradually increases (anti-starvation logic).
2.  **LLM Decision Justification**: 
    TinyLlama acts as the "Social Reasoner." While the math decides the order, the LLM explains the decision in human-readable terms, especially useful for doctor dashboards and handling "gray area" edge cases where scores are identical.

---

## 🔄 Workflow
1.  **Input**: Receives `AppointmentRequest` containing the patient's triage data (from Agent 01), a list of available doctors, and current resource levels.
2.  **Scoring**: Calculates the `total_priority_score`.
3.  **Matching**: Maps the patient to the most suitable available slot and doctor.
4.  **Reasoning**: TinyLlama reviews the context and provides a brief clinical justification for the slot assignment.
5.  **Output**: Returns a `QueueStatus` containing the scheduled ID, estimated wait time, and reasoning.

---

## 🛠️ Tech Stack
*   **Math/Logic**: Python (Scoring Algorithms)
*   **Optimization**: OR-Tools (Optional, can be added for complex full-day constraint scheduling)
*   **Web Framework**: FastAPI
*   **LLM Model**: TinyLlama-1.1B

---

## 🚀 Getting Started

### 1. Running the Agent
Start the microservice on port `8002`:
```bash
export PYTHONPATH=$PYTHONPATH:.
python3 -m agents.agent_02_appointment.main
```

### 2. Testing & Endpoint Calling

**Option A: Automated Test Script**
Run the test script to simulate a queue prioritization:
```bash
python3 -m agents.agent_02_appointment.test_agent
```

**Option B: Manual Curl Call**
You can call the API directly from your terminal while the server is running:
```bash
curl -X POST http://localhost:8002/schedule \
     -H "Content-Type: application/json" \
     -d '{
          "patient": {
            "patient_id": "PAT-456",
            "triage_tier": 2,
            "severity_score": 8,
            "waiting_minutes": 20
          },
          "available_doctors": [{
            "doctor_id": "DOC-1",
            "name": "Dr. Smith",
            "specialty": "General Medicine",
            "available_slots": ["2026-03-13T15:00:00Z"]
          }],
          "resource_state": {
            "rooms_available": 2,
            "nurses_on_duty": 3
          }
         }'
```
