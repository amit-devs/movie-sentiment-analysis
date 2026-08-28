import os
import json
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import sys

# Add src to path so we can import predict
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))
from src.predict import predict_sentiment

app = FastAPI(title="Movie Sentiment Analysis API")

# Setup CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class PredictRequest(BaseModel):
    movie_name: str
    review: str

class PredictResponse(BaseModel):
    movie_name: str
    sentiment: str
    confidence: float

@app.post("/predict", response_model=PredictResponse)
async def predict(request: PredictRequest):
    if not request.review or not request.review.strip():
        raise HTTPException(status_code=400, detail="Review text cannot be empty.")
        
    try:
        sentiment, confidence = predict_sentiment(request.review)
        return PredictResponse(
            movie_name=request.movie_name,
            sentiment=sentiment,
            confidence=confidence
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/metrics")
async def get_metrics():
    base_dir = os.path.dirname(os.path.abspath(__file__))
    metrics_path = os.path.join(base_dir, '..', 'model', 'metrics.json')
        
    if not os.path.exists(metrics_path):
        raise HTTPException(status_code=404, detail="Metrics file not found. Model might not be trained yet.")
        
    try:
        with open(metrics_path, "r") as f:
            metrics = json.load(f)
        return metrics
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
