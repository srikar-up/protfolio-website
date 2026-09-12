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
      className="lg:col-span-8 bg-white dark:bg-brand-darkCard rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-7 lg:p-8 shadow-soft dark:shadow-soft-dark border border-zinc-200/40 dark:border-zinc-800/30 min-h-[320px] md:min-h-[340px] flex flex-col justify-between bento-transition explode-level-1 relative overflow-hidden group select-none"
    >
      {/* Top Header Row: Clean Section Badge */}
      <div className="relative z-20 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <span className="text-[11px] font-mono uppercase tracking-widest text-brand-orange font-bold">
            {q.badge || "ABOUT ME • PHILOSOPHY •"}
          </span>
        </div>
      </div>

      {/* Central Content Area: Quotation Mark, Scaled Quote Statement, Author & Reflection */}
      <div className="relative z-20 my-auto pt-2 pb-2 max-w-full sm:max-w-[62%] lg:max-w-[58%]">
        {/* Stylized Double Quote Glyph */}
        <div className="text-brand-orange text-2xl sm:text-3xl font-serif font-black leading-none mb-1.5 sm:mb-2 select-none">
          ”
        </div>

        {/* Main Statement (Decreased font size to sandwich proportionally) */}
        <h3 className="font-syne font-bold text-base sm:text-lg lg:text-[1.35rem] text-zinc-900 dark:text-white leading-snug tracking-tight">
          {q.quote}
        </h3>

        {/* Author Name & Role */}
        <div className="flex items-center space-x-2 mt-2.5 sm:mt-3 text-xs font-mono">
          <span className="font-bold text-brand-orange uppercase tracking-wider">
            {q.author}
          </span>
          <span className="text-zinc-300 dark:text-zinc-700">•</span>
          <span className="text-zinc-500 dark:text-zinc-400 font-medium font-sans">
            {q.role}
          </span>
        </div>

        {/* Purposeful Reflection (Data Science & ML craft) */}
        <p className="text-xs sm:text-xs text-zinc-500 dark:text-zinc-400 font-sans leading-relaxed mt-2 max-w-lg">
          {q.reflection || "Building high-performance data systems, machine learning workflows, and intuitive interfaces crafted with precision and purpose."}
        </p>
      </div>

      {/* Whole Portrait on Right Anchored to the Corner with Soft Left-to-Right Fade */}
      <div className="absolute right-0 bottom-0 h-full w-[46%] sm:w-[44%] lg:w-[42%] flex items-end justify-end pointer-events-none select-none z-10 overflow-hidden">
        {/* Slow gradient overlay from card background to transparent (left-to-right fade) */}
        <div className="absolute inset-y-0 left-0 w-20 sm:w-28 bg-gradient-to-r from-white via-white/70 to-transparent dark:from-brand-darkCard dark:via-brand-darkCard/70 dark:to-transparent z-20 pointer-events-none" />

        {/* Portrait flushed to bottom-right corner without whitespace */}
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
    </div>
  );
}
