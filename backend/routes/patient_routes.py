from flask import Blueprint, request, jsonify
from database import db
from models import Patient

patient_bp = Blueprint('patients', __name__)

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
