# 📦 Installation & Model Setup Guide

This guide will help you set up **MediAgents** on your laptop (HP Victus or similar) after unzipping the project.

---

## 1. Environment Setup

It is highly recommended to use a virtual environment to keep your system clean.

```bash
# Open your terminal in the MediAgents folder
python3 -m venv venv

# Activate the environment:
# On Windows (HP Victus):
venv\Scripts\activate
# On Mac/Linux:
source venv/bin/activate
```

## 2. Install Dependencies

Install the core libraries required for the project:

```bash
pip install torch transformers numpy
```

### 🏎️ For HP Victus Users (Enable NVIDIA GPU)
If you have an NVIDIA RTX card, you MUST install the CUDA version of Torch to avoid slow performance:

```bash
# Uninstall the default CPU version first
pip uninstall torch

# Install the GPU-accelerated version
pip install torch --index-url https://download.pytorch.org/whl/cu121
```

### 🍎 For Mac Users (Apple Silicon M1/M2/M3)
If you are using a Mac with Apple Silicon, you can leverage the GPU using **MPS**:

```bash
# Install the standard PyTorch (usually comes with MPS support)
pip install torch torchvision torchaudio
```
The system will automatically detect the device as `mps`.

---

## 3. How to Cache the Model

The project is designed to **automatically handle model caching**. You don't need to manually download weight files.

### The First Run
The first time you run any script (like `test_generation.py`), the system will:
1.  Connect to HuggingFace.
2.  Download the **TinyLlama-1.1B-Chat-v1.0** weights (approx. 2.2GB).
3.  Save them into the `model_cache/` folder in your project directory.

**To trigger the caching process immediately:**
```bash
python test_generation.py
```
*Wait for the progress bar to hit 100%. Once done, the model is "Cached" and you can run the project **offline** in the future.*

---

## 4. Running the Project

### 🩺 Scenario 1: Triage Demo
Run the clinical triage engine with pre-set medical cases:
```bash
python llm/demo_llm.py
```

### 💬 Scenario 2: Interactive Triage
Type in your own symptoms and get an AI classification:
```bash
python llm/demo_llm.py --interactive
```

### 📝 Scenario 3: Text Generation (Fast Testing)
Test the raw TinyLlama model for general conversation:
```bash
python test_generation.py
```

---

## 🔧 Troubleshooting

### "The model is taking 1 minute to respond"
- **Cause**: The system is running on your CPU instead of your GPU.
- **Fix**: Check the `llm_engine.py` output. It should say `Loading TinyLlama on cuda` (for Victus) or `mps` (for Mac). If it says `cpu`, follow the GPU Fix in Section 2.

### "Out of Memory (OOM)"
- **Fix**: Close other apps (Chrome/Games) to free up VRAM. TinyLlama only needs ~2-3GB of VRAM, which any RTX card can handle easily.
