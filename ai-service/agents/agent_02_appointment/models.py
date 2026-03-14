from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional
from datetime import datetime

class PatientQueueItem(BaseModel):
    patient_id: str
    triage_tier: int  # 1=Emergency, 2=Urgent, 3=Routine, 4=Self-care
    severity_score: int # 1-10
    waiting_minutes: int
    is_revisit: bool = False

class DoctorAvailability(BaseModel):
    doctor_id: str
    name: str
    specialty: str
    available_slots: List[str] # List of ISO datetimes

class ResourceState(BaseModel):
    rooms_available: int
    nurses_on_duty: int

class AppointmentRequest(BaseModel):
    patient: PatientQueueItem
    available_doctors: List[DoctorAvailability]
    resource_state: ResourceState

class ScheduledAppointment(BaseModel):
    appointment_id: str
    patient_id: str
    doctor_id: str
    doctor_name: str
    slot: str
    estimated_wait_time: int # minutes
    priority_rank: int

class QueueStatus(BaseModel):
    current_queue: List[ScheduledAppointment]
    optimization_reasoning: str
    timestamp: str = Field(default_factory=lambda: datetime.utcnow().isoformat() + "Z")
