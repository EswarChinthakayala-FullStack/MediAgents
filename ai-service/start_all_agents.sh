#!/bin/bash

# =============================================================================
# ClinicAI — Local Server Startup Script (Fixed Memory Management)
# This script starts the centralized LLM agent (13) first, then all others.
# This prevents memory exhaustion/crashes by sharing one model instance.
# =============================================================================

echo "🚀 Starting ClinicAI Ecosystem with Centralized LLM..."
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
cd "$SCRIPT_DIR"
export PYTHONPATH=$PYTHONPATH:.

# Use venv python if it exists
if [ -d "venv" ]; then
    PYTHON_EXEC="./venv/bin/python3"
else
    PYTHON_EXEC="python3"
fi

# Create a logs directory if it doesn't exist
mkdir -p logs

# 1. START THE CENTRAL LLM SERVICE FIRST
echo "🧠 Starting Centralized LLM Service (Agent 13) on port 8013..."
echo "Please wait, model loading will take ~20-30 seconds..."
export IS_LLM_SERVER="true"
$PYTHON_EXEC -m agents.agent_13_llm.main > "logs/agent_13_llm.log" 2>&1 &
echo $! > "logs/agent_13_llm.pid"

# Give the LLM service some time to initialize weights (avoid early connection failures)
sleep 15
export IS_LLM_SERVER="false"
export CLINICAI_LLM_URL="http://localhost:8013"

# 2. START THE REST OF THE AGENTS
AGENTS=(
    "agent_00_orchestrator:8000"
    "agent_01_triage:8001"
    "agent_02_appointment:8002"
    "agent_03_monitoring:8003"
    "agent_04_risk:8004"
    "agent_05_decision_support:8005"
    "agent_06_ehr:8006"
    "agent_07_medication:8007"
    "agent_08_assistant:8008"
    "agent_09_analytics:8009"
    "agent_10_emergency:8010"
    "agent_11_security:8011"
    "agent_12_portal:8012"
)

for ENTRY in "${AGENTS[@]}"; do
    AGENT=${ENTRY%%:*}
    PORT=${ENTRY#*:}
    echo "📻 Starting $AGENT on port $PORT..."
    $PYTHON_EXEC -m agents.$AGENT.main > "logs/${AGENT}.log" 2>&1 &
    echo $! > "logs/${AGENT}.pid"
done

echo "========================================================"
echo "🏥 All 13 Agents are starting in the background!"
echo "🧠 LLM Instance: 1 (Shared across all agents)"
echo "📄 Logs are available in the 'ai-service/logs/' directory."
echo "🔗 Triage Agent: http://localhost:8001"
echo "🛠️ To stop them, you can run: pkill -f 'agents.*.main'"
echo "========================================================"
