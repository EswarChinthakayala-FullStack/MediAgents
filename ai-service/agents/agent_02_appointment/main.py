from fastapi import FastAPI, HTTPException
from .models import AppointmentRequest, QueueStatus
from .scheduler import AppointmentAgent
import uvicorn

app = FastAPI(title="ClinicAI - Appointment Prioritisation Agent (02)")
agent = AppointmentAgent()

@app.get("/")
async def root():
    return {"agent": "02", "name": "Appointment Prioritisation Agent", "status": "online"}

@app.post("/schedule", response_model=QueueStatus)
async def perform_scheduling(data: AppointmentRequest):
    try:
        result = agent.schedule(data)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8002)
