from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional
from datetime import datetime

class PatientDemographics(BaseModel):
    patient_id: str
    name: str
    age: int
    gender: str
    contact: str

class Medication(BaseModel):
    name: str
    dosage: str
    frequency: str
    prescribed_date: str

class LabResult(BaseModel):
    test_name: str
    value: str
    unit: str
    date: str
    status: str # Normal | Abnormal | Critical

class EHRRecord(BaseModel):
    patient_id: str
    demographics: PatientDemographics
    diagnoses: List[str]
    active_problems: List[str]
    medications: List[Medication]
    lab_results: List[LabResult]
    allergies: List[str]
    last_updated: str = Field(default_factory=lambda: datetime.utcnow().isoformat() + "Z")

class ClinicalSummary(BaseModel):
    patient_id: str
    summary_text: str
    audit_id: str
    timestamp: str = Field(default_factory=lambda: datetime.utcnow().isoformat() + "Z")

class AuditLogEntry(BaseModel):
    audit_id: str
    patient_id: str
    accessed_by: str
    action: str # READ | WRITE | SUMMARY
    timestamp: str = Field(default_factory=lambda: datetime.utcnow().isoformat() + "Z")
