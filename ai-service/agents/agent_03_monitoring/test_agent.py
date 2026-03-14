from agents.agent_03_monitoring.analyzer import VitalSignsAnalyzer
from agents.agent_03_monitoring.models import PatientVitalsStream, VitalReading
from datetime import datetime, timedelta

def test_monitoring():
    analyzer = VitalSignsAnalyzer()
    
    # Simulate a deteriorating patient (Falling SpO2, Rising HR)
    readings = [
        VitalReading(timestamp=datetime.utcnow() - timedelta(minutes=20), heart_rate=80, sp_o2=98, blood_pressure_sys=120, blood_pressure_dia=80),
        VitalReading(timestamp=datetime.utcnow() - timedelta(minutes=15), heart_rate=85, sp_o2=97, blood_pressure_sys=125, blood_pressure_dia=82),
        VitalReading(timestamp=datetime.utcnow() - timedelta(minutes=10), heart_rate=95, sp_o2=95, blood_pressure_sys=135, blood_pressure_dia=85),
        VitalReading(timestamp=datetime.utcnow() - timedelta(minutes=5),  heart_rate=110, sp_o2=93, blood_pressure_sys=145, blood_pressure_dia=90),
        VitalReading(timestamp=datetime.utcnow(),                    heart_rate=125, sp_o2=89, blood_pressure_sys=155, blood_pressure_dia=95),
    ]
    
    stream = PatientVitalsStream(
        patient_id="PAT-VITAL-001",
        readings=readings
    )
    
    print("\n--- Running Continuous Monitoring Analysis ---")
    result = analyzer.analyze(stream)
    
    print(f"Patient ID: {result.patient_id}")
    print(f"Current Status: {result.current_status}")
    print(f"\nTrend Analysis Summary:\n{result.trend_analysis}")
    
    if result.alerts:
        print("\n⚠️ ALERTS TRIGGERED:")
        for alert in result.alerts:
            print(f"- {alert.status}: {', '.join(alert.triggered_vitals)}")

if __name__ == "__main__":
    test_monitoring()
