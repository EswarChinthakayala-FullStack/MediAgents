import os
import requests
from dotenv import load_dotenv

load_dotenv()

class AIService:
    def __init__(self):
        # Default URL for the Triage Agent (Agent 01)
        self.triage_url = os.getenv("AI_SERVICE_URL", "http://localhost:8001")

    def analyze_symptoms(self, symptoms, severity, age=30, conditions="None", medications="None"):
        """
        Calls the specialized Agent 01 (Triage) via REST API.
        """
        payload = {
            "symptoms": symptoms,
            "severity": severity,
            "age": age,
            "conditions": conditions if isinstance(conditions, list) else [conditions],
            "medications": medications if isinstance(medications, list) else [medications]
        }
        
        try:
            # Note: The agent endpoint is /triage as seen in ai-service/agents/agent_01_triage/main.py
            response = requests.post(f"{self.triage_url}/triage", json=payload, timeout=30)
            
            if response.status_code == 200:
                result = response.json()
                return {
                    "urgency_tier": result.get("urgency_tier", 3),
                    "urgency_label": result.get("urgency_label", "ROUTINE"),
                    "reasoning": result.get("reasoning", "Analysis complete."),
                    "status": "success"
                }
            else:
                return {
                    "urgency_tier": 3,
                    "urgency_label": "ROUTINE",
                    "reasoning": f"AI Agent error: {response.text}",
                    "status": "partial_success"
                }
                
        except Exception as e:
            print(f"Connection to AI Agent failed: {e}")
            return {
                "urgency_tier": 3,
                "urgency_label": "ROUTINE",
                "reasoning": "AI Service unreachable. Using fallback logic.",
                "status": "fallback"
            }

ai_service = AIService()
