import React from 'react';
import { useTheme } from '../context/ThemeContext';

export default function Blog() {
  const { showToast } = useTheme();

  const handleArticleView = (title) => {
    showToast(`Loading essay: "${title}"...`);
  };

  return (
    <div className="lg:col-span-12 bg-transparent rounded-[2rem] pt-6 flex flex-col gap-6 explode-level-0">
      
      {/* Section Header */}
      <div className="flex justify-between items-end px-2">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-zinc-400 dark:text-zinc-500">Curated Writings</span>
          <h2 className="font-syne font-bold text-3xl text-zinc-900 dark:text-white mt-1">Design Notebook</h2>
        </div>
        <span 
          onClick={() => showToast("Opening writings archive...")}
          className="text-xs font-mono text-brand-orange font-semibold tracking-wider cursor-pointer hover:underline" 
          id="view-all-blog-btn"
        >
          ALL PAPERS — 02
        </span>
      </div>

      {/* Grid of articles */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Article 1 */}
        <div 
          onClick={() => handleArticleView("The Typography of Silence")}
          className="bg-white dark:bg-brand-darkCard rounded-[2rem] p-8 shadow-soft dark:shadow-soft-dark border border-zinc-200/30 dark:border-zinc-800/20 bento-transition explode-level-1 flex flex-col justify-between min-h-[280px] group hover:-translate-y-1.5 cursor-pointer"
        >
          <div className="space-y-4">
            <div className="flex items-center space-x-3 text-xs font-mono text-zinc-400">
              <span>JULY 2026</span>
              <span className="w-1 h-1 rounded-full bg-zinc-300 dark:bg-zinc-700"></span>
              <span>5 MIN READ</span>
            </div>
            <h3 className="font-syne font-bold text-2xl text-zinc-900 dark:text-white group-hover:text-brand-orange bento-transition leading-snug">
              The Typography of Silence: Why whitespace dictates SaaS visual identity
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
              An investigation into how high-fashion typography parameters dictate standard interface conversion rates and mental cognitive load.
            </p>
          </div>
          <div className="pt-6 border-t border-zinc-100 dark:border-zinc-800/40 flex justify-between items-center mt-6">
            <span className="text-xs font-mono font-semibold text-zinc-900 dark:text-white uppercase group-hover:translate-x-1 bento-transition">Read Entry →</span>
            <span className="text-[10px] font-mono text-zinc-400">TYPOGRAPHY / ARCHITECTURE</span>
          </div>
        </div>

        {/* Article 2 */}
        <div 
          onClick={() => handleArticleView("Designing for the GPU")}
          className="bg-white dark:bg-brand-darkCard rounded-[2rem] p-8 shadow-soft dark:shadow-soft-dark border border-zinc-200/30 dark:border-zinc-800/20 bento-transition explode-level-1 flex flex-col justify-between min-h-[280px] group hover:-translate-y-1.5 cursor-pointer"
        >
          <div className="space-y-4">
            <div className="flex items-center space-x-3 text-xs font-mono text-zinc-400">
              <span>MAY 2026</span>
              <span className="w-1 h-1 rounded-full bg-zinc-300 dark:bg-zinc-700"></span>
              <span>7 MIN READ</span>
            </div>
            <h3 className="font-syne font-bold text-2xl text-zinc-900 dark:text-white group-hover:text-brand-orange bento-transition leading-snug">
              Designing for the GPU: Shifting the rendering load away from JS cycles
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
              A technical look at transform layers, viewport matrices, and compositing variables that result in smooth scroll architectures.
            </p>
          </div>
          <div className="pt-6 border-t border-zinc-100 dark:border-zinc-800/40 flex justify-between items-center mt-6">
            <span className="text-xs font-mono font-semibold text-zinc-900 dark:text-white uppercase group-hover:translate-x-1 bento-transition">Read Entry →</span>
            <span className="text-[10px] font-mono text-zinc-400">GRAPHICS / ENGINEERING</span>
          </div>
        </div>

      </div>
    </div>
  );
}
