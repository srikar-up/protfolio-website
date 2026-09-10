import React, { useState, useEffect, useRef } from 'react';
import { playTactileClick } from '../utils/sound';

const outlineItems = [
  { id: 'hero', num: '01', label: 'Overview' },
  { id: 'projects', num: '02', label: 'Projects' },
  { id: 'certifications', num: '03', label: 'Certifications' },
  { id: 'education', num: '04', label: 'Education & Skills' },
  { id: 'reading-list', num: '05', label: 'My Reads' },
  { id: 'github', num: '06', label: 'GitHub' },
  { id: 'blog', num: '07', label: 'Blog' },
  { id: 'location', num: '08', label: 'Location & Process' },
  { id: 'contact', num: '09', label: 'Contact' },
];

export default function StickyOutline() {
  const [activeSection, setActiveSection] = useState('hero');
  const [footerOffset, setFooterOffset] = useState(0);
  const asideRef = useRef(null);

  // Scroll Spy and Footer Collision Detection
  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + 260;
      let currentActive = outlineItems[0].id;

      const contactEl = document.getElementById('contact');
      const locationEl = document.getElementById('location');
      const blogEl = document.getElementById('blog');
      const githubEl = document.getElementById('github');
      const readingEl = document.getElementById('reading-list');
      const educationEl = document.getElementById('education');
      const certEl = document.getElementById('certifications');
      const projEl = document.getElementById('projects');

      if (contactEl && scrollPos >= contactEl.offsetTop - 60) {
        currentActive = 'contact';
      } else if (locationEl && scrollPos >= locationEl.offsetTop - 60) {
        currentActive = 'location';
      } else if (blogEl && scrollPos >= blogEl.offsetTop - 60) {
        currentActive = 'blog';
      } else if (githubEl && scrollPos >= githubEl.offsetTop - 60) {
        currentActive = 'github';
      } else if (readingEl && scrollPos >= readingEl.offsetTop - 60) {
        currentActive = 'reading-list';
      } else if (educationEl && scrollPos >= educationEl.offsetTop - 60) {
        currentActive = 'education';
      } else if (certEl && scrollPos >= certEl.offsetTop - 60) {
        currentActive = 'certifications';
      } else if (projEl && scrollPos >= projEl.offsetTop - 60) {
        currentActive = 'projects';
      } else {
        currentActive = 'hero';
      }

      setActiveSection(prev => (prev !== currentActive ? currentActive : prev));

      // Footer avoidance: calculate if bottom of outline hits footer top
      const footerEl = document.getElementById('site-footer') || document.querySelector('footer');
      if (footerEl && asideRef.current) {
        const footerRect = footerEl.getBoundingClientRect();
        const asideHeight = asideRef.current.offsetHeight || 440;
        const asideCenterY = window.innerHeight / 2;
        const asideBottomY = asideCenterY + (asideHeight / 2) + 40; // 40px buffer

        if (footerRect.top < asideBottomY) {
          // Push outline up by the overlap amount
          const overlap = asideBottomY - footerRect.top;
          setFooterOffset(overlap);
        } else {
          setFooterOffset(0);
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  const scrollTo = (id) => {
    playTactileClick(950);
    const element = document.getElementById(id);
    if (element) {
      const navOffset = 90;
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = elementPosition - navOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      setActiveSection(id);
    }
  };

  return (
    <aside 
      ref={asideRef}
      aria-label="Table of Contents"
      style={{
        transform: `translateY(calc(-50% - ${footerOffset}px))`
      }}
      className="fixed left-3 xl:left-6 2xl:left-12 top-1/2 z-40 hidden min-[1380px]:flex flex-col select-none pointer-events-auto max-w-[240px] 2xl:max-w-[280px] transition-transform duration-100 ease-out"
    >
      {/* Notion-style Seamless Outline (No box, no card, seamlessly blended into the canvas) */}
      <div className="flex flex-col bg-transparent pl-2">
        
        {/* Subtle Notion Header Label */}
        <div className="mb-3.5 pl-1 flex items-center space-x-2 text-zinc-400 dark:text-zinc-600">
          <span className="text-[11px] font-mono tracking-[0.25em] uppercase font-bold">
            Outline
          </span>
        </div>

        {/* Big Text Navigation List with Dedicated Dash Container */}
        <nav className="flex flex-col space-y-2.5 2xl:space-y-3.5">
          {outlineItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                className={`group flex items-center text-left py-1 px-1 transition-all duration-200 focus:outline-none cursor-pointer ${
                  isActive ? 'translate-x-1.5' : 'hover:translate-x-1'
                }`}
              >
                {/* Dedicated Dash Marker Container */}
                <div className="w-5 flex items-center justify-start shrink-0">
                  <span 
                    className={`rounded-full transition-all duration-300 ${
                      isActive
                        ? 'w-4.5 h-[2.5px] bg-brand-orange shadow-[0_0_10px_rgba(255,69,0,0.7)]'
                        : 'w-2 h-[1.5px] bg-zinc-300 dark:bg-zinc-700 group-hover:w-3.5 group-hover:bg-zinc-500 dark:group-hover:bg-zinc-400'
                    }`}
                  />
                </div>

                {/* Section Number with clear spacing */}
                <span className={`text-xs font-mono font-bold tracking-tight ml-1 mr-3 shrink-0 transition-colors duration-200 ${
                  isActive 
                    ? 'text-brand-orange' 
                    : 'text-zinc-400 dark:text-zinc-600 group-hover:text-zinc-600 dark:group-hover:text-zinc-400'
                }`}>
                  {item.num}
                </span>

                {/* Big Text Title */}
                <span className={`text-xl 2xl:text-2xl font-sans tracking-tight leading-tight transition-all duration-200 ${
                  isActive 
                    ? 'font-bold text-zinc-950 dark:text-white' 
                    : 'font-medium text-zinc-400 dark:text-zinc-500 group-hover:text-zinc-800 dark:group-hover:text-zinc-200'
                }`}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </nav>

      </div>
    </aside>
  );
}
