"use client";

import { useEffect, useState } from "react";

export default function ModelInfo() {
  const [metrics, setMetrics] = useState<Record<string, unknown> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
    fetch(`${apiUrl}/metrics`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch model metrics");
        return res.json();
      })
      .then((data) => {
        setMetrics(data);
        setLoading(false);
      })
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : String(err));
        setLoading(false);
      });
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-6 py-24">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-light tracking-tight mb-6">
          Under the <span className="italic font-serif text-[var(--gold)]">Hood</span>
        </h1>
        <p className="text-[var(--muted)] max-w-xl mx-auto font-light leading-relaxed">
          Technical details and evaluation metrics of the trained sentiment analysis model.
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center p-20">
          <div className="w-8 h-8 rounded-full border-2 border-[var(--gold)]/20 border-t-[var(--gold)] animate-spin" />
        </div>
      ) : error ? (
        <div className="p-6 rounded-md bg-[var(--error)]/10 border border-[var(--error)]/30 text-[var(--error)] text-center">
          {error} (Is the backend running?)
        </div>
      ) : metrics ? (
        <div className="space-y-12 animate-in fade-in duration-1000">
          {/* Architecture Details */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="cinematic-card p-6 rounded-lg">
              <h3 className="text-[10px] font-bold tracking-[0.2em] text-[var(--muted)] mb-1 uppercase">Dataset</h3>
              <p className="text-lg">IMDb Movie Reviews</p>
            </div>
            <div className="cinematic-card p-6 rounded-lg">
              <h3 className="text-[10px] font-bold tracking-[0.2em] text-[var(--muted)] mb-1 uppercase">Task</h3>
              <p className="text-lg">Binary Sentiment Classification</p>
            </div>
            <div className="cinematic-card p-6 rounded-lg">
              <h3 className="text-[10px] font-bold tracking-[0.2em] text-[var(--muted)] mb-1 uppercase">Feature Extraction</h3>
              <p className="text-lg">TF-IDF Vectorizer</p>
            </div>
            <div className="cinematic-card p-6 rounded-lg">
              <h3 className="text-[10px] font-bold tracking-[0.2em] text-[var(--muted)] mb-1 uppercase">Model</h3>
              <p className="text-lg">Logistic Regression</p>
            </div>
          </section>

          {/* Dataset Stats */}
          <section className="cinematic-card p-8 rounded-xl border-t-2 border-t-[var(--gold)]">
            <h2 className="text-xl font-medium tracking-wider mb-8 uppercase text-center">Dataset Distribution</h2>
            <div className="flex justify-around text-center flex-wrap gap-6">
              <div>
                <div className="text-4xl font-light text-[var(--foreground)] mb-2">
                  {metrics.dataset_stats?.total_reviews.toLocaleString() || '50,000'}
                </div>
                <div className="text-[10px] font-bold tracking-[0.15em] text-[var(--muted)] uppercase">Total Reviews</div>
              </div>
              <div>
                <div className="text-4xl font-light text-[var(--success)] mb-2">
                  {metrics.dataset_stats?.positive_reviews.toLocaleString() || '25,000'}
                </div>
                <div className="text-[10px] font-bold tracking-[0.15em] text-[var(--muted)] uppercase">Positive</div>
              </div>
              <div>
                <div className="text-4xl font-light text-[var(--error)] mb-2">
                  {metrics.dataset_stats?.negative_reviews.toLocaleString() || '25,000'}
                </div>
                <div className="text-[10px] font-bold tracking-[0.15em] text-[var(--muted)] uppercase">Negative</div>
              </div>
            </div>
          </section>

          {/* Model Performance */}
          <section>
            <h2 className="text-xl font-medium tracking-wider mb-6 uppercase text-center">Test Performance</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="cinematic-card p-6 rounded-lg text-center flex flex-col justify-center">
                <div className="text-[10px] font-bold tracking-[0.15em] text-[var(--muted)] mb-2 uppercase">Accuracy</div>
                <div className="text-3xl font-light text-[var(--gold)]">{metrics.accuracy}%</div>
              </div>
              <div className="cinematic-card p-6 rounded-lg text-center flex flex-col justify-center">
                <div className="text-[10px] font-bold tracking-[0.15em] text-[var(--muted)] mb-2 uppercase">Precision</div>
                <div className="text-3xl font-light text-[var(--foreground)]">{metrics.precision}%</div>
              </div>
              <div className="cinematic-card p-6 rounded-lg text-center flex flex-col justify-center">
                <div className="text-[10px] font-bold tracking-[0.15em] text-[var(--muted)] mb-2 uppercase">Recall</div>
                <div className="text-3xl font-light text-[var(--foreground)]">{metrics.recall}%</div>
              </div>
              <div className="cinematic-card p-6 rounded-lg text-center flex flex-col justify-center">
                <div className="text-[10px] font-bold tracking-[0.15em] text-[var(--muted)] mb-2 uppercase">F1 Score</div>
                <div className="text-3xl font-light text-[var(--foreground)]">{metrics.f1_score}%</div>
              </div>
            </div>

            {/* Confusion Matrix */}
            <div className="cinematic-card p-8 rounded-xl max-w-lg mx-auto">
              <h3 className="text-center text-[10px] font-bold tracking-[0.15em] text-[var(--muted)] mb-6 uppercase">Confusion Matrix</h3>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="bg-[#111] p-4 rounded border border-[var(--success)]/30">
                  <div className="text-sm text-[var(--muted)] mb-1">True Positive</div>
                  <div className="text-2xl font-light">{metrics.confusion_matrix?.true_positive.toLocaleString()}</div>
                </div>
                <div className="bg-[#111] p-4 rounded border border-[var(--error)]/30">
                  <div className="text-sm text-[var(--muted)] mb-1">False Positive</div>
                  <div className="text-2xl font-light">{metrics.confusion_matrix?.false_positive.toLocaleString()}</div>
                </div>
                <div className="bg-[#111] p-4 rounded border border-[var(--error)]/30">
                  <div className="text-sm text-[var(--muted)] mb-1">False Negative</div>
                  <div className="text-2xl font-light">{metrics.confusion_matrix?.false_negative.toLocaleString()}</div>
                </div>
                <div className="bg-[#111] p-4 rounded border border-[var(--success)]/30">
                  <div className="text-sm text-[var(--muted)] mb-1">True Negative</div>
                  <div className="text-2xl font-light">{metrics.confusion_matrix?.true_negative.toLocaleString()}</div>
                </div>
              </div>
            </div>
          </section>
        </div>
      ) : null}
    </div>
  );
}
