from agents.agent_11_security.compliance_logic import SecurityComplianceManager
from agents.agent_11_security.models import AccessRequest

def test_security_agent():
    sec = SecurityComplianceManager()
    
    print("\n--- TEST 1: Authorized Doctor Access ---")
    req1 = AccessRequest(user_id="DOC-123", role="Doctor", resource="EHR_RECORD", action="READ", resource_id="PAT-001")
    res1 = sec.validate_access(req1)
    print(f"Decision: {res1.decision} | Reason: {res1.reason}")
    
    print("\n--- TEST 2: Unauthorized Patient Access to Analytics ---")
    req2 = AccessRequest(user_id="PAT-99", role="Patient", resource="ANALYTICS", action="READ")
    res2 = sec.validate_access(req2)
    print(f"Decision: {res2.decision} | Reason: {res2.reason}")
    
    print("\n--- TEST 3: High-Risk Action (Delete) ---")
    req3 = AccessRequest(user_id="ADMIN-1", role="Admin", resource="SECURITY_LOGS", action="DELETE")
    res3 = sec.validate_access(req3)
    print(f"Decision: {res3.decision} | Anomaly Score: {res3.anomaly_score}")
    
    print("\n--- Generating Compliance Report ---")
    briefing = sec.generate_compliance_briefing()
    print(f"\nFinal Compliance Briefing (TinyLlama):\n{briefing}")
    
    print(f"\nAudit Log Count: {len(sec.audit_buffer)}")

if __name__ == "__main__":
    test_security_agent()
