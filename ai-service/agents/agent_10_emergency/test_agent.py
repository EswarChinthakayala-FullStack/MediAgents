from agents.agent_10_emergency.coordinator import AlertCoordinator
from agents.agent_10_emergency.models import EmergencyEvent

def test_emergency_alert():
    coordinator = AlertCoordinator()
    
    # Simulate a critical vital alert from Monitoring Agent
    event = EmergencyEvent(
        patient_id="PAT-EMER-001",
        source_agent="Monitoring",
        severity="CRITICAL",
        event_details="Patient heart rate spiked to 160 bpm and SpO2 dropped to 85%."
    )
    
    print("\n--- Running Emergency Alert Coordination ---")
    notification = coordinator.process_emergency(event)
    
    print(f"\nNotification ID: {notification.notification_id}")
    print(f"Severity: {notification.severity}")
    
    print(f"\n[PHYSICIAN ALERT]:\n{notification.physician_message}")
    print(f"\n[PATIENT ALERT]:\n{notification.patient_message}")
    
    print("\n[PRIORITY ACTIONS]:")
    for action in notification.priority_actions:
        print(f"!! {action}")

if __name__ == "__main__":
    test_emergency_alert()
