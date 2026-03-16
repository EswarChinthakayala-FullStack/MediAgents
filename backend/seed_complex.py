from app import create_app
from database import db
from models import User, Patient, Staff
import bcrypt
import uuid
from datetime import datetime

def seed_all():
    app, socketio = create_app()
    with app.app_context():
        # 1. Create a Patient
        patient_obj = Patient.query.filter_by(mrn="MRN-001").first()
        if not patient_obj:
            patient_obj = Patient(
                id=str(uuid.uuid4()),
                mrn="MRN-001",
                first_name_enc=b"Patient",
                last_name_enc=b"Test",
                dob_enc=b"1990-01-01",
                gender="male",
                blood_group="O+",
                language_pref="en",
                phone_enc=b"+1234567890",
                email_enc=b"patient@clinic.ai"
            )
            db.session.add(patient_obj)
            print("Created Patient MRN-001")
        
        # 2. Create Staff (Doctor, Dentist, Admin)
        staff_data = [
            {"email": "doctor@clinic.ai", "first": "John", "last": "Doe", "role": "doctor", "speciality": "General Medicine", "license": "LIC-DOC-001", "phone": "555-0101"},
            {"email": "dentist@clinic.ai", "first": "Jane", "last": "Smooth", "role": "dentist", "speciality": "Orthodontics", "license": "LIC-DEN-001", "phone": "555-0102"},
            {"email": "admin@clinic.ai", "first": "System", "last": "Admin", "role": "admin", "speciality": "Systems", "license": "LIC-ADM-001", "phone": "555-0103"}
        ]
        
        staff_map = {}
        for s in staff_data:
            staff_obj = Staff.query.filter_by(role=s['role'], speciality=s['speciality']).first()
            if not staff_obj:
                staff_obj = Staff(
                    id=str(uuid.uuid4()),
                    first_name=s['first'],
                    last_name=s['last'],
                    role=s['role'],
                    speciality=s['speciality'],
                    license_number=s['license'],
                    phone=s['phone'],
                    is_on_duty=True
                )
                db.session.add(staff_obj)
                print(f"Created Staff: {s['first']} {s['last']} ({s['role']})")
            else:
                # Update existing staff
                staff_obj.license_number = s['license']
                staff_obj.phone = s['phone']
                staff_obj.is_on_duty = True
                print(f"Updated Staff: {s['first']} {s['last']} ({s['role']})")
            staff_map[s['email']] = staff_obj

        # 3. Create Users and Link
        user_data = [
            {"email": "patient@clinic.ai", "password": "password123", "role": "patient", "patient_id": patient_obj.id, "staff_id": None},
            {"email": "doctor@clinic.ai", "password": "password123", "role": "doctor", "patient_id": None, "staff_id": staff_map["doctor@clinic.ai"].id},
            {"email": "dentist@clinic.ai", "password": "password123", "role": "dentist", "patient_id": None, "staff_id": staff_map["dentist@clinic.ai"].id},
            {"email": "admin@clinic.ai", "password": "password123", "role": "admin", "patient_id": None, "staff_id": staff_map["admin@clinic.ai"].id},
        ]

        for u in user_data:
            existing_user = User.query.filter_by(email=u['email']).first()
            if existing_user:
                # Update existing user to link IDs
                existing_user.patient_id = u['patient_id']
                existing_user.staff_id = u['staff_id']
                existing_user.role = u['role']
                print(f"Updated user: {u['email']} with linked IDs")
            else:
                hashed_pw = bcrypt.hashpw(u['password'].encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
                new_user = User(
                    id=str(uuid.uuid4()),
                    email=u['email'],
                    password_hash=hashed_pw,
                    role=u['role'],
                    patient_id=u['patient_id'],
                    staff_id=u['staff_id']
                )
                db.session.add(new_user)
                print(f"Created user: {u['email']} ({u['role']})")
        
        db.session.commit()
        print("Seeding complete.")

if __name__ == "__main__":
    seed_all()
