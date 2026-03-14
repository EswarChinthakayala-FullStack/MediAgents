from fastapi import FastAPI, HTTPException
from .models import AccessRequest, AccessDecision, SecurityAuditEntry, ComplianceReport
from .compliance_logic import SecurityComplianceManager
import uvicorn

app = FastAPI(title="ClinicAI - Security & Privacy Compliance Agent (11)")
manager = SecurityComplianceManager()

@app.get("/")
async def root():
    return {"agent": "11", "name": "Security & Privacy Compliance Agent", "status": "online"}

@app.post("/validate", response_model=AccessDecision)
async def validate_request(request: AccessRequest):
    try:
        decision = manager.validate_access(request)
        return decision
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/audit", response_model=list[SecurityAuditEntry])
async def get_audit_logs():
    return manager.audit_buffer

@app.get("/report", response_model=ComplianceReport)
async def get_compliance_report():
    briefing = manager.generate_compliance_briefing()
    return ComplianceReport(
        period="Real-time Session",
        total_requests=len(manager.audit_buffer),
        denied_count=sum(1 for e in manager.audit_buffer if e.decision.decision == "DENIED"),
        anomalies_detected=sum(1 for e in manager.audit_buffer if e.decision.anomaly_score > 0.5),
        narrative_summary=briefing
    )

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8011)
