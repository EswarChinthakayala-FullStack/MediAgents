from agents.agent_01_triage.triage_logic import SymptomTriageAgent
from agents.agent_01_triage.models import PatientInput

def test_triage():
    agent = SymptomTriageAgent()
    
    # Test case: Emergency
    input_data = PatientInput(
        patient_id="TEST-1",
        symptom_text="I have crushing chest pain and I'm sweating. My left arm feels numb.",
        severity=10,
        duration_days=0,
        age=60,
        sex="Male",
        conditions=["Hypertension"],
        medications=["Lisinopril"]
    )
    
    print("\n--- Processing Triage ---")
    result = agent.process(input_data)
    
    print(f"ID: {result.triage_id}")
    print(f"Tier: {result.urgency_tier} ({result.urgency_label})")
    print(f"Summary: {result.triage_summary}")
    print(f"Action: {result.recommended_action}")
    print(f"Reasoning: {result.reasoning}")
    print(f"ICD-10: {result.icd10_hints}")
    print(f"Drug Alerts: {result.drug_alerts}")

if __name__ == "__main__":
    test_triage()
