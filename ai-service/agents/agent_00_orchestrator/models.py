from pydantic import BaseModel, Field
from typing import List, Optional

class SymptomSubmission(BaseModel):
    patient_id: str
    symptoms: str
    severity: int
    duration: int

class OrchestrationResponse(BaseModel):
    status: str
    pipeline_id: str
    message: str
