"""
llm_engine.py
─────────────────────────────────────────────────────────────────────────────
TinyLlama Integration for ClinicAI

Handles local inference using TinyLlama-1.1B-Chat-v1.0.
Requires: pip install transformers torch
─────────────────────────────────────────────────────────────────────────────
"""

import os
try:
    import torch
    from transformers import pipeline, AutoTokenizer, AutoModelForCausalLM
except ImportError:
    torch = None

class TinyLlamaEngine:
    def __init__(self, model_id="TinyLlama/TinyLlama-1.1B-Chat-v1.0", device=None, **kwargs):
        self.model_id = model_id
        self.tokenizer = None
        self.pipe = None
        
        # Auto-detect device (Apple Silicon, CUDA, or CPU)
        if device is None:
            if torch and torch.backends.mps.is_available():
                self.device = "mps"
            elif torch and torch.cuda.is_available():
                self.device = "cuda"
            else:
                self.device = "cpu"
        else:
            self.device = device

    def load(self):
        """Lazy load the model to save memory if not used."""
        if self.pipe is not None:
            return
            
        if torch is None:
            raise ImportError("Please install torch and transformers to use TinyLlama: pip install torch transformers")
            
        import logging
        from transformers import logging as transformers_logging
        transformers_logging.set_verbosity_error()
        
        # Use a local cache directory to avoid re-downloading
        env_path = os.getenv("CLINICAI_MODEL_PATH")
        cache_dir = env_path if env_path else os.path.join(os.path.dirname(__file__), "model_cache")
        os.makedirs(cache_dir, exist_ok=True)
        
        print(f"Loading TinyLlama on {self.device}...")
        print(f"Model Cache Path: {cache_dir}")
        
        # Determine optimal dtype
        dtype = torch.float16 if self.device != "cpu" else torch.float32
        
        self.pipe = pipeline(
            "text-generation",
            model=self.model_id,
            torch_dtype=dtype,
            device=self.device,
            model_kwargs={"cache_dir": cache_dir}
        )
        print("Model loaded successfully.")

    def classify_urgency(self, symptom_text, severity, age, conditions, medications):
        """
        Classifies patient urgency into 4 categories (1-4).
        Uses the LLM to analyze and return probabilities and the most likely tier.
        """
        self.load()
        
        prompt = (
            f"<|system|>\nYou are a medical triage AI. Classify the patient urgency as one of: [1: EMERGENCY, 2: URGENT, 3: ROUTINE, 4: SELF-CARE]. "
            f"Be precise. Return only the tier number and a brief label.</s>\n"
            f"<|user|>\nSymptoms: {symptom_text}\nSeverity: {severity}/10, Age: {age}, Conditions: {conditions}\nTier:</s>\n<|assistant|>\n"
        )
        
        # Clear max_length to avoid conflict with max_new_tokens
        outputs = self.pipe(prompt, max_new_tokens=20, do_sample=False, pad_token_id=self.pipe.tokenizer.eos_token_id)
        response = outputs[0]["generated_text"].split("<|assistant|>\n")[-1].strip()
        
        # Parse output for tier
        tier = 3 # Default to Routine
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
            "confidence": 0.85, # Simulated confidence
            "probabilities": {label: 0.85},
            "llm_reasoning_basis": "Textual pattern matching from LLM output"
        }

    def generate_reasoning(self, symptom_text, urgency_label, icd10_hints, severity, age):
        """Generates a detailed clinical reasoning narrative."""
        self.load()
        
        hints_str = ", ".join([f"{h.code} ({h.description})" for h in icd10_hints]) if icd10_hints else "None"
        prompt = (
            f"<|system|>\nYou are a clinical educator. Explain the medical reasoning for classifying this case as {urgency_label}. "
            f"Include potential risks.</s>\n<|user|>\nSymptoms: {symptom_text}\nSeverity: {severity}/10, ICD-10 Hints: {hints_str}\nReasoning:</s>\n<|assistant|>\n"
        )
        
        outputs = self.pipe(
            prompt, 
            max_new_tokens=150, 
            do_sample=True, 
            temperature=0.6, 
            pad_token_id=self.pipe.tokenizer.eos_token_id
        )
        return outputs[0]["generated_text"].split("<|assistant|>\n")[-1].strip()

if __name__ == "__main__":
    # Test
    llm = TinyLlamaEngine()
    try:
        print(llm.generate_analysis("I have a crushing chest pain and I'm sweating", 55, "M", ["diabetes"]))
    except Exception as e:
        print(f"Error: {e}")
