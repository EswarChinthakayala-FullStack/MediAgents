from fastapi import FastAPI, HTTPException
from .models import AccessRequest, AccessDecision, SecurityAuditEntry, ComplianceReport
from .compliance_logic import SecurityComplianceManager
import uvicorn
import asyncio
import sys
import os

# Add parent path for event_bus
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
from event_bus import EventBus

app = FastAPI(title="ClinicAI - Security & Privacy Compliance Agent (11)")
manager = SecurityComplianceManager()
bus = EventBus()

async def audit_event_bus(data: dict):
    """Callback to audit all traffic on the event bus."""
    # Perform security check
    # In a real system we'd check roles/permissions
    # For now, simulate a check
    mock_request = AccessRequest(
        requester_id="EventBus",
        resource_id="ClinicalStream",
        action="PUBLISH",
        token="MOCK_TOKEN"
    )
    decision = manager.validate_access(mock_request)
    
    if decision.decision == "DENIED":
        bus.publish("access_violation", {
            "requester": "EventBus",
            "details": decision.reasoning,
            "anomaly_score": decision.anomaly_score
        })

@app.on_event("startup")
async def startup_event():
    # Audit all critical streams
    critical_streams = ["triage_result", "ehr_updated", "emergency_alert"]
    for stream in critical_streams:
        asyncio.create_task(bus.start_subscriber_task(
            stream_name=stream,
            group_name="security_audit_group",
            consumer_name="agent_11",
            callback=audit_event_bus
        ))

@app.get("/")
async def root():
    return {"agent": "11", "name": "Security & Privacy Compliance Agent", "status": "online"}

@app.post("/auth/validate", response_model=AccessDecision)
async def validate_user_auth(request: AccessRequest):
    return await validate_request(request)

@app.post("/audit/log")
async def log_security_event(entry: dict):
    # Simulated log
    return {"status": "logged", "timestamp": "2026-03-16T15:55:00Z"}

@app.get("/audit", response_model=list[SecurityAuditEntry])
async def get_audit_logs():
    return manager.audit_buffer

@app.get("/compliance/report", response_model=ComplianceReport)
async def get_compliance_report():
    briefing = manager.generate_compliance_briefing()
    return ComplianceReport(
        period="Real-time Session",
        total_requests=len(manager.audit_buffer),
        denied_count=sum(1 for e in manager.audit_buffer if e.decision.decision == "DENIED"),
        anomalies_detected=sum(1 for e in manager.audit_buffer if e.decision.anomaly_score > 0.5),
        narrative_summary=briefing
    )

@app.post("/validate", response_model=AccessDecision)
async def validate_request(request: AccessRequest):
    try:
        decision = manager.validate_access(request)
        if decision.decision == "DENIED":
            bus.publish("access_violation", {"requester": request.requester_id, "reason": decision.reasoning})
        return decision
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8011)
