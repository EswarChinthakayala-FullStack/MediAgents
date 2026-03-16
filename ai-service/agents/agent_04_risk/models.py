from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional
from datetime import datetime

class RiskFactor(BaseModel):
    name: str
    impact: float # SHAP-like value
    description: str

class LabResult(BaseModel):
    test_name: str
    value: float
    unit: str
    status: str # Normal | Abnormal | Critical

class Vitals(BaseModel):
    heart_rate: int
    sys_bp: int
    dia_bp: int
    temp: float
    spo2: int

class PatientProfile(BaseModel):
    patient_id: str
    age: int
    comorbidities: List[str]
    vitals: Optional[Vitals] = None
    recent_labs: List[LabResult] = []
    recent_vital_trends: Dict[str, str] = {} # e.g. {"HeartRate": "Increasing", "SpO2": "Decreasing"}
    last_lab_results: Dict[str, float] = {} # e.g. {"Creatinine": 1.5, "Glucose": 200}
    medications: List[str] = []

class RiskAssessment(BaseModel):
    patient_id: str
    deterioration_risk: float # 0.0 - 1.0
    readmission_risk: float
    complication_risk: float
    risk_tier: str # Low | Medium | High | Critical
    top_risk_factors: List[RiskFactor]
    narrative_summary: str # LLM generated SBAR
    recommended_interventions: List[str]
    timestamp: str = Field(default_factory=lambda: datetime.utcnow().isoformat() + "Z")
