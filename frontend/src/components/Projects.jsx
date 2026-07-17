import React from 'react';
import { useTheme } from '../context/ThemeContext';

export default function Projects() {
  const { showToast } = useTheme();

  const handleProjectClick = (name) => {
    showToast(`Loading sandbox environment for ${name}...`);
  };

  return (
    <div className="lg:col-span-12 bg-transparent rounded-[2rem] pt-6 flex flex-col gap-6 explode-level-0">
      
      {/* Section Header */}
      <div className="flex justify-between items-end px-2">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-zinc-400 dark:text-zinc-500">Selected Masterpieces</span>
          <h2 className="font-syne font-bold text-3xl text-zinc-900 dark:text-white mt-1">Projects Engine</h2>
        </div>
        <span 
          onClick={() => showToast("Navigating to all project archives...")}
          className="text-xs font-mono text-brand-orange font-semibold tracking-wider cursor-pointer hover:underline" 
          id="view-all-projects-btn"
        >
          ALL ARCHIVES — 02
        </span>
      </div>

      {/* Grid containing Project 1 & Project 2 */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Project 1 (Spans 7 Columns) */}
        <div 
          onClick={() => handleProjectClick("Aether OS")}
          className="md:col-span-7 bg-white dark:bg-brand-darkCard rounded-[2rem] p-8 shadow-soft dark:shadow-soft-dark border border-zinc-200/30 dark:border-zinc-800/20 bento-transition explode-level-1 flex flex-col justify-between min-h-[440px] group hover:-translate-y-2 cursor-pointer"
        >
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-mono bg-zinc-100 dark:bg-zinc-800 px-3 py-1 rounded-full text-zinc-500 dark:text-zinc-400">PRODUCT ENGINEERING</span>
            <span className="text-xs font-mono text-zinc-400">2026</span>
          </div>

          {/* Interactive responsive canvas block mockup */}
          <div className="my-6 bg-zinc-50 dark:bg-zinc-900/60 rounded-xl p-4 h-48 relative overflow-hidden border border-zinc-200/10 dark:border-zinc-800/10 flex items-center justify-center">
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-100/10 to-transparent z-0"></div>
            
            <div className="w-11/12 h-5/6 bg-white dark:bg-zinc-950 rounded-lg shadow-md border border-zinc-200/20 dark:border-zinc-800/20 p-3.5 flex flex-col justify-between group-hover:scale-105 bento-transition relative z-10">
              <div className="flex items-center space-x-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-400"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-400"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-green-400"></span>
                <span className="text-[9px] font-mono text-zinc-300 dark:text-zinc-600 ml-2">https://aether.system</span>
              </div>
              <div className="flex flex-col gap-1.5 my-2">
                <span className="w-3/4 h-2 bg-zinc-100 dark:bg-zinc-900 rounded-full"></span>
                <span className="w-1/2 h-2 bg-zinc-100 dark:bg-zinc-900 rounded-full"></span>
                <span className="w-5/6 h-2 bg-zinc-100 dark:bg-zinc-900 rounded-full"></span>
              </div>
              <div className="flex justify-between items-center">
                <span className="w-12 h-4 bg-brand-orange/15 rounded-full" id="mock-project-badge-1"></span>
                <span className="w-6 h-6 bg-zinc-100 dark:bg-zinc-900 rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-zinc-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7"/></svg>
                </span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-syne font-bold text-2xl text-zinc-900 dark:text-white leading-tight">Aether OS Interactive Spatial Window</h3>
            <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-2 leading-relaxed max-w-lg">
              An award-winning viewport framework operating custom spatial coordinates using raw JS layouts.
            </p>
          </div>
        </div>

        {/* Project 2 (Spans 5 Columns) */}
        <div 
          onClick={() => handleProjectClick("Nova Core")}
          className="md:col-span-5 bg-white dark:bg-brand-darkCard rounded-[2rem] p-8 shadow-soft dark:shadow-soft-dark border border-zinc-200/30 dark:border-zinc-800/20 bento-transition explode-level-1 flex flex-col justify-between min-h-[440px] group hover:-translate-y-2 cursor-pointer"
        >
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-mono bg-zinc-100 dark:bg-zinc-800 px-3 py-1 rounded-full text-zinc-500 dark:text-zinc-400">DESIGN SYSTEM</span>
            <span className="text-xs font-mono text-zinc-400">2025</span>
          </div>

          {/* Typography Graphic Mockup */}
          <div className="my-6 bg-gradient-to-br from-zinc-50 to-zinc-100/10 dark:from-zinc-950 dark:to-zinc-900/30 rounded-xl p-4 h-48 relative overflow-hidden border border-zinc-200/10 dark:border-zinc-800/10 flex items-center justify-center">
            <span className="text-5xl font-extrabold font-syne tracking-tighter text-zinc-200 dark:text-zinc-800 group-hover:scale-110 bento-transition">SYSTEMA</span>
          </div>

          <div>
            <h3 className="font-syne font-bold text-xl text-zinc-900 dark:text-white leading-tight">Nova Minimalist Component Core</h3>
            <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-2 leading-relaxed">
              A hyper-optimized component foundry yielding zero layout jank on standard browser renders.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
