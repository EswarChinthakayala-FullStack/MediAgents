from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional
from datetime import datetime

class EmergencyEvent(BaseModel):
    event_id: str = Field(default_factory=lambda: str(datetime.utcnow().timestamp()))
    patient_id: str
    source_agent: str # Monitoring | Triage | Risk | Conversational
    severity: str # URGENT | CRITICAL
    event_details: str
    timestamp: str = Field(default_factory=lambda: datetime.utcnow().isoformat() + "Z")

class AlertNotification(BaseModel):
    notification_id: str
    patient_id: str
    physician_message: str
    patient_message: str
    priority_actions: List[str]
    severity: str
    escalation_status: str = "Active" # Active | Notified | Escalated | Acknowledged
    timestamp: str = Field(default_factory=lambda: datetime.utcnow().isoformat() + "Z")
