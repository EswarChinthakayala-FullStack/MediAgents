import os
import sys
import uuid
import json
from typing import List, Dict, Any, Optional
from datetime import datetime
from .models import EHRRecord, ClinicalSummary, AuditLogEntry, PatientDemographics, Medication, LabResult

# Add parent path for LLM
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../..")))
from llm_engine import TinyLlamaEngine

class EHRManager:
    def __init__(self):
        self.llm = TinyLlamaEngine()
        # Mock Database
        self.db: Dict[str, EHRRecord] = {}
        self.audit_logs: List[AuditLogEntry] = []
        
        # Seed initial data
        self._seed_data()

    def _seed_data(self):
        p1_id = "PAT-001"
        self.db[p1_id] = EHRRecord(
            patient_id=p1_id,
            demographics=PatientDemographics(
                patient_id=p1_id, name="John Doe", age=58, gender="Male", contact="555-0199"
            ),
            diagnoses=["Type 2 Diabetes", "Hypertension", "Chronic Kidney Disease Stage 2"],
            active_problems=["Lower limb edema", "Elevated HbA1c"],
            medications=[
                Medication(name="Metformin", dosage="500mg", frequency="BID", prescribed_date="2024-01-10"),
                Medication(name="Lisinopril", dosage="10mg", frequency="Daily", prescribed_date="2023-11-15")
            ],
            lab_results=[
                LabResult(test_name="Glucose", value="180", unit="mg/dL", date="2026-03-01", status="Abnormal"),
                LabResult(test_name="Creatinine", value="1.4", unit="mg/dL", date="2026-03-01", status="Normal")
            ],
            allergies=["Penicillin"]
        )

    def get_record(self, patient_id: str, accessed_by: str = "System") -> Optional[EHRRecord]:
        record = self.db.get(patient_id)
        if record:
            self._log_audit(patient_id, accessed_by, "READ")
        return record

    def update_record(self, record: EHRRecord, accessed_by: str = "System"):
        self.db[record.patient_id] = record
        self._log_audit(record.patient_id, accessed_by, "WRITE")

    def generate_summary(self, patient_id: str, accessed_by: str = "System") -> Optional[ClinicalSummary]:
        record = self.get_record(patient_id, accessed_by)
        if not record:
            return None
            
        summary_text = self._call_llm_summarize(record)
        audit_id = self._log_audit(patient_id, accessed_by, "SUMMARY")
        
        return ClinicalSummary(
            patient_id=patient_id,
            summary_text=summary_text,
            audit_id=audit_id
        )

    def _log_audit(self, patient_id: str, accessed_by: str, action: str) -> str:
        audit_id = str(uuid.uuid4())
        entry = AuditLogEntry(
            audit_id=audit_id,
            patient_id=patient_id,
            accessed_by=accessed_by,
            action=action
        )
        self.audit_logs.append(entry)
        print(f"[AUDIT] {action} on {patient_id} by {accessed_by} id: {audit_id}")
        return audit_id

    def _call_llm_summarize(self, record: EHRRecord) -> str:
        prompt = f"""<|system|>
You are a medical record summarisation AI. Produce a concise, structured clinical summary using SHORTHAND.
Include: (1) Key Diagnoses, (2) Meds/Dosing, (3) Recent Labs, (4) Active Problems, (5) Allergies/Alerts.
</s>
<|user|>
RECORDS FOR: {record.demographics.name} ({record.demographics.age}y {record.demographics.gender})
Diagnoses: {", ".join(record.diagnoses)}
Problems: {", ".join(record.active_problems)}
Meds: {", ".join([f"{m.name} {m.dosage} {m.frequency}" for m in record.medications])}
Labs: {", ".join([f"{l.test_name}: {l.value}{l.unit} ({l.status})" for l in record.lab_results])}
Allergies: {", ".join(record.allergies)}
</s>
<|assistant|>
"""
        try:
            self.llm.load()
            outputs = self.llm.pipe(
                prompt,
                max_new_tokens=250,
                do_sample=False,
                pad_token_id=self.llm.pipe.tokenizer.eos_token_id
            )
            return outputs[0]["generated_text"].split("<|assistant|>")[-1].strip()
        except Exception as e:
            return f"Patient: {record.demographics.name}. Diagnoses: {record.diagnoses}. (Summarization Failed: {str(e)})"
