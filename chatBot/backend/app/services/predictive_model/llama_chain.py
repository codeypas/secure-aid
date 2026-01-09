from transformers import AutoTokenizer, AutoModelForCausalLM, pipeline
from app.state import PREDICTION_CACHE
import traceback

model_id = "meta-llama/Llama-2-7b-chat-hf"  
tokenizer = AutoTokenizer.from_pretrained(model_id)
model = AutoModelForCausalLM.from_pretrained(model_id)

pipe = pipeline("text-generation", model=model, tokenizer=tokenizer)


def build_prompt(user_input):
    from app.state import refresh_predictions  
    if not PREDICTION_CACHE:
        print("[DEBUG] Cache is empty, refreshing predictions...")
        refresh_predictions()

    data = PREDICTION_CACHE
    try:
        sarima = data["SARIMA (mo)"]
        lstm = data["LSTM (day)"]
        floods = data["Floods (yr)"]
        warming = data["Trend"]["tavg"][-3:]
    except Exception as e:
        print("Error in build_prompt:", e)
        sarima = lstm = floods = warming = "Unavailable"

    return f"""
    You are a helpful assistant in a Disaster Management System.

    Based on the predictive forecast data:
    - SARIMA Forecast: {sarima}
    - LSTM Forecast: {lstm}
    - Flood Predictions: {floods}
    - Warming Trend: {warming}

    User query: {user_input}

    Answer:"""


def query_llama_with_summary(user_input: str) -> str:
    try:
        print("[DEBUG] Building full prompt...")
        full_prompt = build_prompt(user_input)
        print("[DEBUG] Prompt built:\n", full_prompt)
        #full_prompt = build_prompt(user_input)
        result = pipe(
            full_prompt,
            max_new_tokens=100,
            return_full_text=False,
            do_sample=True,
            temperature=0.8,
            truncation=True,
            pad_token_id=tokenizer.eos_token_id
        )[0]['generated_text']
        print("[DEBUG] Model output:\n", result)


        if "Answer:" in result:
            return result.split("Answer:")[-1].strip()
        return result.strip()

   

    except Exception as e:
        print("Error during chatbot generation:", e)
        traceback.print_exc()
        return "Sorry, an internal error occurred while generating the response."


