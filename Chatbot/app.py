"""
app.py
Flask microservice that serves the trained Hinglish intent classifier.
Node backend's chatbotRoutes.js proxies requests here.

Run from inside the Chatbot/ folder (after running train.py at least once):
    python app.py

Serves:
    POST /chat   { "message": "mera token status kya hai" }
    -> { "intent": "token_status", "confidence": 0.83, "reply": "..." }
"""

import os
import pickle
import random

from flask import Flask, request, jsonify
from flask_cors import CORS

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "model.pkl")
VECTORIZER_PATH = os.path.join(BASE_DIR, "vectorizer.pkl")
RESPONSES_PATH = os.path.join(BASE_DIR, "responses.pkl")

CONFIDENCE_THRESHOLD = 0.18

FALLBACK_REPLY = (
    "Maaf kijiye, main aapka sawal samajh nahi paya. Kripya thoda alag tarike se "
    "poochein, ya 'help' type karein options dekhne ke liye."
)

app = Flask(__name__)
CORS(app)  # allow the Node backend / React dev server to call this service

# Load model artifacts once at startup.
try:
    with open(MODEL_PATH, "rb") as f:
        model = pickle.load(f)
    with open(VECTORIZER_PATH, "rb") as f:
        vectorizer = pickle.load(f)
    with open(RESPONSES_PATH, "rb") as f:
        responses = pickle.load(f)
    print("Model, vectorizer and responses loaded successfully.")
except FileNotFoundError:
    model = None
    vectorizer = None
    responses = {}
    print(
        "WARNING: model.pkl / vectorizer.pkl / responses.pkl not found. "
        "Run train.py first before starting app.py."
    )


@app.route("/chat", methods=["POST"])
def chat():
    if model is None or vectorizer is None:
        return jsonify({
            "intent": None,
            "confidence": 0.0,
            "reply": "Chatbot model abhi load nahi hua. Pehle train.py chalayein.",
        }), 503

    data = request.get_json(silent=True) or {}
    message = (data.get("message") or "").strip()

    if not message:
        return jsonify({"error": "message field is required"}), 400

    X = vectorizer.transform([message.lower()])

    # predict_proba gives per-class probabilities; pick the top one.
    proba = model.predict_proba(X)[0]
    classes = model.classes_
    best_idx = proba.argmax()
    intent = classes[best_idx]
    confidence = float(proba[best_idx])

    if confidence < CONFIDENCE_THRESHOLD:
        return jsonify({
            "intent": None,
            "confidence": confidence,
            "reply": FALLBACK_REPLY,
        })

    reply_options = responses.get(intent, [FALLBACK_REPLY])
    reply = random.choice(reply_options)

    return jsonify({
        "intent": intent,
        "confidence": confidence,
        "reply": reply,
    })


@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok", "model_loaded": model is not None})


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5050, debug=True)