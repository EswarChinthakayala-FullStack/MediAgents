from flask import Blueprint, request, jsonify
from database import db
from models import Patient
from services.ai_service import ai_service
import jwt
import os

patient_bp = Blueprint('patients', __name__)

@patient_bp.route('/dashboard', methods=['GET'])
def get_dashboard():
    # Extract patient_id from token
    auth_header = request.headers.get('Authorization')
    if not auth_header or not auth_header.startswith('Bearer '):
        return jsonify({"error": "Unauthorized"}), 401
    
    token = auth_header.split(' ')[1]
    try:
        decoded = jwt.decode(token, os.getenv('SECRET_KEY'), algorithms=['HS256'])
        patient_id = decoded.get('user_id') # In this system, user_id and patient_id are often synced or linked
        # Better: get the actual patient_id if it's different
        from models import User
        user = User.query.get(patient_id)
        if user and user.patient_id:
            patient_id = user.patient_id
    except:
        return jsonify({"error": "Invalid token"}), 401

    if not patient_id:
        return jsonify({"error": "Patient context missing"}), 400

    # Parallel aggregation would be better, but serial for now
    ehr_record = ai_service.get_patient_context(patient_id)
    summary_data = ai_service.get_patient_summary(patient_id) # Using the summary method
    medications_report = ai_service.get_medications(patient_id)
    # Merged Appointments Logic
    raw_agent_appts = ai_service.get_appointments(patient_id)
    agent_appointments = []
    if isinstance(raw_agent_appts, list):
        for aa in raw_agent_appts:
            dt_str = aa.get('date') or aa.get('slot') or "2026-03-20T10:00:00Z"
            agent_appointments.append({
                "id": aa.get('id') or aa.get('appointment_id'),
                "doctor": aa.get('doctor_name') or aa.get('doctor'),
                "status": aa.get('status', 'Scheduled'),
                "date": dt_str.split('T')[0]
            })
    
    from models import Appointment, Staff
    local_appts = Appointment.query.filter_by(patient_id=patient_id).all()
    formatted_local = []
    for a in local_appts:
        doc = Staff.query.get(a.doctor_id)
        formatted_local.append({
            "id": a.id, "doctor": f"Dr. {doc.first_name if doc else 'Unknown'}", 
            "status": a.status, "date": a.scheduled_at.strftime("%Y-%m-%d")
        })
    appointments = formatted_local + agent_appointments
    risk_data = ai_service.get_risk_assessment(patient_id)

    # Calculate health score from risk (Risk 0-10, Health 0-100)
    # Higher risk = lower health
    risk_score = risk_data.get('risk_score', 1.0)
    calculated_health_score = int((10 - risk_score) * 10)

    # Transform EHR Vitals/Labs for Frontend
    vitals = {}
    if ehr_record.get('lab_results'):
        for lab in ehr_record['lab_results']:
            # Mock vitals if they are in labs for this demo
            if lab['test_name'] in ['Glucose', 'Creatinine', 'BP', 'Pulse']:
                vitals[lab['test_name']] = f"{lab['value']} {lab['unit']}"

    documents = []
    if ehr_record.get('lab_results'):
        for lab in ehr_record['lab_results']:
            documents.append({
                "name": f"{lab['test_name']} Result",
                "date": lab['date']
            })

    return jsonify({
        "summary": summary_data.get("summary_text", "No recent health alerts."),
        "vitals": vitals if vitals else {"Status": "Synchronized"},
        "medications": medications_report.get("medications", []),
        "appointments": appointments,
        "documents": documents[:3], # Limit to recent
        "health_score": calculated_health_score
    }), 200

@patient_bp.route('/medications', methods=['GET'])
def get_patient_medications():
    # Similar token auth logic as dashboard, but simplified for brevity here
    auth_header = request.headers.get('Authorization')
    if not auth_header or not auth_header.startswith('Bearer '):
        return jsonify({"error": "Unauthorized"}), 401
    
    token = auth_header.split(' ')[1]
    try:
        decoded = jwt.decode(token, os.getenv('SECRET_KEY'), algorithms=['HS256'])
        user_id = decoded.get('user_id')
        from models import User
        user = User.query.get(user_id)
        patient_id = user.patient_id if user else None
    except:
        return jsonify({"error": "Invalid token"}), 401

    if not patient_id:
        return jsonify({"error": "Patient not found"}), 404

    report = ai_service.get_medications(patient_id)
    return jsonify(report), 200

@patient_bp.route('/appointments', methods=['GET'])
def get_patient_appointments():
    auth_header = request.headers.get('Authorization')
    if not auth_header or not auth_header.startswith('Bearer '):
        return jsonify({"error": "Unauthorized"}), 401
    
    token = auth_header.split(' ')[1]
    try:
        decoded = jwt.decode(token, os.getenv('SECRET_KEY'), algorithms=['HS256'])
        user_id = decoded.get('user_id')
        from models import User
        user = User.query.get(user_id)
        patient_id = user.patient_id if user else None
    except:
        return jsonify({"error": "Invalid token"}), 401

    if not patient_id:
        return jsonify({"error": "Patient not found"}), 404

    # 1. Get from Agent 02 and Normalize
    raw_agent_appts = ai_service.get_appointments(patient_id)
    agent_appointments = []
    if isinstance(raw_agent_appts, list):
        for aa in raw_agent_appts:
            # Normalize agent fields to match frontend expectation
            dt_str = aa.get('date') or aa.get('slot') or "2026-03-20T10:00:00Z"
            date_part = dt_str.split('T')[0]
            time_part = dt_str.split('T')[1][:5] if 'T' in dt_str else "10:00"
            
            agent_appointments.append({
                "id": aa.get('id') or aa.get('appointment_id'),
                "doctor": aa.get('doctor_name') or aa.get('doctor'),
                "specialty": aa.get('specialty') or "Specialist",
                "date": date_part,
                "time": time_part,
                "status": aa.get('status', 'Scheduled'),
                "type": aa.get('type', 'Consultation'),
                "location": aa.get('location', 'Virtual Clinic')
            })
        
    # 2. Get from Local DB
    from models import Appointment, Staff
    local_appts = Appointment.query.filter_by(patient_id=patient_id).all()
    
    formatted_local = []
    for a in local_appts:
        doctor = Staff.query.get(a.doctor_id)
        formatted_local.append({
            "id": a.id,
            "doctor": f"Dr. {doctor.first_name} {doctor.last_name}" if doctor else "Unknown Doctor",
            "specialty": doctor.speciality if doctor else "General Practice",
            "date": a.scheduled_at.strftime("%Y-%m-%d"),
            "time": a.scheduled_at.strftime("%H:%M"),
            "status": a.status,
            "type": "In-Person" if not a.room_id else "Video Consult",
            "location": "Main Medical Plaza" if not a.room_id else "Virtual Room"
        })

    # Combine
    return jsonify(formatted_local + agent_appointments), 200

@patient_bp.route('/', methods=['GET'])
def get_patients():
    patients = Patient.query.all()
    return jsonify([{
        "id": p.id,
        "mrn": p.mrn,
        "gender": p.gender,
        "blood_group": p.blood_group
    } for p in patients]), 200

@patient_bp.route('/<id>', methods=['GET'])
def get_patient(id):
    patient = Patient.query.get(id)
    if not patient:
        return jsonify({"error": "Patient not found"}), 404
    return jsonify({
        "id": patient.id,
        "mrn": patient.mrn,
        "gender": patient.gender,
        "blood_group": patient.blood_group
    }), 200
