import os
import sys
import uuid
import json
from typing import List, Dict, Any, Optional
from .models import UserInput, AssistantResponse, ChatMessage

# Add parent path for LLM
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../..")))
from llm_engine import TinyLlamaEngine

class HealthAssistantAgent:
    def __init__(self):
        self.llm = TinyLlamaEngine()
        # In-memory session store (In production use Redis)
        self.sessions: Dict[str, List[ChatMessage]] = {}

    def chat(self, user_input: UserInput) -> AssistantResponse:
        session_id = user_input.session_id or str(uuid.uuid4())
        
        # Initialize or retrieve history
        if session_id not in self.sessions:
            self.sessions[session_id] = []
        
        history = self.sessions[session_id]
        
        # 1. Detect Intent and Emergency Language (Heuristic + LLM)
        msg_upper = user_input.message.upper()
        emergency_keywords = ["CHEST PAIN", "CHEST HURTS", "CAN'T BREATHE", "CATCH MY BREATH", "STROKE", "BLEEDING", "UNCONSCIOUS", "DYING"]
        is_emergency = any(kw in msg_upper for kw in emergency_keywords)
        
        # 2. Build Memory-Aware Prompt
        prompt = self._build_prompt(user_input, history)
        
        # 3. Call LLM
        raw_response = self._call_llm(prompt)
        
        # 4. Post-process Response
        intent = self._classify_intent(user_input.message, raw_response, is_emergency)
        
        # 5. Update History
        history.append(ChatMessage(role="user", content=user_input.message))
        history.append(ChatMessage(role="assistant", content=raw_response))
        
        # Limit history to last 10 turns to save tokens
        if len(history) > 20: 
            self.sessions[session_id] = history[-20:]

        return AssistantResponse(
            response_text=raw_response,
            intent=intent,
            escalation_required=(intent == "Emergency"),
            booking_suggested=("BOOK" in raw_response.upper() or "APPOINTMENT" in raw_response.upper()),
            session_id=session_id
        )

    def _build_prompt(self, user_input: UserInput, history: List[ChatMessage]) -> str:
        # Format history
        history_str = ""
        for msg in history[-5:]: # Last 5 messages for context
            history_str += f"{msg.role.capitalize()}: {msg.content}\n"
            
        ehr_context = f"Patient context: {user_input.ehr_summary}" if user_input.ehr_summary else "No record summary available."

        return f"""<|system|>
You are ClinicAI, a compassionate health assistant.
Rules:
1. Be warm, empathetic, and reassuring.
2. ALWAYS recommend professional consultation for clinical symptoms.
3. If the patient mentions an emergency (chest pain, breathing issues), tell them to CALL EMERGENCY SERVICES immediately.
4. Answer FAQs and help with scheduling.

{ehr_context}

CHAT HISTORY:
{history_str}
</s>
<|user|>
{user_input.message}
</s>
<|assistant|>
"""

    def _call_llm(self, prompt: str) -> str:
        self.llm.load()
        outputs = self.llm.pipe(
            prompt,
            max_new_tokens=250,
            do_sample=True,
            temperature=0.6,
            pad_token_id=self.llm.pipe.tokenizer.eos_token_id
        )
        return outputs[0]["generated_text"].split("<|assistant|>")[-1].strip()

    def _classify_intent(self, user_msg: str, ai_resp: str, is_emergency: bool) -> str:
        msg = user_msg.lower()
        if is_emergency: return "Emergency"
        if "book" in msg or "schedule" in msg or "appointment" in msg: return "AppointmentRequest"
        if "?" in msg or "what" in msg or "how" in msg: return "FAQ"
        return "SymptomQuery"
