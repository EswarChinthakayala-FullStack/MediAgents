from flask import Blueprint, jsonify
from database import db
from models import Patient, Appointment, Prescription, Notification
import datetime

portal_bp = Blueprint('portal', __name__)

from services.ai_service import ai_service

@portal_bp.route('/dashboard/advanced/<patient_id>', methods=['GET'])
def get_advanced_portal_dashboard(patient_id):
    """
    Combines local data with Agent 06 (Context) and Agent 07 (Medications).
    """
    # 1. Local Appointments
    appointments = Appointment.query.filter_by(patient_id=patient_id).order_by(Appointment.scheduled_at).limit(2).all()
    appt_data = [{
        "date": appt.scheduled_at.strftime("%b %d"),
        "title": appt.notes or "General Consultation",
        "doctor": "Dr. Michael Chen",
        "time": appt.scheduled_at.strftime("%I:%M %p"),
        "status": appt.status
    } for appt in appointments]
    
    # 2. Agent 06 Context
    ai_context = ai_service.get_patient_context(patient_id)
    health_score = ai_context.get("health_score", 84)
    status_label = ai_context.get("status_label", "Stable")
    
    # 3. Agent 07 Medications
    med_report = ai_service.get_medications(patient_id)
    med_list = med_report.get("medications", [])
    
    # If agent returns detailed meds, use the first one as reminder
    med_reminder = {
        "title": med_list[0]["name"] if med_list else "Check Medications",
        "instruction": med_list[0]["dosage"] if med_list else "No active reminders.",
        "icon": "HeartPulse"
    }

    # 4. Recent Documents (Mock)
    docs = [
        {"name": 'Lab Results - Oct 10', "date": 'Oct 10'},
        {"name": 'Prescription - Sep 28', "date": 'Sep 28'},
    ]

    return jsonify({
        "appointments": appt_data,
        "med_reminder": med_reminder,
        "documents": docs,
        "health_score": health_score,
        "status": status_label,
        "ai_insights": ai_context.get("insights", ["Vitals within normal limits for last 24h."])
    }), 200

@portal_bp.route('/chat', methods=['POST'])
def chat_with_assistant():
    from flask import request
    data = request.json
    patient_id = data.get('patient_id')
    message = data.get('message')
    
    if not message:
        return jsonify({"error": "Message is required"}), 400
        
    resp = ai_service.chat_with_assistant(patient_id, message)
    return jsonify(resp), 200
