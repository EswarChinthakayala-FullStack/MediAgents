"""
medical_kb.py
─────────────────────────────────────────────────────────────────────────────
Offline Medical Knowledge Base for the Symptom Triage Agent.

This module replaces:
  • Pinecone vector DB   → symptom_rules + guideline_rag
  • ICD-10 API           → ICD10_MAP
  • OpenFDA API          → DRUG_INTERACTIONS
  • WHO severity data    → SEVERITY_WEIGHTS + RED_FLAG_SYMPTOMS

No API keys or internet access required.
─────────────────────────────────────────────────────────────────────────────
"""

# ── ICD-10 Hint Map ─────────────────────────────────────────────────────────
# symptom keyword → (ICD-10 code, description)
ICD10_MAP = {
    # Cardiac
    "chest pain":           ("R07.9",  "Chest pain, unspecified"),
    "chest tightness":      ("R07.89", "Other chest pain"),
    "palpitations":         ("R00.2",  "Palpitations"),
    "irregular heartbeat":  ("R00.1",  "Bradycardia, unspecified"),
    "heart racing":         ("R00.0",  "Tachycardia, unspecified"),

    # Respiratory
    "shortness of breath":  ("R06.00", "Dyspnoea, unspecified"),
    "difficulty breathing":  ("R06.09", "Other forms of dyspnoea"),
    "wheezing":             ("R06.2",  "Wheezing"),
    "cough":                ("R05",    "Cough"),
    "hemoptysis":           ("R04.2",  "Haemoptysis"),

    # Neurological
    "stroke":               ("I63.9",  "Cerebral infarction, unspecified"),
    "facial drooping":      ("R29.810","Facial weakness"),
    "arm weakness":         ("M62.81", "Muscle weakness, upper arm"),
    "slurred speech":       ("R47.81", "Slurred speech"),
    "seizure":              ("R56.9",  "Unspecified convulsions"),
    "loss of consciousness": ("R55",   "Syncope and collapse"),
    "fainting":             ("R55",    "Syncope and collapse"),
    "sudden confusion":     ("R41.3",  "Other amnesia"),
    "headache":             ("R51",    "Headache"),
    "severe headache":      ("G44.309","Post-traumatic headache, unspecified"),
    "migraine":             ("G43.909","Migraine, unspecified"),
    "dizziness":            ("R42",    "Dizziness and giddiness"),

    # GI
    "abdominal pain":       ("R10.9",  "Unspecified abdominal pain"),
    "severe abdominal pain": ("R10.0", "Acute abdomen"),
    "nausea":               ("R11.0",  "Nausea"),
    "vomiting":             ("R11.10", "Vomiting, unspecified"),
    "blood in stool":       ("K92.1",  "Melena"),
    "diarrhea":             ("R19.7",  "Diarrhoea, unspecified"),
    "constipation":         ("K59.00", "Constipation, unspecified"),

    # Fever / Infection
    "fever":                ("R50.9",  "Fever, unspecified"),
    "high fever":           ("R50.9",  "Fever, unspecified"),
    "chills":               ("R68.83", "Chills (without fever)"),
    "rigors":               ("R68.89", "Other general symptoms"),

    # Trauma
    "bleeding":             ("R58",    "Haemorrhage, not elsewhere classified"),
    "uncontrolled bleeding": ("R58",   "Haemorrhage, not elsewhere classified"),
    "laceration":           ("T14.1",  "Open wound of unspecified body region"),
    "fracture":             ("T14.2",  "Fracture of unspecified body region"),
    "head injury":          ("S09.90", "Unspecified injury of head"),

    # Allergic
    "anaphylaxis":          ("T78.2",  "Anaphylactic shock, unspecified"),
    "allergic reaction":    ("T78.40", "Allergy, unspecified"),
    "hives":                ("L50.9",  "Urticaria, unspecified"),
    "swelling":             ("R60.9",  "Oedema, unspecified"),
    "throat swelling":      ("J39.2",  "Other diseases of pharynx"),

    # Mental health
    "suicidal":             ("R45.851","Suicidal ideation"),
    "self harm":            ("T14.91", "Suicide attempt"),
    "anxiety":              ("F41.9",  "Anxiety disorder, unspecified"),
    "depression":           ("F32.9",  "Major depressive disorder, unspecified"),
    "panic attack":         ("F41.0",  "Panic disorder"),

    # General
    "fatigue":              ("R53.83", "Other fatigue"),
    "weight loss":          ("R63.4",  "Abnormal weight loss"),
    "rash":                 ("R21",    "Rash and other nonspecific skin eruption"),
    "back pain":            ("M54.5",  "Low back pain"),
    "joint pain":           ("M25.50", "Pain in unspecified joint"),
    "urinary pain":         ("R30.9",  "Painful micturition, unspecified"),
    "eye pain":             ("H57.10", "Ocular pain, unspecified"),
    "ear pain":             ("H92.09", "Otalgia, unspecified ear"),
    "sore throat":          ("J02.9",  "Acute pharyngitis, unspecified"),
}

# ── Red-Flag Symptom Rules (ESI / MTS-based) ────────────────────────────────
# Each rule: { keywords, tier, reasoning, min_severity, age_modifier }
# tier: 1=Emergency, 2=Urgent, 3=Routine, 4=Self-care

TRIAGE_RULES = [
    # ── Tier 1: EMERGENCY ──────────────────────────────────────────────────
    {
        "id": "RULE-001",
        "name": "Cardiac Emergency",
        "keywords": ["chest pain", "chest tightness", "heart attack", "cardiac"],
        "co_keywords": ["sweating", "arm pain", "jaw pain", "nausea", "left arm"],
        "tier": 1,
        "min_severity": 0,  # any severity triggers this
        "reasoning": "Chest pain with associated symptoms is a potential ACS. Immediate ECG and troponin required.",
        "action": "Call emergency services immediately. Do not drive to hospital. Chew aspirin 300mg if not allergic.",
        "vital_flags": ["low BP", "irregular pulse"],
    },
    {
        "id": "RULE-002",
        "name": "Stroke (FAST)",
        "keywords": ["facial drooping", "arm weakness", "slurred speech", "sudden confusion", "stroke"],
        "co_keywords": ["sudden", "one side", "unilateral"],
        "tier": 1,
        "min_severity": 0,
        "reasoning": "FAST criteria met — potential ischaemic stroke. Time-critical: thrombolysis window is 4.5 hours.",
        "action": "Call emergency services immediately. Note exact time symptoms started. Do not give food or water.",
        "vital_flags": [],
    },
    {
        "id": "RULE-003",
        "name": "Anaphylaxis",
        "keywords": ["anaphylaxis", "throat swelling", "can't breathe", "allergic reaction"],
        "co_keywords": ["hives", "swelling", "bee sting", "food allergy", "medication allergy"],
        "tier": 1,
        "min_severity": 0,
        "reasoning": "Anaphylaxis is a life-threatening systemic allergic reaction requiring immediate epinephrine.",
        "action": "Use epinephrine auto-injector (EpiPen) if available. Call emergency services. Lie flat with legs elevated.",
        "vital_flags": ["low BP", "rapid pulse"],
    },
    {
        "id": "RULE-004",
        "name": "Major Trauma / Uncontrolled Bleeding",
        "keywords": ["uncontrolled bleeding", "major trauma", "head injury", "loss of consciousness", "unconscious"],
        "co_keywords": ["accident", "fall", "hit", "stabbed", "shooting"],
        "tier": 1,
        "min_severity": 0,
        "reasoning": "Major trauma or uncontrolled haemorrhage can be rapidly fatal without immediate intervention.",
        "action": "Apply direct pressure to bleeding. Call emergency services. Keep patient still. Monitor breathing.",
        "vital_flags": [],
    },
    {
        "id": "RULE-005",
        "name": "Severe Breathing Difficulty",
        "keywords": ["can't breathe", "not breathing", "severe shortness of breath", "choking", "cyanosis", "blue lips"],
        "co_keywords": ["oxygen", "inhaler", "asthma", "COPD"],
        "tier": 1,
        "min_severity": 0,
        "reasoning": "Severe respiratory compromise leads to hypoxia within minutes. Immediate airway management needed.",
        "action": "Call emergency services. Sit patient upright. Use rescue inhaler if asthmatic. Begin CPR if not breathing.",
        "vital_flags": ["low SpO2", "cyanosis"],
    },
    {
        "id": "RULE-006",
        "name": "Seizure (Active or First-Time)",
        "keywords": ["seizure", "convulsions", "fitting", "epileptic"],
        "co_keywords": ["shaking", "jerking", "unresponsive"],
        "tier": 1,
        "min_severity": 0,
        "reasoning": "Active seizure or first-time seizure requires immediate evaluation to rule out status epilepticus or CNS emergency.",
        "action": "Keep patient safe. Do not restrain. Time the seizure. Call emergency services if >5 min or first seizure.",
        "vital_flags": [],
    },
    {
        "id": "RULE-007",
        "name": "Suicidal Ideation / Mental Health Emergency",
        "keywords": ["suicidal", "self harm", "want to die", "kill myself", "suicide"],
        "co_keywords": ["plan", "method", "intent", "hopeless"],
        "tier": 1,
        "min_severity": 0,
        "reasoning": "Active suicidal ideation with plan or intent is a psychiatric emergency.",
        "action": "Do not leave patient alone. Remove harmful objects. Call emergency services or crisis line immediately.",
        "vital_flags": [],
    },
    {
        "id": "RULE-008",
        "name": "Thunderclap / Worst-Ever Headache",
        "keywords": ["worst headache of my life", "thunderclap headache", "sudden severe headache"],
        "co_keywords": ["sudden onset", "neck stiffness", "vomiting", "photophobia"],
        "tier": 1,
        "min_severity": 8,
        "reasoning": "Thunderclap headache is a red flag for subarachnoid haemorrhage until proven otherwise.",
        "action": "Go to emergency department immediately. CT head without contrast required urgently.",
        "vital_flags": [],
    },
    # ── Tier 2: URGENT ─────────────────────────────────────────────────────
    {
        "id": "RULE-009",
        "name": "High Fever",
        "keywords": ["high fever", "fever"],
        "co_keywords": ["rigors", "chills", "sweating", "confusion"],
        "tier": 2,
        "min_severity": 6,
        "reasoning": "High fever (>39°C) especially with rigors or altered mental status suggests systemic infection / sepsis.",
        "action": "See a doctor within 2–4 hours. Take paracetamol for fever. Stay hydrated. If confused — go to ER.",
        "vital_flags": ["high temperature"],
    },
    {
        "id": "RULE-010",
        "name": "Moderate Chest Pain",
        "keywords": ["chest pain", "chest discomfort"],
        "co_keywords": [],
        "tier": 2,
        "min_severity": 4,
        "reasoning": "Chest pain without classic ACS signs still warrants urgent cardiac and pulmonary evaluation.",
        "action": "See a doctor urgently today. Avoid exertion. Monitor for worsening symptoms.",
        "vital_flags": [],
    },
    {
        "id": "RULE-011",
        "name": "Abdominal Pain (Severe)",
        "keywords": ["severe abdominal pain", "abdominal pain"],
        "co_keywords": ["fever", "vomiting", "rigid abdomen", "right side"],
        "tier": 2,
        "min_severity": 6,
        "reasoning": "Severe abdominal pain with fever could indicate appendicitis, peritonitis, or other surgical emergency.",
        "action": "See a doctor within 2 hours. Nothing by mouth. Go to ER if pain is constant and worsening.",
        "vital_flags": [],
    },
    {
        "id": "RULE-012",
        "name": "Diabetic Emergency (Hypo/Hyperglycaemia)",
        "keywords": ["blood sugar", "diabetes", "hypoglycemia", "hyperglycemia", "insulin"],
        "co_keywords": ["shaking", "sweating", "confused", "very thirsty", "frequent urination"],
        "tier": 2,
        "min_severity": 5,
        "reasoning": "Diabetic emergencies can rapidly deteriorate to coma without timely glucose correction.",
        "action": "Check blood glucose. If hypoglycaemic: take glucose gel or juice. See doctor urgently.",
        "vital_flags": ["abnormal glucose"],
    },
    {
        "id": "RULE-013",
        "name": "Shortness of Breath (Moderate)",
        "keywords": ["shortness of breath", "difficulty breathing", "breathless"],
        "co_keywords": [],
        "tier": 2,
        "min_severity": 5,
        "reasoning": "Moderate dyspnoea requires evaluation for pulmonary embolism, pneumonia, or cardiac failure.",
        "action": "See a doctor within 2–4 hours. Sit upright. Avoid exertion. Call 999/112 if rapidly worsening.",
        "vital_flags": [],
    },
    {
        "id": "RULE-014",
        "name": "Paediatric Fever (Child under 5)",
        "keywords": ["fever", "high temperature"],
        "co_keywords": ["child", "baby", "infant", "toddler"],
        "tier": 2,
        "min_severity": 0,
        "age_max": 5,
        "reasoning": "Febrile illness in children under 5 has higher complication risk including febrile seizures and meningitis.",
        "action": "See paediatrician or GP urgently within 2 hours. Tepid sponging and paracetamol for fever.",
        "vital_flags": [],
    },
    {
        "id": "RULE-015",
        "name": "Elderly Fall with Possible Fracture",
        "keywords": ["fall", "fracture", "broken bone", "hip pain"],
        "co_keywords": ["can't walk", "can't move", "pain on movement"],
        "tier": 2,
        "min_severity": 0,
        "age_min": 65,
        "reasoning": "Falls in elderly patients carry high fracture risk (especially hip) and potential for internal injury.",
        "action": "Do not attempt to move patient. Call ambulance. Keep patient warm and reassured.",
        "vital_flags": [],
    },
    # ── Tier 3: ROUTINE ────────────────────────────────────────────────────
    {
        "id": "RULE-016",
        "name": "Mild Fever",
        "keywords": ["fever", "temperature", "feeling warm"],
        "co_keywords": [],
        "tier": 3,
        "min_severity": 0,
        "max_severity": 5,
        "reasoning": "Mild fever likely viral in origin. Monitor for 48 hours.",
        "action": "Book GP appointment within 24–48 hours. Rest, hydrate, take paracetamol/ibuprofen for comfort.",
        "vital_flags": [],
    },
    {
        "id": "RULE-017",
        "name": "Persistent Headache",
        "keywords": ["headache", "migraine"],
        "co_keywords": [],
        "tier": 3,
        "min_severity": 0,
        "max_severity": 7,
        "reasoning": "Recurrent or persistent headache warrants clinical evaluation to exclude secondary causes.",
        "action": "Book a GP appointment within 1–3 days. Avoid triggers. Take OTC analgesia.",
        "vital_flags": [],
    },
    {
        "id": "RULE-018",
        "name": "Back Pain",
        "keywords": ["back pain", "lower back pain", "lumbar pain"],
        "co_keywords": [],
        "tier": 3,
        "min_severity": 0,
        "reasoning": "Non-specific back pain is usually musculoskeletal and responds to conservative management.",
        "action": "Book GP/physiotherapy within 3–5 days. Gentle movement, NSAIDs, heat pack.",
        "vital_flags": [],
    },
    {
        "id": "RULE-019",
        "name": "Sore Throat / Upper Respiratory",
        "keywords": ["sore throat", "throat pain", "cold", "runny nose", "congestion"],
        "co_keywords": [],
        "tier": 3,
        "min_severity": 0,
        "reasoning": "Upper respiratory tract infections are predominantly viral; antibiotic prescription rarely needed.",
        "action": "Book GP if symptoms persist >7 days or worsen. Salt water gargle, honey, paracetamol.",
        "vital_flags": [],
    },
    {
        "id": "RULE-020",
        "name": "Urinary Symptoms",
        "keywords": ["urinary pain", "burning urination", "frequent urination", "uti"],
        "co_keywords": [],
        "tier": 3,
        "min_severity": 0,
        "reasoning": "Uncomplicated UTI symptoms warrant urine dipstick and possible antibiotics.",
        "action": "Book GP appointment within 1–2 days. Increase water intake. Cranberry supplement optional.",
        "vital_flags": [],
    },
    # ── Tier 4: SELF-CARE ─────────────────────────────────────────────────
    {
        "id": "RULE-021",
        "name": "Minor Cold / Viral URTI",
        "keywords": ["sneezing", "mild cold", "runny nose", "blocked nose"],
        "co_keywords": [],
        "tier": 4,
        "min_severity": 0,
        "max_severity": 4,
        "reasoning": "Common cold symptoms — self-limiting viral illness, no medical intervention required.",
        "action": "Rest, fluids, OTC decongestants/antihistamines. See GP if no improvement in 10 days.",
        "vital_flags": [],
    },
    {
        "id": "RULE-022",
        "name": "Mild Digestive Upset",
        "keywords": ["mild nausea", "upset stomach", "indigestion", "heartburn", "bloating"],
        "co_keywords": [],
        "tier": 4,
        "min_severity": 0,
        "max_severity": 4,
        "reasoning": "Mild GI symptoms are usually dietary in origin and self-resolving.",
        "action": "Eat bland foods (BRAT diet). Antacids for heartburn. Avoid trigger foods. See GP if >3 days.",
        "vital_flags": [],
    },
    {
        "id": "RULE-023",
        "name": "Minor Skin Rash",
        "keywords": ["mild rash", "skin irritation", "itchy skin", "dry skin"],
        "co_keywords": [],
        "tier": 4,
        "min_severity": 0,
        "max_severity": 3,
        "reasoning": "Minor skin irritation rarely requires emergency intervention.",
        "action": "Moisturise. Hydrocortisone 1% cream for itch. Avoid irritants. GP if no improvement in 7 days.",
        "vital_flags": [],
    },
    {
        "id": "RULE-024",
        "name": "Fatigue / Mild Stress",
        "keywords": ["tired", "fatigue", "exhausted", "stressed", "anxious", "mild anxiety"],
        "co_keywords": [],
        "tier": 4,
        "min_severity": 0,
        "max_severity": 4,
        "reasoning": "Mild fatigue or stress — lifestyle intervention appropriate before medical workup.",
        "action": "Prioritise sleep (7–9 hrs). Reduce caffeine/alcohol. Regular exercise. GP if persists >2 weeks.",
        "vital_flags": [],
    },
]

# ── Drug Interaction Flags ───────────────────────────────────────────────────
# (drug_a, drug_b) → severity, description
DRUG_INTERACTIONS = {
    ("warfarin", "aspirin"):       ("HIGH",   "Increased bleeding risk — major haemorrhage possible"),
    ("warfarin", "ibuprofen"):     ("HIGH",   "Increased bleeding risk — NSAIDs potentiate anticoagulation"),
    ("warfarin", "naproxen"):      ("HIGH",   "Increased bleeding risk — NSAIDs potentiate anticoagulation"),
    ("metformin", "contrast"):     ("HIGH",   "Risk of lactic acidosis with iodinated contrast media"),
    ("ssri", "tramadol"):          ("HIGH",   "Serotonin syndrome risk — avoid combination"),
    ("maoi", "ssri"):              ("CRITICAL","Serotonin syndrome — potentially fatal combination"),
    ("maoi", "tramadol"):          ("CRITICAL","Serotonin syndrome — potentially fatal combination"),
    ("lithium", "ibuprofen"):      ("HIGH",   "NSAIDs can increase lithium toxicity"),
    ("lithium", "naproxen"):       ("HIGH",   "NSAIDs can increase lithium toxicity"),
    ("digoxin", "amiodarone"):     ("HIGH",   "Amiodarone increases digoxin levels — toxicity risk"),
    ("simvastatin", "amiodarone"): ("MODERATE","Increased risk of myopathy/rhabdomyolysis"),
    ("clopidogrel", "omeprazole"): ("MODERATE","Omeprazole reduces clopidogrel antiplatelet effect"),
    ("sildenafil", "nitrates"):    ("CRITICAL","Severe hypotension — potentially fatal"),
    ("ace inhibitor", "potassium"):("MODERATE","Hyperkalaemia risk"),
    ("beta blocker", "verapamil"): ("HIGH",   "Risk of complete heart block and bradycardia"),
}

# ── Comorbidity Risk Multipliers ─────────────────────────────────────────────
# Conditions that escalate tier by 1 step if present
COMORBIDITY_ESCALATORS = {
    "diabetes":            ["chest pain", "shortness of breath", "fever", "wound"],
    "heart disease":       ["chest pain", "shortness of breath", "palpitations", "dizziness"],
    "copd":                ["shortness of breath", "cough", "fever"],
    "immunocompromised":   ["fever", "infection", "cough", "rash"],
    "cancer":              ["fever", "pain", "bleeding", "weight loss"],
    "pregnancy":           ["abdominal pain", "bleeding", "headache", "shortness of breath"],
    "chronic kidney disease": ["fatigue", "nausea", "swelling", "confusion"],
    "liver disease":       ["abdominal pain", "bleeding", "confusion", "jaundice"],
    "hypertension":        ["headache", "chest pain", "vision changes", "nosebleed"],
    "anticoagulated":      ["bleeding", "headache", "bruising", "head injury"],
}

# ── Severity Weight Modifiers ────────────────────────────────────────────────
# How severity score (1-10) shifts the final tier
# High severity alone can push Routine → Urgent or Urgent → Emergency
SEVERITY_TIER_THRESHOLDS = {
    "emergency_floor": 9,   # severity ≥ 9 → always at least Urgent
    "urgent_floor": 7,      # severity ≥ 7 → always at least Routine
}

# ── Age Risk Modifiers ───────────────────────────────────────────────────────
AGE_RISK_ZONES = [
    {"min": 0,  "max": 1,  "label": "Neonate",       "escalate": True,  "reason": "Neonates require immediate evaluation for any symptom."},
    {"min": 1,  "max": 5,  "label": "Infant/Toddler","escalate": True,  "reason": "Young children deteriorate rapidly — escalate 1 tier."},
    {"min": 5,  "max": 14, "label": "Child",          "escalate": False, "reason": "Standard evaluation with parental context."},
    {"min": 14, "max": 65, "label": "Adult",          "escalate": False, "reason": "Standard adult triage protocols."},
    {"min": 65, "max": 80, "label": "Elderly",        "escalate": True,  "reason": "Elderly patients often present atypically — escalate 1 tier."},
    {"min": 80, "max": 200,"label": "Very Elderly",   "escalate": True,  "reason": "Very elderly with frailty — escalate 1 tier and consider social support."},
]

# ── RAG-simulated Guideline Passages ────────────────────────────────────────
# Retrieved by keyword match, injected into reasoning as evidence
GUIDELINE_RAG = {
    "chest pain": (
        "ESI Guideline (AHA 2023): Chest pain with diaphoresis, radiation to arm/jaw, "
        "or associated dyspnoea must be treated as ACS until proven otherwise. "
        "12-lead ECG within 10 minutes of arrival is mandatory."
    ),
    "stroke": (
        "NICE Stroke Guideline (NG128): Use the FAST test (Face-Arm-Speech-Time). "
        "Any positive FAST finding warrants immediate CT head and neurology review. "
        "Thrombolysis (alteplase) should be offered within 4.5 hours of symptom onset."
    ),
    "fever": (
        "WHO Clinical Management (2022): Fever >38.5°C with rigors, altered mental status, "
        "or source unknown warrants urgent sepsis screening (blood cultures, lactate, FBC, CRP). "
        "NEWS2 score should be calculated in all febrile adults."
    ),
    "shortness of breath": (
        "BTS Dyspnoea Guideline: Acute onset dyspnoea with pleuritic pain, haemoptysis, "
        "or recent immobility raises suspicion of pulmonary embolism — Wells score indicated. "
        "Peak flow <50% predicted in asthma indicates severe attack."
    ),
    "seizure": (
        "NICE Epilepsy Guideline (NG217): First seizure requires same-day specialist assessment. "
        "Status epilepticus (>5 min) is an emergency — IV lorazepam first-line. "
        "Post-ictal patients need airway protection in recovery position."
    ),
    "anaphylaxis": (
        "NICE Anaphylaxis Guideline (CG134): Adrenaline 0.5mg IM (0.5ml of 1:1000) is the "
        "first-line treatment for anaphylaxis. Antihistamines and steroids are adjuncts only. "
        "All patients with anaphylaxis should be observed for minimum 6 hours."
    ),
    "suicidal": (
        "NICE Self-harm Guideline (NG225): Any expression of suicidal intent requires immediate "
        "psychiatric assessment. Risk stratification tools (Columbia Protocol) should be used. "
        "Never leave the patient alone. Involve mental health crisis team."
    ),
    "abdominal pain": (
        "NICE Acute Abdominal Pain: Localised RIF tenderness with fever and anorexia suggests "
        "appendicitis — Alvarado score indicated. Generalised rigidity suggests peritonitis "
        "requiring emergency surgical assessment."
    ),
    "headache": (
        "NICE Headache Guideline (NG193): 'Worst headache of life' with sudden onset is a "
        "red flag for subarachnoid haemorrhage. CT head is indicated. "
        "New headache in HIV+ or immunocompromised patient — consider meningitis/cryptococcus."
    ),
}

# ── Tier Labels ──────────────────────────────────────────────────────────────
TIER_LABELS = {
    1: "EMERGENCY",
    2: "URGENT",
    3: "ROUTINE",
    4: "SELF-CARE",
}

TIER_COLORS = {
    1: "red",
    2: "orange",
    3: "blue",
    4: "green",
}

TIER_WAIT_TIMES = {
    1: "Immediate — call emergency services NOW",
    2: "Within 2–4 hours — see a doctor today",
    3: "Within 1–3 days — book a GP appointment",
    4: "Self-manage — see GP if no improvement in 7–10 days",
}