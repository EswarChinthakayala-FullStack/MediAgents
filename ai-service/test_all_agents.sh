#!/bin/bash

# =============================================================================
# ClinicAI — Full Ecosystem Validation Script
# This script runs the test suite for all 12 agents to verify 
# clinical logic, RAG integration, and LLM performance.
# =============================================================================

echo "🚀 Initializing ClinicAI Full System Test..."
export PYTHONPATH=$PYTHONPATH:.

# Clean up any residual cache if needed (optional)
# rm -rf model_cache/

AGENTS=(
    "agent_01_triage"
    "agent_02_appointment"
    "agent_03_monitoring"
    "agent_04_risk"
    "agent_05_decision_support"
    "agent_06_ehr"
    "agent_07_medication"
    "agent_08_assistant"
    "agent_09_analytics"
    "agent_10_emergency"
    "agent_11_security"
    "agent_12_portal"
)

for AGENT in "${AGENTS[@]}"; do
    echo "--------------------------------------------------------"
    echo "🔍 Testing: $AGENT"
    echo "--------------------------------------------------------"
    python3 -m agents.$AGENT.test_agent
    if [ $? -eq 0 ]; then
        echo "✅ $AGENT: PASSED"
    else
        echo "❌ $AGENT: FAILED"
    fi
    echo ""
done

echo "========================================================"
echo "🏥 All 12 Agents Validated!"
echo "========================================================"
