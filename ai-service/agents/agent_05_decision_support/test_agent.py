from agents.agent_05_decision_support.logic import DecisionSupportAgent
from agents.agent_05_decision_support.models import DecisionRequest

def test_decision_support():
    agent = DecisionSupportAgent()
    
    # Scenario: Chest pain in a patient on Warfarin
    request = DecisionRequest(
        patient_id="DOC-99",
        chief_complaint="Crushing chest pain radiating to left arm",
        triage_summary="Tier 1 Emergency - Cardiac suspected",
        history=["CAD", "Atrial Fibrillation"],
        current_medications=["Warfarin", "Aspirin"], # Known Interaction
        lab_results={"ECG": "Pending", "Troponin": "Pending"},
        risk_scores={"deterioration": 0.85}
    )
    
    print("\n--- Running Doctor Decision Support Analysis ---")
    result = agent.provide_support(request)
    
    print(f"\n{result.prefix}")
    
    print("\nRanked Differential Diagnoses:")
    for d in result.differential_diagnoses:
        print(f"- {d.condition} (Prob: {d.probability*100}%): {d.reasoning}")
        
    print("\nRecommended investigations:")
    for i in result.recommended_investigations:
        print(f"✓ {i.test_name} ({i.priority}): {i.purpose}")
        
    print("\nTreatment Options:")
    for t in result.treatment_options:
        print(f"• {t}")
        
    if result.drug_safety_alerts:
        print("\n⚠️ DRUG INTERACTION ALERTS:")
        for a in result.drug_safety_alerts:
            print(f"!! {a.severity}: {a.description}")
            
    print("\nCitations:")
    for c in result.guideline_citations:
        print(f"Ref: {c}")

if __name__ == "__main__":
    test_decision_support()
