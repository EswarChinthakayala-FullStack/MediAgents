from flask import Blueprint, request, jsonify
from database import db
from models import TriageRecord
from services.ai_service import ai_service
import uuid

triage_bp = Blueprint('triage', __name__)

@triage_bp.route('/analyze', methods=['POST'])
def analyze_symptoms():
    data = request.json
    symptoms = data.get('symptoms')
    patient_id = data.get('patient_id')
    severity = data.get('severity', 5)
    
    if not symptoms:
        return jsonify({"error": "Symptoms text is required"}), 400

    try:
        analysis = ai_service.analyze_symptoms(
            symptoms=symptoms,
            severity=severity,
            age=data.get('age', 30),
            conditions=data.get('conditions', "None"),
            medications=data.get('medications', "None")
        )
        
        # Map label to database enum if necessary
        label = analysis['urgency_label'].capitalize()
        if label == 'Self-care': label = 'Self-care'
        elif label == 'Emergency': label = 'Emergency'
        elif label == 'Urgent': label = 'Urgent'
        else: label = 'Routine'

        new_record = TriageRecord(
            id=str(uuid.uuid4()),
            patient_id=patient_id,
            session_id=str(uuid.uuid4()),
            symptom_text=symptoms,
            severity_score=severity,
            urgency_tier=label,
            reasoning=analysis['reasoning'],
            recommended_action="Please follow up with a professional if symptoms persist."
        )
        
        db.session.add(new_record)
        db.session.commit()
        
        return jsonify({
            "id": new_record.id,
            "urgency": analysis['urgency_label'],
            "tier": analysis['urgency_tier'],
            "reasoning": analysis['reasoning'],
            "status": "success"
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

@triage_bp.route('/history/<patient_id>', methods=['GET'])
def get_triage_history(patient_id):
    records = TriageRecord.query.filter_by(patient_id=patient_id).order_by(TriageRecord.created_at.desc()).all()
    return jsonify([{
        "id": r.id,
        "symptoms": r.symptom_text,
        "urgency": r.urgency_tier,
        "date": r.created_at.isoformat()
    } for r in records]), 200
