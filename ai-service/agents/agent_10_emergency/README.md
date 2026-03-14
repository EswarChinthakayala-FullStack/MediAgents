# 🚨 Agent 10: Emergency Alert Agent

## Overview
The **Emergency Alert Agent** is the real-time alarm system of ClinicAI. It monitors inputs from all other agents (Monitoring, Triage, Risk, etc.) and coordinates high-priority notifications to doctors and patients, ensuring life-threatening events are managed within clinical time-windows.

---

## 🏗️ Design & Features
This agent acts as a **Critical Event Dispatcher**:

1.  **Multi-Source Agnostic**: Ingests alerts regardless of origin—whether it's a vital sign drop, a high-risk prediction, or emergency keywords in a chat.
2.  **Contextual Messaging**: Uses **TinyLlama** to generate dual-sided messages:
    *   **Physician Message**: Fast, technical, and high-impact (e.g., "Critical SpO2 drop, room 4.").
    *   **Patient Message**: Calm, reassuring, and directive (e.g., "Please stay still, help is on the way.").
3.  **Action Prioritization**: Automatically generates the top 3 clinical actions requested for the event.
4.  **Real-Time State Tracking**: Maintains a registry of active alerts that can be queried by doctor dashboards.

---

## 🔄 Workflow
1.  **Detection**: Receives an `EmergencyEvent` from another microservice.
2.  **Synthesis**: TinyLlama analyzes the event details and generates appropriate alert text and action lists.
3.  **Routing**: In a production environment, this agent would trigger Twilio SMS/Calls and Firebase Push notifications.
4.  **Logging**: All alerts are logged to the EHR Agent for the permanent record.

---

## 🛠️ Tech Stack
*   **Coordination Engine**: Python
*   **Intelligence**: TinyLlama-1.1B
*   **Web Framework**: FastAPI
*   **Tracking**: In-memory state (Simulating Redis)

---

## 🚀 Getting Started

### 1. Running the Agent
Start the microservice on port `8010`:
```bash
export PYTHONPATH=$PYTHONPATH:.
python3 -m agents.agent_10_emergency.main
```

### 2. Testing & Endpoint Calling

**Option A: Automated Test Script**
```bash
python3 -m agents.agent_10_emergency.test_agent
```

**Option B: Manual Curl Call**
```bash
curl -X POST http://localhost:8010/trigger \
     -H "Content-Type: application/json" \
     -d '{
          "patient_id": "P-911",
          "source_agent": "Triage",
          "severity": "CRITICAL",
          "event_details": "Patient reports severe chest pain and radiating numbness."
         }'
```
