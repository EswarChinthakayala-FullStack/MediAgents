from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional
from datetime import datetime

class Prescription(BaseModel):
    medication_name: str
    dosage: str
    frequency: str
    remaining_doses: int
    is_critical: bool = False

class AdherenceRecord(BaseModel):
    medication_name: str
    taken_timestamp: datetime
    status: str # Taken | Missed | Delayed

class MedicationReport(BaseModel):
    patient_id: str
    prescriptions: List[Prescription]
    adherence_history: List[AdherenceRecord]
    reported_side_effects: List[str] = []

class MedicationAnalysis(BaseModel):
    patient_id: str
    adherence_scores: Dict[str, float] # percentage
    side_effect_flags: List[str]
    refill_reminders: List[str]
    patient_instructions: str # LLM generated
    adjustment_recommendations: List[str]
    timestamp: str = Field(default_factory=lambda: datetime.utcnow().isoformat() + "Z")
