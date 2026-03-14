# ============================================================
#  🏥  Clinical Triage Agent — TinyLlama Edition
#  Run in Google Colab (GPU recommended)
#  No external API keys required
# ============================================================

# ── CELL 1: Install dependencies ────────────────────────────
# !pip install -q transformers accelerate fastapi uvicorn nest-asyncio pyngrok sentence-transformers faiss-cpu pydantic

# ── CELL 2: Imports & Setup ──────────────────────────────────
import json
import re
import time
import threading
from typing import Optional, List
from datetime import datetime

import torch
import numpy as np
from transformers import pipeline, AutoTokenizer, AutoModelForCausalLM
from sentence_transformers import SentenceTransformer
import faiss

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn
import nest_asyncio
nest_asyncio.apply()


# ════════════════════════════════════════════════════════════
#  1.  TinyLlama Engine  (mirrors your existing llm_engine.py)
# ════════════════════════════════════════════════════════════
class TinyLlamaEngine:
    """
    Wraps TinyLlama-1.1B-Chat via HuggingFace pipeline.
    Usage mirrors the existing TinyLlamaEngine interface:
        engine.load()
        outputs = engine.pipe(prompt, **gen_kwargs)
    """
    MODEL_ID = "TinyLlama/TinyLlama-1.1B-Chat-v1.0"

    def __init__(self):
        self.pipe = None
        self.device = (
            "cuda" if torch.cuda.is_available()
            else "mps" if torch.backends.mps.is_available()
            else "cpu"
        )
        print(f"  [TinyLlamaEngine] Target device: {self.device}")

    def load(self):
        print(f"  [TinyLlamaEngine] Loading {self.MODEL_ID} …")
        tokenizer = AutoTokenizer.from_pretrained(self.MODEL_ID)
        model = AutoModelForCausalLM.from_pretrained(
            self.MODEL_ID,
            torch_dtype=torch.float16 if self.device != "cpu" else torch.float32,
            device_map="auto",
        )
        self.pipe = pipeline(
            "text-generation",
            model=model,
            tokenizer=tokenizer,
            device_map="auto",
        )
        print("  [TinyLlamaEngine] Model ready ✅")

    def generate(self, prompt: str, max_new_tokens: int = 512) -> str:
        """
        Formats prompt in ChatML, calls engine.pipe exactly as in your
        existing tester, and returns only the assistant reply text.
        """
        chat_prompt = (
            f"<|system|>\n{TRIAGE_SYSTEM_PROMPT}</s>\n"
            f"<|user|>\n{prompt}</s>\n"
            f"<|assistant|>\n"
        )
        outputs = self.pipe(
            chat_prompt,
            max_new_tokens=max_new_tokens,
            do_sample=True,
            temperature=0.3,       # lower temp → more deterministic clinical output
            top_k=50,
            top_p=0.9,
            pad_token_id=self.pipe.tokenizer.eos_token_id,
        )
        raw = outputs[0]["generated_text"]
        response = raw.split("<|assistant|>\n")[-1].strip()
        return response


# ════════════════════════════════════════════════════════════
#  2.  Medical RAG  (in-memory FAISS, no Pinecone key needed)
# ════════════════════════════════════════════════════════════
# Condensed WHO / ESI / MTS severity guidelines embedded at startup
MEDICAL_KNOWLEDGE_BASE = [
    # Emergency red flags
    "Chest pain with radiation to arm or jaw, sweating, shortness of breath: EMERGENCY - possible MI",
    "Sudden severe headache 'worst of life', neck stiffness, photophobia: EMERGENCY - possible subarachnoid hemorrhage",
    "Difficulty breathing, oxygen saturation below 92%, cyanosis: EMERGENCY - respiratory failure",
    "Loss of consciousness, unresponsive, no pulse: EMERGENCY - cardiac arrest, call 999/911 immediately",
    "Stroke symptoms: face drooping, arm weakness, speech difficulty (FAST): EMERGENCY - possible CVA",
    "Severe allergic reaction, throat swelling, anaphylaxis: EMERGENCY - administer epinephrine",
    "Active major bleeding, haemodynamic instability, systolic BP < 90: EMERGENCY",
    "High fever > 40°C with altered consciousness in any age: EMERGENCY - possible sepsis",
    "Fever > 38°C in infant under 3 months: EMERGENCY",
    "Seizure lasting more than 5 minutes or repeated seizures: EMERGENCY",

    # Urgent (seen within 2 hours)
    "Moderate chest pain without clear cardiac features, age > 40: URGENT",
    "High fever 39-40°C with rigors, severe myalgia: URGENT - possible sepsis workup",
    "Acute abdominal pain, moderate severity, no peritoneal signs: URGENT",
    "Fracture with intact neurovascular status, moderate pain: URGENT",
    "Severe migraine not responding to analgesia: URGENT",
    "Urinary symptoms with high fever, possible pyelonephritis: URGENT",
    "Blood glucose > 16 mmol/L or < 3 mmol/L with symptoms: URGENT",
    "Asthma exacerbation, moderate — PEFR 50-75% predicted: URGENT",
    "Significant laceration requiring suture, controlled bleeding: URGENT",
    "Acute psychiatric crisis, risk of self-harm: URGENT",

    # Routine (seen within 4 hours)
    "Mild urinary tract infection, no systemic features, afebrile: ROUTINE",
    "Minor musculoskeletal injury, sprain, mild pain (1-4/10): ROUTINE",
    "Ear infection (otitis media), mild pain, afebrile: ROUTINE",
    "Sore throat, mild fever, no stridor, no drooling: ROUTINE",
    "Minor wound, superficial laceration, no tendon involvement: ROUTINE",
    "Skin rash, non-urticarial, no systemic symptoms: ROUTINE",
    "Mild abdominal pain, no peritoneal signs, afebrile: ROUTINE",
    "Dental pain, mild to moderate: ROUTINE",
    "Conjunctivitis, discharge without visual changes: ROUTINE",

    # Self-care
    "Common cold, runny nose, mild sore throat, no fever: SELF-CARE - rest, fluids, OTC analgesia",
    "Mild headache, no neurological features, no fever: SELF-CARE - analgesia, rest",
    "Minor skin abrasion, clean wound, low infection risk: SELF-CARE - clean and dress",
    "Mild diarrhoea without blood, no dehydration: SELF-CARE - oral rehydration",
    "Insect bite, local swelling only, no systemic reaction: SELF-CARE",

    # Age / comorbidity modifiers
    "Age > 65 with any acute condition: escalate triage tier by one level",
    "Age < 2 with any fever: escalate triage tier by one level",
    "Known immunosuppression (HIV, chemotherapy, steroids): escalate triage tier",
    "Diabetes mellitus with acute infection: escalate triage tier",
    "Known heart failure with worsening dyspnoea: escalate triage tier",
    "Pregnancy > 20 weeks with abdominal pain: escalate triage tier",

    # ICD-10 hints
    "Chest pain ICD-10: R07.4 (unspecified), I21 (STEMI), I20.9 (unstable angina)",
    "Shortness of breath ICD-10: R06.0, J45 (asthma), J18 (pneumonia)",
    "Fever ICD-10: R50.9, A41 (sepsis)",
    "Headache ICD-10: R51, G43 (migraine), I60 (subarachnoid haemorrhage)",
    "Abdominal pain ICD-10: R10, K35 (appendicitis), K80 (cholelithiasis)",
    "Fracture ICD-10: S prefix codes based on site",
    "UTI ICD-10: N39.0",
    "Diarrhoea ICD-10: R19.7, A09 (infectious gastroenteritis)",
]

class MedicalRAG:
    """Lightweight in-memory RAG using FAISS + sentence-transformers."""

    def __init__(self, top_k: int = 5):
        self.top_k = top_k
        self.embedder = None
        self.index = None
        self.docs = MEDICAL_KNOWLEDGE_BASE

    def load(self):
        print("  [MedicalRAG] Loading embedding model …")
        self.embedder = SentenceTransformer("all-MiniLM-L6-v2")
        vecs = self.embedder.encode(self.docs, show_progress_bar=False)
        dim = vecs.shape[1]
        self.index = faiss.IndexFlatL2(dim)
        self.index.add(np.array(vecs, dtype=np.float32))
        print(f"  [MedicalRAG] Indexed {len(self.docs)} clinical guidelines ✅")

    def retrieve(self, query: str) -> str:
        q_vec = self.embedder.encode([query])
        _, indices = self.index.search(np.array(q_vec, dtype=np.float32), self.top_k)
        results = [self.docs[i] for i in indices[0] if i < len(self.docs)]
        return "\n".join(f"• {r}" for r in results)


# ════════════════════════════════════════════════════════════
#  3.  Mock External Tools  (no API keys needed)
# ════════════════════════════════════════════════════════════
class MockOpenFDA:
    """Simulates OpenFDA drug interaction lookup."""
    INTERACTIONS = {
        ("warfarin", "aspirin"):   "HIGH RISK: Increased bleeding risk",
        ("metformin", "contrast"): "HIGH RISK: Risk of lactic acidosis",
        ("ssri", "tramadol"):      "HIGH RISK: Serotonin syndrome risk",
        ("ace inhibitor", "nsaid"):"MODERATE: Reduced antihypertensive effect, renal risk",
    }
    def check(self, medications: List[str]) -> str:
        meds_lower = [m.lower() for m in medications]
        found = []
        for (a, b), warning in self.INTERACTIONS.items():
            if any(a in m for m in meds_lower) and any(b in m for m in meds_lower):
                found.append(f"⚠ {a.title()} + {b.title()}: {warning}")
        return "\n".join(found) if found else "No critical interactions detected."


class MockICD10Lookup:
    """Returns plausible ICD-10 codes from symptom keywords."""
    CODES = {
        "chest pain":     "R07.4",
        "dyspnoea":       "R06.0",
        "fever":          "R50.9",
        "headache":       "R51",
        "abdominal pain": "R10.9",
        "fracture":       "S09.90",
        "uti":            "N39.0",
        "diarrhoea":      "R19.7",
        "rash":           "R21",
        "seizure":        "R56.9",
        "syncope":        "R55",
        "stroke":         "I64",
    }
    def lookup(self, symptom_text: str) -> List[str]:
        text = symptom_text.lower()
        return [
            f"{code} ({kw})"
            for kw, code in self.CODES.items()
            if kw in text
        ]


# ════════════════════════════════════════════════════════════
#  4.  LLM System Prompt
# ════════════════════════════════════════════════════════════
TRIAGE_SYSTEM_PROMPT = """You are a clinical triage AI assistant operating under ESI (Emergency Severity Index) and MTS (Manchester Triage System) protocols.

Given patient-reported symptoms plus retrieved clinical guidelines, classify urgency and output ONLY valid JSON.

RULES:
- NEVER diagnose. Only classify urgency and recommend actions.
- Consider age, comorbidities, medications, and red-flag symptoms.
- Use the retrieved guidelines provided in the user message.

OUTPUT FORMAT (strict JSON, no extra text):
{
  "urgency_tier": "Emergency | Urgent | Routine | Self-care",
  "severity_score": <1-10 integer>,
  "reasoning": "<2-3 sentence clinical rationale>",
  "recommended_action": "<specific next step>",
  "icd10_hints": ["<code> (<description>)", ...],
  "red_flags_detected": ["<flag>", ...],
  "drug_interaction_alert": "<alert or none>"
}"""


# ════════════════════════════════════════════════════════════
#  5.  Triage Agent
# ════════════════════════════════════════════════════════════
class TriageAgent:
    def __init__(self):
        self.llm    = TinyLlamaEngine()
        self.rag    = MedicalRAG()
        self.fda    = MockOpenFDA()
        self.icd10  = MockICD10Lookup()
        self.event_log: List[dict] = []   # simulates Redis pub/sub log

    def load(self):
        self.llm.load()
        self.rag.load()

    # ── Event bus (simulated) ────────────────────────────────
    def _publish(self, event: str, payload: dict):
        entry = {"event": event, "ts": datetime.utcnow().isoformat(), **payload}
        self.event_log.append(entry)
        tier = payload.get("urgency_tier", "")
        print(f"\n  📡 Event published [{event}] — tier: {tier}")
        if tier == "Emergency":
            print("  🚨 ALERT AGENT triggered — Emergency escalation!")

    # ── Core triage ─────────────────────────────────────────
    def triage(self, request: "TriageRequest") -> dict:
        t0 = time.time()

        # Tool 1: Drug interaction check
        drug_alert = self.fda.check(request.current_medications)

        # Tool 2: ICD-10 hints from raw symptom text
        icd_hints = self.icd10.lookup(request.symptom_text)
        # Also pull from known_conditions
        for cond in request.known_conditions:
            icd_hints += self.icd10.lookup(cond)
        icd_hints = list(set(icd_hints))

        # Tool 3: RAG retrieval
        rag_query = f"{request.symptom_text} {' '.join(request.known_conditions)} age {request.age}"
        guidelines = self.rag.retrieve(rag_query)

        # Build LLM prompt
        user_prompt = f"""PATIENT DATA:
- Symptom text: {request.symptom_text}
- Duration: {request.duration}
- Severity score (patient-reported): {request.severity_score}/10
- Age: {request.age}
- Known conditions: {', '.join(request.known_conditions) or 'None'}
- Current medications: {', '.join(request.current_medications) or 'None'}

RETRIEVED CLINICAL GUIDELINES:
{guidelines}

TOOL RESULTS:
- Drug interaction check: {drug_alert}
- ICD-10 hints: {', '.join(icd_hints) or 'None found'}

Based on the above, output the triage JSON now."""

        # LLM call — same pattern as your existing tester
        raw_response = self.llm.generate(user_prompt, max_new_tokens=400)

        # Parse JSON from LLM output
        result = self._parse_json(raw_response, icd_hints, drug_alert)
        result["processing_time_s"] = round(time.time() - t0, 2)

        # Publish triage_result event
        self._publish("triage_result", {
            "patient_age":    request.age,
            "urgency_tier":   result.get("urgency_tier", "Unknown"),
            "severity_score": result.get("severity_score", 0),
        })

        # Log to EHR agent (simulated)
        self._publish("ehr_log", {"triage_summary": result.get("reasoning", "")})

        return result

    def _parse_json(self, raw: str, icd_hints: list, drug_alert: str) -> dict:
        """Extract JSON from LLM output; fall back to structured defaults."""
        try:
            match = re.search(r'\{.*\}', raw, re.DOTALL)
            if match:
                return json.loads(match.group())
        except Exception:
            pass

        # Graceful fallback: rule-based urgency from raw text
        text = raw.lower()
        if any(w in text for w in ["emergency", "immediate", "life-threatening", "critical"]):
            tier, score = "Emergency", 9
        elif any(w in text for w in ["urgent", "soon", "hours"]):
            tier, score = "Urgent", 6
        elif any(w in text for w in ["routine", "appointment"]):
            tier, score = "Routine", 3
        else:
            tier, score = "Self-care", 1

        return {
            "urgency_tier":          tier,
            "severity_score":        score,
            "reasoning":             raw[:300],
            "recommended_action":    "Consult a healthcare professional for full assessment.",
            "icd10_hints":           icd_hints,
            "red_flags_detected":    [],
            "drug_interaction_alert": drug_alert,
        }


# ════════════════════════════════════════════════════════════
#  6.  FastAPI App
# ════════════════════════════════════════════════════════════
app    = FastAPI(title="Clinical Triage Agent", version="1.0.0")
agent  = TriageAgent()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], allow_methods=["*"], allow_headers=["*"],
)

# ── Pydantic schemas ────────────────────────────────────────
class TriageRequest(BaseModel):
    symptom_text:        str
    duration:            str                  = "unknown"
    severity_score:      int                  = 5          # 1-10
    age:                 int                  = 30
    known_conditions:    List[str]            = []
    current_medications: List[str]            = []

class TriageResponse(BaseModel):
    urgency_tier:           str
    severity_score:         int
    reasoning:              str
    recommended_action:     str
    icd10_hints:            List[str]
    red_flags_detected:     List[str]
    drug_interaction_alert: str
    processing_time_s:      float


# ── Endpoints ───────────────────────────────────────────────
@app.on_event("startup")
async def startup():
    print("\n" + "═" * 60)
    print("  🏥  Clinical Triage Agent — TinyLlama Edition")
    print("═" * 60)
    agent.load()
    print("  🚀  All components loaded. API ready.\n")

@app.get("/health")
def health():
    return {"status": "ok", "model": TinyLlamaEngine.MODEL_ID}

@app.post("/triage", response_model=TriageResponse)
def run_triage(req: TriageRequest):
    try:
        result = agent.triage(req)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/events")
def get_events():
    """Returns the simulated pub/sub event log (triage_result, ehr_log, alerts)."""
    return {"events": agent.event_log}


# ════════════════════════════════════════════════════════════
#  7.  Colab launcher  (ngrok tunnel → public HTTPS URL)
# ════════════════════════════════════════════════════════════
def launch_colab(port: int = 8000):
    """
    Run in a Colab cell:
        from triage_agent_colab import launch_colab
        launch_colab()
    Or just run this file directly.
    """
    try:
        from pyngrok import ngrok
        public_url = ngrok.connect(port)
        print(f"\n  🌐  Public URL : {public_url}")
        print(f"  📖  Swagger UI : {public_url}/docs")
        print(f"  ❤   Health    : {public_url}/health\n")
    except ImportError:
        print(f"\n  ℹ  pyngrok not installed — access locally on http://localhost:{port}")
        print(f"  📖  Swagger UI : http://localhost:{port}/docs\n")

    uvicorn.run(app, host="0.0.0.0", port=port, log_level="warning")


# ════════════════════════════════════════════════════════════
#  8.  Quick CLI test  (no server needed)
# ════════════════════════════════════════════════════════════
def quick_test():
    """Runs a triage request directly without starting the server."""
    print("\n" + "═" * 60)
    print("  🏥  Clinical Triage Agent — Quick Test")
    print("═" * 60)
    agent.load()

    sample = TriageRequest(
        symptom_text        = "Severe chest pain radiating to left arm, sweating, nausea for 30 minutes",
        duration            = "30 minutes",
        severity_score      = 9,
        age                 = 68,
        known_conditions    = ["hypertension", "type 2 diabetes"],
        current_medications = ["metformin", "aspirin", "lisinopril"],
    )

    print("\n  🔍  Running triage …\n")
    result = agent.triage(sample)

    print("\n" + "═" * 60)
    print("  📋  TRIAGE RESULT")
    print("═" * 60)
    print(json.dumps(result, indent=2))
    print("═" * 60)

    print("\n  📡  EVENT LOG")
    print("─" * 60)
    for ev in agent.event_log:
        print(json.dumps(ev, indent=2))


# ════════════════════════════════════════════════════════════
#  Entry point
# ════════════════════════════════════════════════════════════
if __name__ == "__main__":
    import sys
    if "--test" in sys.argv:
        quick_test()
    else:
        launch_colab()