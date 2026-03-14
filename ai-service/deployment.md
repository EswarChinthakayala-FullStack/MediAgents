# 🚀 ClinicAI Deployment Guide

Efficiently managing a 12-agent microservice architecture doesn't require 12 physical servers. This guide outlines how to scale ClinicAI from a local development environment to a production hospital deployment.

---

## 🏗️ Deployment Strategies

### 1. Local Development (Single Machine)
You can run the entire ecosystem on a single workstation or laptop.
*   **Networking**: All agents communicate via `localhost` using their unique assigned ports (`8001`-`8012`).
*   **Hardware Requirement**: 
    *   **RAM**: 16GB Minimum (to handle concurrent LLM loads).
    *   **CPU**: 8-Core modern processor.
    *   **GPU**: Apple Silicon (M1/M2/M3) or NVIDIA GPU (8GB+ VRAM) is highly recommended for real-time AI performance.

### 2. Standard Production (Docker Compose)
Using Docker allows you to wrap each agent into a lightweight container.
*   **Efficiency**: Containers share the host OS kernel, making them much lighter than Virtual Machines.
*   **Scaling**: You can host all 12 containers on **one powerful server** (e.g., An AWS EC2 `g5.4xlarge` instance).
*   **Example Layout**:
    *   **Server A (The Brain)**: 1x NVIDIA GPU Server running all 12 agents.

### 3. High Availability (Cluster / Cloud)
For hospital-grade reliability, use an orchestrator like **AWS ECS** or **Kubernetes**.
*   **Resource Grouping**: Group agents onto nodes based on their hardware needs:
    *   **AI Group (GPU Nodes)**: Triage, Assistant, Decision Support, Risk.
    *   **Data Group (High Memory Nodes)**: EHR, Analytics, Security.
    *   **Logic Group (General Nodes)**: Appointment, Medication, Portal, Emergency Alert, Monitoring.

---

## 🖥️ Recommended Hardware Specs

| Scale | Recommended Hardware | Setup |
| :--- | :--- | :--- |
| **Individual/Dev** | 16GB RAM, Apple M-Series or RTX 3060 | Local Python Env |
| **Small Clinic** | 32GB RAM, 1x NVIDIA RTX 4090 / A4000 | Docker Compose |
| **Large Hospital** | AWS Cluster (G5 & M6i instances) | Kubernetes / ECS |

---

## 🛰️ Infrastructure Configuration

### Environment Variables
Configure your agents across any environment using a `.env` file or system variables:

```bash
# Point agents to the central Security Guard
SECURITY_AGENT_URL="http://security-service:8011"

# Point to the central EHR Data Layer
EHR_AGENT_URL="http://ehr-service:8006"

# Set valid model cache path
CLINICAI_MODEL_PATH="/mnt/models/tinyllama"
```

### Port Mapping Summary
If running on a single server, ensure these ports are open in your fireplace/security groups:
`8001` (Triage), `8002` (Appt), `8003` (Monitor), `8004` (Risk), `8005` (Support), `8006` (EHR), `8007` (Medication), `8008` (Chat), `8009` (Analytics), `8010` (Emergency), `8011` (Security), `8012` (Portal).

---

## 🔒 Security Note
In production:
1.  **Always** use HTTPS (TLS 1.3).
2.  **Never** expose ports 8001-8011 directly to the internet.
3.  **Only** expose Port `8012` (Portal) and Port `8008` (Chat) via an API Gateway or Load Balancer.
