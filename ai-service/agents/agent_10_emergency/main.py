from fastapi import FastAPI, HTTPException
from .models import EmergencyEvent, AlertNotification
from .coordinator import AlertCoordinator
import uvicorn

app = FastAPI(title="ClinicAI - Emergency Alert Agent (10)")
coordinator = AlertCoordinator()

@app.get("/")
async def root():
    return {"agent": "10", "name": "Emergency Alert Agent", "status": "online"}

@app.post("/trigger", response_model=AlertNotification)
async def trigger_alert(event: EmergencyEvent):
    try:
        notification = coordinator.process_emergency(event)
        return notification
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/alerts")
async def get_active_alerts():
    return list(coordinator.active_alerts.values())

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8010)
