from fastapi import FastAPI, HTTPException, Query
from .models import EHRRecord, ClinicalSummary, AuditLogEntry
from .ehr_manager import EHRManager
import uvicorn

app = FastAPI(title="ClinicAI - Smart EHR Agent (06)")
manager = EHRManager()

@app.get("/")
async def root():
    return {"agent": "06", "name": "Smart EHR Agent", "status": "online"}

@app.get("/record/{patient_id}", response_model=EHRRecord)
async def get_patient_record(patient_id: str, requester: str = Query("ExternalAgent")):
    record = manager.get_record(patient_id, requester)
    if not record:
        raise HTTPException(status_code=404, detail="Patient not found")
    return record

@app.post("/record", response_model=dict)
async def update_patient_record(record: EHRRecord, requester: str = Query("ExternalAgent")):
    manager.update_record(record, requester)
    return {"status": "success", "message": f"Record for {record.patient_id} updated"}

@app.get("/summary/{patient_id}", response_model=ClinicalSummary)
async def get_patient_summary(patient_id: str, requester: str = Query("ExternalAgent")):
    summary = manager.generate_summary(patient_id, requester)
    if not summary:
        raise HTTPException(status_code=404, detail="Patient not found")
    return summary

@app.get("/audit", response_model=list[AuditLogEntry])
async def get_audit_logs():
    return manager.audit_logs

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8006)
