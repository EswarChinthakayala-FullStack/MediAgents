from fastapi import FastAPI, HTTPException, Query
from .models import MedicationReport, MedicationAnalysis, MedicationItem
from .medication_manager import MedicationManager
import uvicorn
import asyncio
import sys
import os

# Add parent path for event_bus
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
from event_bus import EventBus

app = FastAPI(title="ClinicAI - Medication Management Agent (07)")
manager = MedicationManager()
bus = EventBus()

async def handle_ehr_update(data: dict):
    """Callback for EHR updates to check for medication adherence or changes."""
    print(f"Agent 07 received EHR update for patient: {data.get('patient_id')}")
    
    # Mock adherence check
    report = MedicationReport(
        patient_id=data.get("patient_id", "UNKNOWN"),
        medications=[MedicationItem(drug_name="Unknown", dosage="N/A", frequency="N/A", last_taken="Never")],
        adherence_logs=[]
    )
    result = manager.analyze(report)
    
    # Publish to Event Bus if there's an alert
    if result.alerts:
        bus.publish("medication_alert", result.model_dump())

@app.on_event("startup")
async def startup_event():
    asyncio.create_task(bus.start_subscriber_task(
        stream_name="ehr_updated",
        group_name="medication_group",
        consumer_name="agent_07",
        callback=handle_ehr_update
    ))

@app.get("/")
async def root():
    return {"agent": "07", "name": "Medication Management Agent", "status": "online"}

@app.get("/medications/{id}", response_model=MedicationReport)
async def get_medications(id: str):
    # Simulated report
    return MedicationReport(patient_id=id, prescriptions=[], reported_side_effects=[])

@app.post("/prescribe")
async def prescribe_medication(patient_id: str, drug_name: str, dosage: str):
    return {"status": "success", "patient_id": patient_id, "prescribed": drug_name}

@app.put("/adherence/{id}")
async def update_adherence(id: str, medication_name: str, status: str):
    return {"status": "success", "patient_id": id, "medication": medication_name, "adherence": status}

@app.get("/interactions")
async def check_interactions(drugs: list[str] = Query(...)):
    return {"interactions": ["No major interactions found for " + ", ".join(drugs)]}

@app.post("/analyze", response_model=MedicationAnalysis)
async def analyze_medication(report: MedicationReport):
    try:
        result = manager.analyze(report)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8007)
