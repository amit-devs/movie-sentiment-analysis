# Movie Review Sentiment Analysis

A full-stack Natural Language Processing (NLP) web application that classifies IMDb movie reviews as **Positive** or **Negative** using a custom-trained Logistic Regression model.

## Features
- **Custom Trained ML Model:** Trained on 50,000 IMDb movie reviews.
- **Cinematic Web Interface:** Premium, modern, responsive UI built with Next.js and Tailwind CSS.
- **Real-Time Analysis:** Predicts the sentiment of any text review on the fly.
- **Model Metrics:** Displays actual test set metrics (Accuracy, Precision, Recall, F1) directly from the backend.

## Project Architecture
This is a standard full-stack ML application divided into three main components:

1. **ML Pipeline (`src/`)**: 
   - Uses `scikit-learn` and `NLTK` to preprocess text (lowercasing, stopword removal while keeping negations like "not", lemmatization).
   - Trains a TF-IDF vectorizer and a Logistic Regression model.
   - Saves the models into the `model/` directory as `.pkl` files.
2. **Backend API (`backend/`)**: 
   - Built with **FastAPI** (Python).
   - Loads the saved `.pkl` files.
   - Exposes a `/predict` endpoint to evaluate new reviews.
   - Exposes a `/metrics` endpoint for the frontend to show model performance.
3. **Frontend (`frontend/`)**: 
   - Built with **Next.js** and **React**.
   - Styled with **Tailwind CSS** using a custom "cinematic" theme (charcoal, ivory, gold, burgundy).
   - Connects to the FastAPI backend.

## Dataset
- **Source**: `IMDB Dataset.csv`
- **Size**: 50,000 reviews
- **Classes**: Positive / Negative (Balanced 50/50)

## Performance Metrics (Test Set)
- **Accuracy**: ~90.2%
- **F1 Score**: ~90.3%

## How to Run Locally

### 1. Setup the Python Environment
```bash
python -m venv venv
# Activate the virtual environment
# Windows: venv\Scripts\activate
# Mac/Linux: source venv/bin/activate

pip install -r requirements.txt
```

### 2. Train the Model (Optional)
If you want to retrain the model, make sure `IMDB Dataset.csv` is inside the `data/` folder, then run:
```bash
python src/train.py
```
This will generate `sentiment_model.pkl`, `tfidf_vectorizer.pkl`, and `metrics.json` inside the `model/` directory.

### 3. Start the Backend (FastAPI)
```bash
cd backend
uvicorn main:app --reload --port 8000
```
The API will be available at `http://localhost:8000`.

### 4. Start the Frontend (Next.js)
Open a new terminal window:
```bash
cd frontend
npm install
npm run dev
```
The web app will be available at `http://localhost:3000`.

## Future Improvements
- **Model Tuning:** Experiment with advanced models like Support Vector Machines (SVM) or Deep Learning (Transformers like BERT) for higher accuracy.
- **More Nuanced Sentiment:** Transition from binary (Positive/Negative) classification to a 5-star rating prediction.
- **Batch Processing:** Allow uploading a CSV file to analyze multiple reviews at once.
