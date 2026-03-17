"""
llm_engine.py (Optimized Client-Server Architecture)
─────────────────────────────────────────────────────────────────────────────
ClinicAI - Centralized Inference Integration

To prevent system crashes due to memory exhaustion, this engine now operates 
in "Remote Mode" by default, delegating heavy LLM inference to the 
Centralized LLM Service (Agent 13).
─────────────────────────────────────────────────────────────────────────────
"""

import os
import httpx
import time
import json
import logging

try:
    import torch
    from transformers import pipeline, AutoTokenizer
except ImportError:
    torch = None
    AutoTokenizer = None

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("LLMEngine")

class PipeProxy:
    """ Mimics transformers.pipeline behavior. """
    def __init__(self, engine, tokenizer=None):
        self._engine = engine
        self._tokenizer = tokenizer

    @property
    def tokenizer(self):
        if self._tokenizer is None:
            # Lazy load tokenizer even in remote mode (it's small)
            logger.info("Loading tokenizer locally for remote inference...")
            self._tokenizer = AutoTokenizer.from_pretrained(self._engine.model_id)
        return self._tokenizer

    def __call__(self, prompt, **kwargs):
        """ Call either the remote service or local pipeline. """
        if self._engine.is_server:
            # Use real local pipeline
            return self._engine._pipe_instance(prompt, **kwargs)
        
        # Remote execution: Extract common parameters
        max_new_tokens = kwargs.get("max_new_tokens", 128)
        do_sample = kwargs.get("do_sample", True)
        temperature = kwargs.get("temperature", 0.7)
        
        generated_text = self._engine._remote_generate(
            prompt, 
            max_new_tokens=max_new_tokens, 
            do_sample=do_sample, 
            temperature=temperature
        )
        
        # Return the structure transformers pipeline returns: [{"generated_text": "..."}]
        # Note: We append the prompt to generated_text to match pipeline behavior
        return [{"generated_text": prompt + generated_text}]

class TinyLlamaEngine:
    def __init__(self, model_id="TinyLlama/TinyLlama-1.1B-Chat-v1.0", device=None, **kwargs):
        self.model_id = model_id
        self._pipe_instance = None
        self._tokenizer = None
        self._pipe_proxy = None
        
        # Determine if we should run in Local or Remote mode
        self.remote_url = os.getenv("CLINICAI_LLM_URL", "http://localhost:8013")
        self.is_server = os.getenv("IS_LLM_SERVER", "false").lower() == "true"
        
        if self.is_server:
            if device is None:
                if torch and torch.backends.mps.is_available():
                    self.device = "mps"
                elif torch and torch.cuda.is_available():
                    self.device = "cuda"
                else:
                    self.device = "cpu"
            else:
                self.device = device
            logger.info(f"LLM Engine initialized in SERVER mode on {self.device}")
        else:
            logger.info(f"LLM Engine initialized in REMOTE mode (Target: {self.remote_url})")

    @property
    def pipe(self):
        """ Returns a proxy that looks like a transformers pipeline. """
        if self._pipe_proxy is None:
            if self.is_server:
                self.load()
                self._pipe_proxy = PipeProxy(self, tokenizer=self._pipe_instance.tokenizer)
            else:
                self._pipe_proxy = PipeProxy(self)
        return self._pipe_proxy

    def load(self):
        """Lazy load the model ONLY if in server mode."""
        if not self.is_server:
            return
            
        if self._pipe_instance is not None:
            return
            
        if torch is None:
            raise ImportError("Please install torch and transformers to use TinyLlama: pip install torch transformers")
            
        from transformers import logging as transformers_logging
        transformers_logging.set_verbosity_error()
        
        env_path = os.getenv("CLINICAI_MODEL_PATH")
        cache_dir = env_path if env_path else os.path.join(os.path.dirname(__file__), "model_cache")
        os.makedirs(cache_dir, exist_ok=True)
        
        dtype = torch.float16 if self.device != "cpu" else torch.float32
        
        logger.info(f"Loading weights on {self.device}...")
        self._pipe_instance = pipeline(
            "text-generation",
            model=self.model_id,
            torch_dtype=dtype,
            device=self.device,
            model_kwargs={"cache_dir": cache_dir}
        )
        logger.info("Model loaded successfully into memory.")

    def _remote_generate(self, prompt, max_new_tokens=128, do_sample=True, temperature=0.7):
        """Internal helper to call the remote LLM service."""
        try:
            with httpx.Client(timeout=60.0) as client:
                response = client.post(
                    f"{self.remote_url}/generate",
                    json={
                        "prompt": prompt,
                        "max_new_tokens": max_new_tokens,
                        "do_sample": do_sample,
                        "temperature": temperature
                    }
                )
                if response.status_code == 200:
                    return response.json()["generated_text"]
                else:
                    logger.error(f"Remote LLM error: {response.text}")
                    return f"Error: LLM service returned {response.status_code}"
        except Exception as e:
            logger.error(f"Failed to connect to LLM service: {e}")
            return f"Error: Could not reach LLM Service at {self.remote_url}. Is it running?"

    def classify_urgency(self, symptom_text, severity, age, conditions, medications):
        """ Compatibility method. """
        prompt = (
            f"<|system|>\nYou are a medical triage AI. Classify the patient urgency as one of: [1: EMERGENCY, 2: URGENT, 3: ROUTINE, 4: SELF-CARE]. "
            f"Be precise. Return only the tier number and a brief label.</s>\n"
            f"<|user|>\nSymptoms: {symptom_text}\nSeverity: {severity}/10, Age: {age}, Conditions: {conditions}\nTier:</s>\n<|assistant|>\n"
        )
        
        outputs = self.pipe(prompt, max_new_tokens=20, do_sample=False, pad_token_id=self.pipe.tokenizer.eos_token_id)
        response = outputs[0]["generated_text"].split("<|assistant|>\n")[-1].strip()
            
        tier = 3 
        label = "ROUTINE"
        
        if "1" in response or "EMERGENCY" in response.upper():
            tier, label = 1, "EMERGENCY"
        elif "2" in response or "URGENT" in response.upper():
            tier, label = 2, "URGENT"
        elif "4" in response or "SELF-CARE" in response.upper():
            tier, label = 4, "SELF-CARE"
            
        return {
            "urgency_tier": tier,
            "urgency_label": label,
            "confidence": 0.85,
            "probabilities": {label: 0.85},
            "llm_reasoning_basis": f"Generated via {'Local' if self.is_server else 'Remote'} LLM"
        }

    def generate_reasoning(self, symptom_text, urgency_label, icd10_hints, severity, age):
        """ Compatibility method. """
        hints_str = ", ".join([f"{h.code} ({h.description})" for h in icd10_hints]) if hasattr(icd10_hints, '__iter__') and not isinstance(icd10_hints, str) else str(icd10_hints)
        
        prompt = (
            f"<|system|>\nYou are a clinical educator. Explain the medical reasoning for classifying this case as {urgency_label}. "
            f"Include potential risks.</s>\n<|user|>\nSymptoms: {symptom_text}\nSeverity: {severity}/10, ICD-10 Hints: {hints_str}\nReasoning:</s>\n<|assistant|>\n"
        )
        
        outputs = self.pipe(prompt, max_new_tokens=150, do_sample=True, temperature=0.6, pad_token_id=self.pipe.tokenizer.eos_token_id)
        return outputs[0]["generated_text"].split("<|assistant|>\n")[-1].strip()

if __name__ == "__main__":
    llm = TinyLlamaEngine()
    print("Remote Mode initialization complete.")
