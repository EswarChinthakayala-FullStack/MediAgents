from fastapi import FastAPI, HTTPException
from .models import DecisionRequest, ClinicalRecommendation
from .logic import DecisionSupportAgent
import uvicorn

app = FastAPI(title="ClinicAI - Doctor Decision Support Agent (05)")
agent = DecisionSupportAgent()

@app.get("/")
async def root():
    return {"agent": "05", "name": "Doctor Decision Support Agent", "status": "online"}

@app.post("/advise", response_model=ClinicalRecommendation)
async def get_clinical_advice(req: DecisionRequest):
    try:
        result = agent.provide_support(req)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8005)
