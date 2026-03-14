import os
import sys
import json
from typing import List, Dict, Any
from .models import PatientVitalsStream, MonitoringStatus, MonitoringAlert, VitalReading

# Add parent path for LLM
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../..")))
from llm_engine import TinyLlamaEngine

class VitalSignsAnalyzer:
    def __init__(self):
        self.llm = TinyLlamaEngine()
        
        # Clinical Thresholds
        self.thresholds = {
            "hr": {"low": 50, "high": 120},
            "bp_sys": {"high": 160, "low": 90},
            "sp_o2": {"low": 92},
            "temp": {"high": 38.5, "low": 35.5}
        }

    def analyze(self, stream: PatientVitalsStream) -> MonitoringStatus:
        latest = stream.readings[-1] if stream.readings else None
        if not latest:
            return MonitoringStatus(
                patient_id=stream.patient_id,
                current_status="Normal",
                trend_analysis="No data received.",
                alerts=[]
            )

        triggered = []
        status = "Normal"

        # Simple Anomaly Detection
        if latest.heart_rate and (latest.heart_rate > self.thresholds["hr"]["high"] or latest.heart_rate < self.thresholds["hr"]["low"]):
            triggered.append(f"Heart Rate: {latest.heart_rate}")
        if latest.sp_o2 and latest.sp_o2 < self.thresholds["sp_o2"]["low"]:
            triggered.append(f"SpO2: {latest.sp_o2}%")
            status = "Critical"
        if latest.blood_pressure_sys and latest.blood_pressure_sys > self.thresholds["bp_sys"]["high"]:
            triggered.append(f"Systolic BP: {latest.blood_pressure_sys}")
            
        if triggered and status != "Critical":
            status = "Warning"

        # LLM Trend Narrative
        trend_narrative = self._generate_trend_narrative(stream, triggered)

        alert = []
        if status != "Normal":
            alert.append(MonitoringAlert(
                patient_id=stream.patient_id,
                status=status,
                triggered_vitals=triggered,
                trend_summary=trend_narrative
            ))

        return MonitoringStatus(
            patient_id=stream.patient_id,
            current_status=status,
            trend_analysis=trend_narrative,
            alerts=alert
        )

    def _generate_trend_narrative(self, stream: PatientVitalsStream, triggered: List[str]) -> str:
        vitals_summary = ""
        for r in stream.readings[-5:]: # Look at last 5 readings
            vitals_summary += f"[{r.timestamp.strftime('%H:%M')}] HR: {r.heart_rate}, SpO2: {r.sp_o2}, BP: {r.blood_pressure_sys}/{r.blood_pressure_dia}\n"

        prompt = f"""<|system|>
You are a clinical vital signs monitoring AI. Analyze the following time-series vitals for patient {stream.patient_id}.
Identify deteriorating trends and cite specific values.
Status: {", ".join(triggered) if triggered else "Within normal limits"}
</s>
<|user|>
Data:
{vitals_summary}
Provide a concise clinical summary.
</s>
<|assistant|>
"""
        try:
            self.llm.load()
            outputs = self.llm.pipe(
                prompt,
                max_new_tokens=150,
                do_sample=False,
                pad_token_id=self.llm.pipe.tokenizer.eos_token_id
            )
            return outputs[0]["generated_text"].split("<|assistant|>")[-1].strip()
        except Exception as e:
            return f"Review required. Triggered: {triggered}. (Summary generation failed: {str(e)})"
