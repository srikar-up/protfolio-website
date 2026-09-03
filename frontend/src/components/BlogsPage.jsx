import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';

export default function BlogsPage({ data, onClose }) {
  const { theme, accent } = useTheme();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeArticle, setActiveArticle] = useState(null);

  // Dynamic accent style mappings based on theme settings
  const textAccent = accent === 'green' ? 'text-brand-green' : 'text-brand-orange';
  const bgAccent = accent === 'green' ? 'bg-brand-green' : 'bg-brand-orange';
  const borderAccent = accent === 'green' ? 'border-brand-green/30' : 'border-brand-orange/30';
  const ringAccent = accent === 'green' ? 'ring-brand-green/20' : 'ring-brand-orange/20';

  const blogs = data?.blogs || [
    {
      id: 1,
      date: "JULY 2026",
      readTime: "5 MIN READ",
      category: "TYPOGRAPHY / ARCHITECTURE",
      title: "The Typography of Silence: Why whitespace dictates SaaS visual identity",
      desc: "An investigation into how high-fashion typography parameters dictate standard interface conversion rates and mental cognitive load.",
      content: "Whitespace is not empty space; it is a structural element. In high-converting SaaS interfaces, whitespace guides the user’s eye, establishes visual hierarchy, and reduces cognitive overload. By studying high-fashion typography variables, we can apply editorial padding parameters to layout structures to elevate brand identity and drive conversion."
    },
    {
      id: 2,
      date: "MAY 2026",
      readTime: "7 MIN READ",
      category: "GRAPHICS / ENGINEERING",
      title: "Designing for the GPU: Shifting the rendering load away from JS cycles",
      desc: "A technical look at transform layers, viewport matrices, and compositing variables that result in smooth scroll architectures.",
      content: "Smooth scrolling is achieved when the browser runs at 60fps (or 120fps). Standard JavaScript animations block the main thread. By shifting layout transformations to CSS compositor variables (using transform3d, will-change, and translateZ), we utilize the GPU directly, ensuring a lag-free layout scroll experience even with heavy coordinate grids."
    },
    {
      id: 3,
      date: "APRIL 2026",
      readTime: "4 MIN READ",
      category: "UX / INTERACTION",
      title: "The Tactile Web: Fusing physical textures with digital layout layers",
      desc: "Exploring how micro-interactions, spring physics, and subtle gradients create depth in modern interfaces.",
      content: "We experience the physical world through touch and material weight. The digital interface can simulate this weight using spring animations and coordinate depths. Designing with layers that slightly overlap and translate based on scroll speed mimics physical parallax, making the interface feel alive and tactile."
    },
    {
      id: 4,
      date: "FEB 2026",
      readTime: "6 MIN READ",
      category: "CSS / PERFORMANCE",
      title: "CSS Subgrid & Container Queries: Reimagining grid dependencies",
      desc: "A detailed look at modular card rendering systems that scale dynamically to layout grids.",
      content: "CSS container queries allow components to own their responsive styling based on their parent container width rather than the screen viewport. Together with CSS Subgrid, cards inside nested grids align perfectly to the master layout grid, preventing layout shifts and creating highly modular component foundries."
    }
  ];

  const categories = [
    { id: 'all', title: 'All Musings', date: 'Writings Log' },
    { id: 'typography', title: 'Typography & Brand', date: 'Design Theory' },
    { id: 'graphics', title: 'Graphics & GPU', date: 'Engineering Core' },
    { id: 'ux', title: 'Tactile UX & Motion', date: 'Interactivity' },
    { id: 'performance', title: 'Performance & CSS', date: 'Optimization' }
  ];

  const getNormalizedCategory = (itemCategory) => {
    const cat = (itemCategory || '').toLowerCase();
    if (cat.includes('typography')) return 'typography';
    if (cat.includes('graphics') || cat.includes('gpu')) return 'graphics';
    if (cat.includes('ux') || cat.includes('interaction') || cat.includes('motion')) return 'ux';
    if (cat.includes('performance') || cat.includes('css')) return 'performance';
    return 'other';
  };

  const filteredBlogs = selectedCategory === 'all'
    ? blogs
    : blogs.filter(item => getNormalizedCategory(item.category) === selectedCategory);

  return (
    <div className="min-h-screen py-6 px-4 md:px-8 max-w-5xl mx-auto">
      
      {/* Header controls */}
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-zinc-200/10 dark:border-zinc-800/10">
        <button 
          onClick={onClose} 
          className="flex items-center space-x-2 text-xs font-mono font-semibold uppercase tracking-wider text-zinc-500 hover:text-zinc-900 dark:hover:text-white bento-transition group"
        >
          <svg className="w-4 h-4 transform group-hover:-translate-x-1 bento-transition" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          <span>Back to Portfolio</span>
        </button>
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-brand-orange animate-pulse"></span>
          <span className="text-[10px] font-mono text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">Blogs Hub Engine</span>
        </div>
      </div>

      {/* Mobile Horizontal Category Pills (flows with scroll on mobile) */}
      <div className="lg:hidden flex items-center space-x-2 overflow-x-auto pb-4 scrollbar-none w-full select-none mb-4">
        {categories.map((cat) => {
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-xs font-mono font-semibold whitespace-nowrap bento-transition flex-shrink-0 ${
                isActive
                  ? `${bgAccent} text-white shadow-sm scale-[1.02]`
                  : 'bg-white dark:bg-brand-darkCard border border-zinc-200/50 dark:border-zinc-800/50 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
              }`}
            >
              {cat.title}
            </button>
          );
        })}
      </div>

      {/* Main Layout Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Category Timeline Menu (Desktop: sticky, follows scroll smoothly) */}
        <div className="hidden lg:block lg:col-span-4 space-y-6 lg:sticky lg:top-24 self-start">
          <section className="bg-white dark:bg-brand-darkCard rounded-[2rem] p-8 shadow-soft dark:shadow-soft-dark border border-zinc-200/30 dark:border-zinc-800/20">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-450 dark:text-zinc-500">Timeline Split</span>
              <h2 className="font-syne font-bold text-2xl text-zinc-900 dark:text-white mt-1 mb-8">Writings Filter</h2>
            </div>
            
            {/* Timeline Filter items */}
            <div className="space-y-6 relative pl-6 ml-1 border-l border-zinc-100 dark:border-zinc-850">
              {categories.map((cat, idx) => {
                const isActive = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className="relative w-full text-left group focus:outline-none block"
                  >
                    <span 
                      className={`absolute -left-[29px] top-1 w-3 h-3 rounded-full border-2 border-white dark:border-zinc-950 bento-transition ${
                        isActive 
                          ? `${bgAccent} ring-4 ${ringAccent}` 
                          : 'bg-zinc-300 dark:bg-zinc-700 group-hover:bg-zinc-500'
                      }`}
                    ></span>
                    <h3 className={`text-sm font-bold bento-transition leading-none ${
                      isActive 
                        ? 'text-zinc-900 dark:text-white scale-105' 
                        : 'text-zinc-455 dark:text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-350'
                    }`}>
                      {cat.title}
                    </h3>
                    <p className="text-[10px] font-mono text-zinc-400 dark:text-zinc-600 mt-1.5">{cat.date}</p>
                  </button>
                );
              })}
            </div>
          </section>
        </div>

        {/* Right Column: Articles Bento Grid (8 cols wide) */}
        <div className="lg:col-span-8 space-y-6">
          {filteredBlogs.length === 0 ? (
            <div className="bg-white dark:bg-brand-darkCard rounded-[2rem] p-12 text-center border border-zinc-200/30 dark:border-zinc-800/20 text-zinc-450 font-mono text-xs">
              No musings logged under this category yet.
            </div>
          ) : (
            <div className="space-y-6">
              {filteredBlogs.map((blog) => (
                <div
                  key={blog.id}
                  onClick={() => setActiveArticle(blog)}
                  className="bg-white dark:bg-brand-darkCard rounded-[2rem] p-8 shadow-soft dark:shadow-soft-dark border border-zinc-200/30 dark:border-zinc-800/20 cursor-pointer bento-transition hover:-translate-y-1 hover:shadow-soft-dark scale-100 hover:scale-[1.005] active:scale-[0.995] group flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="flex flex-wrap items-center gap-3 text-[10px] font-mono text-zinc-400 dark:text-zinc-500">
                      <span>{blog.date}</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-zinc-300 dark:bg-zinc-850"></span>
                      <span>{blog.readTime}</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-zinc-300 dark:bg-zinc-850"></span>
                      <span className={`font-bold uppercase tracking-wider ${textAccent}`}>
                        {blog.category}
                      </span>
                    </div>

                    <h3 className="font-syne font-bold text-2xl text-zinc-900 dark:text-white group-hover:text-brand-orange bento-transition leading-snug">
                      {blog.title}
                    </h3>
                    
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                      {blog.desc}
                    </p>
                  </div>

                  <div className="pt-6 border-t border-zinc-100 dark:border-zinc-800/40 flex justify-between items-center mt-6">
                    <span className={`text-xs font-mono font-bold uppercase ${textAccent} group-hover:translate-x-1 bento-transition`}>
                      Read Full Article →
                    </span>
                    <span className="text-[9px] font-mono text-zinc-400">ARTICLE LOG</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Lightbox Reading Modal */}
      {activeArticle && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm transition-opacity duration-300 animate-in fade-in"
          onClick={() => setActiveArticle(null)}
        >
          <div 
            className="bg-white dark:bg-brand-darkCard border border-zinc-200/60 dark:border-zinc-800/60 rounded-[2.5rem] w-full max-w-2xl p-8 md:p-10 shadow-2xl relative animate-in zoom-in-95 duration-200 flex flex-col justify-between"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top bar */}
            <div className="flex justify-between items-center mb-6 w-full select-none">
              <div className="flex items-center space-x-2 text-[10px] font-mono text-zinc-450">
                <span>{activeArticle.date}</span>
                <span className="w-1 h-1 rounded-full bg-zinc-300 dark:bg-zinc-850"></span>
                <span>{activeArticle.readTime}</span>
              </div>
              <button 
                onClick={() => setActiveArticle(null)}
                className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 hover:text-zinc-800 dark:hover:text-white bento-transition"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Content area */}
            <div className="space-y-6 overflow-y-auto max-h-[60vh] pr-2">
              <div className="space-y-2">
                <span className={`text-[10px] font-mono font-bold uppercase tracking-wider ${textAccent}`}>
                  {activeArticle.category}
                </span>
                <h3 className="font-syne font-extrabold text-2xl md:text-3xl text-zinc-950 dark:text-white leading-tight">
                  {activeArticle.title}
                </h3>
              </div>

              <p className="text-sm text-zinc-650 dark:text-zinc-350 leading-relaxed font-sans whitespace-pre-line">
                {activeArticle.content}
              </p>
            </div>

            {/* Footer */}
            <div className="pt-6 border-t border-zinc-100 dark:border-zinc-800/40 flex justify-between items-center text-[10px] font-mono text-zinc-400 mt-6">
              <span>EXPLORATION ID: {activeArticle.id}</span>
              <button 
                onClick={() => setActiveArticle(null)}
                className="underline hover:text-zinc-900 dark:hover:text-white bento-transition"
              >
                Done Reading
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
