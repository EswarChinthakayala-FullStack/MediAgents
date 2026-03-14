from agents.agent_12_portal.notification_engine import NotificationEngine
from agents.agent_12_portal.models import PatientNotificationRequest

def test_portal_agent():
    engine = NotificationEngine()
    patient_id = "PAT-PORTAL-001"
    
    # 1. Test Routine Appointment Notification
    print("\n--- TEST 1: Routine Appointment Notification ---")
    req1 = PatientNotificationRequest(
        patient_id=patient_id,
        event_type="APPOINTMENT",
        event_details="Your follow-up with Dr. Smith is confirmed for March 20th at 10:00 AM.",
        urgency="Routine",
        channel_preference=["push", "email"]
    )
    res1 = engine.process_notification(req1)
    for n in res1:
        print(f"\n[Channel: {n.channel}]")
        print(f"Subject: {n.subject}")
        print(f"Body: {n.body}")
        print(f"CTA: {n.call_to_action}")
        
    # 2. Test Urgent Alert Notification
    print("\n--- TEST 2: Urgent Medication Reminder ---")
    req2 = PatientNotificationRequest(
        patient_id=patient_id,
        event_type="MEDICATION",
        event_details="You missed your midday dose of Lisinopril. This is important for your blood pressure.",
        urgency="Urgent",
        channel_preference=["push", "sms"]
    )
    res2 = engine.process_notification(req2)
    for n in res2:
        print(f"\n[Channel: {n.channel}]")
        print(f"Subject: {n.subject}")
        print(f"Body: {n.body}")
        print(f"CTA: {n.call_to_action}")

if __name__ == "__main__":
    test_portal_agent()
