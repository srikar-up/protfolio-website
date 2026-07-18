import React from 'react';

export default function MapCard() {
  return (
    <div className="lg:col-span-4 bg-white dark:bg-brand-darkCard rounded-[2rem] p-8 shadow-soft dark:shadow-soft-dark border border-zinc-200/30 dark:border-zinc-800/20 min-h-[460px] flex flex-col justify-between bento-transition explode-level-1 overflow-hidden relative">
      {/* Background map grid coordinate overlay */}
      <div className="absolute inset-0 map-grid opacity-80 z-0 pointer-events-none"></div>
      
      <div className="absolute inset-0 z-0 opacity-40 pointer-events-none flex items-center justify-center">
        <svg className="w-full h-full text-zinc-300 dark:text-zinc-800" fill="none" stroke="currentColor" strokeWidth="0.5">
          <line x1="0" y1="50%" x2="100%" y2="50%" stroke-dasharray="4"/>
          <line x1="50%" y1="0" x2="50%" y2="100%" stroke-dasharray="4"/>
          <path d="M10,20 Q60,180 180,240 T400,320" stroke="currentColor" strokeWidth="1.5" stroke-dasharray="2,5"/>
          <path d="M80,20 Q160,200 240,290 T380,450" stroke="currentColor" strokeWidth="1"/>
        </svg>
      </div>

      {/* Pulse beacon indicating location */}
      <div className="absolute top-[55%] left-[45%] z-10">
        <span className="flex h-3 w-3 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-orange opacity-75" id="map-ping"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-brand-orange" id="map-dot"></span>
        </span>
      </div>

      <div className="relative z-10">
        <div className="flex justify-between items-center">
          <span className="text-xs font-mono uppercase tracking-widest text-zinc-400 dark:text-zinc-500">Map location</span>
          <span className="text-[10px] font-mono bg-zinc-100 dark:bg-zinc-800 px-2.5 py-1 rounded-full text-zinc-400 dark:text-zinc-500">HQ</span>
        </div>
      </div>

      <div className="relative z-10 text-center pb-2">
        <h3 className="font-syne font-bold text-2xl tracking-tight text-zinc-950 dark:text-white uppercase">Punjab</h3>
        <p className="text-xs font-mono text-zinc-400 dark:text-zinc-500 mt-1">LPU, INDIA</p>
        <p className="text-[9px] font-mono text-zinc-300 dark:text-zinc-600 mt-2 tracking-widest">31.2536° N, 75.7037° E</p>
      </div>
    </div>
  );
}
