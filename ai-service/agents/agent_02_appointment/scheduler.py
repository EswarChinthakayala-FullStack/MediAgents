import os
import sys
import uuid
from typing import List, Dict, Any
from datetime import datetime, timedelta

# Add parent path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../..")))
from llm_engine import TinyLlamaEngine
from .models import AppointmentRequest, ScheduledAppointment, QueueStatus

class AppointmentAgent:
    def __init__(self):
        self.llm = TinyLlamaEngine()
        
    def schedule(self, request: AppointmentRequest) -> QueueStatus:
        # 1. Scoring Algorithm (Dynamic Prioritisation)
        # Higher score = higher priority
        # Base: (5 - tier) * 100
        # Multiplier: severity * 10
        # Time bonus: minutes * 2
        
        patient = request.patient
        base_score = (5 - patient.triage_tier) * 100
        severity_bonus = patient.severity_score * 10
        wait_bonus = patient.waiting_minutes * 2
        
        total_priority_score = base_score + severity_bonus + wait_bonus
        
        # 2. Match with Doctor (Simplistic matching for demo)
        if not request.available_doctors:
            return QueueStatus(current_queue=[], optimization_reasoning="No doctors available.")
            
        selected_doctor = request.available_doctors[0]
        selected_slot = selected_doctor.available_slots[0] if selected_doctor.available_slots else "2026-03-13T14:00:00"
        
        # 3. LLM Reasoning for Optimization Decisions
        reasoning = self._get_llm_reasoning(request, total_priority_score)
        
        # 4. Create Schedule
        scheduled = ScheduledAppointment(
            appointment_id=str(uuid.uuid4()),
            patient_id=patient.patient_id,
            doctor_id=selected_doctor.doctor_id,
            doctor_name=selected_doctor.name,
            slot=selected_slot,
            estimated_wait_time=max(0, 15 - (patient.waiting_minutes // 5)),
            priority_rank=1 # In a real system, we'd sort the whole queue
        )
        
        return QueueStatus(
            current_queue=[scheduled],
            optimization_reasoning=reasoning
        )

    def _get_llm_reasoning(self, req: AppointmentRequest, score: float) -> str:
        prompt = f"""<|system|>
You are a clinical scheduling optimiser. Given a set of patients with severity scores and doctor availability, explain why this patient was prioritised.
Context:
- Patient Tier: {req.patient.triage_tier} (1=Emergency, 4=Self-care)
- Severity: {req.patient.severity_score}/10
- Calculated Priority Score: {score}
- Resources: {req.resource_state.rooms_available} rooms, {req.resource_state.nurses_on_duty} nurses.

Explain the scheduling decision briefly.
</s>
<|user|>
Explain decision for Patient {req.patient.patient_id}.
</s>
<|assistant|>
"""
        try:
            self.llm.load()
            outputs = self.llm.pipe(
                prompt, 
                max_new_tokens=100, 
                do_sample=False,
                pad_token_id=self.llm.pipe.tokenizer.eos_token_id
            )
            return outputs[0]["generated_text"].split("<|assistant|>")[-1].strip()
        except Exception as e:
            return f"Heuristic optimization used. Priority Score: {score}. (LLM Error: {str(e)})"
