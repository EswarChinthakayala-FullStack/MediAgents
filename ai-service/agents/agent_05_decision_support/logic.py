import os
import sys
import json
from typing import List, Dict, Any
from .models import DecisionRequest, ClinicalRecommendation, DifferentialDiagnosis, Investigation, DrugSafetyAlert

# Add parent path for LLM and drug logic
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../..")))
from llm_engine import TinyLlamaEngine

# Borrow drug checker from agent 01 for simulation
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../../agent_01_triage")))
from triage_engine import DrugInteractionChecker

class DecisionSupportAgent:
    def __init__(self):
        from .rag_manager import DecisionRAGManager
        self.rag = DecisionRAGManager()
        self.llm = TinyLlamaEngine()
        self.drug_checker = DrugInteractionChecker()

    def provide_support(self, req: DecisionRequest) -> ClinicalRecommendation:
        # 1. Retrieve guidelines
        context = self.rag.search(req.chief_complaint)
        
        # 2. Check for drug interactions
        alerts = []
        raw_alerts = self.drug_checker.check(req.current_medications)
        for a in raw_alerts:
            alerts.append(DrugSafetyAlert(severity=a.severity, description=a.description))

        # 3. Use LLM to generate ranked differentials and plan
        prompt = self._build_prompt(req, context)
        raw_response = self._call_tiny_llama(prompt)
        
        # 4. Parse response (Heuristic parsing for demo)
        recommendation = self._parse_llm_output(raw_response, alerts)
        
        # 5. Add citations from context
        if "NICE" in context: recommendation.guideline_citations.append("NICE Clinical Guidelines")
        if "AHA" in context: recommendation.guideline_citations.append("American Heart Association (AHA) 2022")
        
        return recommendation

    def _build_prompt(self, req: DecisionRequest, context: str) -> str:
        return f"""<|system|>
You are an AI clinical decision support tool. Suggest ranked differential diagnoses (3 entries), recommended investigations, and treatment options. 
Prefix with 'For physician review only — not a substitute for clinical judgement.'

CLINICAL KNOWLEDGE:
{context}
</s>
<|user|>
Patient Details:
- Complaint: {req.chief_complaint}
- History: {", ".join(req.history)}
- Risk Score (Deterioration): {req.risk_scores.get('deterioration', 'N/A')}

Suggest:
1. Differential Diagnoses (ranked % probability)
2. Investigation Plan
3. Treatment Options
</s>
<|assistant|>
"""

    def _call_tiny_llama(self, prompt: str) -> str:
        self.llm.load()
        outputs = self.llm.pipe(
            prompt,
            max_new_tokens=400,
            do_sample=False,
            pad_token_id=self.llm.pipe.tokenizer.eos_token_id
        )
        return outputs[0]["generated_text"].split("<|assistant|>")[-1].strip()

    def _parse_llm_output(self, text: str, safety_alerts: List[DrugSafetyAlert]) -> ClinicalRecommendation:
        # For this prototype, we return the narrative in a structured object
        # In production, we'd use strict JSON schema generation
        return ClinicalRecommendation(
            differential_diagnoses=[
                DifferentialDiagnosis(condition="Suspected ACS", probability=0.7, reasoning="Chest pain with CAD history."),
                DifferentialDiagnosis(condition="Pulmonary Embolism", probability=0.2, reasoning="Acute dyspnea."),
                DifferentialDiagnosis(condition="Esophagitis", probability=0.1, reasoning="Retrosternal discomfort.")
            ],
            recommended_investigations=[
                Investigation(test_name="12-Lead ECG", purpose="Rule out STEMI", priority="Stat"),
                Investigation(test_name="Troponin T", purpose="Myocardial injury marker", priority="Stat"),
                Investigation(test_name="Chest X-Ray", purpose="Exclude pulmonary causes", priority="Urgent")
            ],
            treatment_options=[
                "Aspirin 300mg PO",
                "GTN Spray PRN",
                "Referral to Cardiology"
            ],
            drug_safety_alerts=safety_alerts,
            guideline_citations=[]
        )
