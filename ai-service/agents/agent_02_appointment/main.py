from fastapi import FastAPI, HTTPException
from .models import AppointmentRequest, QueueStatus, AppointmentRequestPatient, ResourceState, DoctorAvailability
from .scheduler import AppointmentAgent
import uvicorn
import asyncio
import sys
import os

# Add parent path for event_bus
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
from event_bus import EventBus

app = FastAPI(title="ClinicAI - Appointment Prioritisation Agent (02)")
agent = AppointmentAgent()
bus = EventBus()

async def handle_triage_result(data: dict):
    """Callback when a triage result is received."""
    print(f"Agent 02 received triage result for patient: {data.get('triage_id')}")
    
    # Map triage result to appointment request (simplified for demo)
    request = AppointmentRequest(
        patient=AppointmentRequestPatient(
            patient_id=data.get("triage_id", "UNKNOWN"),
            triage_tier=data.get("urgency_tier", 3),
            severity_score=data.get("urgency_tier", 3) * 2, # Mock mapping
            waiting_minutes=0
        ),
        available_doctors=[
            DoctorAvailability(doctor_id="DR-101", name="Dr. Smith", specialty="General", available_slots=["2026-03-16T15:00:00"])
        ],
        resource_state=ResourceState(rooms_available=5, nurses_on_duty=2)
    )
    
    result = agent.schedule(request)
    
    # Publish to Event Bus
    bus.publish("appointment_scheduled", result.model_dump())

@app.on_event("startup")
async def startup_event():
    asyncio.create_task(bus.start_subscriber_task(
        stream_name="triage_result",
        group_name="appointment_group",
        consumer_name="agent_02",
        callback=handle_triage_result
    ))

@app.get("/")
async def root():
    return {"agent": "02", "name": "Appointment Prioritisation Agent", "status": "online"}

@app.get("/slots")
async def get_slots(doctor_id: str = None):
    # Simulated slots
    return {
        "doctor_id": doctor_id or "ALL",
        "slots": ["2026-03-16T15:00:00Z", "2026-03-16T16:00:00Z", "2026-03-17T09:00:00Z"]
    }

@app.put("/reschedule")
async def reschedule_appointment(appointment_id: str, new_slot: str):
    return {"status": "success", "appointment_id": appointment_id, "new_slot": new_slot}

@app.get("/queue", response_model=QueueStatus)
async def get_queue():
    # Return mock status
    return agent.schedule(None) # Fallback if agent needs request

@app.post("/schedule", response_model=QueueStatus)
async def perform_scheduling(data: AppointmentRequest):
    try:
        result = agent.schedule(data)
        # Also publish manually triggered schedules
        bus.publish("appointment_scheduled", result.model_dump())
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8002)
