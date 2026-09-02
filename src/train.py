import os
import json
import pickle
import pandas as pd
import numpy as np
import random
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, confusion_matrix
from preprocessing import clean_text

DATA_PATH = os.path.join("data", "IMDB Dataset.csv")
MODEL_DIR = "model"

def generate_neutral_data(num_samples=5000):
    """
    Generate synthetic neutral data using templates.
    Avoids using extreme positive/negative IMDb vocabulary which was 
    causing the model to overfit 'Neutral' on strong sentiment words.
    """
    random.seed(42)
    
    aspects = ['acting', 'plot', 'story', 'direction', 'cinematography', 'music', 'pacing', 'ending', 'dialogue', 'script']
    pos_adjectives = ['okay', 'decent', 'fine', 'acceptable', 'good', 'passable', 'alright', 'fair', 'great', 'excellent', 'amazing']
    neg_adjectives = ['boring', 'dull', 'slow', 'weak', 'bland', 'uninteresting', 'mediocre', 'predictable', 'flawed', 'bad', 'terrible', 'awful']
    neutral_adjectives = ['average', 'mediocre', 'middle-of-the-road', 'okay', 'so-so', 'unremarkable', 'standard', 'typical', 'mixed']
    
    templates = [
        "The {aspect} had {neg} {aspect} but a {pos} {aspect}.",
        "The movie had {neg} {aspect} but a {pos} {aspect}.",
        "The {aspect} was {pos}, but the {aspect} was {neg}.",
        "While the {aspect} was {neg}, the {aspect} was {pos}.",
        "It was an {neu} movie. Not great, but not terrible.",
        "I have mixed feelings. The {aspect} was {pos} but the rest was {neg}.",
        "A perfectly {neu} film. 3 out of 5 stars.",
        "It was fine. The {aspect} is {pos}, though it feels {neg} at times.",
        "An {neu} watch. It had some {pos} moments and some {neg} ones.",
        "Nothing special, just {neu}. The {aspect} was {pos} though.",
        "Decent watch but {neg}. The {aspect} carried it.",
        "It's just {neu}. I wouldn't watch it again, but it wasn't a waste of time.",
        "The {aspect} was {pos} but the {aspect} was completely {neg}. Balanced out to an {neu} movie."
    ]
    
    neutral_reviews = []
    for _ in range(num_samples):
        template = random.choice(templates)
        review = template.format(
            aspect=random.choice(aspects),
            pos=random.choice(pos_adjectives),
            neg=random.choice(neg_adjectives),
            neu=random.choice(neutral_adjectives)
        )
        neutral_reviews.append(review)
        
    return pd.DataFrame({
        'review': neutral_reviews,
        'sentiment': ['neutral'] * len(neutral_reviews)
    })

def main():
    print("Loading dataset...")
    if not os.path.exists(DATA_PATH):
        print(f"Error: Dataset not found at {DATA_PATH}")
        return

    df = pd.read_csv(DATA_PATH)
    print(f"Original dataset loaded. Shape: {df.shape}")
    
    print("Generating synthetic 'Neutral/Mixed' reviews...")
    df_neutral = generate_neutral_data(5000)
    
    # Combine datasets
    df_combined = pd.concat([df, df_neutral], ignore_index=True)
    print(f"Combined dataset shape: {df_combined.shape}")

    # Map sentiment to 0 (Neg), 1 (Pos), 2 (Neu)
    sentiment_map = {'negative': 0, 'positive': 1, 'neutral': 2}
    df_combined['sentiment_label'] = df_combined['sentiment'].map(sentiment_map)
    
    df_combined = df_combined.dropna()

    print("Cleaning text (this may take a few minutes)...")
    # Apply preprocessing (reusing the existing robust clean_text)
    df_combined['cleaned_review'] = df_combined['review'].apply(clean_text)

    X = df_combined['cleaned_review']
    y = df_combined['sentiment_label']

    print("Splitting data...")
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, stratify=y, random_state=42)

    print("Training TF-IDF Vectorizer...")
    vectorizer = TfidfVectorizer(ngram_range=(1, 2), max_features=15000, min_df=5)
    X_train_tfidf = vectorizer.fit_transform(X_train)
    X_test_tfidf = vectorizer.transform(X_test)

    print("Training 3-Class Logistic Regression Model...")
    # Use class_weight='balanced' to handle the fact that we have 25k pos, 25k neg, but only ~7k neutral
    model = LogisticRegression(max_iter=1000, class_weight='balanced', random_state=42, n_jobs=-1)
    model.fit(X_train_tfidf, y_train)

    print("Evaluating Model...")
    y_pred = model.predict(X_test_tfidf)

    acc = accuracy_score(y_test, y_pred)
    prec = precision_score(y_test, y_pred, average='macro')
    rec = recall_score(y_test, y_pred, average='macro')
    f1 = f1_score(y_test, y_pred, average='macro')
    cm = confusion_matrix(y_test, y_pred)

    metrics = {
        "accuracy": round(acc * 100, 2),
        "precision_macro": round(prec * 100, 2),
        "recall_macro": round(rec * 100, 2),
        "f1_score_macro": round(f1 * 100, 2),
        "confusion_matrix": cm.tolist(),
        "dataset_stats": {
            "total_reviews": len(df_combined),
            "positive_reviews": int((y == 1).sum()),
            "negative_reviews": int((y == 0).sum()),
            "neutral_reviews": int((y == 2).sum())
        }
    }

    print(f"Accuracy: {metrics['accuracy']}%")
    print(f"F1 Score (Macro): {metrics['f1_score_macro']}%")

    print("Saving model, vectorizer, and metrics...")
    os.makedirs(MODEL_DIR, exist_ok=True)
    
    with open(os.path.join(MODEL_DIR, "sentiment_model.pkl"), "wb") as f:
        pickle.dump(model, f)
        
    with open(os.path.join(MODEL_DIR, "tfidf_vectorizer.pkl"), "wb") as f:
        pickle.dump(vectorizer, f)

    with open(os.path.join(MODEL_DIR, "metrics.json"), "w") as f:
        json.dump(metrics, f, indent=4)

    print("Training complete! 3-Class model files saved to model/ directory.")

if __name__ == "__main__":
    main()
