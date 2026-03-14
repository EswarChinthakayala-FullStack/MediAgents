# 🌐 Detailed AWS Deployment Guide: ClinicAI 12-Agent Ecosystem

This guide provides a step-by-step walkthrough to deploy the 12-agent ClinicAI platform to AWS using **Amazon ECS (Elastic Container Service)** with **EC2 GPU Instances**.

---

## 📋 Prerequisites
1.  **AWS Account**: Active account with permissions for IAM, ECR, ECS, EC2, and VPC.
2.  **AWS CLI**: Installed and configured (`aws configure`).
3.  **Docker**: Installed and running on your local machine.
4.  **Hardware**: The AI agents require GPU instances (e.g., `g4dn.xlarge`) for reasonable inference speeds.

---

## 🛠️ Step 1: Network Infrastructure (VPC & Security Groups)
We need a secure environment where agents can talk to each other but only the Portal and Assistant are exposed to the public.

1.  **Create a VPC**: Go to VPC Dashboard -> "Create VPC" -> "VPC and more". Use a CIDR block like `10.0.0.0/16`.
2.  **Create Security Groups**:
    *   **`ClinicAI-Internal-SG`**: 
        *   Inbound: Allow all traffic from itself (Self-referencing).
        *   Allow ports `8001-8012` from the `ClinicAI-ALB-SG`.
    *   **`ClinicAI-ALB-SG`**:
        *   Inbound: Allow `80` (HTTP) and `443` (HTTPS) from `0.0.0.0/0`.

---

## 📦 Step 2: Container Registry (Amazon ECR)
We will use a single repository to store our multi-purpose image.

1.  **Create Repository**:
    ```bash
    aws ecr create-repository --repository-name clinic-ai-master
    ```
2.  **Login to ECR**:
    ```bash
    aws ecr get-login-password --region <your-region> | docker login --username AWS --password-stdin <aws_account_id>.dkr.ecr.<your-region>.amazonaws.com
    ```
3.  **Build and Push**:
    ```bash
    # Build the image locally
    docker build -t clinic-ai-master .

    # Tag it
    docker tag clinic-ai-master:latest <aws_account_id>.dkr.ecr.<your-region>.amazonaws.com/clinic-ai-master:latest

    # Push to AWS
    docker push <aws_account_id>.dkr.ecr.<your-region>.amazonaws.com/clinic-ai-master:latest
    ```

---

## 🏗️ Step 3: Cluster & GPU Instance Setup
1.  **Create ECS Cluster**: Go to ECS -> "Clusters" -> "Create Cluster".
    *   Choose "Amazon EC2 Instances".
    *   **Instance Type**: `g4dn.xlarge` (NVIDIA T4 GPU) or `g5.xlarge`.
    *   **Desired Capacity**: 2-3 instances depending on how many agents you run simultaneously.
2.  **Model Cache Persistence**:
    *   Create an **Amazon EFS (Elastic File System)**.
    *   Mount it to your ECS instances at `/mnt/models`. This ensures TinyLlama isn't downloaded 12 times.

---

## 📜 Step 4: Create ECS Task Definitions
You will create 12 Task Definitions (or one template for all).

1.  **Create Task Definition**: ECS -> "Task Definitions" -> "Create new Task Definition (JSON)".
2.  **Configuration (Agent 01 Example)**:
    *   **Memory/CPU**: 4GB RAM / 2 vCPU.
    *   **Environment Variables**:
        *   `AGENT_MODULE`: `agents.agent_01_triage.main`
        *   `PORT`: `8001`
        *   `CLINICAI_MODEL_PATH`: `/mnt/models/tinyllama` (from EFS)
    *   **GPU Support**: Enable GPU and set `value: 1`.
    *   **Mount Points**: Map Source Volume `efs-models` to Container Path `/mnt/models`.

---

## 🚦 Step 5: Application Load Balancer (ALB)
1.  **Create ALB**: Go to EC2 -> "Load Balancers" -> "Create Application Load Balancer".
2.  **Listeners**:
    *   Port 80 (HTTP) -> Redirect to 443 (HTTPS recommended).
3.  **Target Groups**:
    *   Create a Target Group for each "Public" agent (Port `8012` for Portal, `8008` for Assistant).
    *   Other agents (`8001-8011`) are accessed internally via the **Service Discovery** (see next step).

---

## 🔗 Step 6: Deploy Services & Service Discovery
1.  **Cloud Map (Service Discovery)**:
    *   Create a Private DNS Namespace (e.g., `clinicai.local`).
    *   Each ECS service will register itself (e.g., `triage.clinicai.local`).
2.  **Create Services**: 
    *   For each of the 12 agents, create a "Service" in ECS using the Task Definitions created in Step 4.
    *   **Service Type**: Replica.
    *   **Network**: Select the Private Subnets and `ClinicAI-Internal-SG`.

---

## 📈 Step 7: Monitoring & Scaling
1.  **CloudWatch Logs**: Every agent is already configured to stream logs to CloudWatch.
2.  **Scaling Policies**:
    *   Create a metric for **GPU Utilization**.
    *   Set the service to scale up if GPU usage > 70% for more than 5 minutes.

---

## ⚡ Summary of Commands
| Action | Command |
| :--- | :--- |
| **Build** | `docker build -t clinic-ai-master .` |
| **Login** | `aws ecr get-login-password` |
| **Push** | `docker push <account>.dkr.ecr.<region>.amazonaws.com/clinic-ai-master` |
| **Restart Services** | `aws ecs update-service --cluster clinic-cluster --service agent-01 --force-new-deployment` |

---

## 🚑 Troubleshooting
- **Agent not starting?** Check if the EFS volume is mounted correctly.
- **AI responses slow?** Check if the GPU is being utilized (`nvidia-smi` inside container).
- **Communication Error?** Ensure Port `8011` (Security) is reachable by all other services via Service Discovery.
