"use client";

import { useEffect, useState } from "react";

interface MovieStat {
  movie_name: string;
  total_searches: number;
  positive_count: number;
  negative_count: number;
  neutral_count: number;
  avg_confidence: number;
}

interface RecentAnalysis {
  movie_name: string;
  sentiment: string;
  confidence: number;
  timestamp: string;
}

interface TimelineData {
  date: string;
  positive_count: number;
  negative_count: number;
  neutral_count: number;
}

interface AnalyticsPayload {
  movie_stats: MovieStat[];
  recent: RecentAnalysis[];
  timeline: TimelineData[];
}

export default function Dashboard() {
  const [data, setData] = useState<AnalyticsPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hoveredSlice, setHoveredSlice] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
        const res = await fetch(`${apiUrl}/analytics`);
        if (!res.ok) throw new Error("Failed to fetch analytics data");
        const json = await res.json();
        setData(json.analytics);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center p-24">
        <div className="w-8 h-8 rounded-full border-2 border-[var(--gold)]/20 border-t-[var(--gold)] animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 m-12 rounded-md bg-[var(--error)]/10 border border-[var(--error)]/30 text-[var(--error)] text-center">
        {error}
      </div>
    );
  }

  if (!data || !data.movie_stats || data.movie_stats.length === 0) {
    return (
      <div className="text-center text-[var(--muted)] cinematic-card m-12 p-16 rounded-xl">
        <h2 className="text-2xl mb-4 font-light text-[var(--foreground)]">No analyses yet</h2>
        <p>Analyze a movie review to see your dashboard come to life.</p>
      </div>
    );
  }

  // Calculate Aggregates
  const totalMovies = data.movie_stats.length;
  const totalAnalyses = data.movie_stats.reduce((acc, curr) => acc + curr.total_searches, 0);
  const totalPositive = data.movie_stats.reduce((acc, curr) => acc + curr.positive_count, 0);
  const totalNegative = data.movie_stats.reduce((acc, curr) => acc + curr.negative_count, 0);
  const totalNeutral = data.movie_stats.reduce((acc, curr) => acc + curr.neutral_count, 0);
  
  const posRate = totalAnalyses > 0 ? Math.round((totalPositive / totalAnalyses) * 100) : 0;
  const neuRate = totalAnalyses > 0 ? Math.round((totalNeutral / totalAnalyses) * 100) : 0;
  const negRate = totalAnalyses > 0 ? Math.round((totalNegative / totalAnalyses) * 100) : 0;

  // Center logic for interactive chart
  let centerLabel = "Total";
  let centerValue: string | number = totalAnalyses;
  let centerColor = "text-[var(--foreground)]";

  if (hoveredSlice === "Positive") {
    centerLabel = "Positive";
    centerValue = `${posRate}%`;
    centerColor = "text-[var(--success)]";
  } else if (hoveredSlice === "Neutral") {
    centerLabel = "Neutral";
    centerValue = `${neuRate}%`;
    centerColor = "text-[var(--neutral)]";
  } else if (hoveredSlice === "Negative") {
    centerLabel = "Negative";
    centerValue = `${negRate}%`;
    centerColor = "text-[var(--error)]";
  }

  // Find maximum value for the volumetric trend chart to scale appropriately
  const maxDailyVolume = Math.max(
    1, 
    ...data.timeline.map(d => Math.max(d.positive_count || 0, d.negative_count || 0, d.neutral_count || 0))
  );

  return (
    <div className="max-w-7xl mx-auto px-6 py-16 w-full animate-in fade-in duration-700">
      <div className="mb-12 border-b border-[rgba(255,255,255,0.05)] pb-6">
        <h1 className="text-3xl md:text-4xl font-light tracking-tight mb-2">
          Analytics <span className="italic font-serif text-[var(--gold)]">Dashboard</span>
        </h1>
        <p className="text-[var(--muted)] font-light">
          Comprehensive overview of movie sentiment analyses
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        {[
          { label: "Total Movies", value: totalMovies },
          { label: "Total Analyses", value: totalAnalyses },
          { label: "Positive", value: totalPositive, color: "text-[var(--success)]" },
          { label: "Neutral", value: totalNeutral, color: "text-[var(--neutral)]" },
          { label: "Negative", value: totalNegative, color: "text-[var(--error)]" }
        ].map((stat, i) => (
          <div key={i} className="cinematic-card p-5 rounded-lg flex flex-col justify-center">
            <span className="text-[10px] uppercase tracking-widest text-[var(--muted)] mb-2 font-semibold">
              {stat.label}
            </span>
            <span className={`text-3xl font-light ${stat.color || 'text-[var(--foreground)]'}`}>
              {stat.value}
            </span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Sentiment Overview Chart (Interactive SVG Donut) */}
        <div className="cinematic-card p-6 rounded-lg lg:col-span-1 flex flex-col items-center justify-center min-h-[350px]">
          <h3 className="text-xs uppercase tracking-widest text-[var(--muted)] font-semibold w-full text-left">
            Sentiment Overview
          </h3>
          
          <div className="relative w-48 h-48 my-8 flex items-center justify-center">
            <svg viewBox="0 0 32 32" className="w-full h-full -rotate-90 drop-shadow-[0_0_15px_rgba(0,0,0,0.5)]">
              {/* Positive Slice */}
              {posRate > 0 && (
                <circle
                  r="15.91549431" cx="16" cy="16" fill="transparent"
                  stroke="var(--success)" strokeWidth="4"
                  strokeDasharray={`${posRate} ${100 - posRate}`}
                  strokeDashoffset="100"
                  className={`cursor-pointer transition-all duration-300 hover:stroke-[5] ${hoveredSlice && hoveredSlice !== 'Positive' ? 'opacity-30' : 'opacity-100'}`}
                  onMouseEnter={() => setHoveredSlice("Positive")}
                  onMouseLeave={() => setHoveredSlice(null)}
                />
              )}
              {/* Neutral Slice */}
              {neuRate > 0 && (
                <circle
                  r="15.91549431" cx="16" cy="16" fill="transparent"
                  stroke="var(--neutral)" strokeWidth="4"
                  strokeDasharray={`${neuRate} ${100 - neuRate}`}
                  strokeDashoffset={100 - posRate}
                  className={`cursor-pointer transition-all duration-300 hover:stroke-[5] ${hoveredSlice && hoveredSlice !== 'Neutral' ? 'opacity-30' : 'opacity-100'}`}
                  onMouseEnter={() => setHoveredSlice("Neutral")}
                  onMouseLeave={() => setHoveredSlice(null)}
                />
              )}
              {/* Negative Slice */}
              {negRate > 0 && (
                <circle
                  r="15.91549431" cx="16" cy="16" fill="transparent"
                  stroke="var(--error)" strokeWidth="4"
                  strokeDasharray={`${negRate} ${100 - negRate}`}
                  strokeDashoffset={100 - posRate - neuRate}
                  className={`cursor-pointer transition-all duration-300 hover:stroke-[5] ${hoveredSlice && hoveredSlice !== 'Negative' ? 'opacity-30' : 'opacity-100'}`}
                  onMouseEnter={() => setHoveredSlice("Negative")}
                  onMouseLeave={() => setHoveredSlice(null)}
                />
              )}
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className={`text-3xl font-light transition-colors duration-300 ${centerColor}`}>
                {centerValue}
              </span>
              <span className="text-[10px] tracking-widest uppercase text-[var(--muted)] mt-1 transition-opacity duration-300">
                {centerLabel}
              </span>
            </div>
          </div>

          <div className="flex gap-4 w-full justify-center text-xs tracking-widest uppercase font-semibold">
            <div 
              className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
              onMouseEnter={() => setHoveredSlice("Positive")}
              onMouseLeave={() => setHoveredSlice(null)}
            >
              <div className="w-2 h-2 rounded-full bg-[var(--success)]"></div>
              <span className={hoveredSlice === 'Positive' ? 'text-[var(--success)]' : ''}>Pos</span>
            </div>
            <div 
              className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
              onMouseEnter={() => setHoveredSlice("Neutral")}
              onMouseLeave={() => setHoveredSlice(null)}
            >
              <div className="w-2 h-2 rounded-full bg-[var(--neutral)]"></div>
              <span className={hoveredSlice === 'Neutral' ? 'text-[var(--neutral)]' : ''}>Neu</span>
            </div>
            <div 
              className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
              onMouseEnter={() => setHoveredSlice("Negative")}
              onMouseLeave={() => setHoveredSlice(null)}
            >
              <div className="w-2 h-2 rounded-full bg-[var(--error)]"></div>
              <span className={hoveredSlice === 'Negative' ? 'text-[var(--error)]' : ''}>Neg</span>
            </div>
          </div>
        </div>

        {/* Volumetric Trend Timeline (Grouped Bar Chart) */}
        <div className="cinematic-card p-6 rounded-lg lg:col-span-2 flex flex-col min-h-[350px]">
          <h3 className="text-xs uppercase tracking-widest text-[var(--muted)] font-semibold mb-6">
            Volumetric Trend Timeline
          </h3>
          
          <div className="flex-1 w-full flex items-end gap-6 relative mt-auto border-b border-[rgba(255,255,255,0.05)] pb-1 px-4">
            {/* Grid lines (Y-axis) */}
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-1">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="w-full border-t border-[rgba(255,255,255,0.03)] flex items-end">
                  <span className="text-[9px] text-[var(--muted)] -translate-x-6 -translate-y-2 w-4 text-right">
                    {Math.round(maxDailyVolume * (1 - i / 4))}
                  </span>
                </div>
              ))}
            </div>

            {/* Bars */}
            {data.timeline.map((day, i) => {
              const pos = day.positive_count || 0;
              const neg = day.negative_count || 0;
              const neu = day.neutral_count || 0;

              return (
                <div key={i} className="flex-1 flex items-end justify-center gap-1 z-10 group relative h-full pt-8">
                  {/* Positive Bar */}
                  <div className="w-1/3 flex flex-col justify-end h-full">
                    <div 
                      className="w-full bg-[var(--success)] rounded-t-sm transition-all duration-300 hover:opacity-80 cursor-pointer"
                      style={{ height: `${Math.max((pos / maxDailyVolume) * 100, 2)}%` }}
                    />
                  </div>
                  {/* Negative Bar */}
                  <div className="w-1/3 flex flex-col justify-end h-full">
                    <div 
                      className="w-full bg-[var(--error)] rounded-t-sm transition-all duration-300 hover:opacity-80 cursor-pointer"
                      style={{ height: `${Math.max((neg / maxDailyVolume) * 100, 2)}%` }}
                    />
                  </div>
                  {/* Neutral Bar */}
                  <div className="w-1/3 flex flex-col justify-end h-full">
                    <div 
                      className="w-full bg-[var(--gold)]/80 rounded-t-sm transition-all duration-300 hover:opacity-80 cursor-pointer"
                      style={{ height: `${Math.max((neu / maxDailyVolume) * 100, 2)}%` }}
                    />
                  </div>

                  {/* X-Axis Label */}
                  <div className="absolute top-full mt-2 text-[10px] text-[var(--muted)] whitespace-nowrap">
                    {day.date}
                  </div>

                  {/* Tooltip */}
                  <div className="absolute bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-opacity bg-black text-xs p-2 rounded shadow-lg pointer-events-none whitespace-nowrap z-20 border border-[rgba(255,255,255,0.1)] flex flex-col gap-1">
                    <div className="text-[10px] text-[var(--muted)] mb-1 border-b border-[rgba(255,255,255,0.1)] pb-1">{day.date}</div>
                    <div className="flex justify-between gap-4"><span className="text-[var(--success)]">Positive</span><span>{pos}</span></div>
                    <div className="flex justify-between gap-4"><span className="text-[var(--error)]">Negative</span><span>{neg}</span></div>
                    <div className="flex justify-between gap-4"><span className="text-[var(--gold)]">Neutral</span><span>{neu}</span></div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex gap-4 w-full justify-center text-[10px] tracking-widest uppercase font-semibold mt-10">
            <div className="flex items-center gap-1.5"><div className="w-1.5 h-3 rounded-full bg-[var(--success)]"></div><span>Positive</span></div>
            <div className="flex items-center gap-1.5"><div className="w-1.5 h-3 rounded-full bg-[var(--error)]"></div><span>Negative</span></div>
            <div className="flex items-center gap-1.5"><div className="w-1.5 h-3 rounded-full bg-[var(--gold)]/80"></div><span>Neutral</span></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {/* Movie Analytics Table */}
        <div className="cinematic-card rounded-lg overflow-hidden flex flex-col">
          <div className="p-6 border-b border-[rgba(255,255,255,0.05)] bg-[#141414]">
            <h3 className="text-xs uppercase tracking-widest text-[var(--muted)] font-semibold">
              Movie Analytics
            </h3>
          </div>
          <div className="overflow-x-auto max-h-[500px] overflow-y-auto custom-scrollbar">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-[#1a1a1a] sticky top-0 z-10 shadow-md">
                <tr>
                  <th className="px-6 py-4 font-medium text-[var(--muted)]">Movie</th>
                  <th className="px-6 py-4 font-medium text-[var(--muted)] text-right">Searches</th>
                  <th className="px-6 py-4 font-medium text-[var(--success)] text-right">Pos</th>
                  <th className="px-6 py-4 font-medium text-[var(--neutral)] text-right">Neu</th>
                  <th className="px-6 py-4 font-medium text-[var(--error)] text-right">Neg</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[rgba(255,255,255,0.02)]">
                {data.movie_stats.map((movie, i) => {
                  return (
                    <tr key={i} className="hover:bg-[rgba(255,255,255,0.02)] transition-colors">
                      <td className="px-6 py-4 font-medium text-[var(--foreground)]">{movie.movie_name}</td>
                      <td className="px-6 py-4 text-right">{movie.total_searches}</td>
                      <td className="px-6 py-4 text-right text-[var(--success)]/80">{movie.positive_count}</td>
                      <td className="px-6 py-4 text-right text-[var(--neutral)]/80">{movie.neutral_count}</td>
                      <td className="px-6 py-4 text-right text-[var(--error)]/80">{movie.negative_count}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
