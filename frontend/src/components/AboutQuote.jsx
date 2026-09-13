import React from 'react';
import portraitImg from '../assets/Nobgprofile.webp';

export default function AboutQuote({ data }) {
  const q = data || {
    badge: "ABOUT ME • PHILOSOPHY •",
    quote: "Design is not just what it looks like and feels like. Design is how it works.",
    author: "Steve Jobs",
    role: "Apple Co-founder",
    reflection: "Building high-performance data systems, machine learning workflows, and intuitive interfaces crafted with precision and purpose."
  };

  return (
    <div 
      id="philosophy" 
      className="lg:col-span-8 bg-white dark:bg-brand-darkCard rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-7 lg:p-8 shadow-soft dark:shadow-soft-dark border border-zinc-200/40 dark:border-zinc-800/30 min-h-[400px] sm:min-h-[340px] flex flex-col justify-between bento-transition explode-level-1 relative overflow-hidden group select-none"
    >
      {/* ========================================================================= */}
      {/* MOBILE BACKGROUND: Big centered portrait directly UNDER main heading */}
      {/* ========================================================================= */}
      <div className="sm:hidden absolute inset-0 pointer-events-none select-none z-0 overflow-hidden">
        {/* Big centered portrait positioned directly under the top heading badge */}
        <img 
          src={portraitImg} 
          alt="Srikar Maddela - About Me" 
          className="absolute top-12 left-1/2 -translate-x-1/2 h-[72%] w-auto max-w-none object-contain object-top grayscale opacity-95 dark:opacity-90 transition-transform duration-700 ease-out"
          style={{
            WebkitMaskImage: 'linear-gradient(to bottom, black 70%, rgba(0,0,0,0.4) 88%, transparent 100%)',
            maskImage: 'linear-gradient(to bottom, black 70%, rgba(0,0,0,0.4) 88%, transparent 100%)'
          }}
        />

        {/* Linear Gradient: Decreased height so the photo is clearly visible while text remains legible */}
        <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-white from-20% via-white/85 via-50% to-transparent dark:from-brand-darkCard dark:from-20% dark:via-brand-darkCard/85 dark:via-50% dark:to-transparent" />
      </div>

      {/* ========================================================================= */}
      {/* DESKTOP BACKGROUND: Full-height portrait on the right with left-to-right fade */}
      {/* ========================================================================= */}
      <div className="hidden sm:flex absolute right-0 bottom-0 h-full w-[44%] lg:w-[42%] items-end justify-end pointer-events-none select-none z-0 overflow-hidden">
        {/* Slow gradient overlay from card background to transparent (left-to-right fade) */}
        <div className="absolute inset-y-0 left-0 w-24 sm:w-28 bg-gradient-to-r from-white via-white/70 to-transparent dark:from-brand-darkCard dark:via-brand-darkCard/70 dark:to-transparent z-10 pointer-events-none" />

        {/* Portrait flushed to bottom-right corner */}
        <img 
          src={portraitImg} 
          alt="Srikar Maddela - About Me" 
          className="h-[100%] sm:h-[104%] lg:h-[106%] w-auto max-w-none object-contain object-right-bottom grayscale opacity-90 pointer-events-none transition-transform duration-700 ease-out group-hover:scale-[1.02] translate-x-3 sm:translate-x-5 lg:translate-x-6"
          style={{
            WebkitMaskImage: 'linear-gradient(to right, transparent 0%, rgba(0,0,0,0.3) 6%, black 18%)',
            maskImage: 'linear-gradient(to right, transparent 0%, rgba(0,0,0,0.3) 6%, black 18%)'
          }}
        />
      </div>

      {/* ========================================================================= */}
      {/* FOREGROUND CONTENT */}
      {/* ========================================================================= */}
      {/* Top Header Row: Main Heading / Badge placed at the top so image comes UNDER it */}
      <div className="relative z-20 flex justify-center sm:justify-start items-center">
        <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-widest text-brand-orange font-bold">
          {q.badge || "ABOUT ME • PHILOSOPHY •"}
        </span>
      </div>

      {/* Content Area: Positioned at bottom over the solid white background */}
      <div className="relative z-20 mt-auto sm:my-auto pt-6 sm:pt-2 pb-1 w-full text-center sm:text-left sm:max-w-[62%] lg:max-w-[58%]">
        {/* Main Statement - Bold & Clean Typography */}
        <h3 className="font-syne font-bold text-base sm:text-xl lg:text-[1.35rem] text-zinc-900 dark:text-white leading-snug tracking-tight max-w-md mx-auto sm:mx-0">
          "{q.quote}"
        </h3>

        {/* Author Name & Role */}
        <div className="flex items-center justify-center sm:justify-start space-x-2 mt-2.5 sm:mt-3.5 text-xs font-mono">
          <span className="font-bold text-brand-orange uppercase tracking-wider">
            {q.author}
          </span>
          <span className="text-zinc-300 dark:text-zinc-700">•</span>
          <span className="text-zinc-500 dark:text-zinc-400 font-medium font-sans">
            {q.role}
          </span>
        </div>

        {/* Purposeful Reflection: visible on desktop, trimmed on mobile for clean UI */}
        {q.reflection && (
          <p className="hidden sm:block text-xs text-zinc-500 dark:text-zinc-400 font-sans leading-relaxed mt-2.5 max-w-lg">
            {q.reflection}
          </p>
        )}
      </div>
    </div>
  );
}
