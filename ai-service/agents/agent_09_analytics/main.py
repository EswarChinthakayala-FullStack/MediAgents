from fastapi import FastAPI, HTTPException
from .models import AnalyticsRequest, AnalyticsReport
from .analytics_engine import AnalyticsEngine
import uvicorn

app = FastAPI(title="ClinicAI - Population Health Analytics Agent (09)")
engine = AnalyticsEngine()

@app.get("/")
async def root():
    return {"agent": "09", "name": "Population Health Analytics Agent", "status": "online"}

@app.post("/analyze", response_model=AnalyticsReport)
async def analyze_population_data(request: AnalyticsRequest):
    try:
        report = engine.generate_report(request)
        return report
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8009)
