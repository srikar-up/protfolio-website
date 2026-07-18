import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';

export default function SkillsCard({ skills = [] }) {
  const { showToast } = useTheme();
  const [activeIndex, setActiveIndex] = useState(0);

  const skillCategories = skills;

  const cycleNext = () => {
    if (skillCategories.length === 0) return;
    setActiveIndex(prev => (prev + 1) % skillCategories.length);
  };

  const cyclePrev = () => {
    if (skillCategories.length === 0) return;
    setActiveIndex(prev => (prev - 1 + skillCategories.length) % skillCategories.length);
  };

  const handleCardClick = (index) => {
    setActiveIndex(index);
    showToast(`Category switched to: ${skillCategories[index].title}`);
  };

  const currentCategory = skillCategories[activeIndex] || { title: '', subtitle: '', pills: [] };

  // Helper to determine style of stack cards
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
        <h2 className="text-xs font-mono uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-6">My Skills Set</h2>
        
        {/* Stack of Cards (Representing skill categories) */}
        <div className="relative h-44 w-full flex items-center justify-center overflow-visible mb-6">
          {skillCategories.map((category, index) => {
            const style = getCardStyle(index);
            const isActive = index === activeIndex;
            return (
              <div
                key={category.id}
                onClick={() => handleCardClick(index)}
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
              onClick={() => showToast(`Skill details: ${pill}`)}
              className="text-[10px] font-mono font-medium px-2.5 py-1 rounded-full border bg-zinc-50 dark:bg-zinc-900/60 border-zinc-200/40 dark:border-zinc-800/40 text-zinc-600 dark:text-zinc-400 hover:border-brand-orange hover:text-brand-orange dark:hover:text-white cursor-pointer bento-transition"
            >
              {pill}
            </span>
          ))}
        </div>
      </div>

      {/* Navigation Arrows at bottom footer */}
      <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800/40 flex items-center justify-between">
        <div className="flex space-x-2 bg-zinc-100 dark:bg-zinc-800/50 p-1 rounded-full border border-zinc-200/10">
          <button 
            onClick={cyclePrev} 
            className="w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700 active:scale-95 bento-transition"
            title="Previous Skill Deck"
          >
            &lt;
          </button>
          <button 
            onClick={cycleNext} 
            className="w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700 active:scale-95 bento-transition"
            title="Next Skill Deck"
          >
            &gt;
          </button>
        </div>
        <span className="text-[10px] font-mono text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">
          DECK {activeIndex + 1}/{skillCategories.length}
        </span>
      </div>
    </div>
  );
}
