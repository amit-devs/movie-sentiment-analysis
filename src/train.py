import os
import json
import pickle
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, confusion_matrix
from preprocessing import clean_text

DATA_PATH = os.path.join("data", "IMDB Dataset.csv")
MODEL_DIR = "model"

def main():
    print("Loading dataset...")
    if not os.path.exists(DATA_PATH):
        print(f"Error: Dataset not found at {DATA_PATH}")
        return

    df = pd.read_csv(DATA_PATH)
    print(f"Dataset loaded. Shape: {df.shape}")

    # Map sentiment to binary
    df['sentiment'] = df['sentiment'].map({'positive': 1, 'negative': 0})
    
    # Drop NAs just in case
    df = df.dropna()

    print("Cleaning text (this may take a few minutes)...")
    # Apply preprocessing
    df['cleaned_review'] = df['review'].apply(clean_text)

    X = df['cleaned_review']
    y = df['sentiment']

    print("Splitting data...")
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, stratify=y, random_state=42)

    print("Training TF-IDF Vectorizer...")
    # TF-IDF Configuration:
    # unigrams and bigrams, top 15,000 features, appear in at least 5 docs
    vectorizer = TfidfVectorizer(ngram_range=(1, 2), max_features=15000, min_df=5)
    X_train_tfidf = vectorizer.fit_transform(X_train)
    X_test_tfidf = vectorizer.transform(X_test)

    print("Training Logistic Regression Model...")
    model = LogisticRegression(max_iter=1000, random_state=42, n_jobs=-1)
    model.fit(X_train_tfidf, y_train)

    print("Evaluating Model...")
    y_pred = model.predict(X_test_tfidf)

    acc = accuracy_score(y_test, y_pred)
    prec = precision_score(y_test, y_pred)
    rec = recall_score(y_test, y_pred)
    f1 = f1_score(y_test, y_pred)
    cm = confusion_matrix(y_test, y_pred)

    metrics = {
        "accuracy": round(acc * 100, 2),
        "precision": round(prec * 100, 2),
        "recall": round(rec * 100, 2),
        "f1_score": round(f1 * 100, 2),
        "confusion_matrix": {
            "true_negative": int(cm[0][0]),
            "false_positive": int(cm[0][1]),
            "false_negative": int(cm[1][0]),
            "true_positive": int(cm[1][1])
        },
        "dataset_stats": {
            "total_reviews": len(df),
            "positive_reviews": int(y.sum()),
            "negative_reviews": int(len(df) - y.sum())
        }
    }

    print(f"Accuracy: {metrics['accuracy']}%")
    print(f"Precision: {metrics['precision']}%")
    print(f"Recall: {metrics['recall']}%")
    print(f"F1 Score: {metrics['f1_score']}%")

    print("Saving model, vectorizer, and metrics...")
    os.makedirs(MODEL_DIR, exist_ok=True)
    
    with open(os.path.join(MODEL_DIR, "sentiment_model.pkl"), "wb") as f:
        pickle.dump(model, f)
        
    with open(os.path.join(MODEL_DIR, "tfidf_vectorizer.pkl"), "wb") as f:
        pickle.dump(vectorizer, f)

    with open(os.path.join(MODEL_DIR, "metrics.json"), "w") as f:
        json.dump(metrics, f, indent=4)

    print("Training complete! Files saved to model/ directory.")

if __name__ == "__main__":
    main()
