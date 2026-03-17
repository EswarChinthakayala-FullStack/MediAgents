from fastapi import FastAPI, HTTPException
from .models import EmergencyEvent, AlertNotification
from .coordinator import AlertCoordinator
import uvicorn
import asyncio
import sys
import os

# Add parent path for event_bus
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
from event_bus import EventBus

app = FastAPI(title="ClinicAI - Emergency Alert Agent (10)")
coordinator = AlertCoordinator()
bus = EventBus()

# State for escalation tracking
acknowledged_alerts = set()

async def run_escalation_timer(notification_id: str, patient_id: str, delay: int = 120):
    """Wait for acknowledgement, else escalate."""
    await asyncio.sleep(delay)
    if notification_id not in acknowledged_alerts:
        print(f"🔥 [ESCALATION] Alert {notification_id} for {patient_id} NOT ACKNOWLEDGED!")
        # Trigger Escalation via Event Bus
        bus.publish("emergency_escalation", {
            "notification_id": notification_id,
            "patient_id": patient_id,
            "status": "UNACKNOWLEDGED",
            "action": "DISPATCH_AMBULANCE"
        })

async def handle_high_priority_event(data: dict):
    """Callback for high priority events from other agents."""
    # Check if this is an emergency
    is_emergency = False
    
    # Logic to determine if it's an emergency based on data
    if data.get("urgency_tier") == 1 or data.get("severity") == "Critical":
        patient_id = data.get("patient_id") or data.get("triage_id")
        if not patient_id:
            return

        is_emergency = True
        event = EmergencyEvent(
            patient_id=patient_id,
            source=data.get("source", "System Alert"),
            severity="CRITICAL",
            details=data.get("details") or data.get("triage_summary", "High priority alert.")
        )

    if is_emergency:
        notification = coordinator.process_emergency(event)
        # Publish to Event Bus
        bus.publish("emergency_alert", notification.model_dump())
        
        # Start escalation timer (Scenario 2.3)
        asyncio.create_task(run_escalation_timer(
            notification.notification_id, 
            notification.patient_id
        ))

@app.on_event("startup")
async def startup_event():
    # Subscribe to triage_result
    asyncio.create_task(bus.start_subscriber_task(
        stream_name="triage_result",
        group_name="emergency_group",
        consumer_name="agent_10",
        callback=handle_high_priority_event
    ))
    # Subscribe to vital_alert
    asyncio.create_task(bus.start_subscriber_task(
        stream_name="vital_alert",
        group_name="emergency_group",
        consumer_name="agent_10",
        callback=handle_high_priority_event
    ))

@app.get("/")
async def root():
    return {"agent": "10", "name": "Emergency Alert Agent", "status": "online"}

@app.post("/alert", response_model=AlertNotification)
async def trigger_high_priority_alert(event: EmergencyEvent):
    return await trigger_alert(event)

@app.get("/alerts/{doctor_id}")
async def get_doctor_alerts(doctor_id: str):
    return await get_active_alerts()

@app.put("/alert/{id}/acknowledge")
async def physician_acknowledge(id: str):
    return await acknowledge_alert(id)

@app.get("/alert/config")
async def get_alert_config():
    return {"escalation_delay_seconds": 120, "channels": ["WebSocket", "SMS"]}

@app.post("/acknowledge/{notification_id}")
async def acknowledge_alert(notification_id: str):
    """Doctor acknowledges the alert."""
    acknowledged_alerts.add(notification_id)
    print(f"✅ Alert {notification_id} acknowledged by physician.")
    return {"status": "acknowledged"}

@app.post("/trigger", response_model=AlertNotification)
async def trigger_alert(event: EmergencyEvent):
    try:
        notification = coordinator.process_emergency(event)
        bus.publish("emergency_alert", notification.model_dump())
        
        # Start escalation timer
        asyncio.create_task(run_escalation_timer(
            notification.notification_id, 
            notification.patient_id
        ))
        
        return notification
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/alerts")
async def get_active_alerts():
    return list(coordinator.active_alerts.values())

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8010)
