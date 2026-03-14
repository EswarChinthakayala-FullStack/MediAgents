from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional
from datetime import datetime

class AccessRequest(BaseModel):
    user_id: str
    role: str # Doctor, Nurse, Admin, Patient, ExternalAgent
    resource: str # e.g., "EHR_RECORD", "VITAL_STREAM", "ANALYTICS"
    action: str # READ, WRITE, DELETE, SUMMARY
    resource_id: Optional[str] = None
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class AccessDecision(BaseModel):
    request_id: str
    decision: str # GRANTED | DENIED
    reason: str
    compliance_flags: List[str] = []
    anomaly_score: float # 0.0 - 1.0

class SecurityAuditEntry(BaseModel):
    audit_id: str
    request: AccessRequest
    decision: AccessDecision
    timestamp: str = Field(default_factory=lambda: datetime.utcnow().isoformat() + "Z")

class ComplianceReport(BaseModel):
    period: str
    total_requests: int
    denied_count: int
    anomalies_detected: int
    narrative_summary: str # LLM Generated
