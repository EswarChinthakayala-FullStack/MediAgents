# 📲 Agent 12: Patient Notification & Portal Agent

## Overview
The **Patient Notification & Portal Agent** is the outbound communication engine and patient-facing interface for ClinicAI. it manages all personalized messaging across multiple channels (Push, SMS, Email, In-App) and provides the backend for the patient's health portal.

---

## 🏗️ Design & Features
This agent serves as the **Clinical Engagement Layer**:

1.  **Multi-Channel Fan-out**: Sends a single event notification to multiple channels simultaneously based on patient preferences.
2.  **AI-Personalized Tone**: Uses **TinyLlama** to adapt the messaging style. Routine events (appointments) are friendly, while urgent events (missed meds or alerts) are calm but authoritative.
3.  **Portal State Aggregation**: Provides an on-demand view of a patient's recent notifications, upcoming appointments, and available lab reports.
4.  **Action-Oriented Messaging**: Every notification includes a specific Call-To-Action (CTA) to ensure patients know exactly what to do next.

---

## 🔄 Workflow
1.  **Event Detection**: Receives an event from another agent (e.g., Appointment, EHR, or Medication agents).
2.  **Message Generation**: TinyLlama builds a custom Subject, Body, and CTA based on the event's urgency.
3.  **Preferred Delivery**: The agent expands the request into individual messages for each of the patient's preferred channels.
4.  **Portal Sync**: The history is stored to populate the patient's mobile app or web dashboard.
5.  **Output**: Returns a list of generated `NotificationMessage` objects.

---

## 🛠️ Tech Stack
*   **Notification Logic**: Python
*   **Personalization Engine**: TinyLlama-1.1B
*   **Web Framework**: FastAPI
*   **Messaging Simulation**: Twilio/Firebase (Integrated via API-ready structures)

---

## 🚀 Getting Started

### 1. Running the Agent
Start the microservice on port `8012`:
```bash
export PYTHONPATH=$PYTHONPATH:.
python3 -m agents.agent_12_portal.main
```

### 2. Testing & Endpoint Calling

**Option A: Automated Test Script**
Run the notification generation suite:
```bash
python3 -m agents.agent_12_portal.test_agent
```

**Option B: Manual Curl Call (Appointment)**
```bash
curl -X POST http://localhost:8012/notify \
     -H "Content-Type: application/json" \
     -d '{
          "patient_id": "P-123",
          "event_type": "APPOINTMENT",
          "event_details": "Your dental checkup is scheduled for tomorrow at 9 AM.",
          "urgency": "Routine",
          "channel_preference": ["push"]
         }'
```

**Option C: Fetch Portal Data**
```bash
curl -X GET http://localhost:8012/portal/P-123
```
