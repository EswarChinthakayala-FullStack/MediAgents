-- ClinicAI - Master Database Schema (MySQL/XAMPP Optimized)
-- Optimized for HIPAA/GDPR Compliance and Multi-Agent Orchestration

-- 0. Database Creation
CREATE DATABASE IF NOT EXISTS mediagents_db;
USE mediagents_db;

-- 1. Patients Table
CREATE TABLE IF NOT EXISTS patients (
    id CHAR(36) PRIMARY KEY, -- Using UUIDs
    mrn VARCHAR(20) UNIQUE NOT NULL,
    first_name_enc BLOB NOT NULL,
    last_name_enc BLOB NOT NULL,
    dob_enc BLOB NOT NULL,
    gender ENUM('male', 'female', 'other', 'unknown') DEFAULT 'unknown',
    language_pref VARCHAR(10) DEFAULT 'en',
    phone_enc BLOB,
    email_enc BLOB,
    address_enc BLOB, -- Encrypted JSON
    blood_group VARCHAR(5),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 2. Staff Table
CREATE TABLE IF NOT EXISTS staff (
    id CHAR(36) PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    role ENUM('patient', 'doctor', 'nurse', 'admin', 'radiologist') NOT NULL,
    speciality VARCHAR(100),
    license_number VARCHAR(50),
    is_on_duty BOOLEAN DEFAULT FALSE,
    fcm_token TEXT,
    phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Users Table (Authentication)
CREATE TABLE IF NOT EXISTS users (
    id CHAR(36) PRIMARY KEY,
    patient_id CHAR(36),
    staff_id CHAR(36),
    keycloak_id VARCHAR(64) UNIQUE,
    role ENUM('patient', 'doctor', 'nurse', 'admin', 'radiologist') NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    last_login DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE SET NULL,
    FOREIGN KEY (staff_id) REFERENCES staff(id) ON DELETE SET NULL
);

-- 4. Rooms Table
CREATE TABLE IF NOT EXISTS rooms (
    id CHAR(36) PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    type ENUM('consultation', 'procedure', 'emergency', 'waiting') NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    equipment JSON -- MySQL 5.7+ supports JSON
);

-- 5. Triage Records (Agent 01)
CREATE TABLE IF NOT EXISTS triage_records (
    id CHAR(36) PRIMARY KEY,
    patient_id CHAR(36),
    session_id CHAR(36) NOT NULL,
    symptom_text TEXT,
    duration VARCHAR(100),
    severity_score TINYINT CHECK (severity_score >= 1 AND severity_score <= 10),
    urgency_tier ENUM('Emergency', 'Urgent', 'Routine', 'Self-care') NOT NULL,
    reasoning TEXT,
    recommended_action TEXT,
    icd10_hints JSON, -- MySQL uses JSON instead of String Arrays
    drug_alert TEXT,
    assigned_doctor_id CHAR(36),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
    FOREIGN KEY (assigned_doctor_id) REFERENCES staff(id) ON DELETE SET NULL
);

-- 6. Appointments (Agent 02)
CREATE TABLE IF NOT EXISTS appointments (
    id CHAR(36) PRIMARY KEY,
    patient_id CHAR(36),
    doctor_id CHAR(36),
    triage_id CHAR(36),
    room_id CHAR(36),
    scheduled_at DATETIME NOT NULL,
    duration_mins SMALLINT DEFAULT 15,
    status ENUM('scheduled', 'confirmed', 'in_progress', 'completed', 'cancelled', 'no_show') DEFAULT 'scheduled',
    priority_score DECIMAL(5,2),
    est_wait_mins SMALLINT,
    cancellation_reason TEXT,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
    FOREIGN KEY (doctor_id) REFERENCES staff(id) ON DELETE SET NULL,
    FOREIGN KEY (triage_id) REFERENCES triage_records(id) ON DELETE SET NULL,
    FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE SET NULL
);

-- 7. Clinical Notes (Agent 06)
CREATE TABLE IF NOT EXISTS clinical_notes (
    id CHAR(36) PRIMARY KEY,
    patient_id CHAR(36),
    doctor_id CHAR(36),
    appointment_id CHAR(36),
    note_type ENUM('SOAP', 'progress', 'discharge', 'referral') DEFAULT 'SOAP',
    subjective TEXT,
    objective TEXT,
    assessment TEXT,
    plan TEXT,
    is_signed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
    FOREIGN KEY (doctor_id) REFERENCES staff(id),
    FOREIGN KEY (appointment_id) REFERENCES appointments(id)
);

-- 8. Diagnoses
CREATE TABLE IF NOT EXISTS diagnoses (
    id CHAR(36) PRIMARY KEY,
    patient_id CHAR(36),
    doctor_id CHAR(36),
    icd10_code VARCHAR(10),
    icd10_description VARCHAR(255),
    status ENUM('active', 'resolved', 'chronic', 'ruled_out') DEFAULT 'active',
    onset_date DATE,
    resolved_date DATE,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
    FOREIGN KEY (doctor_id) REFERENCES staff(id)
);

-- 9. Prescriptions (Agent 07)
CREATE TABLE IF NOT EXISTS prescriptions (
    id CHAR(36) PRIMARY KEY,
    patient_id CHAR(36),
    doctor_id CHAR(36),
    drug_name VARCHAR(200) NOT NULL,
    drug_code VARCHAR(50),
    dosage VARCHAR(100),
    frequency VARCHAR(100),
    route VARCHAR(50),
    start_date DATE,
    end_date DATE,
    status ENUM('active', 'completed', 'discontinued', 'on_hold') DEFAULT 'active',
    adherence_score DECIMAL(5,2) DEFAULT 100.00,
    refill_due_date DATE,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
    FOREIGN KEY (doctor_id) REFERENCES staff(id)
);

-- 10. Lab Orders
CREATE TABLE IF NOT EXISTS lab_orders (
    id CHAR(36) PRIMARY KEY,
    patient_id CHAR(36),
    doctor_id CHAR(36),
    test_name VARCHAR(200) NOT NULL,
    loinc_code VARCHAR(20),
    status ENUM('ordered', 'collected', 'processing', 'resulted', 'cancelled') DEFAULT 'ordered',
    priority ENUM('routine', 'urgent', 'stat') DEFAULT 'routine',
    ordered_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    resulted_at DATETIME,
    result_value DECIMAL(10,4),
    result_unit VARCHAR(30),
    result_text TEXT,
    reference_range VARCHAR(50),
    is_abnormal BOOLEAN DEFAULT FALSE,
    result_narrative TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
    FOREIGN KEY (doctor_id) REFERENCES staff(id)
);

-- 11. Risk Scores (Agent 04)
CREATE TABLE IF NOT EXISTS risk_scores (
    id CHAR(36) PRIMARY KEY,
    patient_id CHAR(36),
    scored_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deterioration_pct DECIMAL(5,2),
    readmission_pct DECIMAL(5,2),
    emergency_pct DECIMAL(5,2),
    risk_tier ENUM('Low', 'Medium', 'High', 'Critical'),
    top_risk_factors JSON,
    recommended_intervention TEXT,
    model_version VARCHAR(20),
    FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE
);

-- 12. Vital Alerts (Agent 03 & 10)
CREATE TABLE IF NOT EXISTS vital_alerts (
    id CHAR(36) PRIMARY KEY,
    patient_id CHAR(36),
    alert_type ENUM('vital_critical', 'triage_emergency', 'risk_critical', 'chat_emergency', 'medication_missed') NOT NULL,
    severity ENUM('URGENT', 'CRITICAL') NOT NULL,
    message_doctor VARCHAR(280),
    message_patient TEXT,
    vital_name VARCHAR(50),
    vital_value DECIMAL(10,4),
    assigned_doctor_id CHAR(36),
    acknowledged_at DATETIME,
    escalated_at DATETIME,
    resolved_at DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
    FOREIGN KEY (assigned_doctor_id) REFERENCES staff(id)
);

-- 13. Notifications (Agent 12)
CREATE TABLE IF NOT EXISTS notifications (
    id CHAR(36) PRIMARY KEY,
    patient_id CHAR(36),
    channel ENUM('push', 'sms', 'email', 'in_app') NOT NULL,
    event_type VARCHAR(50),
    subject VARCHAR(200),
    body TEXT,
    status ENUM('queued', 'sent', 'delivered', 'failed') DEFAULT 'queued',
    external_id VARCHAR(100),
    sent_at DATETIME,
    read_at DATETIME,
    FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE
);

-- 14. Audit Log (Agent 11)
CREATE TABLE IF NOT EXISTS audit_log (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    event_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    user_id CHAR(36),
    user_role VARCHAR(20),
    action VARCHAR(50) NOT NULL,
    resource_type VARCHAR(50),
    resource_id CHAR(36),
    patient_id CHAR(36),
    ip_address VARCHAR(45),
    user_agent TEXT,
    is_anomalous BOOLEAN DEFAULT FALSE,
    details JSON
);

-- 15. Lab Documents
CREATE TABLE IF NOT EXISTS lab_documents (
    id CHAR(36) PRIMARY KEY,
    patient_id CHAR(36),
    file_url TEXT,
    ocr_text TEXT,
    extracted_values JSON,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE
);

-- 16. Imaging Reports
CREATE TABLE IF NOT EXISTS imaging_reports (
    id CHAR(36) PRIMARY KEY,
    patient_id CHAR(36),
    modality VARCHAR(50),
    body_part VARCHAR(100),
    radiologist_notes TEXT,
    ai_annotation JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE
);

-- 17. Chat Sessions
CREATE TABLE IF NOT EXISTS chat_sessions (
    id CHAR(36) PRIMARY KEY,
    session_id CHAR(36) UNIQUE NOT NULL,
    patient_id CHAR(36),
    messages JSON,
    intent_log JSON,
    language VARCHAR(10) DEFAULT 'en',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE
);

-- 18. Vital Measurements (Time-Series)
-- Retention Policy: 90 days raw -> 1yr downsampled (1min avg)
CREATE TABLE IF NOT EXISTS patient_vitals (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    patient_id CHAR(36),
    device_id VARCHAR(100),
    source VARCHAR(20), -- iot | manual
    hr DECIMAL(5,2),
    bp_sys DECIMAL(5,2),
    bp_dia DECIMAL(5,2),
    spo2 DECIMAL(5,2),
    temp_c DECIMAL(5,2),
    rr DECIMAL(5,2),
    glucose DECIMAL(5,2),
    measured_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX (patient_id, measured_at),
    FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE
);

-- 19. Agent Latency (Observability)
-- Retention Policy: 30 days 
CREATE TABLE IF NOT EXISTS agent_latency (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    agent_name VARCHAR(50) NOT NULL,
    endpoint VARCHAR(100),
    status_code INTEGER,
    response_ms INTEGER,
    triggered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 20. Alert Timeline
-- Retention Policy: 1 year
CREATE TABLE IF NOT EXISTS alert_timeline (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    patient_id CHAR(36),
    alert_type VARCHAR(50), 
    severity_score TINYINT,
    acknowledged BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE
);

-- 21. Medication Doses (Adherence Tracking)
-- Retention Policy: 1 year
CREATE TABLE IF NOT EXISTS medication_doses (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    patient_id CHAR(36),
    drug_code VARCHAR(50),
    scheduled_time DATETIME,
    dose_taken BOOLEAN DEFAULT FALSE,
    taken_at DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE
);

-- 21. Doctor Schedules
CREATE TABLE IF NOT EXISTS doctor_schedules (
    id CHAR(36) PRIMARY KEY,
    doctor_id CHAR(36),
    day_of_week TINYINT CHECK (day_of_week >= 0 AND day_of_week <= 6),
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (doctor_id) REFERENCES staff(id) ON DELETE CASCADE
);

-- 22. Doctor Leaves
CREATE TABLE IF NOT EXISTS doctor_leaves (
    id CHAR(36) PRIMARY KEY,
    doctor_id CHAR(36),
    leave_start DATETIME NOT NULL,
    leave_end DATETIME NOT NULL,
    reason VARCHAR(100),
    FOREIGN KEY (doctor_id) REFERENCES staff(id) ON DELETE CASCADE
);

-- 23. Agent Event Bus Log
CREATE TABLE IF NOT EXISTS agent_events (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    event_name VARCHAR(100) NOT NULL,
    publisher_agent VARCHAR(50) NOT NULL,
    payload JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_patients_mrn ON patients(mrn);
CREATE INDEX idx_triage_session ON triage_records(session_id);
CREATE INDEX idx_audit_patient ON audit_log(patient_id);
CREATE INDEX idx_vitals_patient_time ON patient_vitals(patient_id, measured_at);
