import React, { useRef } from 'react';
import { useTheme } from '../context/ThemeContext';

export default function About({ timeline = { items: [], footerText: '' } }) {
  const items = timeline.items || [];
  const footerText = timeline.footerText || '';
  const timelineContainerRef = useRef(null);
  const { accent } = useTheme();
  
  const bgAccent = accent === 'green' ? 'bg-brand-green' : 'bg-brand-orange';
  const ringAccent = accent === 'green' ? 'ring-brand-green/20' : 'ring-brand-orange/20';

  const scrollTimeline = (direction) => {
    if (timelineContainerRef.current) {
      const scrollAmount = 120;
      timelineContainerRef.current.scrollBy({
        top: direction === 'down' ? scrollAmount : -scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="lg:col-span-4 bg-white dark:bg-brand-darkCard rounded-[2rem] p-8 shadow-soft dark:shadow-soft-dark border border-zinc-200/30 dark:border-zinc-800/20 min-h-[420px] flex flex-col justify-between bento-transition explode-level-1">
      <div>
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-xs font-mono uppercase tracking-widest text-zinc-400 dark:text-zinc-500">My Education</h2>
          <div className="flex space-x-1.5 bg-zinc-100 dark:bg-zinc-800/50 p-1 rounded-full border border-zinc-200/10">
            <button 
              onClick={() => scrollTimeline('up')}
              className="w-6 h-6 rounded-full flex items-center justify-center font-bold text-[10px] text-zinc-650 dark:text-zinc-355 hover:bg-zinc-200 dark:hover:bg-zinc-700 active:scale-90 bento-transition"
              title="Scroll Up"
            >
              ↑
            </button>
            <button 
              onClick={() => scrollTimeline('down')}
              className="w-6 h-6 rounded-full flex items-center justify-center font-bold text-[10px] text-zinc-655 dark:text-zinc-355 hover:bg-zinc-200 dark:hover:bg-zinc-700 active:scale-90 bento-transition"
              title="Scroll Down"
            >
              ↓
            </button>
          </div>
        </div>
        
        <div 
          ref={timelineContainerRef}
          className="max-h-[280px] overflow-y-auto pr-2 scroll-smooth pl-6"
        >
          <div className="space-y-6 relative pl-4 border-l border-zinc-100 dark:border-zinc-800/40">
            {items.map((item, index) => {
              const isFirst = index === 0;
              return (
                <div 
                  key={item.id || index} 
                  className={`relative ${isFirst ? '' : 'opacity-70 hover:opacity-100'} bento-transition`}
                >
                  <span 
                    className={`absolute -left-[21px] top-1.5 w-2.5 h-2.5 rounded-full border-2 border-white dark:border-zinc-950 ${
                      isFirst 
                        ? `${bgAccent} ring-4 ${ringAccent}` 
                        : 'bg-zinc-400 dark:bg-zinc-650'
                    }`}
                    id={isFirst ? 'timeline-dot' : undefined}
                  ></span>
                  <h3 className={`text-sm font-semibold ${isFirst ? 'text-zinc-900 dark:text-white' : 'text-zinc-850 dark:text-zinc-300'}`}>
                    {item.title}
                  </h3>
                  <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5">{item.date}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {footerText && (
        <div className="pt-6 border-t border-zinc-100 dark:border-zinc-800/40 mt-6">
          <p className="text-xs text-zinc-400 dark:text-zinc-500 leading-normal">
            {footerText}
          </p>
        </div>
      )}
    </div>
  );
}
