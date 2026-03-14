import os
import sys
import uuid
from typing import List, Dict, Any
from .models import EmergencyEvent, AlertNotification

# Add parent path for LLM
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../..")))
from llm_engine import TinyLlamaEngine

class AlertCoordinator:
    def __init__(self):
        self.llm = TinyLlamaEngine()
        # Mock storage for alerts
        self.active_alerts: Dict[str, AlertNotification] = {}

    def process_emergency(self, event: EmergencyEvent) -> AlertNotification:
        # 1. Generate Messages using LLM
        prompt = self._build_prompt(event)
        llm_response = self._call_llm(prompt)
        
        # 2. Heuristic Parsing of LLM Response
        phys_msg, pat_msg, actions = self._parse_llm_output(llm_response)

        # 3. Create Notification
        notification = AlertNotification(
            notification_id=str(uuid.uuid4()),
            patient_id=event.patient_id,
            physician_message=phys_msg,
            patient_message=pat_msg,
            priority_actions=actions,
            severity=event.severity
        )
        
        # 4. Store for state tracking
        self.active_alerts[notification.notification_id] = notification
        
        # 5. Simulation of routing
        print(f"[ALERT ROUTED] {event.severity}: {phys_msg}")
        
        return notification

    def _build_prompt(self, event: EmergencyEvent) -> str:
        return f"""<|system|>
You are a medical emergency dispatcher. Generate:
- PHYSICIAN: A short direct technical alert.
- PATIENT: A calm reassuring message.
- ACTIONS: 3 numbered steps.
</s>
<|user|>
Event: {event.event_details}
Severity: {event.severity}
</s>
<|assistant|>
"""

    def _call_llm(self, prompt: str) -> str:
        self.llm.load()
        outputs = self.llm.pipe(
            prompt,
            max_new_tokens=400,
            do_sample=False,
            pad_token_id=self.llm.pipe.tokenizer.eos_token_id
        )
        return outputs[0]["generated_text"].split("<|assistant|>")[-1].strip()

    def _parse_llm_output(self, text: str):
        # Improved parsing for TinyLlama variability
        phys_msg = "Critical Alert: Patient requires immediate review."
        pat_msg = "Please stay calm. A medical professional has been alerted and is on their way."
        actions = ["1. Stay with the patient", "2. Monitor vitals", "3. Prepare emergency equipment"]

        lines = [l.strip() for l in text.split('\n') if l.strip()]
        
        found_phys = False
        found_pat = False
        temp_actions = []

        for i, line in enumerate(lines):
            line_upper = line.upper()
            if "PHYSICIAN" in line_upper and not found_phys:
                # Try to get next line if current one is just the label
                if ":" in line:
                    phys_msg = line.split(":", 1)[1].strip()
                elif i + 1 < len(lines):
                    phys_msg = lines[i+1]
                found_phys = True
            elif "PATIENT" in line_upper and not found_pat:
                if ":" in line:
                    pat_msg = line.split(":", 1)[1].strip()
                elif i + 1 < len(lines):
                    pat_msg = lines[i+1]
                found_pat = True
            elif "ACTION" in line_upper or (line[0].isdigit() if line else False):
                if line[0].isdigit():
                    temp_actions.append(line)
                elif ":" in line:
                    msg = line.split(":", 1)[1].strip()
                    if msg: temp_actions.append(msg)
        
        if len(temp_actions) >= 3:
            actions = temp_actions[:3]
        
        return phys_msg, pat_msg, actions
