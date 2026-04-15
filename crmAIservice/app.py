from fastapi import FastAPI
from pydantic import BaseModel
import tensorflow as tf
import tensorflow_hub as hub
import pickle
import numpy as np

app = FastAPI()

# ── Load artifacts at startup ─────────────────────────────────────────────────
print("Loading model...")
model = tf.keras.models.load_model("intent_model.keras")

print("Loading USE encoder...")
embed = hub.load("https://tfhub.dev/google/universal-sentence-encoder/4")

print("Loading intent names...")
with open("intent_names.pkl", "rb") as f:
    intent_names = pickle.load(f)

print("Ready.")

# ── Contract (unchanged — Spring Boot safe) ───────────────────────────────────
# POST /predict
#   Request:  { "message": "..." }
#   Response: { "intent": "...", "confidence": 0.00 }

CONFIDENCE_THRESHOLD = 0.60

class MessageRequest(BaseModel):
    message: str

@app.post("/predict")
def predict(data: MessageRequest):
    if not data.message.strip():
        return {"error": "Empty message"}

    # Encode with USE — same pipeline used during training
    vector     = embed([data.message]).numpy()    # shape: (1, 512)
    prediction = model.predict(vector)

    predicted_index = int(np.argmax(prediction))
    confidence      = float(np.max(prediction))

    # Reject low-confidence predictions instead of returning a wrong label
    if confidence < CONFIDENCE_THRESHOLD:
        return {
            "intent": "out_of_scope",
            "confidence": round(confidence, 4)
        }

    return {
        "intent":     intent_names[predicted_index],
        "confidence": round(confidence, 4)
    }
