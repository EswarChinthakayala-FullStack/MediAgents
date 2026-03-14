# 📡 Agent 03: Continuous Monitoring Agent

## Overview
The **Continuous Monitoring Agent** is designed to ingest real-time vital streams from IoT devices or manual entry. It perform automated anomaly detection and uses **TinyLlama** to generate clinical trend narratives for medical staff.

---

## 🏗️ Design & Logic
This agent focuses on **Temporal Pattern Recognition**:

1.  **Statistical/Threshold Detection**: 
    The core logic monitors for physiological red flags (e.g., SpO2 < 92% or Heart Rate > 120 bpm). When a reading crosses a critical threshold, it triggers an immediate status change.
2.  **LLM Trend Synthesis**: 
    While simple thresholds catch "now" problems, TinyLlama analyzes the **last 5-10 readings** to identify deteriorating trends (e.g., "Heart rate has steadily increased from 80 to 125 over the last 20 minutes, while oxygen saturation is trending downward").

---

## 🔄 Workflow
1.  **Ingestion**: Receives a `PatientVitalsStream` (a list of historical + current readings).
2.  **Analysis**: Scans the latest reading against clinical thresholds.
3.  **Trend Reasoning**: TinyLlama reviews the time-series data to provide a concise clinical narrative summary.
4.  **Alerting**: If status is `Warning` or `Critical`, an alert object is created for downstream systems (Alert Agent).
5.  **Output**: Returns a `MonitoringStatus` object with a unified trend report.

---

## 🛠️ Tech Stack
*   **Time-Series Processing**: Python (Simulated InfluxDB logic)
*   **Web Framework**: FastAPI
*   **LLM Model**: TinyLlama-1.1B
*   **Data Validation**: Pydantic v2

---

## 🚀 Getting Started

### 1. Running the Agent
Start the microservice on port `8003`:
```bash
export PYTHONPATH=$PYTHONPATH:.
python3 -m agents.agent_03_monitoring.main
```

### 2. Testing & Endpoint Calling

**Option A: Automated Test Script**
Run the test script to simulate a deteriorating patient:
```bash
python3 -m agents.agent_03_monitoring.test_agent
```

**Option B: Manual Curl Call**
```bash
curl -X POST http://localhost:8003/monitor \
     -H "Content-Type: application/json" \
     -d '{
          "patient_id": "PAT-VITAL-001",
          "readings": [
            {"heart_rate": 80, "sp_o2": 98, "blood_pressure_sys": 120, "timestamp": "2026-03-13T10:00:00Z"},
            {"heart_rate": 125, "sp_o2": 89, "blood_pressure_sys": 155, "timestamp": "2026-03-13T10:20:00Z"}
          ]
         }'
```
