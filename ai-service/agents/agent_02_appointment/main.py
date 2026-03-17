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
    patient_id = data.get("patient_id") or data.get("triage_id") or "UNKNOWN"
    request = AppointmentRequest(
        patient=AppointmentRequestPatient(
            patient_id=patient_id,
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
    
    # 🧪 Shared Memory Pattern: Include patient context in publish
    payload = result.model_dump()
    payload["patient_id"] = patient_id
    
    # Publish to Event Bus
    bus.publish("appointment_scheduled", payload)

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
async def get_slots(date: str = "2026-03-16", doctor_id: str = None):
    # Simulated slots based on date
    # In a real system, this would query a database
    
    # Let's generate some slots based on the date string to make it feel dynamic
    day_seed = sum(ord(c) for c in date) % 10
    
    all_slots = [
        {"time": "09:00", "available": day_seed != 1},
        {"time": "09:30", "available": True},
        {"time": "10:00", "available": day_seed != 2},
        {"time": "10:30", "available": True},
        {"time": "11:00", "available": day_seed != 3},
        {"time": "11:30", "available": True},
        {"time": "13:00", "available": day_seed != 4},
        {"time": "13:30", "available": True},
        {"time": "14:00", "available": day_seed != 5},
        {"time": "14:30", "available": True},
        {"time": "15:00", "available": day_seed != 6},
    ]
    
    return {
        "doctor_id": doctor_id or "DR-101",
        "date": date,
        "slots": all_slots
    }

@app.get("/appointments/{patient_id}")
async def get_patient_appointments(patient_id: str):
    # Simulated appointments for the patient
    return [
        {
            "id": "APT-001",
            "doctor_name": "Dr. Sarah Mitchell",
            "specialty": "General Practice",
            "date": "2026-03-20T10:30:00Z",
            "type": "Follow-up",
            "status": "Confirmed"
        },
        {
            "id": "APT-002",
            "doctor_name": "Dr. James Wilson",
            "specialty": "Cardiology",
            "date": "2026-03-25T14:45:00Z",
            "type": "Initial Consultation",
            "status": "Scheduled"
        }
    ]

@app.put("/reschedule")
async def reschedule_appointment(appointment_id: str, new_slot: str):
    return {"status": "success", "appointment_id": appointment_id, "new_slot": new_slot}

@app.get("/queue", response_model=QueueStatus)
async def get_queue():
    # Return mock status
    return agent.schedule(None) # Fallback if agent needs request

@app.post("/book")
async def book_simple(data: dict):
    """Simple booking endpoint for direct portal use."""
    patient_id = data.get("patient_id")
    doctor_id = data.get("doctor_id")
    slot = f"{data.get('date')}T{data.get('time')}:00"
    
    # Mock scheduling logic
    # In a real system, would use agent.schedule()
    print(f"Agent 02 booking simple appointment for {patient_id} with {doctor_id} at {slot}")
    
    # Structured result for frontend report view
    queue_item = {
        "appointment_id": f"APT-{os.urandom(4).hex().upper()}",
        "patient_id": patient_id,
        "doctor_id": doctor_id,
        "doctor_name": "Scheduled Professional",
        "slot": slot,
        "priority_rank": 1,
        "estimated_wait_time": 10,
        "status": "confirmed"
    }
    
    # Trigger event bus with structured payload
    bus.publish("appointment_scheduled", {
        "current_queue": [queue_item],
        "optimization_reasoning": "Appointment finalized through patient portal with priority optimization.",
        "patient_id": patient_id
    })
    
    return {
        "status": "success",
        "confirmation_code": f"CONF-{os.urandom(3).hex().upper()}",
        "message": "Appointment confirmed by Scheduler Agent"
    }

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
