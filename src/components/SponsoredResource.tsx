import React from 'react';
import { ExternalLink } from 'lucide-react';

interface SponsoredResourceProps {
  className?: string;
}

export function SponsoredResourceCard({ className = '' }: SponsoredResourceProps) {
  return (
    <div
      className={`p-5 sm:p-6 rounded-2xl bg-zinc-50/80 dark:bg-zinc-900/60 border border-zinc-200/90 dark:border-zinc-800/90 transition-colors ${className}`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold tracking-widest uppercase text-zinc-700 dark:text-zinc-300 px-2 py-0.5 rounded bg-zinc-200/80 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700">
              Sponsored Link
            </span>
            <span className="text-xs text-zinc-500 font-mono">
              • Recommended Partner Resource
            </span>
          </div>
          <h3 className="text-base sm:text-lg font-serif font-bold text-zinc-950 dark:text-white">
            Curated Developer & Student Opportunities
          </h3>
          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 font-light max-w-xl leading-relaxed">
            Explore partner learning utilities, developer tools, technical career opportunities, and web platforms.
          </p>
        </div>

        <a
          href="https://www.profitableratecpmnetwork.com/zi0q26m3vy?key=d497b5bbda89f2aa846dd72ff9e8619b"
          target="_blank"
          rel="nofollow sponsored noopener"
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 text-xs font-semibold hover:opacity-90 active:scale-95 transition-all shrink-0 self-start sm:self-center cursor-pointer min-h-[40px]"
          aria-label="Visit external sponsored partner resource"
        >
          <span>Explore Partner Resource</span>
          <ExternalLink size={14} className="shrink-0" />
        </a>
      </div>
    </div>
  );
}
