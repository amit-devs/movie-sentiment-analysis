import os
import pickle
from .preprocessing import clean_text

MODEL_DIR = os.path.join(os.path.dirname(__file__), "..", "model")
MODEL_PATH = os.path.join(MODEL_DIR, "sentiment_model.pkl")
VECTORIZER_PATH = os.path.join(MODEL_DIR, "tfidf_vectorizer.pkl")

# Load globally to avoid reloading on every request
model = None
vectorizer = None

def load_models():
    global model, vectorizer
    if model is None or vectorizer is None:
        try:
            with open(MODEL_PATH, "rb") as f:
                model = pickle.load(f)
            with open(VECTORIZER_PATH, "rb") as f:
                vectorizer = pickle.load(f)
        except Exception as e:
            print(f"Error loading models: {e}")
            raise e

def predict_sentiment(review_text: str):
    """
    Predicts the sentiment of a movie review.
    Returns: (sentiment_label, confidence_percentage)
    """
    if not review_text or not str(review_text).strip():
        raise ValueError("Review text cannot be empty.")

    load_models()
    
    # 1. Preprocess
    cleaned = clean_text(review_text)
    
    # 2. Vectorize
    vectorized = vectorizer.transform([cleaned])
    
    # 3. Predict
    prediction = model.predict(vectorized)[0]
    probabilities = model.predict_proba(vectorized)[0]
    
    sentiment_label = "POSITIVE" if prediction == 1 else "NEGATIVE"
    confidence = float(max(probabilities)) * 100
    
    return sentiment_label, round(confidence, 1)
