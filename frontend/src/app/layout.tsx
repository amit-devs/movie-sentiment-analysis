import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Movie Sentiment Analysis | NLP",
  description: "Understand the feeling behind every movie review with our trained NLP model.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen flex flex-col">
        <div className="grain-overlay"></div>
        
        <header className="border-b border-[#333] bg-black/40 backdrop-blur-md sticky top-0 z-40">
          <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--gold)] to-[var(--accent)] flex items-center justify-center text-white font-bold tracking-widest text-xs group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-[0_0_15px_rgba(212,175,55,0.4)]">
                MSA
              </div>
              <span className="font-bold tracking-widest uppercase text-sm">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-[var(--gold)] to-[var(--accent)] opacity-90 group-hover:opacity-100 transition-opacity drop-shadow-sm">
                  MovieSentiment
                </span>
                <span className="font-light text-[var(--muted)] ml-1">
                  Analyzer
                </span>
              </span>
            </Link>
            
            <nav className="flex gap-8 text-sm uppercase tracking-wider font-medium text-[var(--muted)]">
              <Link href="/" className="hover:text-[var(--foreground)] transition-colors">Analyzer</Link>
              <Link href="/dashboard" className="hover:text-[var(--foreground)] transition-colors">Dashboard</Link>
              <Link href="/how-it-works" className="hover:text-[var(--foreground)] transition-colors">How it Works</Link>
              <Link href="/model" className="hover:text-[var(--foreground)] transition-colors">Model</Link>
            </nav>
          </div>
        </header>
        
        <main className="flex-1 flex flex-col relative z-10">
          {children}
        </main>
        
        <footer className="border-t border-[#222] py-8 flex flex-col items-center gap-2 text-center text-xs uppercase tracking-widest text-[#666] mt-auto relative z-10">
          <p>© {new Date().getFullYear()} Movie Sentiment Analysis • NLP Project</p>
          <p className="opacity-70 mt-1">Made by Amit</p>
        </footer>
      </body>
    </html>
  );
}
