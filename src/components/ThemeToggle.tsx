import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export function ThemeToggle({ className = '' }: { className?: string }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      className={`relative p-2.5 rounded-xl transition-all flex items-center justify-center 
        ${theme === 'dark' 
          ? 'bg-zinc-900/80 text-zinc-300 hover:text-white hover:bg-zinc-800 border border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]' 
          : 'bg-zinc-100/90 text-zinc-700 hover:text-zinc-950 hover:bg-zinc-200/80 border border-zinc-200/80 shadow-[inset_0_1px_1px_rgba(255,255,255,0.8)]'
        } ${className}`}
    >
      <span className="sr-only">Toggle theme</span>
      {theme === 'dark' ? (
        <Sun size={18} className="transition-transform duration-300 rotate-0 hover:rotate-45 text-amber-300" />
      ) : (
        <Moon size={18} className="transition-transform duration-300 -rotate-12 hover:rotate-0 text-zinc-900" />
      )}
    </button>
  );
}
