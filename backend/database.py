import sqlite3
import os

DB_PATH = os.path.join(os.path.dirname(__file__), '..', 'data', 'analytics.db')

def init_db():
    os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS predictions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            movie_name TEXT,
            review TEXT,
            sentiment TEXT,
            confidence REAL,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    conn.commit()
    conn.close()

def log_prediction(movie_name: str, review: str, sentiment: str, confidence: float):
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    # Parameterized query to prevent SQL injection
    cursor.execute('''
        INSERT INTO predictions (movie_name, review, sentiment, confidence)
        VALUES (?, ?, ?, ?)
    ''', (movie_name, review, sentiment, confidence))
    conn.commit()
    conn.close()

def get_analytics():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    # 1. Movie Stats
    cursor.execute('''
        SELECT 
            movie_name,
            COUNT(*) as total_searches,
            SUM(CASE WHEN sentiment = 'POSITIVE' THEN 1 ELSE 0 END) as positive_count,
            SUM(CASE WHEN sentiment = 'NEGATIVE' THEN 1 ELSE 0 END) as negative_count,
            SUM(CASE WHEN sentiment = 'NEUTRAL' THEN 1 ELSE 0 END) as neutral_count,
            AVG(confidence) as avg_confidence
        FROM predictions
        WHERE movie_name IS NOT NULL AND trim(movie_name) != ''
        GROUP BY movie_name
        ORDER BY total_searches DESC
    ''')
    
    movie_stats = []
    for row in cursor.fetchall():
        movie_stats.append({
            "movie_name": row[0],
            "total_searches": row[1],
            "positive_count": row[2],
            "negative_count": row[3],
            "neutral_count": row[4],
            "avg_confidence": round(row[5], 1)
        })
        
    # 2. Recent Analyses
    cursor.execute('''
        SELECT movie_name, sentiment, confidence, timestamp
        FROM predictions
        ORDER BY timestamp DESC
        LIMIT 10
    ''')
    recent = []
    for row in cursor.fetchall():
        recent.append({
            "movie_name": row[0],
            "sentiment": row[1],
            "confidence": round(row[2], 1),
            "timestamp": row[3]
        })
        
    # 3. Timeline (Volumetric Trend)
    cursor.execute('''
        SELECT 
            date(timestamp) as date,
            SUM(CASE WHEN sentiment = 'POSITIVE' THEN 1 ELSE 0 END) as positive_count,
            SUM(CASE WHEN sentiment = 'NEGATIVE' THEN 1 ELSE 0 END) as negative_count,
            SUM(CASE WHEN sentiment = 'NEUTRAL' THEN 1 ELSE 0 END) as neutral_count
        FROM predictions
        GROUP BY date(timestamp)
        ORDER BY date(timestamp) ASC
        LIMIT 30
    ''')
    
    timeline = []
    for row in cursor.fetchall():
        timeline.append({
            "date": row[0],
            "positive_count": row[1],
            "negative_count": row[2],
            "neutral_count": row[3]
        })

    conn.close()

    return {
        "movie_stats": movie_stats,
        "recent": recent,
        "timeline": timeline
    }
