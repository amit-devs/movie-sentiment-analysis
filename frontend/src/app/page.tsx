"use client";

import { useState } from "react";

const EXAMPLES = [
  {
    movie: "Interstellar",
    review: "A breathtaking masterpiece with incredible visuals and an emotional story that kept me interested throughout. Absolutely fantastic."
  },
  {
    movie: "The Dark Knight",
    review: "One of the best superhero movies ever made. The acting was brilliant, especially Heath Ledger's Joker."
  },
  {
    movie: "Cats (2019)",
    review: "The movie was extremely boring. The story was weak, the visuals were unsettling, and the acting was disappointing. I would never watch this again."
  },
  {
    movie: "Madame Web",
    review: "Not good at all. The plot made no sense, the dialogue was incredibly wooden, and it felt completely disjointed."
  }
];

export default function Home() {
  const [movieName, setMovieName] = useState("");
  const [review, setReview] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<{
    movie_name: string;
    sentiment: string;
    confidence: number;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!review.trim()) {
      setError("Please enter a movie review before analyzing.");
      return;
    }
    setError(null);
    setIsAnalyzing(true);
    setResult(null);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const res = await fetch(`${apiUrl}/predict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ movie_name: movieName, review }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail || "Failed to analyze sentiment.");
      }

      const data = await res.json();
      // Artificial delay for smooth cinematic effect
      setTimeout(() => {
        setResult(data);
        setIsAnalyzing(false);
      }, 800);
    } catch (err: any) {
      setError(err.message);
      setIsAnalyzing(false);
    }
  };

  const handleExampleClick = (example: { movie: string, review: string }) => {
    setMovieName(example.movie);
    setReview(example.review);
    setResult(null);
    setError(null);
  };

  return (
    <div className="flex flex-col items-center pb-20">
      {/* Hero Section */}
      <section className="w-full max-w-4xl mx-auto px-6 pt-32 pb-24 text-center">
        <div className="inline-block mb-6 px-3 py-1 border border-[var(--accent)] rounded-full text-xs font-semibold tracking-[0.2em] text-[var(--accent)] bg-[var(--accent)]/10">
          NLP • SENTIMENT ANALYSIS
        </div>
        <h1 className="text-5xl md:text-6xl font-light tracking-tight mb-8 leading-tight">
          Understand the <span className="italic font-serif text-[var(--gold)]">feeling</span><br/>behind every review.
        </h1>
        <p className="text-lg text-[var(--muted)] max-w-2xl mx-auto font-light leading-relaxed">
          Analyze movie reviews with natural language processing and discover whether the audience reaction is positive or negative.
        </p>
      </section>

      {/* Main Analyzer */}
      <section className="w-full max-w-3xl mx-auto px-6 relative z-20">
        <div className="cinematic-card rounded-xl p-1 relative overflow-hidden">
          {/* Subtle gradient glow inside card */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none rounded-xl" />
          
          <div className="bg-[#151515] rounded-lg p-6 md:p-10 border border-black/50">
            <div className="mb-6">
              <label className="block text-[10px] font-bold tracking-[0.15em] text-[var(--muted)] mb-3 uppercase">
                Movie Name
              </label>
              <input
                type="text"
                value={movieName}
                onChange={(e) => setMovieName(e.target.value)}
                placeholder="Enter the movie name (optional)..."
                className="w-full cinematic-input p-4 rounded-md text-sm"
              />
            </div>

            <div className="mb-8">
              <label className="block text-[10px] font-bold tracking-[0.15em] text-[var(--muted)] mb-3 uppercase flex justify-between">
                <span>Your Movie Review</span>
                <span className="opacity-50">{review.length} chars</span>
              </label>
              <textarea
                value={review}
                onChange={(e) => setReview(e.target.value)}
                placeholder="Write or paste a movie review here..."
                className="w-full cinematic-input p-5 rounded-md min-h-[160px] text-sm leading-relaxed resize-y"
              />
            </div>

            {error && (
              <div className="mb-6 p-4 rounded-md bg-[var(--error)]/10 border border-[var(--error)]/30 text-[var(--error)] text-sm">
                {error}
              </div>
            )}

            <button
              onClick={handleAnalyze}
              disabled={isAnalyzing}
              className={`w-full py-4 rounded-md flex items-center justify-center cinematic-btn ${isAnalyzing ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isAnalyzing ? (
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full border-2 border-white/20 border-t-white animate-spin" />
                  <span>Analyzing review...</span>
                </div>
              ) : (
                "Analyze Sentiment"
              )}
            </button>
          </div>
        </div>

        {/* Result UI */}
        {result && (
          <div className="mt-8 cinematic-card rounded-xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="p-10 text-center relative">
              {/* Conditional background tint */}
              <div className={`absolute inset-0 opacity-10 ${result.sentiment === 'POSITIVE' ? 'bg-[var(--success)]' : 'bg-[var(--error)]'}`} />
              
              <div className="relative z-10">
                {result.movie_name && (
                  <p className="text-sm font-light text-[var(--muted)] mb-2 uppercase tracking-widest">
                    Movie: <span className="text-white font-medium">{result.movie_name}</span>
                  </p>
                )}
                
                <h2 className="text-5xl font-light tracking-wider mb-6 mt-4 drop-shadow-lg">
                  <span className={result.sentiment === 'POSITIVE' ? 'text-[var(--success)]' : 'text-[var(--error)]'}>
                    {result.sentiment}
                  </span>
                </h2>
                
                <p className="text-lg text-[var(--foreground)] font-light mb-10 opacity-90">
                  This review expresses a <strong className="font-medium tracking-wide">{result.sentiment.toLowerCase()}</strong> sentiment.
                </p>

                <div className="max-w-xs mx-auto text-left">
                  <div className="flex justify-between text-[10px] tracking-[0.2em] text-[var(--muted)] mb-3 uppercase font-semibold">
                    <span>Confidence</span>
                    <span className="text-[var(--foreground)]">{result.confidence}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-black/50 rounded-full overflow-hidden shadow-inner">
                    <div 
                      className={`h-full rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(255,255,255,0.2)] ${result.sentiment === 'POSITIVE' ? 'bg-[var(--success)]' : 'bg-[var(--error)]'}`}
                      style={{ width: `${result.confidence}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Examples Section */}
        <div className="mt-20">
          <h3 className="text-center text-[10px] font-bold tracking-[0.2em] text-[var(--muted)] mb-8 uppercase">
            Try an example
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {EXAMPLES.map((ex, idx) => (
              <button
                key={idx}
                onClick={() => handleExampleClick(ex)}
                className="text-left p-5 rounded-lg border border-[#222] bg-[#1a1a1a]/50 hover:bg-[#222] hover:border-[#333] transition-all group"
              >
                <div className="text-xs text-[var(--gold)] mb-2 font-medium tracking-wide">
                  {ex.movie}
                </div>
                <p className="text-sm text-[var(--muted)] group-hover:text-[var(--foreground)] transition-colors line-clamp-3">
                  "{ex.review}"
                </p>
              </button>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
