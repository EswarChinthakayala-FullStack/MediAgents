from fastapi import FastAPI, HTTPException
from .models import PatientInput, TriageResult
from .triage_logic import SymptomTriageAgent
import uvicorn

app = FastAPI(title="ClinicAI - Symptom Triage Agent (01)")
agent = SymptomTriageAgent()

@app.get("/")
async def root():
    return {"agent": "01", "name": "Symptom Triage Agent", "status": "online"}

@app.post("/triage", response_model=TriageResult)
async def perform_triage(data: PatientInput):
    try:
        result = agent.process(data)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8001)
