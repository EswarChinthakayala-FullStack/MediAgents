"""
demo.py
─────────────────────────────────────────────────────────────────────────────
ClinicAI — Symptom Triage Agent — Interactive Demo

Run: python demo.py
─────────────────────────────────────────────────────────────────────────────
"""

import sys, os, json, time
sys.path.insert(0, os.path.dirname(__file__))
from triage_engine import PatientInput, TriageOrchestrator, result_to_dict

o = TriageOrchestrator()

TIER_BANNERS = {
    1: "🚨  EMERGENCY — Call emergency services NOW",
    2: "⚠️   URGENT — See a doctor within 2–4 hours",
    3: "🔵  ROUTINE — Book a GP appointment (1–3 days)",
    4: "✅  SELF-CARE — Manage at home",
}

SCENARIOS = [
    {
        "title": "Scenario 1 — Cardiac Emergency (55-year-old diabetic male)",
        "input": PatientInput(
            patient_id="DEMO-001",
            symptom_text="I have severe chest pain radiating to my left arm and jaw, sweating, nausea",
            severity=9, duration_days=1, age=55, sex="M",
            conditions=["diabetes", "hypertension"],
            medications=["metformin", "aspirin", "warfarin"],
        ),
    },
    {
        "title": "Scenario 2 — Stroke Symptoms (68-year-old female)",
        "input": PatientInput(
            patient_id="DEMO-002",
            symptom_text="sudden facial drooping on the right side, arm weakness, slurred speech, started 30 min ago",
            severity=9, duration_days=1, age=68, sex="F",
            conditions=["hypertension", "heart disease"],
            medications=["beta blocker", "aspirin"],
        ),
    },
    {
        "title": "Scenario 3 — High Fever (3-year-old child)",
        "input": PatientInput(
            patient_id="DEMO-003",
            symptom_text="my baby has a very high fever with rigors and chills, not eating",
            severity=7, duration_days=1, age=3, sex="M",
            conditions=[], medications=[],
        ),
    },
    {
        "title": "Scenario 4 — Routine Back Pain (38-year-old adult)",
        "input": PatientInput(
            patient_id="DEMO-004",
            symptom_text="lower back pain after lifting at work, aching and stiff",
            severity=4, duration_days=2, age=38, sex="F",
            conditions=[], medications=["ibuprofen"],
        ),
    },
    {
        "title": "Scenario 5 — Critical Drug Interaction (65-year-old male)",
        "input": PatientInput(
            patient_id="DEMO-005",
            symptom_text="I have chest tightness and feel dizzy",
            severity=5, duration_days=1, age=65, sex="M",
            conditions=["heart disease"],
            medications=["sildenafil", "nitrates", "beta blocker", "verapamil"],
        ),
    },
    {
        "title": "Scenario 6 — Self-Care Cold (25-year-old adult)",
        "input": PatientInput(
            patient_id="DEMO-006",
            symptom_text="runny nose, sneezing, mild sore throat, feel a bit tired",
            severity=2, duration_days=2, age=25, sex="F",
            conditions=[], medications=[],
        ),
    },
    {
        "title": "Scenario 7 — Mental Health Emergency (29-year-old)",
        "input": PatientInput(
            patient_id="DEMO-007",
            symptom_text="I have been feeling suicidal and I have a plan to harm myself tonight",
            severity=8, duration_days=3, age=29, sex="M",
            conditions=["depression"], medications=["ssri"],
        ),
    },
]


def print_separator(char="─", width=68):
    print(char * width)


def render_result(result, scenario_title: str):
    d = result_to_dict(result)

    print("\n" + "═" * 68)
    print(f"  {scenario_title}")
    print("═" * 68)

    # Tier banner
    print(f"\n  {TIER_BANNERS[result.urgency_tier]}")
    print(f"  Confidence: {int(result.confidence * 100)}%  |  "
          f"Triage ID: {result.triage_id[:8]}…")

    # Summary
    print_separator()
    print("  📋  TRIAGE SUMMARY")
    print_separator()
    print(f"  {result.triage_summary}")

    # Wait time
    print(f"\n  ⏱  Wait guidance: {result.wait_time}")

    # Recommended action
    print_separator()
    print("  ✅  RECOMMENDED ACTION")
    print_separator()
    for line in result.recommended_action.split(". "):
        if line.strip():
            print(f"  • {line.strip()}.")

    # Reasoning chain
    if result.reasoning_steps:
        print_separator()
        print("  🧠  REASONING CHAIN (ESI/MTS)")
        print_separator()
        for i, step in enumerate(result.reasoning_steps, 1):
            print(f"  {i}. {step}")

    # ICD-10
    if result.icd10_hints:
        print_separator()
        print("  🏷   ICD-10 HINTS")
        print_separator()
        for h in result.icd10_hints[:3]:
            print(f"  • {h.code}  {h.description}  [{h.symptom}]")

    # Drug alerts
    if result.drug_alerts:
        print_separator()
        print("  💊  DRUG INTERACTION ALERTS")
        print_separator()
        for a in result.drug_alerts:
            sev_icon = {"CRITICAL": "🔴", "HIGH": "🟠", "MODERATE": "🟡"}.get(a.severity, "⚪")
            print(f"  {sev_icon} [{a.severity}] {a.drug_a} + {a.drug_b}")
            print(f"       → {a.description}")

    # Comorbidity
    if result.comorbidity_escalations:
        print_separator()
        print("  🔺  COMORBIDITY ESCALATIONS")
        print_separator()
        for c in result.comorbidity_escalations:
            print(f"  • {c.condition} → triggered by: {', '.join(c.triggered_by)}")

    # Age risk
    if result.age_risk.escalate:
        print_separator()
        print(f"  👤  AGE RISK: {result.age_risk.label} ({result.age_risk.age}y)")
        print(f"  {result.age_risk.reason}")

    # Guidelines (first 1)
    if result.guideline_evidence:
        print_separator()
        print("  📖  CLINICAL GUIDELINE EVIDENCE")
        print_separator()
        g = result.guideline_evidence[0]
        print(f"  Topic: {g.topic.upper()}")
        print(f"  {g.guideline}")

    # Escalation flags
    flags = []
    if result.requires_ambulance:            flags.append("🚑 Ambulance required")
    if result.requires_immediate_doctor:     flags.append("👨‍⚕️ Immediate doctor contact")
    if result.requires_mental_health_support: flags.append("🧠 Mental health crisis team")

    if flags:
        print_separator()
        print("  🚨  ESCALATION FLAGS")
        print_separator()
        for f in flags:
            print(f"  {f}")

    # Downstream event
    print_separator()
    print("  📡  DOWNSTREAM EVENT PAYLOAD (for other agents)")
    print_separator()
    ep = result.event_payload
    print(f"  → Orchestrator  : triage_result published [{ep['urgency_label']}]")
    print(f"  → Appointment   : priority_score = {ep['priority_score']}/100")
    print(f"  → EHR Agent     : event logged")
    if ep["alert_required"]:
        print(f"  → Alert Agent   : ⚡ EMERGENCY ALERT TRIGGERED")

    print("\n")


def interactive_mode():
    """Let the user type their own symptoms."""
    print("\n" + "═" * 68)
    print("  🏥  ClinicAI Triage Agent — Interactive Mode")
    print("═" * 68)
    print("  Type your symptoms and answer the questions.")
    print("  Press Ctrl+C to exit.\n")

    while True:
        try:
            symptom_text = input("  Symptoms: ").strip()
            if not symptom_text:
                continue
            severity = int(input("  Severity (1–10): ").strip() or "5")
            age = int(input("  Age: ").strip() or "35")
            sex = input("  Sex (M/F/Other): ").strip() or "M"
            duration = int(input("  Duration (days): ").strip() or "1")
            conditions_str = input("  Conditions (comma-separated, or blank): ").strip()
            meds_str = input("  Medications (comma-separated, or blank): ").strip()

            conditions = [c.strip().lower() for c in conditions_str.split(",") if c.strip()]
            medications = [m.strip().lower() for m in meds_str.split(",") if m.strip()]

            patient = PatientInput(
                patient_id=f"INTERACTIVE-{int(time.time())}",
                symptom_text=symptom_text,
                severity=severity,
                duration_days=duration,
                age=age,
                sex=sex,
                conditions=conditions,
                medications=medications,
            )

            print("\n  Running triage engine…\n")
            result = o.triage(patient)
            render_result(result, "Interactive Triage")

        except KeyboardInterrupt:
            print("\n\n  Goodbye.\n")
            break
        except ValueError as e:
            print(f"\n  ⚠ Input error: {e}\n")


def main():
    if "--interactive" in sys.argv or "-i" in sys.argv:
        interactive_mode()
        return

    print("\n" + "═" * 68)
    print("  🏥  ClinicAI — Symptom Triage Agent — Demo")
    print("  Running 7 clinical scenarios…")
    print("═" * 68)

    for scenario in SCENARIOS:
        t0 = time.time()
        result = o.triage(scenario["input"])
        elapsed = round((time.time() - t0) * 1000, 1)
        render_result(result, f"{scenario['title']}  [{elapsed}ms]")
        time.sleep(0.1)

    print("  All scenarios complete.")
    print("  Run with --interactive to enter your own symptoms.\n")


if __name__ == "__main__":
    main()