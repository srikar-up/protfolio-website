import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';

export default function Header({ navigateTo, isCV }) {
  const { theme, toggleTheme, accent, setAccent } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 w-full z-50 bento-transition print:hidden ${
      isScrolled 
        ? 'bg-brand-lightBg/80 dark:bg-brand-darkBg/80 backdrop-blur-md border-b border-zinc-200/10 dark:border-zinc-800/10 py-3 shadow-md' 
        : 'bg-transparent py-6 border-transparent'
    }`}>
      <div className="max-w-6xl mx-auto flex justify-between items-center px-6 md:px-12">
        
        {/* Brand Mark and Meta Email */}
        <div className="flex items-center space-x-6">
          <button 
            onClick={() => {
              if (navigateTo) navigateTo('/');
              else {
                window.history.pushState({}, '', '/');
                window.dispatchEvent(new PopStateEvent('popstate'));
              }
            }} 
            className="flex items-center space-x-2.5 group focus:outline-none"
          >
            <svg className="w-6 h-6 text-zinc-900 dark:text-white transition-transform duration-500 group-hover:rotate-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round">
              <polygon points="12 3 2 21 22 21"/>
            </svg>
            <span className="hidden sm:inline font-mono text-[11px] tracking-widest text-zinc-400 dark:text-zinc-500 font-medium">hey.@aura-design.com</span>
          </button>
        </div>

        {/* Custom Controls Section */}
        <div className="flex items-center space-x-3 md:space-x-4">

          {/* Theme Accent Swapper (Orange / Green) */}
          <div className="flex items-center bg-zinc-200/50 dark:bg-zinc-800/50 p-1 rounded-full space-x-1 border border-zinc-200/10">
            <button 
              onClick={() => setAccent('orange')} 
              id="btn-accent-orange" 
              className={`w-6 h-6 rounded-full bg-brand-orange border-2 transition-all duration-300 ${
                accent === 'orange' 
                  ? 'border-white dark:border-zinc-900 scale-110 shadow-md' 
                  : 'border-transparent hover:scale-105'
              }`} 
              title="Solar Orange Accent"
            ></button>
            <button 
              onClick={() => setAccent('green')} 
              id="btn-accent-green" 
              className={`w-6 h-6 rounded-full bg-brand-green border-2 transition-all duration-300 ${
                accent === 'green' 
                  ? 'border-white dark:border-zinc-900 scale-110 shadow-md' 
                  : 'border-transparent hover:scale-105'
              }`} 
              title="Emerald Green Accent"
            ></button>
          </div>

          {/* Dark/Light Theme Switcher */}
          <button 
            onClick={toggleTheme} 
            className="p-2.5 rounded-full bg-white dark:bg-zinc-950 border border-zinc-200/50 dark:border-zinc-800/50 hover:scale-105 active:scale-95 bento-transition shadow-sm"
          >
            {theme === 'dark' ? (
              /* Dark Icon (Moon) */
              <svg id="moon-icon" className="w-4 h-4 text-zinc-200" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
              </svg>
            ) : (
              /* Light Icon (Sun) */
              <svg id="sun-icon" className="w-4 h-4 text-zinc-800" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="5"></circle>
                <line x1="12" y1="1" x2="12" y2="3"></line>
                <line x1="12" y1="21" x2="12" y2="23"></line>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                <line x1="1" y1="12" x2="3" y2="12"></line>
                <line x1="21" y1="12" x2="23" y2="12"></line>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
              </svg>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
