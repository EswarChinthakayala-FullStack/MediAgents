# 📋 Agent 06: Smart EHR Agent

## Overview
The **Smart EHR Agent** serves as the centralized data backbone for ClinicAI. It handles the storage, retrieval, and intelligent summarization of Electronic Health Records (EHR). Every access is audited to ensure HIPAA/GDPR compliance.

---

## 🏗️ Design & Features
This agent provides a unified data interface for all other agents:

1.  **Central Data Access (CRUD)**: Standardized read/write operations for demographics, medications, labs, and history.
2.  **Smart Summarization**: Uses **TinyLlama** to convert complex medical records (multiple labs, meds, and problems) into a single, high-density clinical paragraph for doctor handovers.
3.  **Built-in Audit Trail**: Every request (Read, Write, or Summary) generates a unique audit entry with a UUID and time-stamp.
4.  **Schema Enforcement**: Built on **Pydantic** to simulate a FHIR R4 standard-compliant data structure.

---

## 🔄 Workflow
1.  **Query**: An external agent (e.g., Triage or Risk) requests a patient's record using the `patient_id`.
2.  **Validation**: The EHR manager verifies the record exists.
3.  **Audit**: A `READ` log is generated automatically.
4.  **Transformation**: If a summary is requested, TinyLlama processes the structured JSON and outputs clinical shorthand.
5.  **Persistence**: New vitals or lab results sent to the agent are merged into the patient record.

---

## 🛠️ Tech Stack
*   **Data Structure**: HL7 FHIR R4 modeled in Pydantic
*   **Intelligence**: TinyLlama-1.1B
*   **Web Framework**: FastAPI
*   **Logging**: Internal Audit Logic

---

## 🚀 Getting Started

### 1. Running the Agent
Start the microservice on port `8006`:
```bash
export PYTHONPATH=$PYTHONPATH:.
python3 -m agents.agent_06_ehr.main
```

### 2. Testing & Endpoint Calling

**Option A: Automated Test Script**
```bash
python3 -m agents.agent_06_ehr.test_agent
```

**Option B: Manual Curl Call (Summary)**
```bash
curl -X GET "http://localhost:8006/summary/PAT-001?requester=EmergencyDept"
```

**Option C: Manual Curl Call (Update Record)**
```bash
curl -X POST "http://localhost:8006/record?requester=LabAgent" \
     -H "Content-Type: application/json" \
     -d '{
          "patient_id": "PAT-001",
          "demographics": {"patient_id": "PAT-001", "name": "John Doe", "age": 58, "gender": "Male", "contact": "555-0199"},
          "diagnoses": ["Type 2 Diabetes"],
          "active_problems": ["New fever"],
          "medications": [],
          "lab_results": [],
          "allergies": []
         }'
```
