from agents.agent_08_assistant.chat_logic import HealthAssistantAgent
from agents.agent_08_assistant.models import UserInput
import time

def test_assistant():
    agent = HealthAssistantAgent()
    patient_id = "PAT-CHAT-01"
    
    # 1. Test standard health query
    print("\n--- TEST: Standard Health Query ---")
    req1 = UserInput(
        patient_id=patient_id,
        message="I've been feeling a bit tired and have a mild headache. What should I do?",
        ehr_summary="Patient has history of hypertension. Last BP was normal."
    )
    res1 = agent.chat(req1)
    print(f"User: {req1.message}")
    print(f"ClinicAI: {res1.response_text}")
    print(f"Intent: {res1.intent} | Session: {res1.session_id}")
    
    # 2. Test Emergency Detection
    print("\n--- TEST: Emergency Detection ---")
    req2 = UserInput(
        patient_id=patient_id,
        session_id=res1.session_id,
        message="Actually, now my chest hurts a lot and I can't catch my breath!",
        ehr_summary="Patient has history of hypertension."
    )
    res2 = agent.chat(req2)
    print(f"User: {req2.message}")
    print(f"ClinicAI: {res2.response_text}")
    print(f"Intent: {res2.intent} | Escalation: {res2.escalation_required}")
    
    # 3. Test multi-turn memory
    print("\n--- TEST: Appointment Booking intent ---")
    req3 = UserInput(
        patient_id=patient_id,
        session_id=res1.session_id,
        message="Ok, I will go to the ER. But can you also book me an appointment for a follow-up next week?",
        ehr_summary="Patient has history of hypertension."
    )
    res3 = agent.chat(req3)
    print(f"User: {req3.message}")
    print(f"ClinicAI: {res3.response_text}")
    print(f"Intent: {res3.intent} | Booking Suggested: {res3.booking_suggested}")

if __name__ == "__main__":
    test_assistant()
