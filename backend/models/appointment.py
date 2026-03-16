from database import db
from datetime import datetime
import uuid

def generate_uuid():
    return str(uuid.uuid4())

class Appointment(db.Model):
    __tablename__ = 'appointments'
    id = db.Column(db.String(36), primary_key=True, default=generate_uuid)
    patient_id = db.Column(db.String(36), db.ForeignKey('patients.id'), nullable=False)
    doctor_id = db.Column(db.String(36), db.ForeignKey('staff.id'))
    triage_id = db.Column(db.String(36), db.ForeignKey('triage_records.id'))
    room_id = db.Column(db.String(36), db.ForeignKey('rooms.id'))
    scheduled_at = db.Column(db.DateTime, nullable=False)
    duration_mins = db.Column(db.Integer, default=15)
    status = db.Column(db.Enum('scheduled', 'confirmed', 'in_progress', 'completed', 'cancelled', 'no_show'), default='scheduled')
    priority_score = db.Column(db.Numeric(5, 2))
    est_wait_mins = db.Column(db.Integer)
    cancellation_reason = db.Column(db.Text)
    notes = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
