"""
server.py
─────────────────────────────────────────────────────────────────────────────
ClinicAI — Symptom Triage Agent — HTTP API Server

Built with Python stdlib only (http.server + json) — no FastAPI/Flask needed.

Endpoints:
  POST /triage           — Submit symptoms, get triage result
  GET  /triage/{id}      — Retrieve a previous triage result from memory
  GET  /health           — Agent health check
  GET  /metrics          — Basic usage metrics
  POST /triage/batch     — Triage multiple patients at once

Run:  python server.py
      python server.py --port 8080
─────────────────────────────────────────────────────────────────────────────
"""

import json
import sys
import os
import time
import datetime
import threading
import argparse
import traceback
from http.server import BaseHTTPRequestHandler, HTTPServer
from urllib.parse import urlparse, parse_qs

# Ensure triage_engine imports work
sys.path.insert(0, os.path.dirname(__file__))
from triage_engine import (
    PatientInput, TriageOrchestrator, result_to_dict
)

# ─────────────────────────────────────────────────────────────────────────────
# In-memory store (production → replace with Redis)
# ─────────────────────────────────────────────────────────────────────────────

class InMemoryStore:
    def __init__(self):
        self._lock = threading.Lock()
        self._results = {}     # triage_id → result dict
        self._metrics = {
            "total_triages":   0,
            "emergency_count": 0,
            "urgent_count":    0,
            "routine_count":   0,
            "selfcare_count":  0,
            "errors":          0,
            "start_time":      datetime.datetime.utcnow().isoformat() + "Z",
        }

    def save(self, triage_id: str, result: dict):
        with self._lock:
            self._results[triage_id] = result
            self._metrics["total_triages"] += 1
            tier = result.get("urgency_tier", 4)
            key = {1:"emergency", 2:"urgent", 3:"routine", 4:"selfcare"}.get(tier, "selfcare")
            self._metrics[f"{key}_count"] += 1

    def get(self, triage_id: str):
        with self._lock:
            return self._results.get(triage_id)

    def metrics(self):
        with self._lock:
            return dict(self._metrics)

    def error(self):
        with self._lock:
            self._metrics["errors"] += 1


STORE = InMemoryStore()
ORCHESTRATOR = TriageOrchestrator()

# ─────────────────────────────────────────────────────────────────────────────
# Request / Response helpers
# ─────────────────────────────────────────────────────────────────────────────

def _json_response(handler, status: int, body: dict):
    payload = json.dumps(body, indent=2).encode("utf-8")
    handler.send_response(status)
    handler.send_header("Content-Type",  "application/json")
    handler.send_header("Content-Length", str(len(payload)))
    handler.send_header("Access-Control-Allow-Origin", "*")
    handler.send_header("X-Agent-ID", "clinicai-triage-agent-v1")
    handler.end_headers()
    handler.wfile.write(payload)


def _read_json_body(handler) -> dict:
    length = int(handler.headers.get("Content-Length", 0))
    if length == 0:
        return {}
    raw = handler.rfile.read(length)
    return json.loads(raw.decode("utf-8"))


def _validate_triage_request(body: dict) -> tuple[PatientInput | None, list[str]]:
    """Validate and construct PatientInput from raw request dict."""
    errors = []

    patient_id    = body.get("patient_id", f"anon-{int(time.time())}")
    symptom_text  = body.get("symptom_text", "").strip()
    severity      = body.get("severity", 5)
    duration_days = body.get("duration_days", 1)
    age           = body.get("age")
    sex           = body.get("sex", "Unknown")
    conditions    = body.get("conditions", [])
    medications   = body.get("medications", [])
    language      = body.get("language", "en")

    if not symptom_text:
        errors.append("'symptom_text' is required")
    if age is None:
        errors.append("'age' is required (integer, 0–130)")
    if not isinstance(severity, int) or not (1 <= severity <= 10):
        errors.append("'severity' must be an integer between 1 and 10")
    if not isinstance(duration_days, int) or duration_days < 0:
        errors.append("'duration_days' must be a non-negative integer")
    if not isinstance(conditions, list):
        errors.append("'conditions' must be an array of strings")
    if not isinstance(medications, list):
        errors.append("'medications' must be an array of strings")

    if errors:
        return None, errors

    patient = PatientInput(
        patient_id=str(patient_id),
        symptom_text=symptom_text,
        severity=int(severity),
        duration_days=int(duration_days),
        age=int(age),
        sex=str(sex),
        conditions=[str(c).lower() for c in conditions],
        medications=[str(m).lower() for m in medications],
        language=str(language),
    )
    return patient, []


# ─────────────────────────────────────────────────────────────────────────────
# Route handlers
# ─────────────────────────────────────────────────────────────────────────────

def handle_health(handler):
    _json_response(handler, 200, {
        "status":   "healthy",
        "agent":    "Symptom Triage Agent",
        "version":  "1.0.0",
        "uptime":   STORE.metrics()["start_time"],
        "modules": {
            "rule_engine":      "online",
            "icd10_resolver":   "online",
            "drug_checker":     "online",
            "comorbidity":      "online",
            "age_modifier":     "online",
            "guideline_rag":    "online",
        }
    })


def handle_metrics(handler):
    m = STORE.metrics()
    total = max(m["total_triages"], 1)
    _json_response(handler, 200, {
        **m,
        "distribution": {
            "emergency_pct": round(m["emergency_count"] / total * 100, 1),
            "urgent_pct":    round(m["urgent_count"]    / total * 100, 1),
            "routine_pct":   round(m["routine_count"]   / total * 100, 1),
            "selfcare_pct":  round(m["selfcare_count"]  / total * 100, 1),
        }
    })


def handle_triage_post(handler):
    """POST /triage — main triage endpoint."""
    t_start = time.time()
    try:
        body = _read_json_body(handler)
    except (json.JSONDecodeError, ValueError) as e:
        _json_response(handler, 400, {"error": f"Invalid JSON: {str(e)}"})
        return

    patient, errors = _validate_triage_request(body)
    if errors:
        _json_response(handler, 422, {
            "error":   "Validation failed",
            "details": errors,
            "example_request": {
                "patient_id":    "P001",
                "symptom_text":  "I have severe chest pain and shortness of breath",
                "severity":      8,
                "duration_days": 1,
                "age":           55,
                "sex":           "M",
                "conditions":    ["diabetes", "hypertension"],
                "medications":   ["metformin", "aspirin"],
            }
        })
        return

    try:
        result = ORCHESTRATOR.triage(patient)
        result_dict = result_to_dict(result)
        result_dict["processing_time_ms"] = round((time.time() - t_start) * 1000, 2)
        STORE.save(result.triage_id, result_dict)

        # Simulate publishing to event bus (in production → Redis Streams)
        _publish_event_simulation(result_dict)

        _json_response(handler, 200, {
            "success": True,
            "data":    result_dict,
        })
    except ValueError as e:
        STORE.error()
        _json_response(handler, 422, {"error": str(e)})
    except Exception as e:
        STORE.error()
        _json_response(handler, 500, {
            "error":  "Internal triage engine error",
            "detail": str(e),
        })


def handle_triage_get(handler, triage_id: str):
    """GET /triage/{id}"""
    result = STORE.get(triage_id)
    if result is None:
        _json_response(handler, 404, {
            "error": f"Triage result '{triage_id}' not found"
        })
    else:
        _json_response(handler, 200, {"success": True, "data": result})


def handle_batch_triage(handler):
    """POST /triage/batch — triage up to 10 patients at once."""
    try:
        body = _read_json_body(handler)
    except (json.JSONDecodeError, ValueError) as e:
        _json_response(handler, 400, {"error": f"Invalid JSON: {str(e)}"})
        return

    patients_raw = body.get("patients", [])
    if not isinstance(patients_raw, list) or len(patients_raw) == 0:
        _json_response(handler, 422, {"error": "'patients' must be a non-empty array"})
        return
    if len(patients_raw) > 10:
        _json_response(handler, 422, {"error": "Batch limit is 10 patients per request"})
        return

    results = []
    for i, p_raw in enumerate(patients_raw):
        patient, errors = _validate_triage_request(p_raw)
        if errors:
            results.append({"index": i, "error": errors})
            continue
        try:
            r = ORCHESTRATOR.triage(patient)
            rd = result_to_dict(r)
            STORE.save(r.triage_id, rd)
            results.append({"index": i, "success": True, "data": rd})
        except Exception as e:
            STORE.error()
            results.append({"index": i, "error": str(e)})

    _json_response(handler, 200, {"batch_results": results})


def _publish_event_simulation(result_dict: dict):
    """
    Simulate publishing triage_result event to downstream agents.
    Production: redis_client.xadd("triage_events", result_dict["event_payload"])
    """
    payload = result_dict.get("event_payload", {})
    tier    = payload.get("urgency_tier", 4)

    if tier == 1:
        print(f"\n  🚨 EVENT → alert_agent          : EMERGENCY for patient {payload['patient_id']}")
    if tier <= 2:
        print(f"  📅 EVENT → appointment_agent     : priority_score={payload.get('priority_score')}")
    print(    f"  📋 EVENT → ehr_agent             : triage logged for {payload['patient_id']}")
    print(    f"  🎯 EVENT → orchestrator          : triage_result published [{payload['urgency_label']}]")


# ─────────────────────────────────────────────────────────────────────────────
# HTTP Request Handler
# ─────────────────────────────────────────────────────────────────────────────

class TriageAgentHandler(BaseHTTPRequestHandler):

    def log_message(self, format, *args):
        """Override to add timestamp and colour."""
        tier_color = ""
        print(f"  [{datetime.datetime.now().strftime('%H:%M:%S')}] {format % args}")

    def do_OPTIONS(self):
        """CORS preflight."""
        self.send_response(204)
        self.send_header("Access-Control-Allow-Origin",  "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type, Authorization")
        self.end_headers()

    def do_GET(self):
        parsed = urlparse(self.path)
        path   = parsed.path.rstrip("/")

        if path == "/health":
            handle_health(self)
        elif path == "/metrics":
            handle_metrics(self)
        elif path.startswith("/triage/"):
            triage_id = path[len("/triage/"):]
            handle_triage_get(self, triage_id)
        elif path == "" or path == "/":
            _json_response(self, 200, {
                "agent":    "ClinicAI — Symptom Triage Agent",
                "version":  "1.0.0",
                "status":   "online",
                "endpoints": {
                    "POST /triage":       "Submit patient symptoms for triage",
                    "GET  /triage/{id}":  "Retrieve previous triage result",
                    "POST /triage/batch": "Triage up to 10 patients at once",
                    "GET  /health":       "Agent health check",
                    "GET  /metrics":      "Usage statistics",
                }
            })
        else:
            _json_response(self, 404, {"error": f"Route '{path}' not found"})

    def do_POST(self):
        parsed = urlparse(self.path)
        path   = parsed.path.rstrip("/")

        if path == "/triage":
            handle_triage_post(self)
        elif path == "/triage/batch":
            handle_batch_triage(self)
        else:
            _json_response(self, 404, {"error": f"Route '{path}' not found"})


# ─────────────────────────────────────────────────────────────────────────────
# Entry point
# ─────────────────────────────────────────────────────────────────────────────

def main():
    parser = argparse.ArgumentParser(description="ClinicAI Symptom Triage Agent")
    parser.add_argument("--host", default="0.0.0.0",  help="Bind host (default: 0.0.0.0)")
    parser.add_argument("--port", type=int, default=8001, help="Port (default: 8001)")
    args = parser.parse_args()

    print("\n" + "═" * 60)
    print("  🏥  ClinicAI — Symptom Triage Agent v1.0.0")
    print("═" * 60)
    print(f"  Host   : http://{args.host}:{args.port}")
    print(f"  Routes : POST /triage  |  GET /health  |  GET /metrics")
    print(f"  Mode   : Offline (no external APIs required)")
    print(f"  Engine : ESI + MTS rule engine + ICD-10 + Drug checks")
    print("═" * 60 + "\n")

    server = HTTPServer((args.host, args.port), TriageAgentHandler)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\n\n  Agent shutting down gracefully.\n")
        server.server_close()


if __name__ == "__main__":
    main()