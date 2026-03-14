# 🔒 Agent 11: Security & Privacy Compliance Agent

## Overview
The **Security & Privacy Compliance Agent** is the gatekeeper of the ClinicAI platform. It enforces Role-Based Access Control (RBAC), maintains an immutable audit trail of all data interactions, detects anomalous behavior, and ensures continuous compliance with HIPAA and GDPR standards.

---

## 🏗️ Design & Features
This agent provides a unified security layer for the entire ecosystem:

1.  **RBAC Enforcement**: Validates every API request against a predefined matrix of roles (Doctor, Nurse, Admin, Patient, ExternalAgent) and resources (EHR, Vitals, Analytics).
2.  **Anomaly Detection**: Monitors for high-risk actions (e.g., `DELETE` operations) or unauthorized data access attempts, assigning an anomaly score to every event.
3.  **Automated Audit Trail**: Generates detailed JSON audit entries for every access decision, linking the requester, the action, and the outcome.
4.  **Compliance Narrative Synthesis**: Uses **TinyLlama** to generate high-level briefings for Compliance Officers, summarizing the security state and highlighting critical violations.

---

## 🔄 Workflow
1.  **Intercept**: Every agent-to-agent or user-to-agent request is sent to the Security Agent for validation.
2.  **Verify**: The engine checks the Role-Resource-Action triplet.
3.  **Score**: The anomaly detector evaluates the risk of the request.
4.  **Decide**: Access is either `GRANTED` or `DENIED`.
5.  **Audit**: The request and decision are written to the audit log.
6.  **Report**: On demand, TinyLlama reviews the logs to create a human-readable compliance summary.

---

## 🛠️ Tech Stack
*   **Security Logic**: Python (Custom RBAC Engine)
*   **Intelligence**: TinyLlama-1.1B
*   **Web Framework**: FastAPI
*   **Reporting**: Pandas (Aggregations)

---

## 🚀 Getting Started

### 1. Running the Agent
Start the microservice on port `8011`:
```bash
export PYTHONPATH=$PYTHONPATH:.
python3 -m agents.agent_11_security.main
```

### 2. Testing & Endpoint Calling

**Option A: Automated Test Script**
Run the security validation suite:
```bash
python3 -m agents.agent_11_security.test_agent
```

**Option B: Manual Curl Call (Access Check)**
```bash
curl -X POST http://localhost:8011/validate \
     -H "Content-Type: application/json" \
     -d '{
          "user_id": "DR-SMITH-1",
          "role": "Doctor",
          "resource": "EHR_RECORD",
          "action": "READ",
          "resource_id": "PAT-001"
         }'
```

**Option C: Manual Curl Call (Compliance Report)**
```bash
curl -X GET http://localhost:8011/report
```
