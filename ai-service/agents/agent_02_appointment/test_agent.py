from agents.agent_02_appointment.scheduler import AppointmentAgent
from agents.agent_02_appointment.models import (
    AppointmentRequest, PatientQueueItem, DoctorAvailability, ResourceState
)

def test_scheduling():
    agent = AppointmentAgent()
    
    # Mock data
    patient = PatientQueueItem(
        patient_id="PAT-456",
        triage_tier=2, # Urgent
        severity_score=8,
        waiting_minutes=20
    )
    
    doc = DoctorAvailability(
        doctor_id="DOC-1",
        name="Dr. Smith",
        specialty="General Medicine",
        available_slots=["2026-03-13T15:00:00Z"]
    )
    
    resources = ResourceState(
        rooms_available=2,
        nurses_on_duty=3
    )
    
    request = AppointmentRequest(
        patient=patient,
        available_doctors=[doc],
        resource_state=resources
    )
    
    print("\n--- Running Appointment Prioritisation ---")
    result = agent.schedule(request)
    
    for item in result.current_queue:
        print(f"Appointment ID: {item.appointment_id}")
        print(f"Patient ID: {item.patient_id}")
        print(f"Assigned Doctor: {item.doctor_name}")
        print(f"Slot: {item.slot}")
        print(f"Est. Wait Time: {item.estimated_wait_time} mins")
    
    print(f"\nOptimization Reasoning:\n{result.optimization_reasoning}")

if __name__ == "__main__":
    test_scheduling()
