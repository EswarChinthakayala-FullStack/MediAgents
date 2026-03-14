# 💬 Agent 08: Conversational Health Assistant Agent

## Overview
The **Conversational Health Assistant Agent** provides 24/7 natural-language support to patients. It triages queries, answers common health questions, detects emergencies in real-time, and assists with appointment scheduling. It serves as the primary "front-door" interface for patient interaction.

---

## 🏗️ Design & Features
This agent is built as an **Intelligent Patient Interface**:

1.  **Context-Aware Dialogues**: Uses **TinyLlama** and a session-based memory system (last 20 turns) to maintain conversation continuity.
2.  **Emergency Interlock**: Scans every message for clinical red-flag keywords (e.g., "chest pain", "can't breathe"). If an emergency is detected, it immediately provides life-saving instructions and flags the event for escalation.
3.  **Intent Classification**: Automatically categorizes the user's goal into `FAQ`, `SymptomQuery`, `AppointmentRequest`, or `Emergency`.
4.  **EHR Integration**: Can ingest a patient record summary to provide more personalized guidance (e.g., acknowledging a history of hypertension when a patient mentions a headache).

---

## 🔄 Workflow
1.  **Ingestion**: Receives a `UserInput` containing the message, session ID, and (optional) patient context.
2.  **Context Loading**: Retrieves the last few messages of the conversation to maintain context.
3.  **Synthesis**: TinyLlama processes the message, applying rules for empathy, safety, and clinical boundaries.
4.  **Classification**: The agent identifies the intent and whether an escalation is needed.
5.  **Output**: Returns an `AssistantResponse` with the text and metadata for the UI (e.g., showing a booking button).

---

## 🛠️ Tech Stack
*   **Dialogue Engine**: TinyLlama-1.1B
*   **Framework**: FastAPI
*   **Memory Management**: In-memory session store (Extendable to Redis)
*   **Validation**: Pydantic v2

---

## 🚀 Getting Started

### 1. Running the Agent
Start the microservice on port `8008`:
```bash
export PYTHONPATH=$PYTHONPATH:.
python3 -m agents.agent_08_assistant.main
```

### 2. Testing & Endpoint Calling

**Option A: Automated Test Script**
Run the multi-turn conversational test:
```bash
python3 -m agents.agent_08_assistant.test_agent
```

**Option B: Manual Curl Call**
```bash
curl -X POST http://localhost:8008/chat \
     -H "Content-Type: application/json" \
     -d '{
          "patient_id": "P-CHAT-99",
          "message": "Hi ClinicAI, I have a weird rash on my arm. Should I be worried?",
          "ehr_summary": "Patient has no known allergies."
         }'
```
