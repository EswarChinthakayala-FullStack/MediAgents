from pydantic import BaseModel
from typing import Optional, Dict, Any

class InferenceRequest(BaseModel):
    prompt: str
    max_new_tokens: Optional[int] = 128
    do_sample: Optional[bool] = True
    temperature: Optional[float] = 0.7
    top_p: Optional[float] = 0.95
    top_k: Optional[int] = 50

class InferenceResponse(BaseModel):
    generated_text: str
    elapsed_time: float
