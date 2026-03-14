from agents.agent_07_medication.medication_manager import MedicationManager
from agents.agent_07_medication.models import MedicationReport, Prescription, AdherenceRecord
from datetime import datetime, timedelta

def test_medication_agent():
    manager = MedicationManager()
    
    # Mock patient data
    prescriptions = [
        Prescription(medication_name="Lisinopril", dosage="10mg", frequency="Daily", remaining_doses=3, is_critical=True),
        Prescription(medication_name="Metformin", dosage="500mg", frequency="BID", remaining_doses=20, is_critical=False)
    ]
    
    adherence_history = [
        AdherenceRecord(medication_name="Lisinopril", taken_timestamp=datetime.utcnow() - timedelta(days=1), status="Taken"),
        AdherenceRecord(medication_name="Lisinopril", taken_timestamp=datetime.utcnow() - timedelta(days=2), status="Missed"),
        AdherenceRecord(medication_name="Metformin", taken_timestamp=datetime.utcnow() - timedelta(days=1), status="Taken"),
    ]
    
    report = MedicationReport(
        patient_id="PAT-MED-77",
        prescriptions=prescriptions,
        adherence_history=adherence_history,
        reported_side_effects=["Dizziness", "Dry cough"]
    )
    
    print("\n--- Running Medication Management Analysis ---")
    result = manager.analyze(report)
    
    print(f"Patient ID: {result.patient_id}")
    print("\nAdherence Scores:")
    for med, score in result.adherence_scores.items():
        print(f"- {med}: {score}%")
        
    print("\nRefill Reminders:")
    for r in result.refill_reminders:
        print(f"⚠️ {r}")
        
    print("\nPatient Instructions (TinyLlama):")
    print(result.patient_instructions)
    
    print("\nPhysician Recommendations:")
    for adj in result.adjustment_recommendations:
        print(f"✓ {adj}")

if __name__ == "__main__":
    test_medication_agent()
