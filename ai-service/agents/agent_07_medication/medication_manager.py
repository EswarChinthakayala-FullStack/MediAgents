import os
import sys
import json
from typing import List, Dict, Any
from datetime import datetime, timedelta
from .models import MedicationReport, MedicationAnalysis, Prescription, AdherenceRecord

# Add parent path for LLM
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../..")))
from llm_engine import TinyLlamaEngine

class MedicationManager:
    def __init__(self):
        self.llm = TinyLlamaEngine()

    def analyze(self, report: MedicationReport) -> MedicationAnalysis:
        scores = {}
        refill_reminders = []
        side_effect_flags = []
        
        # 1. Calculate Adherence Score
        for rx in report.prescriptions:
            med_name = rx.medication_name
            history = [h for h in report.adherence_history if h.medication_name == med_name]
            
            if not history:
                scores[med_name] = 0.0
            else:
                taken_count = sum(1 for h in history if h.status == "Taken")
                scores[med_name] = (taken_count / len(history)) * 100
                
            # 2. Check for Refills
            if rx.remaining_doses < 5:
                refill_reminders.append(f"REFILL: {med_name} ({rx.remaining_doses} doses left)")
                
        # 3. Side Effect Flags (Basic heuristic)
        if report.reported_side_effects:
            side_effect_flags.extend(report.reported_side_effects)

        # 4. LLM Generation for Instructions and Reminders
        patient_instructions = self._generate_patient_instructions(report, scores)
        adjustments = self._suggest_adjustments(report, scores)

        return MedicationAnalysis(
            patient_id=report.patient_id,
            adherence_scores=scores,
            side_effect_flags=side_effect_flags,
            refill_reminders=refill_reminders,
            patient_instructions=patient_instructions,
            adjustment_recommendations=adjustments
        )

    def _generate_patient_instructions(self, report: MedicationReport, scores: Dict[str, float]) -> str:
        meds_summary = ", ".join([f"{rx.medication_name} ({rx.dosage})" for rx in report.prescriptions])
        low_adherence = [m for m, s in scores.items() if s < 80]
        
        prompt = f"""<|system|>
You are a medication management AI. Generate a patient-friendly summary.
Include: (1) Warm encouragement, (2) Simple instructions for medications, (3) Friendly reminder for missed doses if any.
Keep it simple and empathetic.
</s>
<|user|>
Patient meds: {meds_summary}.
Concerns: {", ".join(report.reported_side_effects) if report.reported_side_effects else "None"}.
Missed doses for: {", ".join(low_adherence) if low_adherence else "None"}.
</s>
<|assistant|>
"""
        try:
            self.llm.load()
            outputs = self.llm.pipe(
                prompt,
                max_new_tokens=250,
                do_sample=True,
                temperature=0.7,
                pad_token_id=self.llm.pipe.tokenizer.eos_token_id
            )
            return outputs[0]["generated_text"].split("<|assistant|>")[-1].strip()
        except Exception as e:
            return f"Please continue your medication as prescribed. Contact your doctor if you have side effects. (Summary failed: {str(e)})"

    def _suggest_adjustments(self, report: MedicationReport, scores: Dict[str, float]) -> List[str]:
        suggestions = []
        for rx in report.prescriptions:
            if scores.get(rx.medication_name, 100) < 50 and rx.is_critical:
                suggestions.append(f"URGENT: Review {rx.medication_name} adherence. Critical medication missed frequently.")
        
        if report.reported_side_effects:
            suggestions.append("REVIEW: Evaluate potential dose reduction or medication switch due to reported side effects.")
            
        return suggestions
