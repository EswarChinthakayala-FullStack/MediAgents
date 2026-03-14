from fastapi import FastAPI, HTTPException
from .models import PatientProfile, RiskAssessment
from .risk_analyzer import RiskPredictor
import uvicorn

app = FastAPI(title="ClinicAI - Predictive Risk Analytics Agent (04)")
predictor = RiskPredictor()

@app.get("/")
async def root():
    return {"agent": "04", "name": "Predictive Risk Analytics Agent", "status": "online"}

@app.post("/predict", response_model=RiskAssessment)
async def predict_risk(data: PatientProfile):
    try:
        result = predictor.predict(data)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8004)
