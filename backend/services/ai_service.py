import os
import requests
from dotenv import load_dotenv

load_dotenv()

class AIService:
    def __init__(self):
        # Base URLs for specialized agents
        self.triage_url = os.getenv("AGENT_01_URL", "http://localhost:8001")
        self.scheduler_url = os.getenv("AGENT_02_URL", "http://localhost:8002")
        self.vitals_url = os.getenv("AGENT_03_URL", "http://localhost:8003")
        self.risk_url = os.getenv("AGENT_04_URL", "http://localhost:8004")
        self.decision_url = os.getenv("AGENT_05_URL", "http://localhost:8005")
        self.ehr_url = os.getenv("AGENT_06_URL", "http://localhost:8006")
        self.pharmacy_url = os.getenv("AGENT_07_URL", "http://localhost:8007")
        self.analytics_url = os.getenv("AGENT_09_URL", "http://localhost:8009")
        self.alerts_url = os.getenv("AGENT_10_URL", "http://localhost:8010")
        self.audit_url = os.getenv("AGENT_11_URL", "http://localhost:8011")
        self.orchestrator_url = os.getenv("ORCHESTRATOR_URL", "http://localhost:8000")

    def _safe_get(self, url, params=None):
        try:
            resp = requests.get(url, params=params, timeout=5)
            return resp.json() if resp.status_code == 200 else {}
        except: return {}

    def _safe_post(self, url, data):
        try:
            resp = requests.post(url, json=data, timeout=5)
            return resp.json() if resp.status_code == 200 else {"error": f"Agent at {url} failed"}
        except Exception as e: return {"error": str(e)}

    def analyze_symptoms(self, symptoms, severity, age=30, conditions="None", medications="None"):
        payload = {"symptoms": symptoms, "severity": severity, "age": age, "conditions": conditions, "medications": medications}
        return self._safe_post(f"{self.triage_url}/triage", payload)

    def get_patient_context(self, patient_id):
        return self._safe_get(f"{self.ehr_url}/patient/{patient_id}/context")

    def get_medications(self, patient_id):
        return self._safe_get(f"{self.pharmacy_url}/medications/{patient_id}")

    def prescribe(self, prescription_data):
        return self._safe_post(f"{self.pharmacy_url}/prescribe", prescription_data)

    def get_appointment_slots(self, date, doctor_id=None):
        return self._safe_get(f"{self.scheduler_url}/slots", {"date": date, "doctor": doctor_id})

    def schedule_appointment(self, appointment_data):
        return self._safe_post(f"{self.scheduler_url}/schedule", appointment_data)

    def get_full_ehr(self, patient_id):
        return self._safe_get(f"{self.ehr_url}/patient/{patient_id}/full")

    def add_clinical_note(self, patient_id, note_data):
        return self._safe_post(f"{self.ehr_url}/patient/{patient_id}/note", note_data)

    def get_decision_support(self, patient_id):
        """Agent 05: Decision Hub"""
        return self._safe_get(f"{self.decision_url}/decision/{patient_id}")

    def get_risk_assessment(self, patient_id):
        """Agent 04: Risk Predictor"""
        return self._safe_get(f"{self.risk_url}/risk/{patient_id}")

    def get_latest_vitals(self, patient_id):
        """Agent 03: Vital Guardian"""
        return self._safe_get(f"{self.vitals_url}/vitals/{patient_id}/latest")

    def get_doctor_alerts(self, doctor_id):
        """Agent 10: Alert Manager"""
        return self._safe_get(f"{self.alerts_url}/alerts/{doctor_id}")

    def acknowledge_alert(self, alert_id):
        """Agent 10: Alert Manager"""
        try:
            resp = requests.put(f"{self.alerts_url}/alert/{alert_id}/acknowledge", timeout=5)
            return resp.json() if resp.status_code == 200 else {"error": "Ack failed"}
        except: return {"error": "Connection failed"}

    def get_population_analytics(self):
        """Agent 09: Data Architect"""
        return self._safe_get(f"{self.analytics_url}/analytics/population")

    def get_audit_logs(self, start=None, end=None):
        """Agent 11: Audit Sentinel"""
        return self._safe_get(f"{self.audit_url}/audit", {"from": start, "to": end})

    def get_agent_health(self):
        """Orchestrator: System Health"""
        return self._safe_get(f"{self.orchestrator_url}/health")

ai_service = AIService()
