from fastapi import FastAPI, HTTPException
from .models import UserInput, AssistantResponse
from .chat_logic import HealthAssistantAgent
import uvicorn

app = FastAPI(title="ClinicAI - Conversational Health Assistant Agent (08)")
agent = HealthAssistantAgent()

@app.get("/")
async def root():
    return {"agent": "08", "name": "Conversational Health Assistant", "status": "online"}

@app.post("/chat", response_model=AssistantResponse)
async def chat_endpoint(input_data: UserInput):
    try:
        response = agent.chat(input_data)
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8008)
