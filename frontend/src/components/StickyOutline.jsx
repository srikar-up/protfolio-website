import React, { useState, useEffect, useRef } from 'react';
import { playTactileClick } from '../utils/sound';

const outlineItems = [
  { id: 'hero', num: '01', label: 'Overview' },
  { 
    id: 'about-me', 
    num: '02', 
    label: 'About Me',
    subItems: [
      { id: 'location', label: 'LOCATION' },
      { id: 'philosophy', label: 'PHILOSOPHY' }
    ]
  },
  { id: 'projects', num: '03', label: 'Projects' },
  { id: 'certifications', num: '04', label: 'Certifications' },
  { 
    id: 'profile', 
    num: '05', 
    label: 'Background',
    subItems: [
      { id: 'education', label: 'EDUCATION' },
      { id: 'skills-card', label: 'SKILLS' },
      { id: 'reading-list', label: 'MY READS' }
    ]
  },
  { id: 'github', num: '06', label: 'GitHub' },
  { id: 'blog', num: '07', label: 'Blog' },
  { id: 'contact', num: '08', label: 'Contact' },
];

export default function StickyOutline() {
  const [activeSection, setActiveSection] = useState('hero');
  const [activeSubSection, setActiveSubSection] = useState(null);
  const [hoveredItemId, setHoveredItemId] = useState(null);
  const [footerOffset, setFooterOffset] = useState(0);
  const [isScrolledPastHero, setIsScrolledPastHero] = useState(false);
  const asideRef = useRef(null);

  // Viewport Center-based active section detection (No arbitrary scroll speed bias)
  useEffect(() => {
    const checkActiveSection = () => {
      // Hide outline while on Hero section to keep Hero clean and unobstructed (matching Image 1)
      const scrollY = window.scrollY;
      setIsScrolledPastHero(scrollY > 240);

      const viewportCenter = window.innerHeight * 0.45;

      // Check all trackable element IDs
      const trackableIds = [
        'hero',
        'location',
        'philosophy',
        'projects',
        'certifications',
        'education',
        'skills-card',
        'reading-list',
        'github',
        'blog',
        'contact'
      ];

      let closestId = null;
      let minDistance = Infinity;

      trackableIds.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          // Calculate distance between element's vertical center and viewport center
          const elCenter = (rect.top + rect.bottom) / 2;
          const distance = Math.abs(elCenter - viewportCenter);

          // Give preference if element bounds contain viewport center
          const isContainingCenter = rect.top <= viewportCenter && rect.bottom >= viewportCenter;
          const effectiveDistance = isContainingCenter ? distance * 0.4 : distance;

          if (effectiveDistance < minDistance) {
            minDistance = effectiveDistance;
            closestId = id;
          }
        }
      });

      if (closestId) {
        // Map closest ID to main outline item and optional sub-section
        if (['location', 'philosophy'].includes(closestId)) {
          setActiveSection('about-me');
          setActiveSubSection(closestId);
        } else if (['education', 'skills-card', 'reading-list'].includes(closestId)) {
          setActiveSection('profile');
          setActiveSubSection(closestId);
        } else {
          setActiveSection(closestId);
          setActiveSubSection(null);
        }
      }

      // Footer collision detection: push outline up smoothly if it touches footer
      const footerEl = document.getElementById('site-footer') || document.querySelector('footer');
      if (footerEl && asideRef.current) {
        const footerRect = footerEl.getBoundingClientRect();
        const asideHeight = asideRef.current.offsetHeight || 440;
        const asideCenterY = window.innerHeight / 2;
        const asideBottomY = asideCenterY + (asideHeight / 2) + 40;

        if (footerRect.top < asideBottomY) {
          setFooterOffset(asideBottomY - footerRect.top);
        } else {
          setFooterOffset(0);
        }
      }
    };

    window.addEventListener('scroll', checkActiveSection, { passive: true });
    window.addEventListener('resize', checkActiveSection, { passive: true });
    checkActiveSection();

    return () => {
      window.removeEventListener('scroll', checkActiveSection);
      window.removeEventListener('resize', checkActiveSection);
    };
  }, []);

  const scrollTo = (id, e) => {
    if (e) e.stopPropagation();
    playTactileClick(950);
    const targetId = id === 'about-me' ? 'location' : id;
    const element = document.getElementById(targetId);
    if (element) {
      const navOffset = id === 'hero' ? 0 : 90;
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = elementPosition - navOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <aside 
      ref={asideRef}
      aria-label="Table of Contents"
      style={{
        transform: `translateY(calc(-50% - ${footerOffset}px))`
      }}
      className={`fixed left-2 min-[1280px]:left-3.5 2xl:left-6 top-1/2 z-40 hidden min-[1200px]:flex flex-col select-none w-[170px] min-[1280px]:w-[190px] 2xl:w-[215px] max-w-[175px] min-[1280px]:max-w-[195px] 2xl:max-w-[220px] transition-all duration-300 ease-out ${
        isScrolledPastHero 
          ? 'opacity-100 pointer-events-auto translate-x-0' 
          : 'opacity-0 pointer-events-none -translate-x-6'
      }`}
    >
      {/* Notion-style Seamless Outline */}
      <div className="flex flex-col bg-transparent pl-1 min-[1280px]:pl-2">
        
        {/* Outline Header */}
        <div className="mb-3 pl-1 flex items-center space-x-2 text-zinc-400 dark:text-zinc-600">
          <span className="text-[10.5px] min-[1280px]:text-[11px] font-mono tracking-[0.25em] uppercase font-bold">
            Outline
          </span>
        </div>

        {/* Big Text Navigation List */}
        <nav className="flex flex-col space-y-2.5 min-[1280px]:space-y-3 2xl:space-y-4">
          {outlineItems.map((item) => {
            const isActive = activeSection === item.id;
            const hasSubItems = Boolean(item.subItems && item.subItems.length > 0);
            const isHovered = hoveredItemId === item.id;

            return (
              <div
                key={item.id}
                onMouseEnter={() => setHoveredItemId(item.id)}
                onMouseLeave={() => setHoveredItemId(null)}
                className="relative flex flex-col"
              >
                {/* Main Item Row */}
                <button
                  onClick={() => scrollTo(hasSubItems ? (activeSubSection || item.subItems[0].id) : item.id)}
                  className="group flex items-center text-left py-0.5 focus:outline-none cursor-pointer"
                >
                  {/* Dash Marker (Only shown when not active) */}
                  <div className="w-3.5 min-[1280px]:w-4 flex items-center justify-start shrink-0">
                    {!isActive && (
                      <span className="w-2.5 h-[1.5px] bg-zinc-300 dark:bg-zinc-700 rounded-full group-hover:bg-zinc-400 dark:group-hover:bg-zinc-500 transition-colors" />
                    )}
                  </div>

                  {/* Number: Gray when inactive, Orange when active */}
                  <span className={`text-[11px] min-[1280px]:text-xs font-mono font-bold tracking-tight mr-2 min-[1280px]:mr-2.5 2xl:mr-3 shrink-0 transition-colors duration-200 ${
                    isActive 
                      ? 'text-brand-orange' 
                      : 'text-zinc-400 dark:text-zinc-600 group-hover:text-zinc-600 dark:group-hover:text-zinc-400'
                  }`}>
                    {item.num}
                  </span>

                  {/* Title */}
                  <span className={`text-[15.5px] min-[1280px]:text-[17.5px] 2xl:text-[20px] font-sans tracking-tight leading-tight transition-colors duration-200 truncate ${
                    isActive 
                      ? 'font-bold text-zinc-950 dark:text-white' 
                      : 'font-medium text-zinc-400 dark:text-zinc-500 group-hover:text-zinc-700 dark:group-hover:text-zinc-300'
                  }`}>
                    {item.label}
                  </span>
                </button>

                {/* Sub-headings (Vertical list matching screenshot) */}
                {hasSubItems && (isActive || isHovered) && (
                  <div className="flex flex-col space-y-1.5 pt-1.5 pb-1 pl-6 min-[1280px]:pl-7 2xl:pl-8 animate-fade-in">
                    {item.subItems.map((sub) => {
                      const isSubActive = activeSubSection 
                        ? activeSubSection === sub.id 
                        : (isActive && sub.id === item.subItems[0].id);
                      return (
                        <button
                          key={sub.id}
                          onClick={(e) => scrollTo(sub.id, e)}
                          className={`text-left text-[10px] min-[1280px]:text-[11px] 2xl:text-xs font-mono font-bold tracking-wider transition-colors duration-150 cursor-pointer focus:outline-none flex items-center ${
                            isSubActive
                              ? 'text-brand-orange'
                              : 'text-zinc-800 dark:text-zinc-300 hover:text-brand-orange'
                          }`}
                        >
                          <span>-{sub.label}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

      </div>
    </aside>
  );
}
