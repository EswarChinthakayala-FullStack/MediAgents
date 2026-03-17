from flask import Blueprint, jsonify
from database import db
from models import Patient, Staff, TriageRecord, AuditLog
import os
import requests

clinical_bp = Blueprint('clinical', __name__)

from services.ai_service import ai_service

@clinical_bp.route('/doctors', methods=['GET'])
def get_doctors():
    doctors = Staff.query.filter_by(role='doctor').all()
    return jsonify([{
        "id": d.id,
        "name": f"Dr. {d.first_name} {d.last_name}",
        "specialty": d.speciality or "General Practice",
        "is_on_duty": d.is_on_duty
    } for d in doctors]), 200

@clinical_bp.route('/ehr/<patient_id>', methods=['GET'])
def get_patient_ehr(patient_id):
    """Agent 06: GET /patient/{id}/full"""
    # 1. Local DB Base Data
    patient = Patient.query.get(patient_id)
    if not patient:
        return jsonify({"error": "Patient not found"}), 404
        
    # 2. Agent 06 Full EHR Data
    ehr_data = ai_service.get_full_ehr(patient_id)
    
    # 3. Merge and Return
    return jsonify({
        "demographics": {
            "id": patient.id,
            "mrn": patient.mrn,
            "gender": patient.gender
        },
        "records": ehr_data.get("history", []),
        "vitals_snapshot": ehr_data.get("vitals", {}),
        "ai_summary": ehr_data.get("summary", "No clinical summary available.")
    }), 200

@clinical_bp.route('/ehr/<patient_id>/note', methods=['POST'])
def add_note(patient_id):
    """Agent 06: POST /patient/{id}/note"""
    data = request.json
    # data: {content, author_id, category, soap_format: {subjective, objective, ...}}
    
    # Delegate to Agent 06
    agent_resp = ai_service.add_clinical_note(patient_id, data)
    
    if "error" in agent_resp:
        return jsonify({"error": agent_resp["error"]}), 500
        
    return jsonify({
        "status": "success",
        "note_id": agent_resp.get("id"),
        "message": "Note synchronized with federated EHR cluster."
    }), 201

@clinical_bp.route('/decision/<patient_id>', methods=['GET'])
def get_decision(patient_id):
    """Agent 05: Decision Hub"""
    data = ai_service.get_decision_support(patient_id)
    return jsonify(data), 200

@clinical_bp.route('/risk/<patient_id>', methods=['GET'])
def get_risk(patient_id):
    """Agent 04: Risk Predictor"""
    data = ai_service.get_risk_assessment(patient_id)
    return jsonify(data), 200

@clinical_bp.route('/vitals/<patient_id>', methods=['GET'])
def get_vitals(patient_id):
    """Agent 03: Vital Guardian"""
    data = ai_service.get_latest_vitals(patient_id)
    return jsonify(data), 200

@clinical_bp.route('/alerts/doctor/<doctor_id>', methods=['GET'])
def get_alerts(doctor_id):
    """Agent 10: Alert Manager"""
    data = ai_service.get_doctor_alerts(doctor_id)
    return jsonify(data), 200

@clinical_bp.route('/alerts/<alert_id>/ack', methods=['PUT'])
def ack_alert(alert_id):
    """Agent 10: Alert Manager"""
    data = ai_service.acknowledge_alert(alert_id)
    return jsonify(data), 200
