from fastapi import FastAPI, HTTPException
from .models import PatientInput, TriageResult
from .triage_logic import SymptomTriageAgent
import uvicorn
import sys
import os

# Add parent path for event_bus
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
from event_bus import EventBus

app = FastAPI(title="ClinicAI - Symptom Triage Agent (01)")
agent = SymptomTriageAgent()
bus = EventBus()

@app.get("/")
async def root():
    return {"agent": "01", "name": "Symptom Triage Agent", "status": "online"}

@app.get("/health")
async def health():
    return {"status": "healthy", "agent": "01"}

@app.post("/triage", response_model=TriageResult)
async def perform_triage(data: PatientInput):
    try:
        result = agent.process(data)
        
        # Publish to Event Bus
        bus.publish("triage_result", result.model_dump())
        
        # 🧪 Shared Memory Pattern: Initialize Patient Context
        bus.set_context(result.triage_id, {
            "patient_id": result.triage_id,
            "current_status": "TRIAGED",
            "urgency_tier": result.urgency_tier,
            "last_symptoms": data.symptom_text,
            "timestamp": result.timestamp
        })
        
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8001)
