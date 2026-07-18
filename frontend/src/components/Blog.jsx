import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';

export default function Blog({ blogs = [] }) {
  const { showToast } = useTheme();
  const [startIndex, setStartIndex] = useState(0);
  const [selectedBlog, setSelectedBlog] = useState(null);

  const handleNext = () => {
    if (startIndex + 2 < blogs.length) {
      setStartIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (startIndex > 0) {
      setStartIndex(prev => prev - 1);
    }
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

  // Select two articles to display based on the carousel index
  const visibleBlogs = blogs.slice(startIndex, startIndex + 2);

  return (
    <div className="lg:col-span-12 bg-transparent rounded-[2rem] pt-6 flex flex-col gap-6 explode-level-0">
      
      {/* Section Header with Carousel Navs */}
      <div className="flex justify-between items-end px-2 select-none">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-zinc-400 dark:text-zinc-500">Curated Writings</span>
          <h2 className="font-syne font-bold text-3xl text-zinc-900 dark:text-white mt-1">Blog Notebook</h2>
        </div>
        
        {/* Navigation Arrows & Total counter */}
        <div className="flex items-center space-x-4">
          <span className="hidden sm:inline text-xs font-mono text-zinc-400">
            {blogs.length > 0 ? `${startIndex + 1}-${Math.min(startIndex + 2, blogs.length)} OF ${blogs.length}` : '0 OF 0'}
          </span>
          <div className="flex bg-zinc-200/60 dark:bg-zinc-800/60 p-1 rounded-full border border-zinc-200/10">
            <button 
              onClick={handlePrev}
              disabled={startIndex === 0}
              className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold bento-transition ${
                startIndex === 0 
                  ? 'text-zinc-300 dark:text-zinc-600 cursor-not-allowed' 
                  : 'text-zinc-800 dark:text-zinc-200 hover:bg-zinc-300 dark:hover:bg-zinc-700 active:scale-95'
              }`}
              title="Previous Articles"
            >
              &lt;
            </button>
            <button 
              onClick={handleNext}
              disabled={startIndex + 2 >= blogs.length}
              className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold bento-transition ${
                startIndex + 2 >= blogs.length 
                  ? 'text-zinc-300 dark:text-zinc-600 cursor-not-allowed' 
                  : 'text-zinc-800 dark:text-zinc-200 hover:bg-zinc-300 dark:hover:bg-zinc-700 active:scale-95'
              }`}
              title="Next Articles"
            >
              &gt;
            </button>
          </div>
        </div>
      </div>

      {/* 2-Column Sliding Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 transition-all duration-500">
        {visibleBlogs.map(blog => (
          <div 
            key={blog.id}
            onClick={() => openBlogModal(blog)}
            className="bg-white dark:bg-brand-darkCard rounded-[2rem] p-8 shadow-soft dark:shadow-soft-dark border border-zinc-200/30 dark:border-zinc-800/20 bento-transition explode-level-1 flex flex-col justify-between min-h-[280px] group hover:-translate-y-1.5 cursor-pointer"
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
