import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';

export default function ReadingList({ books = [] }) {
  const { showToast } = useTheme();
  const [bookIndex, setBookIndex] = useState(0);
  const [activeAccordion, setActiveAccordion] = useState(null);

  const currentBook = books[bookIndex] || { title: '', author: '', spine: '', color: '', highlights: [] };

  const cycleReadBook = () => {
    if (books.length === 0) return;
    const nextIndex = (bookIndex + 1) % books.length;
    setBookIndex(nextIndex);
    // Reset active accordion when cycling to next book
    setActiveAccordion(null);
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
            <div className="text-[8px] font-mono tracking-widest uppercase opacity-75">DESIGNER</div>
            <div className="text-[10px] font-extrabold font-syne tracking-tighter leading-none transform rotate-90 translate-y-4 origin-left uppercase" id="book-spine-text">
              {currentBook.spine}
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-zinc-100 dark:border-zinc-800/40 pt-4 space-y-2">
        <div className="text-[10px] font-mono text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-3">Key Points & Quotes</div>
        
        {currentBook.highlights.map((item, index) => {
          const itemNum = index + 1;
          return (
            <div key={index} className={index < currentBook.highlights.length - 1 ? "border-b border-zinc-100 dark:border-zinc-800/40 pb-1.5" : ""}>
              <button 
                onClick={() => toggleAccordion(itemNum)} 
                className="w-full flex items-center justify-between text-xs font-semibold text-zinc-800 dark:text-zinc-300 py-1 focus:outline-none text-left"
              >
                <span>{item.label}</span>
                <svg 
                  className={`w-3 h-3 text-zinc-400 transform transition-transform duration-300 ${activeAccordion === itemNum ? 'rotate-180' : 'rotate-0'}`} 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  viewBox="0 0 24 24"
                >
                  <path d="M19 9l-7 7-7-7"/>
                </svg>
              </button>
              <div 
                className={`overflow-hidden transition-all duration-300 text-[11px] text-zinc-400 dark:text-zinc-500 leading-relaxed ${activeAccordion === itemNum ? 'max-h-40 opacity-100 pt-1' : 'max-h-0 opacity-0'}`}
              >
                {item.detail}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
