from agents.agent_04_risk.risk_analyzer import RiskPredictor
from agents.agent_04_risk.models import PatientProfile

def test_risk_prediction():
    predictor = RiskPredictor()
    
    # High Risk Case
    profile = PatientProfile(
        patient_id="PAT-RISK-001",
        age=82,
        comorbidities=["Diabetes", "Hypertension", "COPD"],
        recent_vital_trends={"SpO2": "Decreasing", "HeartRate": "Increasing"},
        last_lab_results={"Creatinine": 1.8, "Glucose": 240},
        medications=["Metformin", "Lisinopril", "Salbutamol"]
    )
    
    print("\n--- Running Predictive Risk Analysis ---")
    result = predictor.predict(profile)
    
    print(f"Patient ID: {result.patient_id}")
    print(f"Risk Tier: {result.risk_tier}")
    print(f"Deterioration Risk: {int(result.deterioration_risk * 100)}%")
    
    print("\nTop Risk Factors:")
    for f in result.top_risk_factors:
        print(f"- {f.name} (Impact: {f.impact}): {f.description}")
        
    print(f"\nSBAR Summary:\n{result.narrative_summary}")
    
    print("\nRecommended Interventions:")
    for i in result.recommended_interventions:
        print(f"✓ {i}")

if __name__ == "__main__":
    test_risk_prediction()
