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

class DecisionRequest(BaseModel):
    patient_id: str
    chief_complaint: str
    triage_summary: str
    history: List[str]
    current_medications: List[str]
    lab_results: Dict[str, Any]
    risk_scores: Dict[str, float] # From Agent 04

class ClinicalRecommendation(BaseModel):
    prefix: str = "For physician review only — not a substitute for clinical judgement."
    differential_diagnoses: List[DifferentialDiagnosis]
    recommended_investigations: List[Investigation]
    treatment_options: List[str]
    drug_safety_alerts: List[DrugSafetyAlert]
    guideline_citations: List[str]
    timestamp: str = Field(default_factory=lambda: datetime.utcnow().isoformat() + "Z")
