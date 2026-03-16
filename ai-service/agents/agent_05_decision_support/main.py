from fastapi import FastAPI, HTTPException
from .models import DecisionRequest, ClinicalRecommendation, PatientContext, DoctorProfile
from .logic import DecisionSupportAgent
import uvicorn
import asyncio
import sys
import os

# Add parent path for event_bus
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
from event_bus import EventBus

app = FastAPI(title="ClinicAI - Doctor Decision Support Agent (05)")
agent = DecisionSupportAgent()
bus = EventBus()

async def handle_clinical_updates(data: dict):
    """Callback for triage results or risk updates."""
    print(f"Agent 05 received update for patient: {data.get('patient_id') or data.get('triage_id')}")
    
    # Mock context creation
    req = DecisionRequest(
        patient=PatientContext(
            patient_id=data.get("patient_id") or data.get("triage_id", "UNKNOWN"),
            current_symptoms=data.get("triage_summary", "Unknown symptoms"),
            triage_tier=data.get("urgency_tier", 3),
            risk_score=data.get("risk_score", 0.5)
        ),
        doctor=DoctorProfile(doctor_id="DR-101", specialty="Emergency")
    )
    
    result = agent.provide_support(req)
    
    # Publish to Event Bus
    bus.publish("decision_ready", result.model_dump())

@app.on_event("startup")
async def startup_event():
    # Subscribe to triage_result
    asyncio.create_task(bus.start_subscriber_task(
        stream_name="triage_result",
        group_name="decision_group",
        consumer_name="agent_05",
        callback=handle_clinical_updates
    ))
    # Subscribe to risk_score_updated
    asyncio.create_task(bus.start_subscriber_task(
        stream_name="risk_score_updated",
        group_name="decision_group",
        consumer_name="agent_05",
        callback=handle_clinical_updates
    ))

@app.get("/")
async def root():
    return {"agent": "05", "name": "Doctor Decision Support Agent", "status": "online"}

@app.get("/decision/{id}", response_model=ClinicalRecommendation)
async def get_decision(id: str):
    # Simulated request
    req = DecisionRequest(
        patient=PatientContext(patient_id=id, current_symptoms="Mild cough", triage_tier=3, risk_score=0.2),
        doctor=DoctorProfile(doctor_id="DR-101", specialty="GP")
    )
    return agent.provide_support(req)

@app.post("/decision/generate", response_model=ClinicalRecommendation)
async def generate_decision(req: DecisionRequest):
    try:
        result = agent.provide_support(req)
        bus.publish("decision_ready", result.model_dump())
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8005)
