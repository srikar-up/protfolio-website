import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { handleEmailClick } from '../utils/email';
import footerLightImg from '../assets/footerlight.webp';
import footerDarkImg from '../assets/footerdark.webp';

export default function Footer({ onToggleDashboard, navigateTo, dataSource, locationData }) {
  const { showToast } = useTheme();
  const currentYear = new Date().getFullYear();
  const [clickCount, setClickCount] = React.useState(0);
  const loc = locationData || {
    fullAddress: "Lovely Professional University, Punjab, India (GMT +5:30)",
    state: "Punjab"
  };

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
    <footer id="site-footer" className="relative z-30 pt-16 pb-12 mt-16 w-full overflow-hidden select-none">
      {/* Full Scenic Alpine Landscape as the Footer Background (matching reference) */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Light Mode Landscape Background */}
        <img 
          src={footerLightImg} 
          alt="Footer Scenic Landscape" 
          className="w-full h-full object-cover object-bottom dark:hidden transition-opacity duration-700 opacity-95"
        />
        {/* Dark Mode Landscape Background */}
        <img 
          src={footerDarkImg} 
          alt="Footer Scenic Landscape Dark" 
          className="w-full h-full object-cover object-bottom hidden dark:block transition-opacity duration-700 opacity-90"
        />

        {/* Seamless top gradient blend from the page canvas */}
        <div className="absolute inset-x-0 top-0 h-44 bg-gradient-to-b from-brand-lightBg via-brand-lightBg/80 to-transparent dark:from-brand-darkBg dark:via-brand-darkBg/80 dark:to-transparent pointer-events-none" />
        
        {/* Soft edge vignette to deepen edges and naturally focus on the card */}
        <div className="absolute inset-0 bg-radial-[ellipse_at_center] from-transparent via-transparent to-brand-lightBg/30 dark:to-brand-darkBg/40 pointer-events-none" />
      </div>

      {/* Pure Text-Based Footer directly on canvas (No container box) */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 md:px-12 my-6">
        
        {/* Simple Clean Header: Only triangle logo and website name */}
        <div className="flex items-center space-x-3 mb-10 pb-6 border-b border-zinc-200/20 dark:border-white/10">
          <svg className="w-5 h-5 text-zinc-900 dark:text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polygon points="12 3 2 21 22 21"/>
          </svg>
          <span className="font-syne font-extrabold text-xl text-zinc-900 dark:text-white tracking-wide">Srikar Proto</span>
        </div>

        {/* Navigation & Connect Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 text-xs mb-10">
          <div className="space-y-2.5">
            <h5 className="text-[10px] font-mono font-bold tracking-widest uppercase text-zinc-400 dark:text-zinc-500">Navigation</h5>
            <ul className="space-y-2 text-zinc-600 dark:text-zinc-300 font-medium">
              <li><a href="#hero" className="hover:text-brand-orange transition-colors">Overview</a></li>
              <li><a href="#projects" className="hover:text-brand-orange transition-colors">Projects</a></li>
              <li><a href="#certifications" className="hover:text-brand-orange transition-colors">Certifications</a></li>
              <li><a href="#education" className="hover:text-brand-orange transition-colors">Experience</a></li>
            </ul>
          </div>

          <div className="space-y-2.5">
            <h5 className="text-[10px] font-mono font-bold tracking-widest uppercase text-zinc-400 dark:text-zinc-500">Writing & Work</h5>
            <ul className="space-y-2 text-zinc-600 dark:text-zinc-300 font-medium">
              <li><a href="#blog" className="hover:text-brand-orange transition-colors">Notebook & Blogs</a></li>
              <li><a href="#reading-list" className="hover:text-brand-orange transition-colors">Reading Shelf</a></li>
              <li><a href="#github" className="hover:text-brand-orange transition-colors">GitHub Activity</a></li>
              <li><a href="#location" className="hover:text-brand-orange transition-colors">How I Work</a></li>
            </ul>
          </div>

          <div className="space-y-2.5">
            <h5 className="text-[10px] font-mono font-bold tracking-widest uppercase text-zinc-400 dark:text-zinc-500">Social & Code</h5>
            <ul className="space-y-2 text-zinc-600 dark:text-zinc-300 font-medium">
              <li>
                <a href="https://github.com/srikar-up" target="_blank" rel="noopener noreferrer" className="hover:text-brand-orange transition-colors inline-flex items-center space-x-1">
                  <span>GitHub</span>
                  <span className="text-[9px] opacity-60">↗</span>
                </a>
              </li>
              <li>
                <a href="https://www.linkedin.com/in/srikar-maddela" target="_blank" rel="noopener noreferrer" className="hover:text-brand-orange transition-colors inline-flex items-center space-x-1">
                  <span>LinkedIn</span>
                  <span className="text-[9px] opacity-60">↗</span>
                </a>
              </li>
              <li>
                <a href="https://youtube.com/@devstonks?si=e-9bdTSIavw2EX9p" target="_blank" rel="noopener noreferrer" className="hover:text-brand-orange transition-colors inline-flex items-center space-x-1">
                  <span>YouTube</span>
                  <span className="text-[9px] opacity-60">↗</span>
                </a>
              </li>
            </ul>
          </div>

          <div className="space-y-2.5">
            <h5 className="text-[10px] font-mono font-bold tracking-widest uppercase text-zinc-400 dark:text-zinc-500">Direct Contact</h5>
            <p className="text-zinc-600 dark:text-zinc-300 text-xs leading-relaxed">
              {loc.fullAddress || 'Lovely Professional University, Punjab, India (GMT +5:30)'}
            </p>
            <a 
              href="mailto:srikarsensai@gmail.com" 
              onClick={(e) => {
                handleEmailClick(e, 'srikarsensai@gmail.com', 'Connecting with Srikar Maddela');
                showToast('Opening email client...');
              }}
              className="inline-block text-brand-orange font-semibold hover:underline font-mono text-[11px] pt-1"
            >
              srikarsensai@gmail.com ↗
            </a>
          </div>
        </div>

        {/* Bottom Row Credits */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6 border-t border-zinc-200/20 dark:border-white/10 text-xs text-zinc-500 dark:text-zinc-400">
          <div className="flex items-center space-x-2">
            <span>Made with</span>
            <span className="text-base">🥨</span>
            <span>by <strong className="text-zinc-900 dark:text-white font-semibold">Srikar Maddela</strong> in {loc.state || 'Punjab'}, India.</span>
          </div>

          <div className="flex items-center space-x-4">
            <span 
              onClick={handleCopyrightClick} 
              className="cursor-pointer hover:text-brand-orange font-mono text-[10px] transition-colors"
              title="Admin Control Key"
            >
              © {currentYear} SRIKAR PROTO
            </span>
            <span className="text-zinc-300 dark:text-zinc-700">•</span>
            <span className="font-mono text-[10px] flex items-center space-x-1.5 text-zinc-400">
              <span className={`w-1.5 h-1.5 rounded-full ${dataSource && dataSource.includes('Firestore') ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
              <span>{dataSource || 'Firestore'}</span>
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
}
