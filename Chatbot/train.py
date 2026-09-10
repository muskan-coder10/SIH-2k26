"""
train.py
Trains a TF-IDF + Logistic Regression intent classifier for the ANNDISHA
Hinglish farmer chatbot, using Chatbot/intents.json as training data.

Run from inside the Chatbot/ folder:
    python train.py

Produces (in the same folder):
    model.pkl        -> trained LogisticRegression classifier
    vectorizer.pkl   -> fitted TfidfVectorizer
    responses.pkl    -> dict mapping intent tag -> list of response strings
"""

import json
import pickle
import os

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
INTENTS_PATH = os.path.join(BASE_DIR, "intents.json")

MODEL_PATH = os.path.join(BASE_DIR, "model.pkl")
VECTORIZER_PATH = os.path.join(BASE_DIR, "vectorizer.pkl")
RESPONSES_PATH = os.path.join(BASE_DIR, "responses.pkl")

# Confidence threshold used at inference time (see app.py). Kept here too
# so both files stay in sync if you tune it.
CONFIDENCE_THRESHOLD = 0.18


def load_training_data():
    with open(INTENTS_PATH, "r", encoding="utf-8") as f:
        data = json.load(f)

    texts, labels = [], []
    responses = {}

    for intent in data["intents"]:
        tag = intent["tag"]
        responses[tag] = intent["responses"]
        for pattern in intent["patterns"]:
            texts.append(pattern.lower().strip())
            labels.append(tag)

    return texts, labels, responses


def main():
    print("Loading intents.json ...")
    texts, labels, responses = load_training_data()
    print(f"Loaded {len(texts)} training patterns across {len(responses)} intents.")

    vectorizer = TfidfVectorizer(
        lowercase=True,
        ngram_range=(1, 2),  # unigrams + bigrams help with short Hinglish phrases
        min_df=1,
    )
    X = vectorizer.fit_transform(texts)
    y = labels

    # NOTE: With only a handful of patterns per intent, a stratified
    # train/test split isn't reliable (sklearn needs at least as many
    # test samples as classes). For a dataset this size we just train
    # on everything and report training-set accuracy as a sanity check,
    # rather than a held-out validation score.
    clf = LogisticRegression(max_iter=1000)
    clf.fit(X, y)

    train_preds = clf.predict(X)
    train_acc = accuracy_score(y, train_preds)
    print(f"Training accuracy (sanity check, not a held-out score): {train_acc:.2f}")

    with open(MODEL_PATH, "wb") as f:
        pickle.dump(clf, f)
    with open(VECTORIZER_PATH, "wb") as f:
        pickle.dump(vectorizer, f)
    with open(RESPONSES_PATH, "wb") as f:
        pickle.dump(responses, f)

    print("Saved model.pkl, vectorizer.pkl, responses.pkl")
    print(f"Confidence threshold for inference: {CONFIDENCE_THRESHOLD}")


if __name__ == "__main__":
    main()