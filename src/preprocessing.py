import re
import nltk
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer

# List of negation words to keep for sentiment analysis
NEGATION_WORDS = {
    "no", "not", "never", "none", "nobody", "nowhere", "nothing",
    "neither", "nor", "cannot", "can't", "don't", "doesn't", "didn't",
    "won't", "wouldn't", "shan't", "shouldn't", "isn't", "aren't",
    "wasn't", "weren't", "hasn't", "haven't", "hadn't", "mightn't",
    "mustn't", "needn't"
}

def get_stopwords():
    try:
        stop_words = set(stopwords.words('english'))
    except LookupError:
        nltk.download('stopwords')
        stop_words = set(stopwords.words('english'))
    
    # Remove negation words from stop words
    return stop_words - NEGATION_WORDS

STOP_WORDS = get_stopwords()
lemmatizer = WordNetLemmatizer()

def clean_text(text: str) -> str:
    """
    Cleans movie review text by:
    - Lowercasing
    - Removing HTML tags (like <br />)
    - Removing URLs, non-alphanumeric characters
    - Removing standard stopwords (keeping negations)
    - Lemmatizing words
    """
    if not isinstance(text, str):
        return ""
        
    # 1. Lowercase
    text = text.lower()
    
    # 2. Remove HTML tags
    text = re.sub(r'<[^>]*>', ' ', text)
    
    # 3. Remove URLs
    text = re.sub(r'http\S+|www\S+|https\S+', '', text, flags=re.MULTILINE)
    
    # 4. Remove special characters (keep only letters and numbers)
    # Keeping single quotes for words like "don't"
    text = re.sub(r"[^a-z0-9\s']", ' ', text)
    
    # 5. Tokenize, remove stopwords, and lemmatize
    words = text.split()
    cleaned_words = []
    
    for word in words:
        # Handle cases where quotes might be left floating
        word = word.strip("'")
        if word and word not in STOP_WORDS:
            lemmatized = lemmatizer.lemmatize(word)
            cleaned_words.append(lemmatized)
            
    return ' '.join(cleaned_words)
