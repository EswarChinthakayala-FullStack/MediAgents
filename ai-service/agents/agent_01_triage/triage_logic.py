import os
import sys
import uuid
import json
from typing import List, Dict, Any

# Add parent and local paths
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../..")))
from llm_engine import TinyLlamaEngine
from .rag_manager import MedicalRAGManager
from .models import PatientInput, TriageResult

# Import existing rule logic from original engine for hybrid approach
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../../agent_01_triage")))
from triage_engine import (
    ICD10Resolver, DrugInteractionChecker, ComorbidityAnalyser, 
    AgeRiskModifier, TIER_LABELS, TIER_WAIT_TIMES
)

class SymptomTriageAgent:
    def __init__(self):
        self.rag = MedicalRAGManager(db_path="./agents/agent_01_triage/medical_db")
        self.llm = TinyLlamaEngine()
        
        # Tools
        self.icd10 = ICD10Resolver()
        self.drug_checker = DrugInteractionChecker()
        self.comorbidity = ComorbidityAnalyser()
        self.age_risk = AgeRiskModifier()

    def process(self, input_data: PatientInput) -> TriageResult:
        # 1. Retrieve Knowledge (RAG)
        clinical_context = self.rag.retrieve_context(input_data.symptom_text)
        
        # 2. Traditional Rule Checks for Safety (Hybrid)
        drug_alerts = self.drug_checker.check(input_data.medications)
        icd10_hints = self.icd10.resolve([], input_data.symptom_text.lower())
        age_assessment = self.age_risk.assess(input_data.age)
        
        # 3. LLM Reasoning with RAG
        prompt = self._build_prompt(input_data, clinical_context)
        llm_response = self._call_llm(prompt)
        
        # 4. Parse LLM JSON output
        try:
            # Attempt to find JSON in the response
            json_start = llm_response.find('{')
            json_end = llm_response.rfind('}') + 1
            if json_start != -1 and json_end != 0:
                data = json.loads(llm_response[json_start:json_end])
            else:
                data = self._fallback_triage(input_data, llm_response)
        except Exception:
            data = self._fallback_triage(input_data, llm_response)

        # 5. Construct Final Result
        tier = data.get("urgency_tier", 3)
        return TriageResult(
            triage_id=str(uuid.uuid4()),
            urgency_tier=tier,
            urgency_label=TIER_LABELS.get(tier, "ROUTINE"),
            triage_summary=data.get("reasoning", "Evaluation complete."),
            recommended_action=data.get("recommended_action", "Consult a doctor."),
            reasoning=[f"LLM: {data.get('reasoning', 'N/A')}", 
                       f"RAG Context used: {clinical_context[:100]}..."],
            icd10_hints=[{"code": h.code, "description": h.description} for h in icd10_hints],
            drug_alerts=[{"drug_a": a.drug_a, "drug_b": a.drug_b, "severity": a.severity} for a in drug_alerts],
            requires_alert=(tier == 1)
        )

    def _build_prompt(self, p: PatientInput, context: str) -> str:
        return f"""<|system|>
You are a clinical triage AI assistant. Classify urgency using ESI/MTS protocols.
Rules:
1. EMERGENCY (1): Life-threatening (e.g., chest pain, stroke, breathing difficulty).
2. URGENT (2): Serious but not immediately life-threatening.
3. ROUTINE (3): Stable, needs appointment.
4. SELF-CARE (4): Minor, treat at home.

CLINICAL GUIDELINES:
{context}

Output strictly in JSON format:
{{
  "urgency_tier": integer,
  "reasoning": "brief clinical explanation",
  "recommended_action": "next step"
}}
</s>
<|user|>
Symptoms: {p.symptom_text}
Severity: {p.severity}/10, Age: {p.age}, Conditions: {p.conditions}
</s>
<|assistant|>
"""

    def _call_llm(self, prompt: str) -> str:
        self.llm.load()
        outputs = self.llm.pipe(
            prompt, 
            max_new_tokens=150, 
            do_sample=False, 
            pad_token_id=self.llm.pipe.tokenizer.eos_token_id
        )
        return outputs[0]["generated_text"].split("<|assistant|>")[-1].strip()

    def _fallback_triage(self, p: PatientInput, raw_text: str) -> Dict[str, Any]:
        # Simple heuristic if LLM fails to output JSON
        tier = 3
        if "EMERGENCY" in raw_text.upper() or p.severity >= 9:
            tier = 1
        return {
            "urgency_tier": tier,
            "reasoning": raw_text[:200],
            "recommended_action": "Seek medical evaluation."
        }
