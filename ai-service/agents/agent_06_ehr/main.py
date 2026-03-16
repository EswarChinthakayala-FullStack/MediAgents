from fastapi import FastAPI, HTTPException, Query
from .models import EHRRecord, ClinicalSummary, AuditLogEntry
from .ehr_manager import EHRManager
import uvicorn
import asyncio
import sys
import os

# Add parent path for event_bus
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
from event_bus import EventBus

app = FastAPI(title="ClinicAI - Smart EHR Agent (06)")
manager = EHRManager()
bus = EventBus()

async def handle_ehr_event(data: dict):
    """Callback for all events that update the EHR."""
    print(f"Agent 06 received clinical event: {data.get('type') or 'EHR_UPDATE'}")
    
    # In a real system, we'd find and update the record.
    # For now, we'll just log it and publish ehr_updated.
    patient_id = data.get("patient_id") or data.get("triage_id")
    if patient_id:
        # Publish to Event Bus
        bus.publish("ehr_updated", {
            "patient_id": patient_id,
            "status": "UPDATED",
            "last_event": data
        })
        
        # 🧪 Shared Memory Pattern: Update Context
        context = bus.get_context(patient_id) or {"patient_id": patient_id}
        context["current_status"] = "RECORDS_SYNCED"
        context["last_updated"] = data.get("timestamp") or "Just Now"
        bus.set_context(patient_id, context)

@app.on_event("startup")
async def startup_event():
    # Subscribe to multiple topics
    topics = ["triage_result", "appointment_scheduled", "vital_alert", "notification_sent"]
    for topic in topics:
        asyncio.create_task(bus.start_subscriber_task(
            stream_name=topic,
            group_name="ehr_group",
            consumer_name="agent_06",
            callback=handle_ehr_event
        ))

@app.get("/")
async def root():
    return {"agent": "06", "name": "Smart EHR Agent", "status": "online"}

@app.get("/patient/{id}/context", response_model=EHRRecord)
async def get_patient_context(id: str, requester: str = Query("ExternalAgent")):
    return await get_patient_record(id, requester)

@app.get("/patient/{id}/full", response_model=ClinicalSummary)
async def get_patient_full(id: str, requester: str = Query("ExternalAgent")):
    return await get_patient_summary(id, requester)

@app.post("/patient/{id}/note")
async def add_patient_note(id: str, note: str):
    return {"status": "success", "patient_id": id, "note_added": note}

@app.post("/patient/{id}/vitals")
async def add_patient_vitals(id: str, vitals: dict):
    bus.publish("vital_alert", {"patient_id": id, "vitals": vitals, "source": "EHR_MANUAL_ENTRY"})
    return {"status": "success", "patient_id": id, "vitals_recorded": vitals}

@app.get("/record/{patient_id}", response_model=EHRRecord)
async def get_patient_record(patient_id: str, requester: str = Query("ExternalAgent")):
    record = manager.get_record(patient_id, requester)
    if not record:
        raise HTTPException(status_code=404, detail="Patient not found")
    return record

@app.post("/record", response_model=dict)
async def update_patient_record(record: EHRRecord, requester: str = Query("ExternalAgent")):
    manager.update_record(record, requester)
    bus.publish("ehr_updated", {"patient_id": record.patient_id, "status": "MANUAL_UPDATE"})
    return {"status": "success", "message": f"Record for {record.patient_id} updated"}

@app.get("/summary/{patient_id}", response_model=ClinicalSummary)
async def get_patient_summary(patient_id: str, requester: str = Query("ExternalAgent")):
    summary = manager.generate_summary(patient_id, requester)
    if not summary:
        raise HTTPException(status_code=404, detail="Patient not found")
    return summary

@app.get("/audit", response_model=list[AuditLogEntry])
async def get_audit_logs():
    return manager.audit_logs

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8006)
