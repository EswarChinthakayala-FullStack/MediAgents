from app import create_app
from models import User, Patient, Staff, Appointment

app, _ = create_app()

with app.app_context():
    print("--- USERS ---")
    for u in User.query.all():
        print(f"ID: {u.id} | Email: {u.email} | PatientID: {u.patient_id}")
    
    print("\n--- PATIENTS ---")
    for p in Patient.query.all():
        print(f"ID: {p.id} | Name: {getattr(p, 'first_name', 'N/A')} {getattr(p, 'last_name', 'N/A')}")
        
    print("\n--- STAFF ---")
    for s in Staff.query.all():
        print(f"ID: {s.id} | Role: {s.role} | Name: {s.first_name} {s.last_name}")
        
    print("\n--- APPOINTMENTS ---")
    for a in Appointment.query.all():
        print(f"ID: {a.id} | PatientID: {a.patient_id} | DoctorID: {a.doctor_id} | Status: {a.status} | Date: {a.scheduled_at}")
