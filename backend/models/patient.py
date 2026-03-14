from database import db
from datetime import datetime
import uuid

def generate_uuid():
    return str(uuid.uuid4())

class Patient(db.Model):
    __tablename__ = 'patients'
    id = db.Column(db.String(36), primary_key=True, default=generate_uuid)
    mrn = db.Column(db.String(20), unique=True, nullable=False)
    first_name_enc = db.Column(db.LargeBinary, nullable=False)
    last_name_enc = db.Column(db.LargeBinary, nullable=False)
    dob_enc = db.Column(db.LargeBinary, nullable=False)
    gender = db.Column(db.Enum('male', 'female', 'other', 'unknown'), default='unknown')
    language_pref = db.Column(db.String(10), default='en')
    phone_enc = db.Column(db.LargeBinary)
    email_enc = db.Column(db.LargeBinary)
    blood_group = db.Column(db.String(5))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
