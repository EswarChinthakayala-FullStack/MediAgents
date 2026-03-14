from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional
from datetime import datetime

class ChatMessage(BaseModel):
    role: str # user | assistant
    content: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class ChatSession(BaseModel):
    patient_id: str
    history: List[ChatMessage] = []
    language_preference: str = "en"

class AssistantResponse(BaseModel):
    response_text: str
    intent: str # FAQ | SymptomQuery | AppointmentRequest | Emergency
    escalation_required: bool
    booking_suggested: bool
    session_id: str
    timestamp: str = Field(default_factory=lambda: datetime.utcnow().isoformat() + "Z")

class UserInput(BaseModel):
    patient_id: str
    message: str
    session_id: Optional[str] = None
    language: Optional[str] = "en"
    ehr_summary: Optional[str] = None # From Agent 06
