from flask import Blueprint, request, jsonify
from services.ai_service import ai_service
from database import db
from models import Prescription
import uuid

medication_bp = Blueprint('medications', __name__)

@medication_bp.route('/<patient_id>', methods=['GET'])
def get_medications(patient_id):
    """Agent 07: Pharmacy Node"""
    data = ai_service.get_medications(patient_id)
    return jsonify(data), 200

@medication_bp.route('/', methods=['POST'])
def prescribe():
    """Agent 07: Pharmacy Node"""
    data = request.json
    # data: {patient_id, doctor_id, drug_name, dosage, frequency, duration}
    
    agent_resp = ai_service.prescribe(data)
    
    if "error" in agent_resp:
        return jsonify({"error": agent_resp["error"]}), 500
        
    try:
        new_prescription = Prescription(
            id=str(uuid.uuid4()),
            patient_id=data.get('patient_id'),
            staff_id=data.get('doctor_id'),
            drug_name=data.get('drug_name'),
            dosage=data.get('dosage'),
            status='active'
        )
        db.session.add(new_prescription)
        db.session.commit()
        
        return jsonify({
            "status": "success",
            "prescription_id": new_prescription.id,
            "agent_ref": agent_resp.get("id")
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500
