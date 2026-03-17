from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional
from datetime import datetime

class PatientInput(BaseModel):
    patient_id: str = Field(..., example="PAT-12345")
    symptom_text: str = Field(..., example="I have severe chest pain and I am sweating.")
    severity: int = Field(..., ge=1, le=10, example=9)
    duration_days: int = Field(..., ge=0, example=1)
    age: int = Field(..., ge=0, le=120, example=55)
    sex: str = Field(..., example="Male")
    conditions: List[str] = Field(default_factory=list, example=["Diabetes", "Hypertension"])
    medications: List[str] = Field(default_factory=list, example=["Metformin", "Lisinopril"])

class TriageResult(BaseModel):
    triage_id: str
    patient_id: str
    urgency_tier: int
    urgency_label: str
    triage_summary: str
    recommended_action: str
    reasoning: List[str]
    icd10_hints: List[Dict[str, str]]
    drug_alerts: List[Dict[str, str]]
    timestamp: str = Field(default_factory=lambda: datetime.utcnow().isoformat() + "Z")
    requires_alert: bool = False
