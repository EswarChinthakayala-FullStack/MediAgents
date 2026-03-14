from agents.agent_06_ehr.ehr_manager import EHRManager
from agents.agent_06_ehr.models import EHRRecord, PatientDemographics

def test_ehr_agent():
    ehr = EHRManager()
    patient_id = "PAT-001"
    
    print(f"\n--- Testing EHR Retrieval for {patient_id} ---")
    record = ehr.get_record(patient_id, accessed_by="TestScript")
    if record:
        print(f"Patient Name: {record.demographics.name}")
        print(f"Diagnoses: {record.diagnoses}")
    
    print(f"\n--- Generating Smart Clinical Summary ---")
    summary = ehr.generate_summary(patient_id, accessed_by="ClinicianAlpha")
    if summary:
        print(f"Audit ID: {summary.audit_id}")
        print(f"Summary:\n{summary.summary_text}")
    
    print(f"\n--- Testing Audit Logs ---")
    print(f"Total Audit Entries: {len(ehr.audit_logs)}")
    for entry in ehr.audit_logs:
        print(f"[{entry.timestamp}] {entry.action} by {entry.accessed_by}")

if __name__ == "__main__":
    test_ehr_agent()
