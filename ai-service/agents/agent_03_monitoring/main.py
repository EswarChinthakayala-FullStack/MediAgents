from fastapi import FastAPI, HTTPException, WebSocket, WebSocketDisconnect
import asyncio
from .models import PatientVitalsStream, MonitoringStatus
from .analyzer import VitalSignsAnalyzer
import uvicorn
import sys
import os

# Add parent path for event_bus
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
from event_bus import EventBus

app = FastAPI(title="ClinicAI - Continuous Monitoring Agent (03)")
analyzer = VitalSignsAnalyzer()
bus = EventBus()

# State management for demo purposes
device_configs = {} # patient_id -> {"polling_interval": 60}

@app.get("/")
async def root():
    return {"agent": "03", "name": "Continuous Monitoring Agent", "status": "online"}

@app.post("/configure")
async def configure_device(patient_id: str, interval: int):
    """Instruction to change device polling frequency."""
    device_configs[patient_id] = {"polling_interval": interval}
    print(f"Agent 03: Device for {patient_id} set to {interval}s interval.")
    return {"status": "configured", "interval": interval}

@app.get("/vitals/{id}/latest")
async def get_latest_vitals(id: str):
    # Simulated latest vitals
    return {"patient_id": id, "heart_rate": 75, "spO2": 98, "timestamp": "2026-03-16T15:50:00Z"}

@app.websocket("/ws/vitals/{id}")
async def websocket_vitals(websocket: WebSocket, id: str):
    await websocket.accept()
    try:
        while True:
            # Simulated vitals stream
            await websocket.send_json({"heart_rate": 72, "spO2": 99})
            await asyncio.sleep(1)
    except Exception:
        pass

@app.post("/vitals/ingest", response_model=MonitoringStatus)
async def ingest_vitals(data: PatientVitalsStream):
    try:
        result = analyzer.analyze(data)
        
        # Scenario 2.3 logic: If critical anomaly detected, switch to high-frequency polling
        if result.current_status == "Critical":
            device_configs[data.patient_id] = {"polling_interval": 10}
        
        # Publish alerts to Event Bus if anomalies detected
        for alert in result.alerts:
            bus.publish("vital_alert", {
                "patient_id": data.patient_id,
                "type": "VITAL_ALERT",
                "severity": alert.severity, 
                "details": alert.message,
                "vitals": data.vitals.model_dump()
            })
            
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8003)
