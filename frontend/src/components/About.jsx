import React from 'react';

export default function About({ timeline = { items: [], footerText: '' } }) {
  const items = timeline.items || [];
  const footerText = timeline.footerText || '';

  return (
    <div className="lg:col-span-4 bg-white dark:bg-brand-darkCard rounded-[2rem] p-8 shadow-soft dark:shadow-soft-dark border border-zinc-200/30 dark:border-zinc-800/20 min-h-[420px] flex flex-col justify-between bento-transition explode-level-1">
      <div>
        <h2 className="text-xs font-mono uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-8">My Education</h2>
        
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
                      ? 'bg-zinc-900 dark:bg-white ring-4 ring-zinc-100 dark:ring-zinc-900' 
                      : 'bg-zinc-400 dark:bg-zinc-650'
                  }`}
                  id={isFirst ? 'timeline-dot' : undefined}
                ></span>
                <h3 className={`text-sm font-semibold ${isFirst ? 'text-zinc-900 dark:text-white' : 'text-zinc-800 dark:text-zinc-300'}`}>
                  {item.title}
                </h3>
                <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5">{item.date}</p>
              </div>
            );
          })}
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
