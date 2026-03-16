from fastapi import FastAPI, HTTPException
from .models import AnalyticsRequest, AnalyticsReport, FilterCriteria
from .analytics_engine import AnalyticsEngine
import uvicorn
import asyncio
import sys
import os

# Add parent path for event_bus
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
from event_bus import EventBus

app = FastAPI(title="ClinicAI - Population Health Analytics Agent (09)")
engine = AnalyticsEngine()
bus = EventBus()

async def handle_analytics_updates(data: dict):
    """Callback for clinical updates to trigger new analytics reports."""
    print(f"Agent 09 received data for analytics update: {data.get('patient_id')}")
    
    # Generate a report based on new data (simplified)
    req = AnalyticsRequest(filters=FilterCriteria(cohort="Global"))
    report = engine.generate_report(req)
    
    # Publish to Event Bus
    bus.publish("analytics_report_ready", report.model_dump())

@app.on_event("startup")
async def startup_event():
    # Subscribe to risk_score_updated
    asyncio.create_task(bus.start_subscriber_task(
        stream_name="risk_score_updated",
        group_name="analytics_group",
        consumer_name="agent_09",
        callback=handle_analytics_updates
    ))
    # Subscribe to ehr_updated
    asyncio.create_task(bus.start_subscriber_task(
        stream_name="ehr_updated",
        group_name="analytics_group",
        consumer_name="agent_09",
        callback=handle_analytics_updates
    ))

@app.get("/")
async def root():
    return {"agent": "09", "name": "Population Health Analytics Agent", "status": "online"}

@app.get("/analytics/population")
async def get_population_analytics():
    return {"population_size": 1000, "average_risk": 0.25, "active_cases": 45}

@app.get("/analytics/doctor/{id}")
async def get_doctor_analytics(id: str):
    return {"doctor_id": id, "patients_seen": 42, "avg_wait_time": 15}

@app.post("/reports/generate", response_model=AnalyticsReport)
async def generate_population_report(request: AnalyticsRequest):
    try:
        report = engine.generate_report(request)
        bus.publish("analytics_report_ready", report.model_dump())
        return report
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8009)
