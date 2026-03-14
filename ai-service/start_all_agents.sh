#!/bin/bash

# =============================================================================
# ClinicAI — Local Server Startup Script (No Docker)
# This script starts all 12 agents as background processes.
# =============================================================================

echo "🚀 Starting all 12 ClinicAI agents locally..."
export PYTHONPATH=$PYTHONPATH:.

# Create a logs directory if it doesn't exist
mkdir -p logs

# Port configuration
AGENTS=(
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
    # Running in background and redirecting output to logs
    python3 -m agents.$AGENT.main > "logs/${AGENT}.log" 2>&1 &
    echo $! > "logs/${AGENT}.pid"
done

echo "========================================================"
echo "🏥 All 12 Agents are starting in the background!"
echo "📄 Logs are available in the 'ai-service/logs/' directory."
echo "🔗 Triage Agent: http://localhost:8001"
echo "🛠️ To stop them, you can run: pkill -f 'agents.*.main'"
echo "========================================================"
