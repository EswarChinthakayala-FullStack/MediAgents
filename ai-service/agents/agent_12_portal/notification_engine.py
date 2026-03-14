import os
import sys
import uuid
import json
from typing import List, Dict, Any
from .models import PatientNotificationRequest, NotificationMessage, DeliveryReport

# Add parent path for LLM
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../..")))
from llm_engine import TinyLlamaEngine

class NotificationEngine:
    def __init__(self):
        self.llm = TinyLlamaEngine()
        self.notifications_history: List[NotificationMessage] = []

    def process_notification(self, req: PatientNotificationRequest) -> List[NotificationMessage]:
        # 1. Generate Personalized Message using LLM
        prompt = self._build_prompt(req)
        llm_response = self._call_llm(prompt)
        
        # 2. Heuristic Parsing
        subject, body, cta = self._parse_llm_output(llm_response, req.event_type)

        # 3. Fan-out to preferred channels
        generated = []
        for channel in req.channel_preference:
            msg = NotificationMessage(
                notification_id=str(uuid.uuid4()),
                patient_id=req.patient_id,
                channel=channel,
                subject=subject,
                body=body,
                call_to_action=cta
            )
            self.notifications_history.append(msg)
            generated.append(msg)
            
            # Simulation of sending
            print(f"[COMMUNICATOR] {channel.upper()} sent to {req.patient_id}: {subject}")
            
        return generated

    def _build_prompt(self, req: PatientNotificationRequest) -> str:
        return f"""<|system|>
You are a patient communication AI for ClinicAI. Generate a personalized, warm, and clear notification.
Tone: {req.urgency} event should be {'calm but clear' if req.urgency != 'Routine' else 'friendly and helpful'}.
Always include a clear Call-To-Action (CTA).

EVENT TYPE: {req.event_type}
DETAILS: {req.event_details}
</s>
<|user|>
Generate the notification text. Include SUBJECT, BODY, and CTA.
</s>
<|assistant|>
"""

    def _call_llm(self, prompt: str) -> str:
        self.llm.load()
        outputs = self.llm.pipe(
            prompt,
            max_new_tokens=300,
            do_sample=True,
            temperature=0.7,
            pad_token_id=self.llm.pipe.tokenizer.eos_token_id
        )
        return outputs[0]["generated_text"].split("<|assistant|>")[-1].strip()

    def _parse_llm_output(self, text: str, event_type: str):
        subject = f"ClinicAI Update: {event_type.replace('_', ' ').capitalize()}"
        body = text
        cta = "View in Portal"

        lines = text.split('\n')
        for line in lines:
            if "SUBJECT:" in line.upper():
                subject = line.split(":", 1)[1].strip()
            elif "CTA:" in line.upper() or "CALL TO ACTION:" in line.upper():
                cta = line.split(":", 1)[1].strip()
        
        # Clean body by removing subject and cta lines
        body_lines = [l for l in lines if "SUBJECT:" not in l.upper() and "CTA:" not in l.upper() and "CALL TO ACTION:" not in l.upper()]
        body = "\n".join(body_lines).strip()
        
        return subject, body, cta
