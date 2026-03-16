from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional
from datetime import datetime

class DifferentialDiagnosis(BaseModel):
    condition: str
    probability: float # 0.0 - 1.0
    reasoning: str

class Investigation(BaseModel):
    test_name: str
    purpose: str
    priority: str # Routine | Urgent | Stat

class DrugSafetyAlert(BaseModel):
    severity: str # Moderate | High | Critical
    description: str

class PatientContext(BaseModel):
    patient_id: str
    current_symptoms: str
    triage_tier: int
    risk_score: float

class DoctorProfile(BaseModel):
    doctor_id: str
    specialty: str

class DecisionRequest(BaseModel):
    patient: PatientContext
    doctor: DoctorProfile
    # Traditional fields (optional for compatibility)
    patient_id: Optional[str] = None
    chief_complaint: Optional[str] = None
    triage_summary: Optional[str] = None
    history: List[str] = []
    current_medications: List[str] = []
    lab_results: Dict[str, Any] = {}
    risk_scores: Dict[str, float] = {} # From Agent 04

class ClinicalRecommendation(BaseModel):
    prefix: str = "For physician review only — not a substitute for clinical judgement."
    differential_diagnoses: List[DifferentialDiagnosis]
    recommended_investigations: List[Investigation]
    treatment_options: List[str]
    drug_safety_alerts: List[DrugSafetyAlert]
    guideline_citations: List[str]
    timestamp: str = Field(default_factory=lambda: datetime.utcnow().isoformat() + "Z")
