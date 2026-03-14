import os
import time
import sys
from llm_engine import TinyLlamaEngine

def clear_screen():
    os.system('cls' if os.name == 'nt' else 'clear')

def main():
    # Initialize the real engine
    print("\n" + "═" * 60)
    print("  🚀  TinyLlama-1.1B Text Generation Tester")
    print("  System: Local Inference (Apple Silicon/CUDA/CPU)")
    print("═" * 60)
    
    engine = TinyLlamaEngine()
    
    try:
        # Load the model explicitly for this test
        print("  [1/2] Initializing model...")
        engine.load()
        print("  [2/2] Model ready.")
    except Exception as e:
        print(f"\n  ❌ Error loading model: {e}")
        return

    print("\n  Type 'quit' or 'exit' to stop.")
    print("  Type 'clear' to reset terminal.")
    
    while True:
        try:
            prompt = input("\n  Prompt > ").strip()
            
            if prompt.lower() in ['quit', 'exit']:
                print("\n  Shutting down. Goodbye!\n")
                break
            
            if prompt.lower() == 'clear':
                clear_screen()
                continue
                
            if not prompt:
                continue

            print("\n  Generating response...", end="", flush=True)
            
            t0 = time.time()
            
            # Formulate a generic prompt for text generation
            # We use the ChatML format TinyLlama expects
            chat_prompt = (
                f"<|system|>\nYou are a helpful AI assistant.</s>\n"
                f"<|user|>\n{prompt}</s>\n<|assistant|>\n"
            )
            
            # Using the existing engine's pipe for generation
            outputs = engine.pipe(
                chat_prompt, 
                max_new_tokens=256, 
                do_sample=True, 
                temperature=0.7,
                top_k=50,
                top_p=0.95,
                pad_token_id=engine.pipe.tokenizer.eos_token_id
            )
            
            response = outputs[0]["generated_text"].split("<|assistant|>\n")[-1].strip()
            elapsed = time.time() - t0
            
            print(f"\r  ✅ Generated in {elapsed:.2f}s")
            print("─" * 60)
            print(f"\n{response}\n")
            print("─" * 60)

        except KeyboardInterrupt:
            print("\n  Exiting...")
            break
        except Exception as e:
            print(f"\n  ❌ Error: {e}")

if __name__ == "__main__":
    main()
