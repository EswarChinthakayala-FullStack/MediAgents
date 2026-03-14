from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional
from datetime import datetime

class PatientNotificationRequest(BaseModel):
    patient_id: str
    event_type: str # APPOINTMENT | LAB_RESULT | MEDICATION | EMERGENCY | NUDGE
    event_details: str
    channel_preference: List[str] = ["push", "in-app"] # push, sms, email, in-app
    urgency: str = "Routine" # Routine | Urgent | Critical

class NotificationMessage(BaseModel):
    notification_id: str
    patient_id: str
    channel: str
    subject: str
    body: str
    call_to_action: str
    timestamp: str = Field(default_factory=lambda: datetime.utcnow().isoformat() + "Z")

class PortalContent(BaseModel):
    patient_id: str
    recent_notifications: List[NotificationMessage]
    available_reports: List[Dict[str, str]]
    upcoming_appointments: List[Dict[str, str]]

class DeliveryReport(BaseModel):
    notification_id: str
    status: str # SENT | DELIVERED | FAILED
    delivered_at: str
