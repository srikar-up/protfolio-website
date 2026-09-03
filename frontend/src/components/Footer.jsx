import React from 'react';
import { useTheme } from '../context/ThemeContext';

export default function Footer({ onToggleDashboard, navigateTo, dataSource }) {
  const { showToast } = useTheme();
  const currentYear = new Date().getFullYear();
  const [clickCount, setClickCount] = React.useState(0);

  const handleCopyrightClick = () => {
    setClickCount(prev => {
      const next = prev + 1;
      console.log(`[Admin Trigger] Click registered. Current count: ${next}/7`);
      if (next === 7) {
        showToast("Welcome back, Srikar! Loading Control Desk...");
        if (onToggleDashboard) {
          onToggleDashboard();
        }
        return 0; // reset
      } else {
        if (next >= 2) {
          showToast(`Entering admin desk in ${7 - next} clicks...`);
        }
        return next;
      }
    });
  };

  const handleLinkClick = (name) => {
    showToast(`Redirecting to ${name}...`);
  };

  return (
    <footer className="relative z-30 border-t border-zinc-200/10 dark:border-zinc-800/10 bg-white dark:bg-zinc-950 py-16 px-6 md:px-12 text-zinc-400 dark:text-zinc-500 text-xs font-mono mt-16 w-full">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between gap-12">
        
        {/* Left Column: Branding and Email contact */}
        <div className="space-y-6 md:max-w-sm">
          <div className="flex items-center space-x-2.5">
            <svg className="w-6 h-6 text-zinc-900 dark:text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polygon points="12 3 2 21 22 21"/>
            </svg>
            <span className="font-syne font-bold text-lg text-zinc-900 dark:text-white tracking-wide">Aura Design Lab</span>
          </div>
          <p className="text-[11px] leading-relaxed text-zinc-400 dark:text-zinc-500">
            Fusing physical depth with tactile layouts. Building high-performance visual frameworks that load instantly and respond to human interaction.
          </p>
          <div className="text-zinc-955 dark:text-white font-semibold">
            <a href="mailto:hey.@aura-design.com" className="hover:text-brand-orange bento-transition">hey.@aura-design.com</a>
          </div>
        </div>

        {/* Center/Right columns: Navigation Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 md:gap-16">
          {/* Column 1: Navigation */}
          <div className="space-y-3">
            <h4 className="text-[10px] uppercase font-bold tracking-widest text-zinc-900 dark:text-white">Navigation</h4>
            <ul className="space-y-2 text-[11px] font-medium text-zinc-400 dark:text-zinc-500">
              <li>
                <button 
                  onClick={() => {
                    if (navigateTo) navigateTo('/');
                    else {
                      window.history.pushState({}, '', '/');
                      window.dispatchEvent(new PopStateEvent('popstate'));
                    }
                  }} 
                  className="hover:text-brand-orange text-left bento-transition"
                >
                  Home
                </button>
              </li>
              <li><a href="#projects" className="hover:text-brand-orange bento-transition">Projects</a></li>
              <li><a href="#skills-card" className="hover:text-brand-orange bento-transition">Skills</a></li>
              <li><a href="#contact" className="hover:text-brand-orange bento-transition">Contact</a></li>
              <li>
                <button 
                  onClick={() => {
                    if (navigateTo) navigateTo('/cv');
                    else {
                      window.history.pushState({}, '', '/cv');
                      window.dispatchEvent(new PopStateEvent('popstate'));
                    }
                  }} 
                  className="hover:text-brand-orange text-left bento-transition"
                >
                  Web CV
                </button>
              </li>
              <li>
                <button 
                  onClick={() => {
                    if (navigateTo) navigateTo('/gallery');
                    else {
                      window.history.pushState({}, '', '/gallery');
                      window.dispatchEvent(new PopStateEvent('popstate'));
                    }
                  }} 
                  className="hover:text-brand-orange text-left bento-transition"
                >
                  Creative Gallery
                </button>
              </li>
              <li>
                <button 
                  onClick={() => {
                    if (navigateTo) navigateTo('/blogs');
                    else {
                      window.history.pushState({}, '', '/blogs');
                      window.dispatchEvent(new PopStateEvent('popstate'));
                    }
                  }} 
                  className="hover:text-brand-orange text-left bento-transition"
                >
                  Blogs Hub
                </button>
              </li>
            </ul>
          </div>

          {/* Column 2: Socials */}
          <div className="space-y-3">
            <h4 className="text-[10px] uppercase font-bold tracking-widest text-zinc-900 dark:text-white">Social Connect</h4>
            <ul className="space-y-2 text-[11px] font-medium text-zinc-400 dark:text-zinc-500">
              <li><button onClick={() => handleLinkClick("Twitter")} className="hover:text-brand-orange text-left bento-transition">Twitter</button></li>
              <li><button onClick={() => handleLinkClick("LinkedIn")} className="hover:text-brand-orange text-left bento-transition">LinkedIn</button></li>
              <li><button onClick={() => handleLinkClick("GitHub")} className="hover:text-brand-orange text-left bento-transition">GitHub</button></li>
              <li><button onClick={() => handleLinkClick("Read.cv")} className="hover:text-brand-orange text-left bento-transition">Read.cv</button></li>
              <li><button onClick={() => handleLinkClick("Dribbble")} className="hover:text-brand-orange text-left bento-transition">Dribbble</button></li>
            </ul>
          </div>

          {/* Column 3: Location / Tech */}
          <div className="space-y-3 col-span-2 sm:col-span-1">
            <h4 className="text-[10px] uppercase font-bold tracking-widest text-zinc-900 dark:text-white">Location</h4>
            <p className="text-[11px] leading-relaxed text-zinc-400 dark:text-zinc-500">
              Lovely Professional University, Punjab, India<br />
              GMT +5:30
            </p>
          </div>
        </div>
      </div>

      {/* Large visual separator line */}
      <div className="border-t border-zinc-200/10 dark:border-zinc-800/10 my-10 max-w-6xl mx-auto"></div>

      {/* Bottom bar */}
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] text-zinc-400 dark:text-zinc-500 select-none">
        <div 
          onClick={handleCopyrightClick} 
          className="cursor-pointer hover:text-brand-orange bento-transition"
          title="Admin Access Key"
        >
          © {currentYear} AURA DESIGN LAB. ALL RIGHTS RESERVED.
        </div>
        <div className="flex items-center space-x-2 font-mono">
          <span className={`w-2 h-2 rounded-full ${
            dataSource && dataSource.includes('Firebase') 
              ? 'bg-emerald-500 animate-pulse shadow-sm shadow-emerald-500/50' 
              : 'bg-amber-500'
          }`}></span>
          <span className="text-[10px] tracking-wide uppercase">
            DB: {dataSource || 'Checking...'}
          </span>
        </div>
      </div>

      {/* Huge Decorative Branding text */}
      <div className="max-w-6xl mx-auto text-[10vw] font-bold font-syne text-zinc-200/35 dark:text-zinc-900/10 tracking-tighter uppercase text-center mt-12 select-none leading-none">
        Aura
      </div>
    </footer>
  );
}
