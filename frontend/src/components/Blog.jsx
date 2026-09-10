import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';
import { playTactileClick } from '../utils/sound';

export default function Blog({ blogs = [] }) {
  const { showToast } = useTheme();
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const sliderRef = useRef(null);
  const activeIndexRef = useRef(0);
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);
  const hasDraggedRef = useRef(false);

  // Trackpad / Touchpad & Mouse Wheel handling:
  useEffect(() => {
    const el = sliderRef.current;
    if (!el) return;

    const onWheel = (e) => {
      // If user is swiping horizontally on touchpad (deltaX), let native overflow-x handle it smoothly
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
        return;
      }
      // If user scrolls vertically with mouse wheel or trackpad over the carousel, gently translate to horizontal
      if (Math.abs(e.deltaY) > 4) {
        el.scrollBy({ left: e.deltaY * 1.2, behavior: 'auto' });
      }
    };

    el.addEventListener('wheel', onWheel, { passive: true });
    return () => el.removeEventListener('wheel', onWheel);
  }, []);

  const handleSliderScroll = () => {
    if (!sliderRef.current) return;
    const container = sliderRef.current;
    const firstChild = container.children[0];
    if (!firstChild) return;
    const cardWidth = firstChild.offsetWidth + 24; // 24px gap

    // Check if scrolled to the very end
    const isAtEnd = container.scrollLeft + container.clientWidth >= container.scrollWidth - 30;

    let newIndex;
    if (isAtEnd) {
      newIndex = blogs.length - 1;
    } else {
      newIndex = Math.min(blogs.length - 1, Math.max(0, Math.round(container.scrollLeft / cardWidth)));
    }

    if (newIndex !== activeIndexRef.current) {
      activeIndexRef.current = newIndex;
      setActiveIndex(newIndex);
      playTactileClick(850);
    }
  };

  const scrollToIndex = (index) => {
    if (!sliderRef.current) return;
    const clamped = Math.max(0, Math.min(blogs.length - 1, index));
    const container = sliderRef.current;
    const targetCard = container.children[clamped];
    if (targetCard) {
      playTactileClick(950);
      if (clamped === blogs.length - 1) {
        container.scrollTo({ left: container.scrollWidth, behavior: 'smooth' });
      } else {
        const targetLeft = targetCard.offsetLeft - container.offsetLeft;
        container.scrollTo({ left: targetLeft, behavior: 'smooth' });
      }
      setActiveIndex(clamped);
      activeIndexRef.current = clamped;
    }
  };

  const handleNext = () => {
    scrollToIndex(activeIndex + 1);
  };

  const handlePrev = () => {
    scrollToIndex(activeIndex - 1);
  };

  const handleMouseDown = (e) => {
    if (!sliderRef.current) return;
    isDraggingRef.current = true;
    hasDraggedRef.current = false;
    startXRef.current = e.pageX - sliderRef.current.offsetLeft;
    scrollLeftRef.current = sliderRef.current.scrollLeft;
  };

  const handleMouseMove = (e) => {
    if (!isDraggingRef.current || !sliderRef.current) return;
    const x = e.pageX - sliderRef.current.offsetLeft;
    const walk = x - startXRef.current;
    if (Math.abs(walk) > 6) {
      hasDraggedRef.current = true;
    }
    sliderRef.current.scrollLeft = scrollLeftRef.current - walk;
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  const openBlogModal = (blog) => {
    setSelectedBlog(blog);
  };

  const closeBlogModal = () => {
    setSelectedBlog(null);
  };

  const handleReadFullBlog = (title) => {
    showToast(`Redirecting to read full article: "${title}"`);
    closeBlogModal();
  };

  return (
    <div id="blog" className="lg:col-span-12 bg-transparent rounded-[2rem] pt-6 flex flex-col gap-6 explode-level-0">
      
      {/* Section Header with Carousel Navs */}
      <div className="flex justify-between items-end px-2 select-none">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-brand-orange font-semibold">Curated Writings</span>
          <h2 className="font-syne font-bold text-3xl text-zinc-900 dark:text-white mt-1">Blog Notebook</h2>
        </div>
        
        {/* Navigation Arrows & Total counter */}
        <div className="flex items-center space-x-4">
          <span className="hidden sm:inline text-xs font-mono text-zinc-400">
            {blogs.length > 0 ? `${activeIndex + 1} OF ${blogs.length}` : '0 OF 0'}
          </span>
          <div className="flex bg-zinc-200/60 dark:bg-zinc-800/60 p-1 rounded-full border border-zinc-200/10">
            <button 
              onClick={handlePrev}
              disabled={activeIndex === 0}
              className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold bento-transition ${
                activeIndex === 0 
                  ? 'text-zinc-300 dark:text-zinc-600 cursor-not-allowed' 
                  : 'text-zinc-800 dark:text-zinc-200 hover:bg-zinc-300 dark:hover:bg-zinc-700 active:scale-95 cursor-pointer'
              }`}
              title="Previous Articles"
            >
              &lt;
            </button>
            <button 
              onClick={handleNext}
              disabled={activeIndex >= blogs.length - 1}
              className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold bento-transition ${
                activeIndex >= blogs.length - 1 
                  ? 'text-zinc-300 dark:text-zinc-600 cursor-not-allowed' 
                  : 'text-zinc-800 dark:text-zinc-200 hover:bg-zinc-300 dark:hover:bg-zinc-700 active:scale-95 cursor-pointer'
              }`}
              title="Next Articles"
            >
              &gt;
            </button>
          </div>
        </div>
      </div>

      {/* Horizontal Scrollable Touchpad Carousel Track with Clicky Snap Feel */}
      <div 
        ref={sliderRef}
        onScroll={handleSliderScroll}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className="flex gap-6 overflow-x-auto no-scrollbar snap-x snap-mandatory py-4 px-2 scroll-smooth cursor-grab active:cursor-grabbing select-none"
      >
        {blogs.map(blog => (
          <div 
            key={blog.id}
            onClick={() => {
              if (!hasDraggedRef.current) {
                openBlogModal(blog);
              }
            }}
            className="w-[88vw] sm:w-[75vw] md:w-[calc(50%-12px)] flex-shrink-0 snap-start bg-white dark:bg-brand-darkCard rounded-[2rem] p-8 shadow-soft dark:shadow-soft-dark border border-zinc-200/30 dark:border-zinc-800/20 bento-transition explode-level-1 flex flex-col justify-between min-h-[280px] group hover:-translate-y-1.5 cursor-pointer select-none"
          >
            <div className="space-y-4">
              <div className="flex items-center space-x-3 text-xs font-mono text-zinc-400">
                <span>{blog.date}</span>
                <span className="w-1 h-1 rounded-full bg-zinc-300 dark:bg-zinc-700"></span>
                <span>{blog.readTime}</span>
              </div>
              <h3 className="font-syne font-bold text-2xl text-zinc-900 dark:text-white group-hover:text-brand-orange bento-transition leading-snug">
                {blog.title}
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                {blog.desc}
              </p>
            </div>
            <div className="pt-6 border-t border-zinc-100 dark:border-zinc-800/40 flex justify-between items-center mt-6">
              <span className="text-xs font-mono font-semibold text-zinc-900 dark:text-white uppercase group-hover:translate-x-1 bento-transition">Open Article →</span>
              <span className="text-[10px] font-mono text-zinc-400">{blog.category}</span>
            </div>
          </div>
        ))}

        {/* End Spacer: ensures the final blog card can scroll fully into view and snap to the end */}
        <div className="shrink-0 w-8 md:w-16 pointer-events-none" aria-hidden="true" />
      </div>

      {/* Tactile Dot Slider Pagination */}
      <div className="flex items-center justify-center gap-2 pt-2 select-none">
        {blogs.map((blog, idx) => {
          const isCurrent = idx === activeIndex;
          return (
            <button
              key={blog.id || idx}
              onClick={() => scrollToIndex(idx)}
              aria-label={`Go to article ${idx + 1}`}
              className={`h-2.5 rounded-full transition-all duration-300 focus:outline-none cursor-pointer ${
                isCurrent
                  ? 'w-8 bg-brand-orange shadow-[0_0_12px_rgba(255,69,0,0.5)] scale-105'
                  : 'w-2.5 bg-zinc-300 dark:bg-zinc-700 hover:bg-zinc-400 dark:hover:bg-zinc-500 hover:scale-125'
              }`}
            />
          );
        })}
      </div>

      {/* Premium Popup details Modal */}
      {selectedBlog && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm transition-opacity duration-300">
          <div 
            className="bg-white dark:bg-brand-darkCard border border-zinc-200 dark:border-zinc-800 rounded-3xl max-w-xl w-full p-8 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200 flex flex-col justify-between min-h-[400px]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button 
              onClick={closeBlogModal}
              className="absolute top-6 right-6 p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 hover:text-zinc-800 dark:hover:text-white bento-transition"
              aria-label="Close modal"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Modal Content */}
            <div className="space-y-6">
              {/* Tags info */}
              <div className="flex flex-wrap gap-2 items-center text-xs font-mono text-zinc-400 dark:text-zinc-500">
                <span className="bg-zinc-100 dark:bg-zinc-800 px-3 py-1 rounded-full text-zinc-600 dark:text-zinc-300">
                  {selectedBlog.category}
                </span>
                <span className="bg-brand-orange/10 px-3 py-1 rounded-full text-brand-orange">
                  {selectedBlog.readTime}
                </span>
                <span>{selectedBlog.date}</span>
              </div>

              {/* Title */}
              <h3 className="font-syne font-bold text-3xl text-zinc-950 dark:text-white leading-tight">
                {selectedBlog.title}
              </h3>

              {/* Body */}
              <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed font-sans">
                {selectedBlog.content}
              </p>
            </div>

            {/* Read Blog Option at Bottom */}
            <div className="pt-8 border-t border-zinc-100 dark:border-zinc-800/40 flex items-center justify-between mt-8">
              <button 
                onClick={() => handleReadFullBlog(selectedBlog.title)}
                className="px-6 py-3.5 bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 hover:bg-brand-orange dark:hover:bg-brand-orange dark:hover:text-white rounded-full font-semibold text-xs shadow-md hover:scale-105 active:scale-95 bento-transition uppercase tracking-wider"
              >
                Read Blog
              </button>
              <button 
                onClick={closeBlogModal}
                className="text-xs font-mono text-zinc-400 hover:text-zinc-900 dark:hover:text-white bento-transition underline"
              >
                Close View
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
