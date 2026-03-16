from fastapi import FastAPI, HTTPException
from .models import PatientProfile, RiskAssessment, LabResult, Vitals
from .risk_analyzer import RiskPredictor
import uvicorn
import asyncio
import sys
import os

# Add parent path for event_bus
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
from event_bus import EventBus

app = FastAPI(title="ClinicAI - Predictive Risk Analytics Agent (04)")
predictor = RiskPredictor()
bus = EventBus()

async def handle_input_updates(data: dict):
    """Callback for vital alerts or EHR updates."""
    print(f"Agent 04 received update for patient: {data.get('patient_id')}")
    
    # Simple mapping for demo
    profile = PatientProfile(
        patient_id=data.get("patient_id", "UNKNOWN"),
        age=45, # Mock
        vitals=Vitals(**data.get("vitals", {"heart_rate": 80, "sys_bp": 120, "dia_bp": 80, "temp": 37.0, "spo2": 98})),
        recent_labs=[LabResult(test_name="Glucose", value=110, unit="mg/dL", status="Normal")],
        comorbidities=["None"]
    )
    
    result = predictor.predict(profile)
    
    # Publish to Event Bus
    bus.publish("risk_score_updated", result.model_dump())

@app.on_event("startup")
async def startup_event():
    # Subscribe to vital_alert
    asyncio.create_task(bus.start_subscriber_task(
        stream_name="vital_alert",
        group_name="risk_group",
        consumer_name="agent_04",
        callback=handle_input_updates
    ))
    # Subscribe to ehr_updated
    asyncio.create_task(bus.start_subscriber_task(
        stream_name="ehr_updated",
        group_name="risk_group",
        consumer_name="agent_04",
        callback=handle_input_updates
    ))

@app.get("/")
async def root():
    return {"agent": "04", "name": "Predictive Risk Analytics Agent", "status": "online"}

@app.get("/risk/{id}", response_model=RiskAssessment)
async def get_patient_risk(id: str):
    # Simulated profile for lookup
    profile = PatientProfile(patient_id=id, age=45, comorbidities=[])
    return predictor.predict(profile)

@app.get("/risk/{id}/history")
async def get_risk_history(id: str):
    return {"patient_id": id, "history": [{"timestamp": "2026-03-15T12:00:00Z", "risk_tier": "Low"}, {"timestamp": "2026-03-16T12:00:00Z", "risk_tier": "Medium"}]}

@app.post("/risk/score", response_model=RiskAssessment)
async def score_risk(data: PatientProfile):
    try:
        result = predictor.predict(data)
        bus.publish("risk_score_updated", result.model_dump())
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8004)
