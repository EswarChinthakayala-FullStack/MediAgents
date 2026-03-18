import time
import json
import redis
import threading
from flask_socketio import SocketIO
from database import db
from models import TriageRecord

def start_redis_listener(socketio: SocketIO, app, redis_host='localhost', redis_port=6379):
    def listener():
        r = redis.Redis(host=redis_host, port=redis_port, decode_responses=True)
        streams = {
            'triage_result': '$',
            'appointment_scheduled': '$',
            'risk_score_updated': '$',
            'ehr_updated': '$',
        }
        
        print("Backend Redis Listener Started...")
        
        while True:
            try:
                messages = r.xread(streams, block=1000)
                if messages:
                    for stream, msg_list in messages:
                        for msg_id, payload in msg_list:
                            data = json.loads(payload['data'])
                            print(f"Backend received {stream}: {data}")
                            
                            # Update database in background for agents
                            with app.app_context():
                                triage_id = data.get('triage_id')
                                patient_id = data.get('patient_id')
                                
                                # Try finding by triage_id first, then latest for patient
                                record = None
                                if triage_id:
                                    record = TriageRecord.query.get(triage_id)
                                if not record and patient_id:
                                    record = TriageRecord.query.filter_by(patient_id=patient_id).order_by(TriageRecord.created_at.desc()).first()
                                    
                                if record:
                                    if stream == 'triage_result':
                                        record.icd10_hints = data.get('icd10_hints', record.icd10_hints)
                                        record.drug_alerts = data.get('drug_alerts', record.drug_alerts)
                                        db.session.commit()
                                        print(f"✅ Sync'd triage details for {triage_id or patient_id}")
                                        
                                    elif stream == 'appointment_scheduled':
                                        appt = data.get('current_queue', [{}])[0]
                                        record.assigned_doctor = appt.get('doctor_name', record.assigned_doctor)
                                        db.session.commit()
                                        print(f"✅ Assigned doctor {record.assigned_doctor} to record {record.id}")
                            
                            # Push to all connected clients via SocketIO
                            socketio.emit('event_bus_message', {
                                'stream': stream,
                                'data': data
                            })
            except Exception as e:
                print(f"Error in Redis listener: {e}")
                time.sleep(1)

    thread = threading.Thread(target=listener, daemon=True)
    thread.start()
