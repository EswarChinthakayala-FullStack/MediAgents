# 🏥 ClinicAI — The 12-Agent Autonomous Healthcare Ecosystem

ClinicAI is a state-of-the-art, decentralized medical agentic system designed to handle the entire lifecycle of a clinical patient journey. From initial symptom triage to real-time vital monitoring and population-scale health analytics, ClinicAI leverages **Local LLMs (TinyLlama)** and **Standardized FHIR-like Data Layers** to provide secure, autonomous healthcare operations.

---

## 🏗️ The 12-Agent Architecture

The platform is composed of 12 specialized micro-agents, each running on its own dedicated port:

| ID | Agent Name | Core Responsibility | Port |
|:---|:---|:---|:---|
| **00** | **Master Orchestrator** | Central clinical pipeline coordinator. | `8000` |
| **01** | **Symptom Triage** | Classify urgency using RAG & clinical rules. | `8001` |
| **02** | **Appointment Scheduler** | Dynamic scheduling based on clinical priority. | `8002` |
| **03** | **Continuous Monitoring** | Real-time vital signs ingestion and anomaly detection. | `8003` |
| **04** | **Predictive Risk** | DETECT deterioration and readmission risks via ML/SBAR. | `8004` |
| **05** | **Decision Support** | Doctor co-pilot for guidelines and drug interactions. | `8005` |
| **06** | **Smart EHR** | Centralized patient record management & clinical auditing. | `8006` |
| **07** | **Medication Mgmt** | Adherence tracking and automated patient refills. | `8007` |
| **08** | **Health Assistant** | 24/7 Conversational AI for patient queries (Chat). | `8008` |
| **09** | **Population Analytics** | Cohort-level disease trends and resource insights. | `8009` |
| **10** | **Emergency Alert** | Real-time dispatcher for life-threatening events. | `8010` |
| **11** | **Security & Privacy** | RBAC enforcement and HIPAA/GDPR compliance auditing. | `8011` |
| **12** | **Patient Portal** | Multi-channel notifications and patient-facing UI. | `8012` |

---

## 🗺️ Agent Dependency Map

The following matrix represents how agents interact. A checkmark (✓) indicates that the **Row Agent** either calls a REST endpoint of, or subscribes to a Redis Stream from, the **Column Agent**.

| FROM \ TO | 01 | 02 | 03 | 04 | 05 | 06 | 07 | 08 | 09 | 10 | 11 | 12 |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **01 Triage** | · | ✓ | · | · | · | ✓ | · | · | · | ✓ | · | · |
| **02 Appt** | · | · | · | · | · | ✓ | · | · | · | · | · | ✓ |
| **03 Monitor** | · | · | · | ✓ | · | ✓ | · | · | · | ✓ | · | · |
| **04 Risk** | · | · | · | · | ✓ | ✓ | · | · | ✓ | ✓ | · | · |
| **05 Decision** | · | · | · | · | · | ✓ | · | · | · | · | · | · |
| **06 EHR** | · | · | · | · | · | · | · | · | ✓ | · | · | · |
| **07 Meds** | · | · | · | · | ✓ | ✓ | · | · | · | ✓ | · | ✓ |
| **08 Chat** | ✓ | ✓ | · | · | · | ✓ | · | · | · | ✓ | · | · |
| **09 Analytics** | · | · | · | · | · | ✓ | · | · | · | · | · | · |
| **10 Alert** | · | · | · | · | · | ✓ | · | · | · | · | · | ✓ |
| **11 Security** | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | · | ✓ |
| **12 Notify** | · | · | · | · | · | ✓ | · | · | · | · | · | · |

---

---

## 🚀 Quick Start & Installation

### 1. Prerequisites
- **Python 3.10+** (Recommend 3.11 or 3.12)
- **RAM**: 8GB Minimum (16GB+ recommended for running multiple local LLMs)
- **Disk**: 5GB for models and database storage.
- **Redis**: Required for the Master Event Bus Topology (Agents communication).

### 2. Setup Environment
```bash
# Clone the repository
git clone https://github.com/EswarChinthakayala-FullStack/MediAgents.git
cd MediAgents

# Create and activate virtual environment
python3 -m venv .venv
source venv/bin/activate
# Install Core Dependencies
pip install -r requirements.txt
```

### 3. Model Initialization
ClinicAI uses **TinyLlama-1.1B** for offline, privacy-preserving inference. The model will automatically download to `model_cache/` on the first run of any agent.

### 4. GPU Acceleration (NVIDIA / Windows)
To leverage an NVIDIA GPU on Windows for faster inference, ensure you have the CUDA-enabled version of PyTorch:

```bash
# Uninstall existing torch
pip uninstall torch

# Install Torch with CUDA 12.1 support (Example)
pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu121
```

The system will automatically detect `cuda` and switch from CPU to GPU mode.

### 5. GPU Acceleration (macOS — Apple Silicon M1/M2/M3)
For Mac users with Apple Silicon, the system uses **MPS (Metal Performance Shaders)** for acceleration. 

1. **Install PyTorch**:
   The standard Torch installation usually includes MPS support.
   ```bash
   pip install torch torchvision torchaudio
   ```
2. **Verification**:
   The system will automatically output `Loading TinyLlama on mps...` if acceleration is enabled. Ensure you are running Python 3.10+ on macOS 12.3+.

### 6. Customizing Model Path
You can change where the LLM models are stored by setting the `CLINICAI_MODEL_PATH` environment variable:

```bash
# Linux/Mac
export CLINICAI_MODEL_PATH="/path/to/your/models"

# Windows (PowerShell)
$env:CLINICAI_MODEL_PATH="C:\path\to\your\models"
```

---

## 🛠️ How to Run & Use

### Running Individual Agents
Every agent is a standalone FastAPI service. To start the **Symptom Triage Agent**:
```bash
export PYTHONPATH=$PYTHONPATH:.
python3 -m agents.agent_01_triage.main
```

### 🚀 Starting All Servers
To start all 12 agents simultaneously, you can use the provided automation scripts:

#### Method 1: Using Shell Script (Recommended for Development)
This will start all agents in the background and log their output to the `logs/` directory.
Make sure your virtual environment is activated.

```bash
# Activate environment (if not already)
source venv/bin/activate

# Give execution permission
chmod +x start_all_agents.sh

# Run the startup script
./start_all_agents.sh
```

#### Method 2: Using Docker Compose
If you have Docker installed, you can containerize the entire ecosystem:
```bash
docker-compose up --build
```

### 🛑 Stopping the Servers
If you used the shell script, you can stop all agents with:
```bash
pkill -f 'agents.*.main'
```
If you used Docker, simply run:
```bash
docker-compose down
```

### Integrating Everything
The agents are designed to communicate via REST APIs.
- **Data Flow**: Agent 01 (Triage) sends results to Agent 02 (Appointment). 
- **Security**: Every cross-agent call should be validated by Agent 11 (Security).
- **Communication**: Agent 10 (Alert) triggers Agent 12 (Portal) for patient reach-outs.

---

## 🧪 Validating the System

Every agent comes with a dedicated `test_agent.py` script. To verify the **Emergency Alert Agent (10)**:
```bash
export PYTHONPATH=$PYTHONPATH:.
python3 -m agents.agent_10_emergency.test_agent
```

To run a full system check, you can run all test scripts in sequence to verify local model performance and logic integrity.

---

## 📦 What to Install (Updated Requirements)

Ensure your `requirements.txt` includes:
- **`fastapi`**, **`uvicorn`**: For Agent APIs.
- **`pydantic`**: For data modeling (FHIR-aligned).
- **`torch`**, **`transformers`**: For the TinyLlama inference engine.
- **`chromadb`**, **`sentence-transformers`**: For the RAG (Retrieval-Augmented Generation) layer.
- **`pandas`**: For Population Analytics (Agent 09).
- **`scikit-learn`**: For Predictive Risk Analytics (Agent 04).

---

## 🔒 Security & Privacy
ClinicAI is built for **Privacy-First Healthcare**:
1. **Local Inference**: All clinical reasoning happens on *your* hardware. No patient data leaves the premise to OpenAI/Anthropic.
2. **Immutable Auditing**: Every data access is logged by Agent 11 and can be reviewed by a compliance officer.
3. **RBAC**: Role-Based Access ensures only doctors see EHRs, while admins see only de-identified population data.

---

## 🌐 AWS Deployment Plan

For a complete, step-by-step technical walkthrough of deploying ClinicAI to AWS (covering VPC, ECR, ECS, GPUs, and Service Discovery), please refer to the:
👉 **[Detailed AWS Deployment Guide](AWS_DEPLOYMENT.md)**

### 1. Compute & Orchestration
- **AWS ECS (Elastic Container Service)**: Use Fargate for control-plane agents (Appointment, EHR, Security) and **EC2 GPU Instances (G4dn or G5)** for AI-heavy agents (Triage, Assistant, Decision Support).
- **Auto-Scaling**: Configure scaling policies based on CPU/GPU utilization to handle surge clinical loads.

### 2. Model Hosting
- **Amazon SageMaker**: Alternatively, host the TinyLlama model as a SageMaker Endpoint for high-availability inference.
- **EBS Volumes**: Use high-speed GP3 volumes to store the `model_cache`.

### 3. Data & Security
- **Amazon RDS (PostgreSQL)**: Centralized storage for Agent 06 (EHR) and Agent 11 (Security Audit Logs).
- **AWS Secrets Manager**: Manage API keys and JWT secrets.
- **AWS App Mesh**: For secure, observable communication between all 12 agents.
- **AWS API Gateway**: A single entry point for the Patient Portal and Doctor Dashboard.

---

## 📡 Communication Patterns

ClinicAI uses a hybrid communication strategy to ensure reliability, visibility, and high performance.

| Pattern | Mechanism | Example |
|:---|:---|:---|
| **Event-driven** | Agent publishes to **Redis Streams**; subscribers react async. | `triage_result` → Appointment Agent |
| **Request-Response**| Sync **REST calls** (FastAPI) for direct orchestration. | Frontend → Triage Agent POST `/triage` |
| **Shared Memory** | Agents read/write a **Patient Context Object** (JSON) in Redis. | `bus.set_context("PT-101", {...})` |

---

## 🎬 Clinical Scenarios

### 2.2 Scenario: New Patient Symptom Submission
This is the end-to-end flow from patient form submission to doctor pre-briefing:

1.  **Patient Portal (Agent 12)**: Patient submits symptom form → Portal Agent calls Orchestrator `POST /orchestrate`.
2.  **Orchestrator (Agent 00)**: Fetches EHR context (GET /record/{id}), invokes Triage Agent (POST /triage).
3.  **Triage Agent (01)**: Runs RAG guidelines + ICD-10 check → Publishes `triage_result` to Redis.
4.  **Alert Agent (10)**: Subscribes to `triage_result`. If Emergency → Fires push notification/SMS.
5.  **Appointment Agent (02)**: Subscribes to `triage_result` → schedules optimal slot → publishes `appointment_scheduled`.
6.  **EHR Agent (06)**: Subscribes to results → writes to patient record → updates Redis context.
7.  **Notification Agent (12)**: Subscribes to `appointment_scheduled` → sends confirmation to patient.
8.  **Decision Support (05)**: Subscribes to `triage_result` → fetches EHR → pushes advisory to Doctor Dashboard via WebSocket.
9.  **Risk Agent (04)**: Calculates risk score using history + triage → publishes `risk_score_updated` → stored in context.

### 2.3 Scenario: Chronic Patient Vital Alert
End-to-end flow for deteriorating patients:

1.  **Monitoring (03)**: Anomaly detected (e.g., SpO2 < 92%) → Publishes `vital_alert` to Redis.
2.  **Emergency (10)**: Receives alert → Sends Physician Notification → Starts **2-minute escalation timer**.
3.  **Risk (04)**: Receives alert → Re-scores patient mortality/deterioration risk → Publishes `risk_score_updated`.
4.  **Decision Support (05)**: Receives risk update → Prepares intervention options → Pushes to Doctor Dashboard.
5.  **EHR (06)**: Receives alert → Logs timestamped clinical event → Updates shared context.
6.  **Monitoring (03)**: Automatically switches to **10-second high-frequency polling** for the affected patient.
7.  **Emergency (10)**: If no acknowledgement within 2 mins → Escalates to Senior Staff + Auto-recommends ambulance dispatch.

---

## 🔌 API Usage & Integration

All agents expose RESTful endpoints. The global pattern is `http://<agent-ip>:<port>/<endpoint>`.

### Common Endpoints:
- **GET `/`**: Health check.
- **POST `/validate`**: (Security Agent) Intercepts all requests.
- **POST `/trigger`**: (Emergency Agent) Initiates a crisis flow.

### Integration Example (Python):
```python
import requests

# 1. Triage a patient
triage_data = {"symptom_text": "Severe chest pain", "severity": 9, "age": 45}
response = requests.post("http://localhost:8001/triage", json=triage_data)
triage_result = response.json()

# 2. If Triage Tier is 1, trigger Emergency Alert
if triage_result['urgency_tier'] == 1:
    alert_payload = {
        "patient_id": "P-101",
        "source_agent": "Triage",
        "severity": "CRITICAL",
        "event_details": triage_result['triage_summary']
    }
    requests.post("http://localhost:8010/trigger", json=alert_payload)
```

---

## 📄 Integration Guide
Integration between agents happens via the standard medical data formats defined in `/agents/agent_06_ehr/models.py`. 

- **To connect a new agent**: Use the Pydantic models to ensure your data is "ClinicAI Native".
- **To add external APIs**: Use the provided `requests` or `httpx` patterns found in the `Main.py` files of each agent directory.
