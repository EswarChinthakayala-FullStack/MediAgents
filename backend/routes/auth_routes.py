from flask import Blueprint, request, jsonify
from database import db
from models import User
import bcrypt
import jwt
import datetime
import os
import uuid

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.json
    email = data.get('email')
    password = data.get('password')
    role = data.get('role', 'patient')
    first_name = data.get('first_name', 'Unnamed')
    last_name = data.get('last_name', 'User')
    
    if User.query.filter_by(email=email).first():
        return jsonify({"error": "User already exists"}), 400
        
    hashed_pw = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    user_id = str(uuid.uuid4())
    
    patient_id = None
    staff_id = None
    
    from models import Patient, Staff
    
    if role == 'patient':
        patient_id = str(uuid.uuid4())
        new_patient = Patient(
            id=patient_id,
            mrn=f"MRN-{str(uuid.uuid4())[:8].upper()}",
            first_name_enc=first_name.encode('utf-8'), # In real app, use encryption
            last_name_enc=last_name.encode('utf-8'),
            dob_enc=b"2000-01-01", # Default or from data
            gender="unknown"
        )
        db.session.add(new_patient)
    elif role in ['doctor', 'nurse', 'dentist']:
        staff_id = str(uuid.uuid4())
        new_staff = Staff(
            id=staff_id,
            first_name=first_name,
            last_name=last_name,
            role=role,
            is_on_duty=True
        )
        db.session.add(new_staff)

    new_user = User(
        id=user_id,
        email=email,
        password_hash=hashed_pw,
        role=role,
        patient_id=patient_id,
        staff_id=staff_id
    )
    
    db.session.add(new_user)
    db.session.commit()
    
    return jsonify({"message": "User registered successfully", "user_id": new_user.id}), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    password = data.get('password')
    use_keycloak = data.get('use_keycloak', False)
    
    # Simulating Keycloak Token Exchange
    if use_keycloak:
        # In a real app, you'd call Keycloak token endpoint here
        # POST {KEYCLOAK_URL}/auth/realms/{REALM}/protocol/openid-connect/token
        # grant_type=password, client_id, client_secret, username, password
        
        KEYCLOAK_MOCK_SUCCESS = True # Toggle for demo
        if KEYCLOAK_MOCK_SUCCESS:
            user = User.query.filter_by(email=email).first()
            if not user:
                return jsonify({"error": "Identity not found in synchronized cluster"}), 401
                
            token = jwt.encode({
                'user_id': user.id,
                'email': user.email,
                'role': user.role,
                'iss': 'keycloak.mediagents.ai',
                'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)
            }, os.getenv('SECRET_KEY'), algorithm='HS256')
            
            return jsonify({
                "token": token,
                "provider": "keycloak",
                "user": {
                    "id": user.id,
                    "email": user.email,
                    "role": user.role
                }
            }), 200
    
    # Fallback to Local Auth
    user = User.query.filter_by(email=email).first()
    if not user or not bcrypt.checkpw(password.encode('utf-8'), user.password_hash.encode('utf-8')):
        return jsonify({"error": "Invalid credentials"}), 401
        
    token = jwt.encode({
        'user_id': user.id,
        'email': user.email,
        'role': user.role,
        'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)
    }, os.getenv('SECRET_KEY'), algorithm='HS256')
    
    return jsonify({
        "token": token,
        "user": {
            "id": user.id,
            "email": user.email,
            "role": user.role
        }
    }), 200
