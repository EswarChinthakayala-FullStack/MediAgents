from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional
from datetime import datetime

class VitalReading(BaseModel):
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    heart_rate: Optional[float] = None # bpm
    blood_pressure_sys: Optional[float] = None # mmHg
    blood_pressure_dia: Optional[float] = None
    sp_o2: Optional[float] = None # %
    temperature: Optional[float] = None # °C
    respiration_rate: Optional[float] = None # breaths/min
    blood_glucose: Optional[float] = None # mg/dL

class PatientVitalsStream(BaseModel):
    patient_id: str
    readings: List[VitalReading]

class MonitoringAlert(BaseModel):
    patient_id: str
    status: str # Normal | Warning | Critical
    triggered_vitals: List[str]
    trend_summary: str
    timestamp: str = Field(default_factory=lambda: datetime.utcnow().isoformat() + "Z")

class MonitoringStatus(BaseModel):
    patient_id: str
    current_status: str
    trend_analysis: str
    alerts: List[MonitoringAlert]
    medication_adherence_flag: bool = True
