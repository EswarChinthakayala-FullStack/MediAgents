# 📊 Agent 09: Population Health Analytics Agent

## Overview
The **Population Health Analytics Agent** aggregates and analyzes de-identified patient data to surface high-level clinical trends, resource bottlenecks, and public health risks. It transitions from individual patient care to **cohort-level intelligence**.

---

## 🏗️ Design & Features
This agent serves as the administrative and strategic "lens" of the clinic:

1.  **Cohort Aggregation**: Processes batches of de-identified records to calculate disease incidence and outcome statistics.
2.  **Risk Stratification**: Automatically identifies demographic groups (e.g., specific age ranges) showing elevated risk scores across the population.
3.  **Executive Insight Synthesis**: Uses **TinyLlama** to convert raw statistics into a professional "Executive Briefing" narrative, identifying top trends and areas for intervention.
4.  **Privacy-Preserving**: Designed to work exclusively on de-identified data (removing names, exact IDs, and contact info) to ensure compliance with health data regulations.

---

## 🔄 Workflow
1.  **Ingestion**: Receives a `AnalyticsRequest` containing a list of `DeIdentifiedRecord` objects.
2.  **Processing**: Uses **Pandas** to calculate incidence rates, average risk per cohort, and outcome distribution.
3.  **Narrative Generation**: TinyLlama reviews the statistical summary and produces a high-level briefing for the clinic administration.
4.  **Output**: Returns an `AnalyticsReport` containing structured trends, high-risk group data, and the narrative summary.

---

## 🛠️ Tech Stack
*   **Data Processing**: Python & Pandas
*   **Intelligence**: TinyLlama-1.1B
*   **Web Framework**: FastAPI
*   **Visual Analysis**: Simulated via structured metadata (Ready for Plotly/Chart.js integration)

---

## 🚀 Getting Started

### 1. Running the Agent
Start the microservice on port `8009`:
```bash
export PYTHONPATH=$PYTHONPATH:.
python3 -m agents.agent_09_analytics.main
```

### 2. Testing & Endpoint Calling

**Option A: Automated Test Script**
Run the cohort analysis simulation:
```bash
python3 -m agents.agent_09_analytics.test_agent
```

**Option B: Manual Curl Call**
```bash
curl -X POST http://localhost:8009/analyze \
     -H "Content-Type: application/json" \
     -d '{
          "cohort_name": "Senior Wellness Cohort",
          "date_range": "2026-Q1",
          "records": [
            {"record_id": "M-1", "age_group": "70+", "gender": "F", "diagnoses": ["Hypertension"], "risk_score": 0.75, "outcome": "Stable"},
            {"record_id": "M-2", "age_group": "70+", "gender": "M", "diagnoses": ["Hypertension"], "risk_score": 0.82, "outcome": "Improved"}
          ]
         }'
```
