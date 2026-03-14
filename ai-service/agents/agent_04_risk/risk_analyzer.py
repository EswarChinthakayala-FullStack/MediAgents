import os
import sys
import json
from typing import List, Dict, Any
from .models import PatientProfile, RiskAssessment, RiskFactor

# Add parent path for LLM
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../..")))
from llm_engine import TinyLlamaEngine

class RiskPredictor:
    def __init__(self):
        self.llm = TinyLlamaEngine()

    def predict(self, profile: PatientProfile) -> RiskAssessment:
        # 1. Simulate ML Model Inference (Heuristic-based logic)
        det_risk = 0.1
        factors = []
        
        # Age weight
        if profile.age > 75:
            det_risk += 0.2
            factors.append(RiskFactor(name="Advanced Age", impact=0.2, description="Increased frailty and reduced physiological reserve."))
            
        # Comorbidity weight
        if "Diabetes" in profile.comorbidities and "Hypertension" in profile.comorbidities:
            det_risk += 0.25
            factors.append(RiskFactor(name="Multimorbidity", impact=0.25, description="Synergistic risk from concurrent metabolic and vascular disease."))
            
        # Trend weights
        if profile.recent_vital_trends.get("SpO2") == "Decreasing":
            det_risk += 0.3
            factors.append(RiskFactor(name="Hypoxemic Trend", impact=0.3, description="Decreasing oxygen saturation indicates respiratory compromise."))
            
        det_risk = min(0.95, det_risk)
        
        # 2. Risk Tier Classification
        if det_risk > 0.8: tier = "Critical"
        elif det_risk > 0.5: tier = "High"
        elif det_risk > 0.2: tier = "Medium"
        else: tier = "Low"
        
        # 3. LLM Narratve Generation (SBAR Format)
        sbar_narrative = self._generate_sbar(profile, det_risk, tier, factors)
        
        # 4. Evidence-based Interventions (Simulated PubMed RAG)
        interventions = self._get_interventions(tier, factors)

        return RiskAssessment(
            patient_id=profile.patient_id,
            deterioration_risk=det_risk,
            readmission_risk=det_risk * 0.7, # Correlation
            complication_risk=det_risk * 1.1 if det_risk < 0.9 else 0.99,
            risk_tier=tier,
            top_risk_factors=factors,
            narrative_summary=sbar_narrative,
            recommended_interventions=interventions
        )

    def _generate_sbar(self, p: PatientProfile, risk: float, tier: str, factors: List[RiskFactor]) -> str:
        factors_str = ", ".join([f"{f.name} ({f.description})" for f in factors])
        
        prompt = f"""<|system|>
You are a clinical risk prediction AI. Generate a clinical narrative in SBAR format (Situation, Background, Assessment, Recommendation).
Situation: Patient {p.patient_id} is at {tier} risk of clinical deterioration ({int(risk*100)}%).
Background: Patient has {", ".join(p.comorbidities)} and is showing {p.recent_vital_trends}.
Assessment: Top risk factors include {factors_str}.
</s>
<|user|>
Generate the concise SBAR summary for the physician.
</s>
<|assistant|>
"""
        try:
            self.llm.load()
            outputs = self.llm.pipe(
                prompt,
                max_new_tokens=250,
                do_sample=False,
                pad_token_id=self.llm.pipe.tokenizer.eos_token_id
            )
            return outputs[0]["generated_text"].split("<|assistant|>")[-1].strip()
        except Exception as e:
            return f"Heuristic Risk Analysis: {tier} ({int(risk*100)}%). (LLM SBAR failed: {str(e)})"

    def _get_interventions(self, tier: str, factors: List[RiskFactor]) -> List[str]:
        if tier == "Low":
            return ["Routine follow-up in 4 weeks", "Standard prophylactic measures"]
        
        interventions = ["Increase vital sign monitoring frequency"]
        if any(f.name == "Hypoxemic Trend" for f in factors):
            interventions.append("Initiate supplementary oxygen therapy")
            interventions.append("Stat Chest X-ray and ABG analysis")
        if tier in ["High", "Critical"]:
            interventions.append("Consult Rapid Response Team")
            interventions.append("Review Advance Care Directives")
            
        return interventions
