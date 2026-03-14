from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional
from datetime import datetime

class DeIdentifiedRecord(BaseModel):
    record_id: str
    age_group: str # e.g., "18-30", "60+"
    gender: str
    diagnoses: List[str]
    risk_score: float
    outcome: str # e.g., "Improved", "Stable", "Deteriorated"

class DiseaseTrend(BaseModel):
    condition: str
    count: int
    incidence_rate: float # percentage of cohort

class RiskCohort(BaseModel):
    demographic: str
    average_risk: float

class AnalyticsReport(BaseModel):
    report_period: str
    total_patients_analyzed: int
    top_diseases: List[DiseaseTrend]
    high_risk_demographics: List[RiskCohort]
    outcome_summary: Dict[str, int]
    executive_briefing: str # LLM Generated
    timestamp: str = Field(default_factory=lambda: datetime.utcnow().isoformat() + "Z")

class AnalyticsRequest(BaseModel):
    cohort_name: str
    records: List[DeIdentifiedRecord]
    date_range: str
