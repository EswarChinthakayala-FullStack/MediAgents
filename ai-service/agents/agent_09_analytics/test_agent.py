from agents.agent_09_analytics.analytics_engine import AnalyticsEngine
from agents.agent_09_analytics.models import AnalyticsRequest, DeIdentifiedRecord

def test_analytics_agent():
    engine = AnalyticsEngine()
    
    # Generate mock de-identified records
    records = []
    # High risk elderly group with heart issues
    for i in range(10):
        records.append(DeIdentifiedRecord(
            record_id=f"M-OLD-{i}",
            age_group="65+",
            gender="Female",
            diagnoses=["Hypertension", "Atrial Fibrillation"],
            risk_score=0.8,
            outcome="Stable"
        ))
    
    # Healthy younger group
    for i in range(15):
        records.append(DeIdentifiedRecord(
            record_id=f"M-YNG-{i}",
            age_group="18-30",
            gender="Male",
            diagnoses=["Seasonal Allergies"],
            risk_score=0.1,
            outcome="Improved"
        ))
        
    # Mixed middle-age diabetes group
    for i in range(12):
        records.append(DeIdentifiedRecord(
            record_id=f"M-MID-{i}",
            age_group="45-60",
            gender="Mixed",
            diagnoses=["Type 2 Diabetes", "Hypertension"],
            risk_score=0.55,
            outcome="Deteriorated" if i < 2 else "Stable"
        ))

    request = AnalyticsRequest(
        cohort_name="Quarterly Clinic Review",
        date_range="Jan 2026 - Mar 2026",
        records=records
    )
    
    print("\n--- Running Population Health Analytics ---")
    report = engine.generate_report(request)
    
    print(f"Report Period: {report.report_period}")
    print(f"Total Cohort Size: {report.total_patients_analyzed}")
    
    print("\nTop Disease Trends:")
    for d in report.top_diseases:
        print(f"- {d.condition}: {d.count} patients ({d.incidence_rate:.1f}%)")
        
    print("\nHigh-Risk Demographics:")
    for c in report.high_risk_demographics:
        print(f"- {c.demographic}: Avg Risk {c.average_risk:.2f}")

    print(f"\nExecutive Briefing (TinyLlama):\n{report.executive_briefing}")

if __name__ == "__main__":
    test_analytics_agent()
