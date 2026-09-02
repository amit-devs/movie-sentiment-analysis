"use client";

import { useEffect, useState } from "react";

interface DatasetStats {
  total_reviews: number;
  positive_reviews: number;
  negative_reviews: number;
  neutral_reviews: number;
}

interface Metrics {
  accuracy: number;
  precision_macro: number;
  recall_macro: number;
  f1_score_macro: number;
  confusion_matrix: number[][];
  dataset_stats: DatasetStats;
}

export default function ModelInfo() {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
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
        setMetrics(data as Metrics);
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
              <p className="text-lg">IMDb Movie Reviews (Enhanced)</p>
            </div>
            <div className="cinematic-card p-6 rounded-lg">
              <h3 className="text-[10px] font-bold tracking-[0.2em] text-[var(--muted)] mb-1 uppercase">Task</h3>
              <p className="text-lg">3-Class Sentiment Classification</p>
            </div>
            <div className="cinematic-card p-6 rounded-lg">
              <h3 className="text-[10px] font-bold tracking-[0.2em] text-[var(--muted)] mb-1 uppercase">Feature Extraction</h3>
              <p className="text-lg">TF-IDF Vectorizer</p>
            </div>
            <div className="cinematic-card p-6 rounded-lg">
              <h3 className="text-[10px] font-bold tracking-[0.2em] text-[var(--muted)] mb-1 uppercase">Model</h3>
              <p className="text-lg">Logistic Regression (Balanced)</p>
            </div>
          </section>

          {/* Dataset Stats */}
          <section className="cinematic-card p-8 rounded-xl border-t-2 border-t-[var(--gold)]">
            <h2 className="text-xl font-medium tracking-wider mb-8 uppercase text-center">Dataset Distribution</h2>
            <div className="flex justify-around text-center flex-wrap gap-6">
              <div>
                <div className="text-4xl font-light text-[var(--foreground)] mb-2">
                  {metrics.dataset_stats.total_reviews.toLocaleString()}
                </div>
                <div className="text-[10px] font-bold tracking-[0.15em] text-[var(--muted)] uppercase">Total Reviews</div>
              </div>
              <div>
                <div className="text-4xl font-light text-[var(--success)] mb-2">
                  {metrics.dataset_stats.positive_reviews.toLocaleString()}
                </div>
                <div className="text-[10px] font-bold tracking-[0.15em] text-[var(--muted)] uppercase">Positive</div>
              </div>
              <div>
                <div className="text-4xl font-light text-[var(--neutral)] mb-2">
                  {metrics.dataset_stats.neutral_reviews.toLocaleString()}
                </div>
                <div className="text-[10px] font-bold tracking-[0.15em] text-[var(--muted)] uppercase">Neutral</div>
              </div>
              <div>
                <div className="text-4xl font-light text-[var(--error)] mb-2">
                  {metrics.dataset_stats.negative_reviews.toLocaleString()}
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
                <div className="text-[10px] font-bold tracking-[0.15em] text-[var(--muted)] mb-2 uppercase">Precision (Macro)</div>
                <div className="text-3xl font-light text-[var(--foreground)]">{metrics.precision_macro}%</div>
              </div>
              <div className="cinematic-card p-6 rounded-lg text-center flex flex-col justify-center">
                <div className="text-[10px] font-bold tracking-[0.15em] text-[var(--muted)] mb-2 uppercase">Recall (Macro)</div>
                <div className="text-3xl font-light text-[var(--foreground)]">{metrics.recall_macro}%</div>
              </div>
              <div className="cinematic-card p-6 rounded-lg text-center flex flex-col justify-center">
                <div className="text-[10px] font-bold tracking-[0.15em] text-[var(--muted)] mb-2 uppercase">F1 Score (Macro)</div>
                <div className="text-3xl font-light text-[var(--foreground)]">{metrics.f1_score_macro}%</div>
              </div>
            </div>

            {/* Confusion Matrix */}
            <div className="cinematic-card p-8 rounded-xl mx-auto overflow-x-auto">
              <h3 className="text-center text-[10px] font-bold tracking-[0.15em] text-[var(--muted)] mb-6 uppercase">Confusion Matrix (3-Class)</h3>
              <table className="w-full min-w-[500px] text-center text-sm border-separate border-spacing-2">
                <thead>
                  <tr>
                    <th className="text-[var(--muted)] text-left font-normal italic">Actual \ Predicted</th>
                    <th className="text-[var(--error)] pb-2 font-medium uppercase tracking-wider text-[10px]">Negative</th>
                    <th className="text-[var(--success)] pb-2 font-medium uppercase tracking-wider text-[10px]">Positive</th>
                    <th className="text-[var(--neutral)] pb-2 font-medium uppercase tracking-wider text-[10px]">Neutral</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th className="text-[var(--error)] text-left font-medium uppercase tracking-wider text-[10px]">Negative</th>
                    <td className="bg-[var(--error)]/20 text-[var(--error)] p-4 rounded text-xl font-light">{metrics.confusion_matrix[0]?.[0]}</td>
                    <td className="bg-[#111] text-[var(--muted)] p-4 rounded text-xl font-light">{metrics.confusion_matrix[0]?.[1]}</td>
                    <td className="bg-[#111] text-[var(--muted)] p-4 rounded text-xl font-light">{metrics.confusion_matrix[0]?.[2]}</td>
                  </tr>
                  <tr>
                    <th className="text-[var(--success)] text-left font-medium uppercase tracking-wider text-[10px]">Positive</th>
                    <td className="bg-[#111] text-[var(--muted)] p-4 rounded text-xl font-light">{metrics.confusion_matrix[1]?.[0]}</td>
                    <td className="bg-[var(--success)]/20 text-[var(--success)] p-4 rounded text-xl font-light">{metrics.confusion_matrix[1]?.[1]}</td>
                    <td className="bg-[#111] text-[var(--muted)] p-4 rounded text-xl font-light">{metrics.confusion_matrix[1]?.[2]}</td>
                  </tr>
                  <tr>
                    <th className="text-[var(--neutral)] text-left font-medium uppercase tracking-wider text-[10px]">Neutral</th>
                    <td className="bg-[#111] text-[var(--muted)] p-4 rounded text-xl font-light">{metrics.confusion_matrix[2]?.[0]}</td>
                    <td className="bg-[#111] text-[var(--muted)] p-4 rounded text-xl font-light">{metrics.confusion_matrix[2]?.[1]}</td>
                    <td className="bg-[var(--neutral)]/20 text-[var(--neutral)] p-4 rounded text-xl font-light">{metrics.confusion_matrix[2]?.[2]}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        </div>
      ) : null}
    </div>
  );
}
