import os
import sys
import uuid
import httpx
from fastapi import FastAPI, HTTPException, WebSocket, WebSocketDisconnect
from .models import SymptomSubmission, OrchestrationResponse
import uvicorn
import json
import asyncio
from typing import Dict, List, Any

# Add parent path for event_bus
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
from event_bus import EventBus

app = FastAPI(title="ClinicAI - Master Orchestrator (00)")
bus = EventBus()

# Agent URLs (assuming standard ports)
AGENT_01_URL = os.getenv("AGENT_01_URL", "http://localhost:8001")
AGENT_06_URL = os.getenv("AGENT_06_URL", "http://localhost:8006")
AGENT_08_URL = os.getenv("AGENT_08_URL", "http://localhost:8008")

# --- WebSocket Connection Management ---
class ConnectionManager:
    def __init__(self):
        # role -> {id -> [websockets]}
        self.active_connections: Dict[str, Dict[str, List[WebSocket]]] = {
            "patient": {},
            "doctor": {},
            "nurse": {}
        }

    async def connect(self, websocket: WebSocket, role: str, id: str):
        await websocket.accept()
        if id not in self.active_connections[role]:
            self.active_connections[role][id] = []
        self.active_connections[role][id].append(websocket)
        print(f"WS Connected: {role} {id}")

    def disconnect(self, websocket: WebSocket, role: str, id: str):
        if id in self.active_connections.get(role, {}):
            if websocket in self.active_connections[role][id]:
                self.active_connections[role][id].remove(websocket)
            if not self.active_connections[role][id]:
                del self.active_connections[role][id]
        print(f"WS Disconnected: {role} {id}")

    async def broadcast_to_role(self, message: dict, role: str):
        if role not in self.active_connections: return
        for id in list(self.active_connections[role].keys()):
            for connection in self.active_connections[role][id]:
                try:
                    await connection.send_json(message)
                except Exception:
                    pass # Ignore failed sends, they'll be cleaned up on disconnect

    async def send_to_user(self, message: dict, role: str, id: str):
        if role in self.active_connections and id in self.active_connections[role]:
            for connection in self.active_connections[role][id]:
                try:
                    await connection.send_json(message)
                except Exception:
                    pass

manager = ConnectionManager()

# --- Event Bus Integration for WS Broadcasts ---

async def handle_emergency_alert(data: dict):
    """Relay Agent 10 Emergency Alerts to ALL global doctors."""
    print("📢 Orchestrator broadcasting emergency alert to doctors...")
    await manager.broadcast_to_role({
        "type": "EMERGENCY_ALERT",
        "data": data,
        "timestamp": data.get("timestamp")
    }, "doctor")

async def handle_vital_alert(data: dict):
    """Relay Agent 03 Vital Alerts to relevant doctors/nurses."""
    print(f"💓 Orchestrator broadcasting vital alert for {data.get('patient_id')}...")
    # For demo, broadcast to all doctors and nurses
    await manager.broadcast_to_role({
        "type": "VITAL_ALERT",
        "data": data,
        "timestamp": data.get("timestamp")
    }, "doctor")
    await manager.broadcast_to_role({
        "type": "VITAL_ALERT",
        "data": data,
        "timestamp": data.get("timestamp")
    }, "nurse")

@app.on_event("startup")
async def startup_event():
    # External Event Subscribers
    asyncio.create_task(bus.start_subscriber_task(
        stream_name="emergency_alert",
        group_name="orchestrator_ws_group",
        consumer_name="agent_00",
        callback=handle_emergency_alert
    ))
    asyncio.create_task(bus.start_subscriber_task(
        stream_name="vital_alert",
        group_name="orchestrator_ws_group",
        consumer_name="agent_00",
        callback=handle_vital_alert
    ))

# --- WebSocket Endpoints ---

@app.websocket("/ws/chat")
async def websocket_chat(websocket: WebSocket, patient_id: str = "anonymous"):
    """Relay to Agent 08 (Assistant)"""
    await manager.connect(websocket, "patient", patient_id)
    try:
        while True:
            data = await websocket.receive_text()
            message = json.loads(data)
            
            # Relay to Agent 08 via HTTP (as Agent 08 doesn't have WS yet)
            async with httpx.AsyncClient() as client:
                resp = await client.post(f"{AGENT_08_URL}/chat", json={
                    "patient_id": patient_id,
                    "content": message.get("content", ""),
                    "session_id": message.get("session_id", "default")
                })
                if resp.status_code == 200:
                    await websocket.send_json(resp.json())
                else:
                    await websocket.send_json({"error": "Assistant Agent unavailable."})
                    
    except WebSocketDisconnect:
        manager.disconnect(websocket, "patient", patient_id)

@app.websocket("/ws/doctor/{id}")
async def websocket_doctor(websocket: WebSocket, id: str):
    """Doctor Notifications (Emergency + Monitoring)"""
    await manager.connect(websocket, "doctor", id)
    try:
        while True:
            await websocket.receive_text() # Keep connection alive
    except WebSocketDisconnect:
        manager.disconnect(websocket, "doctor", id)

@app.websocket("/ws/vitals/{id}")
async def websocket_vitals(websocket: WebSocket, id: str):
    """Vitals Streaming for specific patient ({id} is patient_id)"""
    # Here {id} is the patient_id we are watching
    # Role is doctor/nurse watching this patient
    await manager.connect(websocket, "doctor", f"watcher_{id}")
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(websocket, "doctor", f"watcher_{id}")

# --- REST Endpoints ---

@app.get("/")
async def root():
    return {"agent": "00", "name": "Master Orchestrator", "status": "online", "ws_endpoints": ["/ws/chat", "/ws/doctor/{id}", "/ws/vitals/{id}"]}

@app.get("/health")
async def health():
    return {"status": "healthy", "agent": "00"}

@app.get("/agents/status")
async def get_agents_status():
    async with httpx.AsyncClient() as client:
        statuses = {}
        for i in range(1, 13):
            port = 8000 + i
            try:
                # Use a very short timeout for health checks
                resp = await client.get(f"http://localhost:{port}/", timeout=0.5)
                statuses[f"agent_{i:02d}"] = "online" if resp.status_code == 200 else "error"
            except Exception:
                statuses[f"agent_{i:02d}"] = "offline"
        return {"orchestrator": "online", "sub_agents": statuses}

@app.post("/orchestrate", response_model=OrchestrationResponse)
async def orchestrate_pipeline(submission: SymptomSubmission):
    pipeline_id = str(uuid.uuid4())
    print(f"Starting orchestration pipeline {pipeline_id} for patient {submission.patient_id}")
    
    async with httpx.AsyncClient() as client:
        # 1. Fetch EHR Context from Agent 06
        try:
            # Note: Using the endpoint structure from the prompt table
            ehr_response = await client.get(f"{AGENT_06_URL}/record/{submission.patient_id}")
            ehr_data = ehr_response.json() if ehr_response.status_code == 200 else {}
        except Exception as e:
            print(f"Warning: Could not fetch EHR context: {e}")
            ehr_data = {}

        # 2. Invoke Agent 01 (Triage)
        try:
            triage_payload = {
                "patient_id": submission.patient_id,
                "symptom_text": submission.symptoms,
                "severity": submission.severity,
                "duration_days": submission.duration,
                "age": ehr_data.get("age", 30), # Fallback to 30 if not in EHR
                "sex": ehr_data.get("sex", "Unknown"),
                "conditions": ehr_data.get("conditions", []),
                "medications": ehr_data.get("medications", [])
            }
            
            triage_resp = await client.post(f"{AGENT_01_URL}/triage", json=triage_payload)
            
            if triage_resp.status_code != 200:
                raise HTTPException(status_code=500, detail="Triage Agent failed to process submission.")
            
            triage_result = triage_resp.json()
            
            return OrchestrationResponse(
                status="SUCCESS",
                pipeline_id=pipeline_id,
                message=f"Triage complete. Urgency: {triage_result['urgency_label']}. Automation sequence triggered via Event Bus."
            )

        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Orchestration failed at Triage: {str(e)}")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
