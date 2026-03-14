import os
import sys
import uuid
import pandas as pd
from typing import List, Dict, Any
from .models import AccessRequest, AccessDecision, SecurityAuditEntry

# Add parent path for LLM
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../..")))
from llm_engine import TinyLlamaEngine

class SecurityComplianceManager:
    def __init__(self):
        self.llm = TinyLlamaEngine()
        self.audit_buffer: List[SecurityAuditEntry] = []
        
        # RBAC Definitions
        self.role_permissions = {
            "Doctor": ["READ", "WRITE", "SUMMARY"],
            "Nurse": ["READ", "WRITE"],
            "Admin": ["READ", "ANALYTICS"],
            "Patient": ["READ"],
            "ExternalAgent": ["READ"]
        }
        
        # Resource constraints
        self.resource_roles = {
            "EHR_RECORD": ["Doctor", "Nurse", "Patient"],
            "VITAL_STREAM": ["Doctor", "Nurse"],
            "ANALYTICS": ["Admin"],
            "SECURITY_LOGS": ["Admin"]
        }

    def validate_access(self, request: AccessRequest) -> AccessDecision:
        request_id = str(uuid.uuid4())
        decision_str = "GRANTED"
        reason = "Access authorized by RBAC policy."
        flags = []
        
        # 1. RBAC Check
        if request.role not in self.role_permissions:
            decision_str = "DENIED"
            reason = f"Role '{request.role}' is not recognized."
        elif request.action not in self.role_permissions[request.role]:
            decision_str = "DENIED"
            reason = f"Role '{request.role}' does not have permission to perform '{request.action}'."
        elif request.resource in self.resource_roles and request.role not in self.resource_roles[request.resource]:
            decision_str = "DENIED"
            reason = f"Role '{request.role}' is not authorized to access '{request.resource}'."

        # 2. Simulated Anomaly Detection (e.g., Doctors shouldn't delete, midnight access)
        anomaly_score = 0.0
        if request.action == "DELETE":
            anomaly_score = 0.9
            flags.append("HIGH_RISK_ACTION: Delete attempted")
        
        # 3. LLM Compliance Reasoning (Async-style heuristic for decision support)
        if decision_str == "DENIED" or anomaly_score > 0.5:
            # We use LLM for complex cases or alerting
            print(f"[SECURITY ALERT] {reason}")
            
        decision = AccessDecision(
            request_id=request_id,
            decision=decision_str,
            reason=reason,
            compliance_flags=flags,
            anomaly_score=anomaly_score
        )

        # 4. Create immutable audit entry (buffered)
        self.audit_buffer.append(SecurityAuditEntry(
            audit_id=str(uuid.uuid4()),
            request=request,
            decision=decision
        ))
        
        return decision

    def generate_compliance_briefing(self) -> str:
        if not self.audit_buffer:
            return "No access logs recorded in this period."

        # Aggregate stats
        total = len(self.audit_buffer)
        denied = sum(1 for e in self.audit_buffer if e.decision.decision == "DENIED")
        anomalies = sum(1 for e in self.audit_buffer if e.decision.anomaly_score > 0.5)

        prompt = f"""<|system|>
You are a healthcare data compliance AI. Summarize the following security metrics in a brief executive narrative for a HIPAA/GDPR officer.
Total Access Requests: {total}
Total Denials: {denied}
Critical Anomalies: {anomalies}
</s>
<|user|>
Provide a professional compliance summary.
</s>
<|assistant|>
"""
        try:
            self.llm.load()
            outputs = self.llm.pipe(
                prompt,
                max_new_tokens=250,
                do_sample=False,
                pad_token_id=self.llm.pipe.tokenizer.eos_token_id
            )
            return outputs[0]["generated_text"].split("<|assistant|>")[-1].strip()
        except Exception as e:
            return f"Compliance Summary: {total} requests processed. {denied} denials. (LLM Report failed: {str(e)})"
