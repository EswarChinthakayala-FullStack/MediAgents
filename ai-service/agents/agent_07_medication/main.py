from fastapi import FastAPI, HTTPException
from .models import MedicationReport, MedicationAnalysis
from .medication_manager import MedicationManager
import uvicorn

app = FastAPI(title="ClinicAI - Medication Management Agent (07)")
manager = MedicationManager()

@app.get("/")
async def root():
    return {"agent": "07", "name": "Medication Management Agent", "status": "online"}

@app.post("/analyze", response_model=MedicationAnalysis)
async def analyze_medication(report: MedicationReport):
    try:
        result = manager.analyze(report)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8007)
