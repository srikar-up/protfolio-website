import React from 'react';

export default function About() {
  return (
    <div className="lg:col-span-4 bg-white dark:bg-brand-darkCard rounded-[2rem] p-8 shadow-soft dark:shadow-soft-dark border border-zinc-200/30 dark:border-zinc-800/20 min-h-[420px] flex flex-col justify-between bento-transition explode-level-1">
      <div>
        <h2 className="text-xs font-mono uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-8">My Experience</h2>
        
        <div className="space-y-6 relative pl-4 border-l border-zinc-100 dark:border-zinc-800/40">
          {/* Role 1 */}
          <div className="relative">
            <span 
              className="absolute -left-[21px] top-1.5 w-2.5 h-2.5 rounded-full bg-zinc-900 dark:bg-white border-2 border-white dark:border-zinc-950 ring-4 ring-zinc-100 dark:ring-zinc-900" 
              id="timeline-dot"
            ></span>
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">Product Lead at Aura Design</h3>
            <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5">2025 - Present / Montreal</p>
          </div>

          {/* Role 2 */}
          <div className="relative opacity-60 hover:opacity-100 bento-transition">
            <span className="absolute -left-[21px] top-1.5 w-2.5 h-2.5 rounded-full bg-zinc-300 dark:bg-zinc-700 border-2 border-white dark:border-zinc-950"></span>
            <h3 className="text-sm font-semibold text-zinc-800 dark:text-zinc-300">UX Architect at Apple</h3>
            <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5">2024 - Cupertino</p>
          </div>

          {/* Role 3 */}
          <div className="relative opacity-40 hover:opacity-100 bento-transition">
            <span className="absolute -left-[21px] top-1.5 w-2.5 h-2.5 rounded-full bg-zinc-200 dark:bg-zinc-800 border-2 border-white dark:border-zinc-950"></span>
            <h3 className="text-sm font-semibold text-zinc-800 dark:text-zinc-400">Systems Designer at Stripe</h3>
            <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5">2022 - Remote</p>
          </div>
        </div>
      </div>

      <div className="pt-6 border-t border-zinc-100 dark:border-zinc-800/40 mt-6">
        <p className="text-xs text-zinc-400 dark:text-zinc-500 leading-normal">
          Balancing high-performance code pipelines with modern typography grids.
        </p>
      </div>
    </div>
  );
}
