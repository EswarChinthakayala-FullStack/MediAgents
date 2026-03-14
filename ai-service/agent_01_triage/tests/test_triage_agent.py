"""
tests/test_triage_agent.py
─────────────────────────────────────────────────────────────────────────────
ClinicAI — Symptom Triage Agent — Full Test Suite

Covers:
  • All 4 urgency tiers
  • Age escalation (infant, elderly)
  • Comorbidity escalation
  • Drug interaction detection
  • Duration escalation
  • ICD-10 code resolution
  • Guideline RAG retrieval
  • Edge cases (minimal input, extreme severity, unknown symptoms)
  • Batch processing
  • Event payload structure

Run:  python tests/test_triage_agent.py
─────────────────────────────────────────────────────────────────────────────
"""

import sys
import os
import json
import time
import traceback

sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))
from triage_engine import PatientInput, TriageOrchestrator, result_to_dict

# ─────────────────────────────────────────────────────────────────────────────
# Test framework (stdlib only — no pytest)
# ─────────────────────────────────────────────────────────────────────────────

class TestRunner:
    def __init__(self):
        self.passed = 0
        self.failed = 0
        self.errors = 0
        self._results = []

    def run(self, name: str, fn):
        try:
            fn()
            self.passed += 1
            self._results.append(("✅ PASS", name))
        except AssertionError as e:
            self.failed += 1
            self._results.append(("❌ FAIL", f"{name} — {e}"))
        except Exception as e:
            self.errors += 1
            self._results.append(("💥 ERROR", f"{name} — {type(e).__name__}: {e}"))

    def report(self):
        print("\n" + "═" * 68)
        print("  TEST RESULTS — ClinicAI Symptom Triage Agent")
        print("═" * 68)
        for status, name in self._results:
            print(f"  {status}  {name}")
        print("─" * 68)
        total = self.passed + self.failed + self.errors
        print(f"  Total: {total}  |  Passed: {self.passed}  |  "
              f"Failed: {self.failed}  |  Errors: {self.errors}")
        print("═" * 68 + "\n")
        return self.failed == 0 and self.errors == 0

def assert_eq(a, b, msg=""):
    if a != b:
        raise AssertionError(f"Expected {b!r}, got {a!r}. {msg}")

def assert_in_range(val, lo, hi, msg=""):
    if not (lo <= val <= hi):
        raise AssertionError(f"Expected {lo}–{hi}, got {val!r}. {msg}")

def assert_contains(container, item, msg=""):
    if item not in container:
        raise AssertionError(f"Expected {item!r} in {container!r}. {msg}")

def assert_true(expr, msg=""):
    if not expr:
        raise AssertionError(msg or "Expected True")

def assert_false(expr, msg=""):
    if expr:
        raise AssertionError(msg or "Expected False")

# ─────────────────────────────────────────────────────────────────────────────
# Test cases
# ─────────────────────────────────────────────────────────────────────────────

o = TriageOrchestrator()

def make_patient(**kwargs) -> PatientInput:
    defaults = {
        "patient_id": "TEST-001",
        "symptom_text": "I feel unwell",
        "severity": 5,
        "duration_days": 1,
        "age": 35,
        "sex": "F",
        "conditions": [],
        "medications": [],
    }
    defaults.update(kwargs)
    return PatientInput(**defaults)


# ── Tier 1: Emergency ─────────────────────────────────────────────────────────

def test_chest_pain_emergency():
    p = make_patient(
        symptom_text="I have severe chest pain radiating to my left arm with sweating and nausea",
        severity=9, age=55, sex="M"
    )
    r = o.triage(p)
    assert_eq(r.urgency_tier, 1, "Chest pain + sweating + arm pain must be EMERGENCY")
    assert_eq(r.urgency_label, "EMERGENCY")
    assert_true(r.requires_ambulance)
    assert_true(r.requires_immediate_doctor)


def test_stroke_symptoms_emergency():
    p = make_patient(
        symptom_text="my face is drooping, arm weakness on the left side and slurred speech",
        severity=8, age=62
    )
    r = o.triage(p)
    assert_eq(r.urgency_tier, 1, "FAST symptoms must be EMERGENCY")
    assert_true(r.requires_ambulance)


def test_anaphylaxis_emergency():
    p = make_patient(
        symptom_text="I had an allergic reaction to bee sting, throat is swelling, I can't breathe",
        severity=9, age=28
    )
    r = o.triage(p)
    assert_eq(r.urgency_tier, 1, "Anaphylaxis must be EMERGENCY")


def test_seizure_emergency():
    p = make_patient(
        symptom_text="patient is having a seizure, shaking and unresponsive",
        severity=10, age=22
    )
    r = o.triage(p)
    assert_eq(r.urgency_tier, 1, "Active seizure must be EMERGENCY")


def test_suicidal_ideation_emergency():
    p = make_patient(
        symptom_text="I have been feeling suicidal and have a plan to harm myself",
        severity=7, age=30
    )
    r = o.triage(p)
    assert_eq(r.urgency_tier, 1, "Suicidal ideation with plan must be EMERGENCY")
    assert_true(r.requires_mental_health_support)


def test_worst_headache_emergency():
    p = make_patient(
        symptom_text="worst headache of my life, sudden onset, with neck stiffness and vomiting",
        severity=10, age=40
    )
    r = o.triage(p)
    assert_eq(r.urgency_tier, 1, "Thunderclap headache must be EMERGENCY")


# ── Tier 2: Urgent ────────────────────────────────────────────────────────────

def test_high_fever_urgent():
    p = make_patient(
        symptom_text="I have a very high fever with rigors and chills",
        severity=7, age=35
    )
    r = o.triage(p)
    assert_in_range(r.urgency_tier, 1, 2, "High fever with rigors must be URGENT or EMERGENCY")


def test_shortness_of_breath_urgent():
    p = make_patient(
        symptom_text="I have shortness of breath and difficulty breathing when I walk upstairs",
        severity=6, age=50
    )
    r = o.triage(p)
    assert_in_range(r.urgency_tier, 1, 2, "Significant dyspnoea must be URGENT or EMERGENCY")


def test_severe_abdominal_pain_urgent():
    p = make_patient(
        symptom_text="severe abdominal pain on the right side with fever and vomiting",
        severity=7, age=25
    )
    r = o.triage(p)
    assert_in_range(r.urgency_tier, 1, 2, "Severe RIF pain with fever must be URGENT+")


# ── Tier 3: Routine ───────────────────────────────────────────────────────────

def test_mild_fever_routine():
    p = make_patient(
        symptom_text="I have a mild fever and feeling warm",
        severity=3, age=30
    )
    r = o.triage(p)
    assert_in_range(r.urgency_tier, 3, 4, "Mild fever should be ROUTINE or SELF-CARE")


def test_persistent_headache_routine():
    p = make_patient(
        symptom_text="I've had a headache for 3 days, moderate pain",
        severity=5, age=35
    )
    r = o.triage(p)
    assert_in_range(r.urgency_tier, 2, 3, "Persistent moderate headache should be ROUTINE or URGENT")


def test_back_pain_routine():
    p = make_patient(
        symptom_text="lower back pain after lifting boxes at work, mild to moderate",
        severity=4, age=40
    )
    r = o.triage(p)
    assert_in_range(r.urgency_tier, 3, 4, "Non-specific back pain should be ROUTINE or SELF-CARE")


def test_sore_throat_routine():
    p = make_patient(
        symptom_text="I have a sore throat and it hurts to swallow, mild cold symptoms",
        severity=3, age=25
    )
    r = o.triage(p)
    assert_in_range(r.urgency_tier, 3, 4, "Sore throat should be ROUTINE or SELF-CARE")


# ── Tier 4: Self-Care ─────────────────────────────────────────────────────────

def test_mild_cold_selfcare():
    p = make_patient(
        symptom_text="sneezing, runny nose and mild cold symptoms for 2 days",
        severity=2, age=28
    )
    r = o.triage(p)
    assert_in_range(r.urgency_tier, 3, 4, "Common cold should be ROUTINE or SELF-CARE")


def test_mild_indigestion_selfcare():
    p = make_patient(
        symptom_text="mild indigestion and bloating after eating, some heartburn",
        severity=2, age=32
    )
    r = o.triage(p)
    assert_in_range(r.urgency_tier, 3, 4, "Mild GI symptoms should be ROUTINE or SELF-CARE")


def test_fatigue_selfcare():
    p = make_patient(
        symptom_text="feeling tired and stressed at work",
        severity=3, age=29
    )
    r = o.triage(p)
    assert_in_range(r.urgency_tier, 3, 4, "Mild fatigue should be ROUTINE or SELF-CARE")


# ── Age Escalation ────────────────────────────────────────────────────────────

def test_infant_escalation():
    """Infant with fever should be escalated to at least URGENT."""
    p = make_patient(
        symptom_text="my 2-year-old baby has a fever and is crying",
        severity=4, age=2
    )
    r = o.triage(p)
    assert_in_range(r.urgency_tier, 1, 2, "Infant with fever must be escalated to URGENT+")
    assert_true(r.age_risk.escalate, "Age risk should flag escalation for infant")


def test_elderly_escalation():
    """Elderly patient with fall should be escalated."""
    p = make_patient(
        symptom_text="I fell down the stairs and have hip pain and can't walk",
        severity=5, age=78
    )
    r = o.triage(p)
    assert_in_range(r.urgency_tier, 1, 2, "Elderly fall should be escalated to URGENT+")


# ── Comorbidity Escalation ────────────────────────────────────────────────────

def test_diabetic_with_chest_pain():
    """Diabetic patient with chest pain — should always be EMERGENCY."""
    p = make_patient(
        symptom_text="chest pain and shortness of breath",
        severity=6, age=55,
        conditions=["diabetes", "hypertension"]
    )
    r = o.triage(p)
    assert_eq(r.urgency_tier, 1, "Diabetic with chest pain must be EMERGENCY")
    assert_true(len(r.comorbidity_escalations) > 0, "Should have comorbidity escalations")


def test_immunocompromised_with_fever():
    """Immunocompromised patient with fever should be escalated."""
    p = make_patient(
        symptom_text="I have a fever and feel very unwell",
        severity=5, age=42,
        conditions=["immunocompromised", "cancer"]
    )
    r = o.triage(p)
    assert_in_range(r.urgency_tier, 1, 2, "Immunocompromised + fever must be URGENT+")


def test_anticoagulated_head_injury():
    """Patient on anticoagulants with head injury — EMERGENCY."""
    p = make_patient(
        symptom_text="I hit my head and have a headache",
        severity=5, age=65,
        conditions=["anticoagulated"],
        medications=["warfarin"]
    )
    r = o.triage(p)
    assert_in_range(r.urgency_tier, 1, 2, "Anticoagulated patient with head injury must be URGENT+")


# ── Drug Interaction Detection ────────────────────────────────────────────────

def test_critical_drug_interaction():
    """Sildenafil + nitrates = CRITICAL interaction."""
    p = make_patient(
        symptom_text="chest tightness and dizziness",
        severity=5, age=60,
        medications=["sildenafil", "nitrates"]
    )
    r = o.triage(p)
    critical = [d for d in r.drug_alerts if d.severity == "CRITICAL"]
    assert_true(len(critical) > 0, "sildenafil + nitrates must flag CRITICAL interaction")


def test_warfarin_aspirin_interaction():
    """Warfarin + aspirin = HIGH interaction."""
    p = make_patient(
        symptom_text="I have a mild headache",
        severity=3, age=65,
        medications=["warfarin", "aspirin"]
    )
    r = o.triage(p)
    high_alerts = [d for d in r.drug_alerts if d.severity in ("HIGH", "CRITICAL")]
    assert_true(len(high_alerts) > 0, "warfarin + aspirin must flag HIGH interaction")


def test_no_drug_interaction_single_med():
    """Single medication — no interaction possible."""
    p = make_patient(
        symptom_text="mild headache",
        severity=2, age=30,
        medications=["paracetamol"]
    )
    r = o.triage(p)
    assert_eq(len(r.drug_alerts), 0, "Single medication should produce no drug alerts")


# ── ICD-10 Resolution ─────────────────────────────────────────────────────────

def test_icd10_codes_present():
    p = make_patient(
        symptom_text="I have chest pain and shortness of breath",
        severity=7, age=50
    )
    r = o.triage(p)
    assert_true(len(r.icd10_hints) > 0, "Should return at least 1 ICD-10 hint")
    codes = [h.code for h in r.icd10_hints]
    # Chest pain ICD-10 codes
    chest_codes = {"R07.9", "R07.89", "R06.00", "R06.09"}
    assert_true(any(c in chest_codes for c in codes), f"Expected chest/dyspnoea ICD-10, got {codes}")


def test_icd10_stroke():
    p = make_patient(
        symptom_text="facial drooping and slurred speech",
        severity=9, age=60
    )
    r = o.triage(p)
    codes = [h.code for h in r.icd10_hints]
    assert_true(len(codes) > 0, "Stroke symptoms should return ICD-10 hints")


# ── Guideline RAG Evidence ────────────────────────────────────────────────────

def test_guideline_evidence_chest_pain():
    p = make_patient(
        symptom_text="severe chest pain with sweating",
        severity=9, age=55
    )
    r = o.triage(p)
    assert_true(len(r.guideline_evidence) > 0, "Should return guideline evidence")
    topics = [e.topic for e in r.guideline_evidence]
    assert_contains(topics, "chest pain", "Chest pain guideline should be retrieved")


def test_guideline_evidence_stroke():
    p = make_patient(
        symptom_text="sudden facial drooping and arm weakness",
        severity=9, age=65
    )
    r = o.triage(p)
    topics = [e.topic for e in r.guideline_evidence]
    assert_true(len(topics) > 0, "Stroke symptoms should retrieve guidelines")


# ── Duration Escalation ───────────────────────────────────────────────────────

def test_duration_escalation():
    """Routine symptoms present >7 days should escalate to URGENT."""
    p = make_patient(
        symptom_text="I have a headache",
        severity=4, age=35,
        duration_days=10
    )
    r = o.triage(p)
    assert_in_range(r.urgency_tier, 1, 2, "10-day headache should escalate to URGENT")


def test_short_duration_no_escalation():
    """Same symptom for 1 day — should remain ROUTINE/SELF-CARE."""
    p = make_patient(
        symptom_text="mild headache",
        severity=3, age=35,
        duration_days=1
    )
    r = o.triage(p)
    assert_in_range(r.urgency_tier, 3, 4, "Short-duration mild headache should be ROUTINE/SELF-CARE")


# ── Priority Score ────────────────────────────────────────────────────────────

def test_priority_score_range():
    p = make_patient(symptom_text="chest pain", severity=8, age=55)
    r = o.triage(p)
    score = r.event_payload["priority_score"]
    assert_in_range(score, 0, 100, "Priority score must be 0–100")


def test_emergency_higher_priority_than_selfcare():
    emergency = make_patient(
        symptom_text="I am having a heart attack, chest pain and can't breathe",
        severity=10, age=55
    )
    selfcare = make_patient(
        symptom_text="mild runny nose",
        severity=2, age=30
    )
    r_e = o.triage(emergency)
    r_s = o.triage(selfcare)
    assert_true(
        r_e.event_payload["priority_score"] > r_s.event_payload["priority_score"],
        "Emergency patient must have higher priority score than self-care"
    )


# ── Event Payload Structure ───────────────────────────────────────────────────

def test_event_payload_structure():
    p = make_patient(symptom_text="chest pain", severity=7, age=50)
    r = o.triage(p)
    required_fields = [
        "triage_id", "patient_id", "urgency_tier", "urgency_label",
        "severity_score", "requires_ambulance", "priority_score",
        "timestamp", "alert_required", "log_entry"
    ]
    for field in required_fields:
        assert_true(field in r.event_payload, f"event_payload missing field: '{field}'")


def test_emergency_alert_flag():
    p = make_patient(
        symptom_text="uncontrolled bleeding and loss of consciousness",
        severity=9, age=30
    )
    r = o.triage(p)
    assert_true(r.event_payload["alert_required"], "Emergency must set alert_required=True")
    assert_eq(r.event_payload.get("alert_type"), "EMERGENCY_TRIAGE")


def test_selfcare_no_alert_flag():
    p = make_patient(
        symptom_text="mild runny nose and sneezing",
        severity=2, age=25
    )
    r = o.triage(p)
    assert_false(r.event_payload["alert_required"], "Self-care must NOT set alert_required")


# ── Result Serialisation ──────────────────────────────────────────────────────

def test_result_serialisable():
    p = make_patient(
        symptom_text="severe chest pain with arm pain",
        severity=9, age=55,
        conditions=["diabetes"],
        medications=["warfarin", "aspirin"]
    )
    r = o.triage(p)
    d = result_to_dict(r)
    # Should serialise to JSON without error
    json_str = json.dumps(d)
    assert_true(len(json_str) > 100, "Serialised result should be non-trivial JSON")


# ── Abbreviation Expansion ────────────────────────────────────────────────────

def test_abbreviation_sob():
    p = make_patient(symptom_text="SOB and CP", severity=7, age=50)
    r = o.triage(p)
    # SOB → shortness of breath, CP → chest pain
    assert_in_range(r.urgency_tier, 1, 2, "SOB + CP abbreviations should resolve to urgent+")


# ── Edge Cases ────────────────────────────────────────────────────────────────

def test_unknown_symptom_default_selfcare():
    p = make_patient(
        symptom_text="I feel a bit off today, nothing specific",
        severity=2, age=35
    )
    r = o.triage(p)
    assert_in_range(r.urgency_tier, 3, 4, "Vague minimal symptoms should default ROUTINE/SELF-CARE")
    assert_in_range(r.confidence, 0, 1, "Confidence must be 0–1")


def test_maximum_severity_escalation():
    """Severity 10 alone should escalate to at least URGENT."""
    p = make_patient(symptom_text="I feel terrible", severity=10, age=35)
    r = o.triage(p)
    assert_in_range(r.urgency_tier, 1, 2, "Severity 10 should produce at least URGENT")


def test_minimum_severity_no_escalation():
    p = make_patient(symptom_text="mild fatigue", severity=1, age=30)
    r = o.triage(p)
    assert_in_range(r.urgency_tier, 3, 4, "Severity 1 mild fatigue should be ROUTINE/SELF-CARE")


def test_triage_id_unique():
    p1 = make_patient(symptom_text="headache", severity=4, age=30, patient_id="P001")
    p2 = make_patient(symptom_text="headache", severity=4, age=30, patient_id="P002")
    r1 = o.triage(p1)
    r2 = o.triage(p2)
    assert_true(r1.triage_id != r2.triage_id, "Each triage must have a unique triage_id")


def test_timestamp_format():
    p = make_patient(symptom_text="headache", severity=3, age=30)
    r = o.triage(p)
    assert_true(r.timestamp.endswith("Z"), "Timestamp should be UTC ISO format ending in Z")


def test_validation_missing_symptom():
    p = PatientInput(
        patient_id="X", symptom_text="", severity=5, duration_days=1,
        age=30, sex="M", conditions=[], medications=[]
    )
    errors = p.validate()
    assert_true(len(errors) > 0, "Empty symptom_text should fail validation")


def test_validation_invalid_severity():
    p = PatientInput(
        patient_id="X", symptom_text="headache", severity=15, duration_days=1,
        age=30, sex="M", conditions=[], medications=[]
    )
    errors = p.validate()
    assert_true(len(errors) > 0, "Severity 15 should fail validation")


def test_reasoning_steps_populated():
    p = make_patient(
        symptom_text="chest pain with sweating",
        severity=8, age=55, conditions=["diabetes"]
    )
    r = o.triage(p)
    assert_true(len(r.reasoning_steps) > 0, "Should have at least 1 reasoning step")


def test_full_pipeline_complex_patient():
    """Full integration: complex patient with multiple risk factors."""
    p = PatientInput(
        patient_id="COMPLEX-001",
        symptom_text="I have chest pain, shortness of breath and I feel dizzy",
        severity=8,
        duration_days=2,
        age=72,
        sex="M",
        conditions=["diabetes", "heart disease", "hypertension"],
        medications=["warfarin", "aspirin", "metformin", "beta blocker"],
    )
    r = o.triage(p)
    # Must be emergency given the combination
    assert_eq(r.urgency_tier, 1, "Complex high-risk patient must be EMERGENCY")
    assert_true(len(r.drug_alerts) > 0, "Should detect drug interactions")
    assert_true(len(r.comorbidity_escalations) > 0, "Should detect comorbidity escalations")
    assert_true(r.event_payload["priority_score"] >= 80, "Priority score must be high")


# ─────────────────────────────────────────────────────────────────────────────
# Main
# ─────────────────────────────────────────────────────────────────────────────

def main():
    print("\n" + "═" * 68)
    print("  🧪  ClinicAI Triage Agent — Test Suite")
    print("═" * 68)

    runner = TestRunner()
    tests = [
        ("Tier 1: Cardiac emergency",          test_chest_pain_emergency),
        ("Tier 1: Stroke FAST criteria",        test_stroke_symptoms_emergency),
        ("Tier 1: Anaphylaxis",                 test_anaphylaxis_emergency),
        ("Tier 1: Active seizure",              test_seizure_emergency),
        ("Tier 1: Suicidal ideation + plan",    test_suicidal_ideation_emergency),
        ("Tier 1: Thunderclap headache",        test_worst_headache_emergency),
        ("Tier 2: High fever with rigors",      test_high_fever_urgent),
        ("Tier 2: Shortness of breath",         test_shortness_of_breath_urgent),
        ("Tier 2: Severe abdominal pain",       test_severe_abdominal_pain_urgent),
        ("Tier 3: Mild fever",                  test_mild_fever_routine),
        ("Tier 3: Persistent headache",         test_persistent_headache_routine),
        ("Tier 3: Back pain",                   test_back_pain_routine),
        ("Tier 3: Sore throat",                 test_sore_throat_routine),
        ("Tier 4: Common cold",                 test_mild_cold_selfcare),
        ("Tier 4: Mild indigestion",            test_mild_indigestion_selfcare),
        ("Tier 4: Fatigue/stress",              test_fatigue_selfcare),
        ("Age escalation: infant",              test_infant_escalation),
        ("Age escalation: elderly fall",        test_elderly_escalation),
        ("Comorbidity: diabetic chest pain",    test_diabetic_with_chest_pain),
        ("Comorbidity: immunocompromised fever",test_immunocompromised_with_fever),
        ("Comorbidity: anticoagulated head",    test_anticoagulated_head_injury),
        ("Drug: sildenafil + nitrates CRITICAL",test_critical_drug_interaction),
        ("Drug: warfarin + aspirin HIGH",       test_warfarin_aspirin_interaction),
        ("Drug: single med no interaction",     test_no_drug_interaction_single_med),
        ("ICD-10: chest pain codes",            test_icd10_codes_present),
        ("ICD-10: stroke codes",                test_icd10_stroke),
        ("Guideline RAG: chest pain",           test_guideline_evidence_chest_pain),
        ("Guideline RAG: stroke",               test_guideline_evidence_stroke),
        ("Duration: 10-day escalation",         test_duration_escalation),
        ("Duration: 1-day no escalation",       test_short_duration_no_escalation),
        ("Priority score range (0–100)",        test_priority_score_range),
        ("Priority: emergency > self-care",     test_emergency_higher_priority_than_selfcare),
        ("Event payload: required fields",      test_event_payload_structure),
        ("Event payload: alert_required flag",  test_emergency_alert_flag),
        ("Event payload: no alert for self-care",test_selfcare_no_alert_flag),
        ("Serialisation: JSON-serialisable",    test_result_serialisable),
        ("Abbreviation: SOB + CP",              test_abbreviation_sob),
        ("Edge: unknown symptom default",       test_unknown_symptom_default_selfcare),
        ("Edge: max severity escalation",       test_maximum_severity_escalation),
        ("Edge: min severity no escalation",    test_minimum_severity_no_escalation),
        ("Edge: unique triage IDs",             test_triage_id_unique),
        ("Edge: timestamp UTC format",          test_timestamp_format),
        ("Validation: empty symptom_text",      test_validation_missing_symptom),
        ("Validation: invalid severity",        test_validation_invalid_severity),
        ("Output: reasoning steps populated",   test_reasoning_steps_populated),
        ("Integration: complex patient",        test_full_pipeline_complex_patient),
    ]

    t_start = time.time()
    for name, fn in tests:
        runner.run(name, fn)

    elapsed = round(time.time() - t_start, 3)
    print(f"  Time: {elapsed}s")
    ok = runner.report()
    sys.exit(0 if ok else 1)


if __name__ == "__main__":
    main()