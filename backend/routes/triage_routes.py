from flask import Blueprint, request, jsonify
from database import db
from models import TriageRecord, Staff
from services.ai_service import ai_service
import uuid
from datetime import datetime

triage_bp = Blueprint('triage', __name__)

@triage_bp.route('/', methods=['POST'])
@triage_bp.route('/submit', methods=['POST'])
def submit_symptoms():
    """
    Main entry point for Patient Portal Symptom Checker.
    Calls Agent 01 (via AI service) to get immediate clinical triage.
    """
    data = request.json
    symptoms = data.get('symptoms')
    patient_id = data.get('patient_id')
    severity = data.get('severity', 5)
    duration = data.get('duration', 1)
    
    if not symptoms:
        return jsonify({"error": "Symptoms text is required"}), 400

    try:
        # 1. Get Analysis from Agent 01
        analysis_raw = ai_service.analyze_symptoms(
            patient_id=patient_id,
            symptoms=symptoms,
            severity=severity,
            duration=duration,
            age=data.get('age', 30),
            conditions=data.get('conditions', "None"),
            medications=data.get('medications', "None")
        )

        if "error" in analysis_raw:
            raise Exception(analysis_raw["error"])
        
        # Determine if response is wrapped in 'data' (FastAPI is flat, some local agents wrap)
        analysis = analysis_raw.get("data", analysis_raw) if isinstance(analysis_raw, dict) else {}
        
        # 2. Save to database for history
        # Map label to database enum
        label = analysis.get('urgency_label', 'Self-care').title().replace("-", "") # Title case for enum
        valid_tiers = ['Emergency', 'Urgent', 'Routine', 'Self-care']
        db_tier = label if label in valid_tiers else 'Routine'
        if 'Self-care' in label or 'Self' in label: db_tier = 'Self-care'

        try:
            # Assign a doctor if available
            on_duty_doctor = Staff.query.filter_by(role='doctor', is_on_duty=True).first()
            doctor_name = f"Dr. {on_duty_doctor.first_name} {on_duty_doctor.last_name}" if on_duty_doctor else "Queue - Pending Review"

            full_reasoning = analysis.get('reasoning', [])
            if isinstance(full_reasoning, list):
                reasoning_str = "\n".join(full_reasoning)
            else:
                reasoning_str = analysis.get('triage_summary', 'Analysis incomplete.')

            new_record = TriageRecord(
                id=analysis.get('triage_id', str(uuid.uuid4())),
                patient_id=patient_id,
                session_id=str(uuid.uuid4()),
                symptom_text=symptoms,
                duration=str(duration),
                severity_score=int(severity),
                urgency_tier=db_tier,
                reasoning=reasoning_str,
                recommended_action=analysis.get('recommended_action', 'Please monitor your symptoms.'),
                icd10_hints=analysis.get('icd10_hints', []),
                drug_alerts=analysis.get('drug_alerts', []),
                assigned_doctor=doctor_name,
                created_at=datetime.utcnow()
            )
            
            db.session.add(new_record)
            db.session.commit()
            print(f"✅ Triage record saved for patient {patient_id}")
        except Exception as db_err:
            db.session.rollback()
            print(f"❌ Database error saving triage: {db_err}")
            # We continue anyway to return the analysis to the user even if DB save fails

        # 3. Trigger Orchestrator in background (optional, for demo we just return)
        # requests.post("http://localhost:8012/submit_symptoms", json=data) 
        
        return jsonify({
            "status": "success",
            "urgency_label": analysis.get('urgency_label', 'Routine'),
            "urgency_tier": analysis.get('urgency_tier', 3),
            "reasoning": analysis.get('reasoning', [analysis.get('triage_summary', 'Clinical analysis finished.')]),
            "recommended_action": analysis.get('recommended_action', 'Monitor and schedule follow-up if symptoms persist.'),
            "icd10_hints": analysis.get('icd10_hints', []),
            "drug_alerts": analysis.get('drug_alerts', []),
            "triage_id": analysis.get('triage_id'),
            "requires_alert": analysis.get('requires_alert', False)
        }), 201
        
    except Exception as e:
        import traceback
        traceback.print_exc()
        print(f"Triage error: {e}")
        return jsonify({
            "status": "error",
            "message": str(e),
            "urgency_label": "Unknown",
            "urgency_tier": 5,
            "reasoning": "Agent service is currently synchronizing.",
            "recommended_action": "Please contact the clinic directly at (555) 012-3456."
        }), 500

@triage_bp.route('/analyze', methods=['POST'])
def analyze_symptoms():
    data = request.json
    symptoms = data.get('symptoms')
    patient_id = data.get('patient_id')
    severity = data.get('severity', 5)
    
    if not symptoms:
        return jsonify({"error": "Symptoms text is required"}), 400

    try:
        analysis_raw = ai_service.analyze_symptoms(
            patient_id=patient_id,
            symptoms=symptoms,
            severity=severity,
            duration=data.get('duration', 1),
            age=data.get('age', 30),
            conditions=data.get('conditions', "None"),
            medications=data.get('medications', "None")
        )
        
        if "error" in analysis_raw:
            raise Exception(analysis_raw["error"])

        analysis = analysis_raw.get("data", analysis_raw) if isinstance(analysis_raw, dict) else {}
        
        # Map label to database enum if necessary
        label = analysis.get('urgency_label', 'Routine').capitalize()
        if label == 'Self-care': label = 'Self-care'
        elif label == 'Emergency': label = 'Emergency'
        elif label == 'Urgent': label = 'Urgent'
        else: label = 'Routine'

        # Assign a doctor if available
        on_duty_doctor = Staff.query.filter_by(role='doctor', is_on_duty=True).first()
        doctor_name = f"Dr. {on_duty_doctor.first_name} {on_duty_doctor.last_name}" if on_duty_doctor else "Queue - Pending Review"

        full_reasoning = analysis.get('reasoning', [])
        if isinstance(full_reasoning, list):
            reasoning_str = "\n".join(full_reasoning)
        else:
            reasoning_str = analysis.get('triage_summary', 'Evaluation complete.')

        new_record = TriageRecord(
            id=analysis.get('triage_id', str(uuid.uuid4())),
            patient_id=patient_id,
            session_id=str(uuid.uuid4()),
            symptom_text=symptoms,
            severity_score=severity,
            urgency_tier=label,
            reasoning=reasoning_str,
            recommended_action=analysis.get('recommended_action', "Please follow up with a professional if symptoms persist."),
            icd10_hints=analysis.get('icd10_hints', []),
            drug_alerts=analysis.get('drug_alerts', []),
            assigned_doctor=doctor_name,
            created_at=datetime.utcnow()
        )
        
        db.session.add(new_record)
        db.session.commit()
        
        return jsonify({
            "id": new_record.id,
            "urgency": analysis.get('urgency_label', 'Routine'),
            "tier": analysis.get('urgency_tier', 3),
            "reasoning": analysis.get('triage_summary', 'Evaluation complete.'),
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
