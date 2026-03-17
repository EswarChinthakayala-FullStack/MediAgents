from flask import Blueprint, request, jsonify
from services.ai_service import ai_service
from database import db
from models import Appointment
import uuid
from datetime import datetime

appointment_bp = Blueprint('appointments', __name__)

@appointment_bp.route('/slots', methods=['GET'])
def get_slots():
    date = request.args.get('date', datetime.now().strftime("%Y-%m-%d"))
    doctor_id = request.args.get('doctor')
    
    # Delegate to Agent 02 (Scheduler)
    agent_data = ai_service.get_appointment_slots(date, doctor_id)
    
    # Handle both list and dict responses
    if isinstance(agent_data, dict) and 'slots' in agent_data:
        slots_list = agent_data['slots']
    elif isinstance(agent_data, list):
        slots_list = agent_data
    else:
        slots_list = []

    # If agent is down or returns empty, provides default slots for demo
    if not slots_list:
        slots = [
            {"time": "09:00", "available": True},
            {"time": "10:00", "available": False},
            {"time": "11:00", "available": True},
            {"time": "14:00", "available": True},
            {"time": "15:00", "available": True},
        ]
    else:
        # Convert simple string slots (if any) to objects
        slots = []
        for s in slots_list:
            if isinstance(s, str):
                # Extract time part if it's ISO string
                time_part = s.split('T')[-1][:5] if 'T' in s else s
                slots.append({"time": time_part, "available": True})
            else:
                slots.append(s)
        
    return jsonify(slots), 200

@appointment_bp.route('/book', methods=['POST'])
def book_appointment():
    data = request.json
    # Expected: {patient_id, doctor_id, date, time, reason}
    
    # 1. Ask Agent 02 to validate and schedule
    agent_resp = ai_service.schedule_appointment(data)
    
    if "error" in agent_resp:
        return jsonify({"error": agent_resp["error"]}), 400
        
    # 2. Record in local database
    try:
        new_appt = Appointment(
            id=str(uuid.uuid4()),
            patient_id=data.get('patient_id'),
            doctor_id=data.get('doctor_id'),
            scheduled_at=datetime.strptime(f"{data.get('date')} {data.get('time')}", "%Y-%m-%d %H:%M"),
            status='scheduled',
            notes=data.get('reason')
        )
        db.session.add(new_appt)
        db.session.commit()
        
        return jsonify({
            "message": "Appointment booked successfully",
            "appointment_id": new_appt.id,
            "agent_confirmation": agent_resp.get("confirmation_code")
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500
