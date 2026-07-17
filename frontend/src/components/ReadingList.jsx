import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';

export default function ReadingList() {
  const { showToast } = useTheme();
  const [bookIndex, setBookIndex] = useState(0);
  const [activeAccordion, setActiveAccordion] = useState(null);

  const books = [
    {
      title: 'Dieter Rams: Complete Works',
      author: 'By Klaus Klemp',
      spine: 'rams dieter',
      color: 'bg-brand-orange text-white',
      accentColor: 'text-white'
    },
    {
      title: 'Refactoring UI',
      author: 'By Wathan & Schoger',
      spine: 'refactoring ui',
      color: 'bg-blue-600 text-white',
      accentColor: 'text-white'
    },
    {
      title: "Don't Make Me Think",
      author: 'By Steve Krug',
      spine: 'krug think',
      color: 'bg-zinc-900 dark:bg-zinc-800 text-zinc-100',
      accentColor: 'text-brand-orange'
    }
  ];

  const currentBook = books[bookIndex];

  const cycleReadBook = () => {
    const nextIndex = (bookIndex + 1) % books.length;
    setBookIndex(nextIndex);
    showToast(`Current reading item updated: ${books[nextIndex].title}`);
  };

  const toggleAccordion = (index) => {
    setActiveAccordion(prev => (prev === index ? null : index));
  };

  return (
    <div className="lg:col-span-4 bg-white dark:bg-brand-darkCard rounded-[2rem] p-8 shadow-soft dark:shadow-soft-dark border border-zinc-200/30 dark:border-zinc-800/20 min-h-[420px] flex flex-col justify-between bento-transition explode-level-1">
      <div>
        <h2 className="text-xs font-mono uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-6">What I'm reading</h2>
        
        {/* 3D Book Layout */}
        <div className="flex items-start justify-between space-x-4 mb-6">
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-white" id="book-title-disp">
              {currentBook.title}
            </h3>
            <p className="text-[11px] text-zinc-400 dark:text-zinc-500 font-mono">
              {currentBook.author}
            </p>
          </div>

          <div 
            onClick={cycleReadBook}
            id="book-3d-element"
            className={`flex-shrink-0 w-20 h-28 ${currentBook.color} p-2.5 rounded-md shadow-book transform hover:rotate-2 hover:-translate-y-1 hover:shadow-2xl bento-transition relative overflow-hidden flex flex-col justify-between cursor-pointer`}
          >
            <div className="text-[8px] font-mono tracking-widest uppercase">DESIGNER</div>
            <div className="text-[10px] font-extrabold font-syne tracking-tighter leading-none transform rotate-90 translate-y-4 origin-left uppercase" id="book-spine-text">
              {currentBook.spine}
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-zinc-100 dark:border-zinc-800/40 pt-4 space-y-2">
        <div className="text-[10px] font-mono text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-3">Key Design Principles</div>
        
        {/* Accordion Item 1 */}
        <div className="border-b border-zinc-100 dark:border-zinc-800/40 pb-1.5">
          <button 
            onClick={() => toggleAccordion(1)} 
            className="w-full flex items-center justify-between text-xs font-semibold text-zinc-800 dark:text-zinc-300 py-1 focus:outline-none"
          >
            <span>01. Less is better</span>
            <svg 
              className={`w-3 h-3 text-zinc-400 transform transition-transform duration-300 ${activeAccordion === 1 ? 'rotate-180' : 'rotate-0'}`} 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              viewBox="0 0 24 24"
            >
              <path d="M19 9l-7 7-7-7"/>
            </svg>
          </button>
          <div 
            className={`overflow-hidden transition-all duration-300 text-[11px] text-zinc-400 dark:text-zinc-500 leading-relaxed ${activeAccordion === 1 ? 'max-h-40 opacity-100 pt-1' : 'max-h-0 opacity-0'}`}
          >
            Concentrating on essential aspects, matching the purity and restraint of Zen systems.
          </div>
        </div>

        {/* Accordion Item 2 */}
        <div>
          <button 
            onClick={() => toggleAccordion(2)} 
            className="w-full flex items-center justify-between text-xs font-semibold text-zinc-800 dark:text-zinc-300 py-1 focus:outline-none"
          >
            <span>02. Thorough design</span>
            <svg 
              className={`w-3 h-3 text-zinc-400 transform transition-transform duration-300 ${activeAccordion === 2 ? 'rotate-180' : 'rotate-0'}`} 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              viewBox="0 0 24 24"
            >
              <path d="M19 9l-7 7-7-7"/>
            </svg>
          </button>
          <div 
            className={`overflow-hidden transition-all duration-300 text-[11px] text-zinc-400 dark:text-zinc-500 leading-relaxed ${activeAccordion === 2 ? 'max-h-40 opacity-100 pt-1' : 'max-h-0 opacity-0'}`}
          >
            Every single detail designed deliberately. Nothing is left to pure chance.
          </div>
        </div>
      </div>
    </div>
  );
}
