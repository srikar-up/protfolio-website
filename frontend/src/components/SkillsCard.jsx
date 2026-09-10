import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';
import { playTactileClick } from '../utils/sound';

export default function SkillsCard({ skills = [] }) {
  const { showToast } = useTheme();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isRippling, setIsRippling] = useState(false);
  const cardSectionRef = useRef(null);

  const skillCategories = skills;

  // Trigger ripple effect whenever user enters the section after scrolling
  useEffect(() => {
    let timer = null;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Restart ripple animation on entry
          setIsRippling(false);
          clearTimeout(timer);
          timer = setTimeout(() => {
            setIsRippling(true);
          }, 50);
        } else {
          setIsRippling(false);
          clearTimeout(timer);
        }
      },
      {
        threshold: 0.25 // Triggers smoothly when deck enters view
      }
    );

    if (cardSectionRef.current) {
      observer.observe(cardSectionRef.current);
    }

    return () => {
      clearTimeout(timer);
      if (cardSectionRef.current) {
        observer.unobserve(cardSectionRef.current);
      }
    };
  }, []);


  // Directly shuffles to the next card when clicked
  const handleDeckShuffle = (e) => {
    if (e) e.stopPropagation();
    if (skillCategories.length === 0) return;
    
    playTactileClick(980);
    const nextIndex = (activeIndex + 1) % skillCategories.length;
    setActiveIndex(nextIndex);
    showToast(`Shuffled to: ${skillCategories[nextIndex].title}`);

    // Dismiss cue when user interacts manually
    setIsRippling(false);
  };


  const currentCategory = skillCategories[activeIndex] || { title: '', subtitle: '', pills: [] };

  // Helper to determine style of stack cards (Original slanted 3D fanned deck)
  const getCardStyle = (index) => {
    if (skillCategories.length === 0) return {};
    // Relative position in the stack (offset from activeIndex)
    const diff = (index - activeIndex + skillCategories.length) % skillCategories.length;
    
    if (diff === 0) {
      // Front active card
      return {
        zIndex: 30,
        transform: 'translate3d(0, 0, 0) scale(1)',
        opacity: 1,
        pointerEvents: 'auto'
      };
    } else if (diff === 1) {
      // Second card (slanted right and back)
      return {
        zIndex: 20,
        transform: 'translate3d(18px, -10px, -20px) rotate(4deg) scale(0.92)',
        opacity: 0.7,
        pointerEvents: 'auto'
      };
    } else if (diff === 2) {
      // Third card (slanted further back)
      return {
        zIndex: 10,
        transform: 'translate3d(36px, -20px, -40px) rotate(8deg) scale(0.84)',
        opacity: 0.4,
        pointerEvents: 'auto'
      };
    } else {
      // Back-most card hidden or heavily offset
      return {
        zIndex: 5,
        transform: 'translate3d(-36px, -10px, -60px) rotate(-6deg) scale(0.8)',
        opacity: 0.2,
        pointerEvents: 'auto'
      };
    }
  };

  return (
    <div id="skills-card" className="lg:col-span-4 bg-white dark:bg-brand-darkCard rounded-[2rem] p-8 shadow-soft dark:shadow-soft-dark border border-zinc-200/30 dark:border-zinc-800/20 min-h-[420px] flex flex-col justify-between bento-transition explode-level-1">
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xs font-mono uppercase tracking-widest text-brand-orange font-bold">My Skills Set</h2>
          <span className="text-[10px] font-mono text-zinc-400 dark:text-zinc-500 uppercase tracking-widest flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-orange animate-pulse"></span>
            Tap card to shuffle
          </span>
        </div>
        
        {/* Interactive Stack of Cards - Reverted to original amazing slanted animation */}
        <div 
          ref={cardSectionRef}
          onClick={handleDeckShuffle}
          className="relative h-44 w-full flex items-center justify-center overflow-visible mb-6 cursor-pointer group select-none"
          title="Click to shuffle skill deck"
        >
          {/* Small Fingertip-Sized Circle that moves towards card & ripples on scroll entry */}
          {isRippling && (
            <div className="absolute inset-0 z-40 flex items-center justify-center pointer-events-none">
              <div className="relative flex items-center justify-center animate-fingertip-move">
                {/* Fingertip circle */}
                <div className="w-[22px] h-[22px] rounded-full border-2 border-brand-orange bg-brand-orange/30 shadow-[0_0_12px_rgba(255,69,0,0.65)] flex items-center justify-center backdrop-blur-[1px]">
                  <span className="w-1.5 h-1.5 rounded-full bg-white shadow-sm" />
                </div>
                {/* Small localized fingertip ripples */}
                <span className="absolute w-[22px] h-[22px] rounded-full border border-brand-orange animate-fingertip-ripple-1 pointer-events-none" />
                <span className="absolute w-[22px] h-[22px] rounded-full border border-brand-orange/60 animate-fingertip-ripple-2 pointer-events-none" />
              </div>
            </div>
          )}


          {skillCategories.map((category, index) => {
            const style = getCardStyle(index);
            const isActive = index === activeIndex;
            return (
              <div
                key={category.id || index}
                style={style}
                className={`absolute w-44 h-28 rounded-2xl bg-gradient-to-br ${category.bgColor} text-white p-4 shadow-md flex flex-col justify-between cursor-pointer bento-transition select-none`}
              >
                <div className="flex justify-between items-start">
                  <span className="text-[9px] font-mono opacity-80 uppercase tracking-widest">SKILL DECK</span>
                  {isActive && <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>}
                </div>
                <div>
                  <h4 className="font-syne font-bold text-base leading-none mb-1">{category.title}</h4>
                  <p className="text-[9px] opacity-75 font-mono truncate">{category.subtitle}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Skill Category & Capsules */}
        <div className="text-center mb-4 select-none">
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-white uppercase tracking-wider">{currentCategory.title}</h3>
        </div>

        {/* Pills container */}
        <div className="flex flex-wrap gap-1.5 justify-center py-2 min-h-[80px]">
          {currentCategory.pills.map((pill, idx) => (
            <span 
              key={idx}
              onClick={(e) => {
                e.stopPropagation();
                showToast(`Skill details: ${pill}`);
              }}
              className="text-[10px] font-mono font-medium px-2.5 py-1 rounded-full border bg-zinc-50 dark:bg-zinc-900/60 border-zinc-200/40 dark:border-zinc-800/40 text-zinc-600 dark:text-zinc-400 hover:border-brand-orange hover:text-brand-orange dark:hover:text-white cursor-pointer bento-transition"
            >
              {pill}
            </span>
          ))}
        </div>
      </div>

      {/* Clean Bottom Deck Progress Bar & Counter (Bottom arrows removed) */}
      <div 
        onClick={handleDeckShuffle}
        className="pt-4 border-t border-zinc-100 dark:border-zinc-800/40 flex items-center justify-between cursor-pointer group select-none"
        title="Click to shuffle deck"
      >
        <div className="flex items-center space-x-1.5">
          {skillCategories.map((_, i) => (
            <span 
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === activeIndex 
                  ? 'w-6 bg-brand-orange shadow-[0_0_8px_rgba(255,69,0,0.5)]' 
                  : 'w-2 bg-zinc-200 dark:bg-zinc-750 group-hover:bg-zinc-300 dark:group-hover:bg-zinc-600'
              }`}
            />
          ))}
        </div>
        <span className="text-[10px] font-mono text-zinc-400 dark:text-zinc-500 uppercase tracking-widest group-hover:text-brand-orange transition-colors">
          SHUFFLE ({activeIndex + 1}/{skillCategories.length}) ↻
        </span>
      </div>
    </div>
  );
}
