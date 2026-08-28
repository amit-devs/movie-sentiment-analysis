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
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-full bg-[var(--accent)] flex items-center justify-center text-white font-bold tracking-widest text-xs group-hover:scale-105 transition-transform">
                SA
              </div>
              <span className="font-semibold tracking-widest uppercase text-sm text-[var(--foreground)] opacity-90 group-hover:opacity-100 transition-opacity">
                Sentiment<span className="font-light text-[var(--muted)]">Analyzer</span>
              </span>
            </Link>
            
            <nav className="flex gap-8 text-sm uppercase tracking-wider font-medium text-[var(--muted)]">
              <Link href="/" className="hover:text-[var(--foreground)] transition-colors">Analyzer</Link>
              <Link href="/how-it-works" className="hover:text-[var(--foreground)] transition-colors">How it Works</Link>
              <Link href="/model" className="hover:text-[var(--foreground)] transition-colors">Model</Link>
            </nav>
          </div>
        </header>
        
        <main className="flex-1 flex flex-col relative z-10">
          {children}
        </main>
        
        <footer className="border-t border-[#222] py-8 text-center text-xs uppercase tracking-widest text-[#666] mt-auto relative z-10">
          <p>© {new Date().getFullYear()} Sentiment Analysis Model • NLP Project</p>
        </footer>
      </body>
    </html>
  );
}
