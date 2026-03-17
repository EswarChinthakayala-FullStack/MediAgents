import os
import sys
import time
from fastapi import FastAPI, HTTPException
from .models import InferenceRequest, InferenceResponse
import uvicorn

# Ensure the root path is in sys.path so we can import llm_engine
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../..")))

# Set environment variable before importing to force Server Mode
os.environ["IS_LLM_SERVER"] = "true"
from llm_engine import TinyLlamaEngine

app = FastAPI(title="ClinicAI - Centralized LLM Inference Service (13)")
engine = TinyLlamaEngine()

@app.on_event("startup")
def startup_event():
    """Load the model on startup instead of lazy loading to avoid cold-start delays on the first API call."""
    print("🚀 Initializing centralized LLM service weights...")
    engine.load()
    print("✅ LLM Core ready for inference requests.")

@app.get("/")
async def root():
    return {
        "agent": "13", 
        "name": "Centralized LLM Service", 
        "status": "online",
        "device": getattr(engine, 'device', 'unknown'),
        "model": engine.model_id
    }

@app.get("/health")
async def health():
    return {"status": "healthy", "agent": "13"}

@app.post("/generate", response_model=InferenceResponse)
async def generate(request: InferenceRequest):
    """
    Direct low-level inference endpoint.
    Used by all other agents to perform LLM tasks.
    """
    if not engine.pipe:
        raise HTTPException(status_code=503, detail="LLM Model not yet loaded.")
        
    try:
        t0 = time.time()
        
        # Call the underlying pipeline directly to save overhead
        # We manually handle the ChatML format from the prompt provided by the caller
        outputs = engine.pipe(
            request.prompt,
            max_new_tokens=request.max_new_tokens,
            do_sample=request.do_sample,
            temperature=request.temperature,
            top_p=request.top_p,
            top_k=request.top_k,
            pad_token_id=engine.pipe.tokenizer.eos_token_id
        )
        
        # Extract response - most callers use a split by <|assistant|>
        # But we'll return the full raw text after the prompt (the generated portion)
        # Note: pipeline with return_full_text=False is cleaner, but we'll stick to 
        # what the previous engine logic expected.
        
        raw_output = outputs[0]["generated_text"]
        
        # Strip the input prompt from the output
        generated_part = raw_output[len(request.prompt):].strip()
        
        elapsed = time.time() - t0
        
        return InferenceResponse(
            generated_text=generated_part,
            elapsed_time=elapsed
        )
    except Exception as e:
        print(f"❌ Inference Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8013)
