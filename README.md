# 🏥 MediAgents — Autonomous Healthcare Ecosystem

This is a comprehensive, multi-service platform for autonomous healthcare operations, featuring a 12-agent AI ecosystem, a patient-facing frontend, and a clinical backend.

## 🏗️ Project Structure

- **`ai-service/`**: The core AI layer with 12 specialized micro-agents running Local LLMs (TinyLlama).
- **`backend/`**: Flask-based clinical backend for data management and security.
- **`frontend/`**: React/Vite-based modern patient portal and doctor dashboard.

---

## 🚀 Getting Started

### 1. AI Service (The 12 Agents)
The AI agents handle triage, scheduling, monitoring, and more.
```bash
cd ai-service
# Follow instructions in ai-service/README.md for environment setup
./start_all_agents.sh
```
*For detailed instructions, see [ai-service/README.md](ai-service/README.md).*

> **🍎 Mac Users:** For Apple Silicon (M1/M2/M3), ensure you use `source venv/bin/activate` while inside the `ai-service` folder. The system will automatically use **MPS** (Metal Performance Shaders) for AI acceleration.

### 2. Backend (Clinical Data Layer)
```bash
cd backend
# Follow instructions in backend/README.md
python app.py
```

### 3. Frontend (User Interface)
```bash
cd frontend
npm install
npm run dev
```

---

## 🛠️ Global Startup
To get the entire system running for a full demo:

1.  **Start AI Agents**: Run `./ai-service/start_all_agents.sh`.
2.  **Start Backend**: Run `python backend/app.py`.
3.  **Start Frontend**: Run `npm run dev` inside the `frontend` directory.

---

## 📄 Documentation
- [AI Service Documentation](ai-service/README.md)
- [AWS Deployment Guide](ai-service/AWS_DEPLOYMENT.md)
- [Installation Guide](ai-service/INSTALL.md)
