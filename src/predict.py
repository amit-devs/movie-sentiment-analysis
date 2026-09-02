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
    
    # Map the prediction back to string label
    sentiment_map = {0: "NEGATIVE", 1: "POSITIVE", 2: "NEUTRAL"}
    sentiment_label = sentiment_map.get(prediction, "UNKNOWN")
    
    # If the model is not very confident about positive or negative, it's essentially a mixed/neutral review
    pos_prob = probabilities[1]
    neg_prob = probabilities[0]
    neu_prob = probabilities[2]
    
    # Check if neither positive nor negative strongly dominate
    if pos_prob < 0.65 and neg_prob < 0.65 and sentiment_label != "NEUTRAL":
        sentiment_label = "NEUTRAL"
        # Give it a reasonable confidence reflecting the ambiguity
        confidence = 100.0 - (abs(pos_prob - neg_prob) * 100)
    else:
        confidence = float(max(probabilities)) * 100
    
    return sentiment_label, round(confidence, 1)
