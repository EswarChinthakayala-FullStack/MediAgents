from fastapi import FastAPI, HTTPException, WebSocket
from .models import UserInput, AssistantResponse
from .chat_logic import HealthAssistantAgent
import uvicorn
import sys
import os

# Add parent path for event_bus
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
from event_bus import EventBus

app = FastAPI(title="ClinicAI - Conversational Health Assistant Agent (08)")
agent = HealthAssistantAgent()
bus = EventBus()

@app.get("/")
async def root():
    return {"agent": "08", "name": "Conversational Health Assistant", "status": "online"}

@app.websocket("/ws/chat")
async def websocket_chat(websocket: WebSocket, id: str = "anonymous"):
    await websocket.accept()
    try:
        while True:
            data = await websocket.receive_text()
            user_input = UserInput(patient_id=id, content=data)
            response = agent.chat(user_input)
            await websocket.send_json(response.model_dump())
    except Exception:
        pass

@app.get("/chat/{id}/history")
async def get_chat_history(id: str):
    return {"history": [{"role": "user", "content": "Hello"}, {"role": "assistant", "content": "Hi, how can I help you today?"}]}

@app.post("/chat", response_model=AssistantResponse)
@app.post("/chat/message", response_model=AssistantResponse)
async def chat_message(input_data: UserInput):
    try:
        response = agent.chat(input_data)
        if response.escalation_required:
            bus.publish("chat_escalation", {
                "patient_id": input_data.patient_id,
                "intent": response.intent,
                "message": response.response_text
            })
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8008)
