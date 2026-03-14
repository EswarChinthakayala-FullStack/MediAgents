from fastapi import FastAPI, HTTPException
from .models import PatientNotificationRequest, NotificationMessage, PortalContent
from .notification_engine import NotificationEngine
import uvicorn

app = FastAPI(title="ClinicAI - Patient Notification & Portal Agent (12)")
engine = NotificationEngine()

@app.get("/")
async def root():
    return {"agent": "12", "name": "Patient Notification & Portal Agent", "status": "online"}

@app.post("/notify", response_model=list[NotificationMessage])
async def send_notification(req: PatientNotificationRequest):
    try:
        notifications = engine.process_notification(req)
        return notifications
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

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
