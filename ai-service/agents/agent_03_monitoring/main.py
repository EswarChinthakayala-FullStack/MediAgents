from fastapi import FastAPI, HTTPException
from .models import PatientVitalsStream, MonitoringStatus
from .analyzer import VitalSignsAnalyzer
import uvicorn

app = FastAPI(title="ClinicAI - Continuous Monitoring Agent (03)")
analyzer = VitalSignsAnalyzer()

@app.get("/")
async def root():
    return {"agent": "03", "name": "Continuous Monitoring Agent", "status": "online"}

@app.post("/monitor", response_model=MonitoringStatus)
async def monitor_vitals(data: PatientVitalsStream):
    try:
        result = analyzer.analyze(data)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8003)
