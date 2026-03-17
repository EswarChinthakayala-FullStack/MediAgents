from fastapi import FastAPI, HTTPException
from .models import PatientNotificationRequest, NotificationMessage, PortalContent
from .notification_engine import NotificationEngine
import uvicorn
import httpx
import asyncio
import sys
import os

# Add parent path for event_bus
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
from event_bus import EventBus

app = FastAPI(title="ClinicAI - Patient Notification & Portal Agent (12)")
engine = NotificationEngine()
bus = EventBus()

async def handle_notification_events(data: dict):
    """Callback for all events that require a patient notification."""
    print(f"Agent 12 processing notification for: {data.get('patient_id')}")
    
    # Map event and process notification (simplified)
    # req = PatientNotificationRequest(...)
    # notifications = engine.process_notification(req)
    # for n in notifications:
    #    bus.publish("notification_sent", n.model_dump())
    
    # Placeholder for demo
    patient_id = data.get("patient_id") or data.get("triage_id")
    if not patient_id:
        return # Don't publish notifications without a valid patient target
        
    bus.publish("notification_sent", {
        "patient_id": patient_id,
        "status": "SENT",
        "original_event": data
    })

@app.on_event("startup")
async def startup_event():
    # Subscribe to clinical alerts
    topics = ["appointment_scheduled", "medication_alert", "emergency_alert"]
    for topic in topics:
        asyncio.create_task(bus.start_subscriber_task(
            stream_name=topic,
            group_name="portal_group",
            consumer_name="agent_12",
            callback=handle_notification_events
        ))

@app.get("/")
async def root():
    return {"agent": "12", "name": "Patient Notification & Portal Agent", "status": "online"}

@app.get("/notifications/{patient_id}", response_model=PortalContent)
async def get_patient_notifications(patient_id: str):
    return await get_portal_view(patient_id)

@app.put("/notifications/{id}/read")
async def mark_notification_read(id: str):
    return {"status": "success", "notification_id": id, "action": "READ"}

@app.post("/notify", response_model=list[NotificationMessage])
async def send_notification(req: PatientNotificationRequest):
    try:
        notifications = engine.process_notification(req)
        for n in notifications:
            bus.publish("notification_sent", n.model_dump())
        return notifications
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/submit_symptoms")
async def handle_symptom_submission(data: dict):
    """
    Patient submits symptoms via the portal.
    This calls the Master Orchestrator to start the clinical pipeline.
    """
    ORCHESTRATOR_URL = os.getenv("ORCHESTRATOR_URL", "http://localhost:8000")
    
    async with httpx.AsyncClient() as client:
        try:
            resp = await client.post(f"{ORCHESTRATOR_URL}/orchestrate", json={
                "patient_id": data.get("patient_id"),
                "symptoms": data.get("symptoms"),
                "severity": data.get("severity", 5),
                "duration": data.get("duration", 1)
            })
            return resp.json()
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Portal failed to reach Orchestrator: {str(e)}")

@app.get("/portal/{patient_id}", response_model=PortalContent)
async def get_portal_view(patient_id: str):
    # Filter global history for this specific patient
    relevant = [n for n in engine.notifications_history if n.patient_id == patient_id]
    
    return PortalContent(
        patient_id=patient_id,
        recent_notifications=relevant[:10],
        available_reports=[{"type": "Lab Result", "date": "2026-03-01", "name": "Complete Blood Count"}],
        upcoming_appointments=[{"date": "2026-03-20T10:00:00Z", "doctor": "Dr. Smith"}]
    )

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8012)
