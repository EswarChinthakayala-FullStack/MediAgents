# Optimized Multi-Agent Dockerfile
# This single Dockerfile can run any of the 12 agents via the AGENT_PATH env var.

FROM python:3.11-slim

# Prevent python from buffering logs
ENV PYTHONUNBUFFERED=1
ENV PYTHONDONTWRITEBYTECODE=1

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copy only requirements first to leverage Docker cache
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the entire project
COPY . .

# Default environment variables
ENV PYTHONPATH="/app"
ENV AGENT_MODULE="agents.agent_01_triage.main"
ENV PORT=8001

# Run the agent using the module path provided in the environment
CMD python3 -m ${AGENT_MODULE}
