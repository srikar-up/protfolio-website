import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useTheme } from '../context/ThemeContext';
import { playTactileClick } from '../utils/sound';

export const formatExternalUrl = (url) => {
  if (!url || typeof url !== 'string') return '';
  const trimmed = url.trim();
  if (!trimmed) return '';
  if (/^(https?:\/\/|\/\/|mailto:|tel:)/i.test(trimmed)) {
    return trimmed;
  }
  return `https://${trimmed}`;
};

export const getProjectImageData = (project) => {
  if (!project) return [];
  const results = [];
  const seenUrls = new Set();

  const addImage = (url, tag = '') => {
    if (!url || typeof url !== 'string') return;
    const trimmed = url.trim();
    if (!trimmed || seenUrls.has(trimmed)) return;
    seenUrls.add(trimmed);
    results.push({ url: trimmed, tag: (tag || '').trim() });
  };

  if (Array.isArray(project.images)) {
    project.images.forEach((img, idx) => {
      if (typeof img === 'string') {
        const tag = Array.isArray(project.imageTags) ? (project.imageTags[idx] || '') : '';
        addImage(img, tag);
      } else if (img && typeof img === 'object') {
        addImage(img.url || img.image || img.src, img.tag || img.label || img.title || '');
      }
    });
  }
  if (project.image && typeof project.image === 'string') {
    const parts = project.image.split(/[,\n]+/).map(s => s.trim()).filter(Boolean);
    parts.forEach((p, idx) => {
      const tag = Array.isArray(project.imageTags) ? (project.imageTags[idx] || '') : '';
      addImage(p, tag);
    });
  }
  return results;
};

export const getProjectImages = (project) => {
  return getProjectImageData(project).map(item => item.url);
};

export default function Projects({ items = [], onToggleCv }) {
  const { showToast } = useTheme();
  const [scrollProgress, setScrollProgress] = useState(0);
  const [modalScrollProgress, setModalScrollProgress] = useState(0);
  const modalCardsContainerRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;

      const start = viewportHeight; 
      const end = viewportHeight * 0.25; 

      const current = rect.top;
      const progress = (start - current) / (start - end);
      const clampedProgress = Math.max(0, Math.min(1, progress));

      setScrollProgress(clampedProgress);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedProject, setSelectedProject] = useState(null);
  const [lightboxData, setLightboxData] = useState(null);
  const containerRef = useRef(null);
  const sliderRef = useRef(null);
  const activeIndexRef = useRef(0);
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);
  const hasDraggedRef = useRef(false);

  const projects = items;

  // Trackpad / Touchpad & Mouse Wheel handling:
  useEffect(() => {
    const el = sliderRef.current;
    if (!el) return;

    const onWheel = (e) => {
      // If user is swiping horizontally on touchpad (deltaX), let native overflow-x handle it smoothly with momentum!
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
        return;
      }
      // If user scrolls vertically with mouse wheel or trackpad over the carousel, gently translate it to horizontal movement
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
      newIndex = projects.length - 1;
    } else {
      newIndex = Math.min(projects.length - 1, Math.max(0, Math.round(container.scrollLeft / cardWidth)));
    }

    if (newIndex !== activeIndexRef.current) {
      activeIndexRef.current = newIndex;
      setActiveIndex(newIndex);
      playTactileClick(850);
    }
  };

  const scrollToIndex = (index) => {
    if (!sliderRef.current) return;
    const clamped = Math.max(0, Math.min(projects.length - 1, index));
    const container = sliderRef.current;
    const targetCard = container.children[clamped];
    if (targetCard) {
      playTactileClick(950);
      if (clamped === projects.length - 1) {
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

  const scrollModalCards = (direction) => {
    if (!modalCardsContainerRef.current) return;
    const container = modalCardsContainerRef.current;
    const scrollAmount = container.clientWidth * 0.5 * direction;
    container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };

  const updateModalSliderProgress = () => {
    if (!modalCardsContainerRef.current) return;
    const container = modalCardsContainerRef.current;
    const maxScrollLeft = container.scrollWidth - container.clientWidth;
    if (maxScrollLeft > 0) {
      const scrollPercentage = container.scrollLeft / maxScrollLeft;
      const translation = Math.max(0, Math.min(200, scrollPercentage * 200));
      setModalScrollProgress(translation);
    } else {
      setModalScrollProgress(0);
    }
  };

  const openProjectModal = (project) => {
    setSelectedProject(project);
    setModalScrollProgress(0);
  };

  const closeProjectModal = () => {
    setSelectedProject(null);
    setModalScrollProgress(0);
  };

  const openLightbox = (images, index = 0, title = '') => {
    if (!images || images.length === 0) return;
    setLightboxData({
      images,
      index: Math.max(0, Math.min(images.length - 1, index)),
      title: title || (selectedProject ? selectedProject.title : 'Project Preview')
    });
    playTactileClick(900);
  };

  const closeLightbox = () => {
    setLightboxData(null);
    playTactileClick(750);
  };

  const handleLightboxNext = (e) => {
    if (e) e.stopPropagation();
    if (!lightboxData || lightboxData.images.length <= 1) return;
    setLightboxData(prev => ({
      ...prev,
      index: (prev.index + 1) % prev.images.length
    }));
    playTactileClick(850);
  };

  const handleLightboxPrev = (e) => {
    if (e) e.stopPropagation();
    if (!lightboxData || lightboxData.images.length <= 1) return;
    setLightboxData(prev => ({
      ...prev,
      index: (prev.index - 1 + prev.images.length) % prev.images.length
    }));
    playTactileClick(850);
  };

  const handleLaunchProject = (project) => {
    if (!project) return;
    const launchUrl = formatExternalUrl(
      project.demoUrl || project.url || project.link || project.liveUrl || project.projectUrl || project.sandboxUrl
    );
    if (launchUrl) {
      window.open(launchUrl, '_blank', 'noopener,noreferrer');
      showToast(`Launching project: "${project.title}"`);
    } else {
      showToast(`No live URL configured for: "${project.title}"`);
    }
  };

  const handleModalNext = () => {
    if (selectedProject) {
      const currentIndex = projects.findIndex(p => p.id === selectedProject.id);
      const nextIndex = (currentIndex + 1) % projects.length;
      setSelectedProject(projects[nextIndex]);
      setModalScrollProgress(0);
    }
  };

  const handleModalPrev = () => {
    if (selectedProject) {
      const currentIndex = projects.findIndex(p => p.id === selectedProject.id);
      const prevIndex = (currentIndex - 1 + projects.length) % projects.length;
      setSelectedProject(projects[prevIndex]);
      setModalScrollProgress(0);
    }
  };

  // Reset modal scroll track on selectedProject change
  useEffect(() => {
    if (selectedProject && modalCardsContainerRef.current) {
      modalCardsContainerRef.current.scrollLeft = 0;
      setModalScrollProgress(0);
    }
  }, [selectedProject]);

  // Keep modal slider progress updated on resize
  useEffect(() => {
    window.addEventListener('resize', updateModalSliderProgress);
    return () => window.removeEventListener('resize', updateModalSliderProgress);
  }, []);

  // Smooth wheel scroll on modal cards track
  useEffect(() => {
    const el = modalCardsContainerRef.current;
    if (!el) return;

    const onWheel = (e) => {
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
      if (Math.abs(e.deltaY) > 4) {
        el.scrollBy({ left: e.deltaY * 1.2, behavior: 'auto' });
      }
    };

    el.addEventListener('wheel', onWheel, { passive: true });
    return () => el.removeEventListener('wheel', onWheel);
  }, [selectedProject]);

  const selectedIndex = selectedProject ? projects.findIndex(p => p.id === selectedProject.id) : 0;

  // Close modal/lightbox on Escape key, keyboard arrows, and lock body scroll
  useEffect(() => {
    if (!selectedProject && !lightboxData) return;
    const handleKeyDown = (e) => {
      if (lightboxData) {
        if (e.key === 'Escape') {
          closeLightbox();
        } else if (e.key === 'ArrowRight') {
          handleLightboxNext();
        } else if (e.key === 'ArrowLeft') {
          handleLightboxPrev();
        }
        return;
      }

      if (selectedProject) {
        if (e.key === 'Escape') {
          closeProjectModal();
        } else if (e.key === 'ArrowRight') {
          handleModalNext();
        } else if (e.key === 'ArrowLeft') {
          handleModalPrev();
        }
      }
    };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [selectedProject, lightboxData, projects]);

  return (
    <div 
      ref={containerRef}
      id="projects" 
      className="lg:col-span-12 bg-transparent rounded-[2rem] pt-12 pb-6 flex flex-col gap-6 explode-level-0 overflow-hidden"
    >
      
      {/* Section Header with Carousel Navigation & Touchpad Instructions */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 px-2 select-none">
        <div>
          <div className="flex items-center space-x-2.5 mb-1.5">
            <span className="text-xs font-mono uppercase tracking-widest text-brand-orange font-semibold">Selected Masterpieces</span>
            <span className="w-1.5 h-1.5 rounded-full bg-brand-orange animate-pulse"></span>
          </div>
          <h2 className="font-syne font-bold text-3xl md:text-4xl text-zinc-900 dark:text-white">Projects</h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2 flex items-center gap-2">
            <span className="font-medium text-brand-orange">Click to preview</span>
            <span className="text-zinc-300 dark:text-zinc-700">•</span>
            <span>Interactive architectures, sandboxes & engineering deep dives</span>
          </p>
        </div>
        
        {/* Navigation Arrows & Counter */}
        <div className="flex items-center space-x-4">
          <span className="hidden sm:inline text-xs font-mono text-zinc-400">
            {activeIndex + 1} OF {projects.length}
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
              title="Previous Project"
            >
              &lt;
            </button>
            <button 
              onClick={handleNext}
              disabled={activeIndex >= projects.length - 1}
              className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold bento-transition ${
                activeIndex >= projects.length - 1 
                  ? 'text-zinc-300 dark:text-zinc-600 cursor-not-allowed' 
                  : 'text-zinc-800 dark:text-zinc-200 hover:bg-zinc-300 dark:hover:bg-zinc-700 active:scale-95 cursor-pointer'
              }`}
              title="Next Project"
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
        {projects.map((project, idx) => {
          const projectImages = getProjectImages(project);
          const primaryImage = projectImages[0];
          const cardLaunchUrl = formatExternalUrl(
            project.demoUrl || project.url || project.link || project.liveUrl || project.projectUrl || project.sandboxUrl
          );
          const cardVideoLink = formatExternalUrl(
            project.videoUrl || project.video || project.youtubeUrl || project.demoVideo
          );

          return (
            <div 
              key={project.id}
              onClick={() => {
                if (!hasDraggedRef.current) {
                  openProjectModal(project);
                }
              }}
              className="w-[88vw] sm:w-[75vw] md:w-[calc(50%-12px)] flex-shrink-0 snap-start bg-white dark:bg-brand-darkCard rounded-[2rem] p-4 sm:p-5 shadow-soft dark:shadow-soft-dark border border-zinc-200/60 dark:border-zinc-800/60 flex flex-col justify-between group hover:-translate-y-1.5 cursor-pointer bento-transition select-none will-change-transform relative overflow-hidden"
              title="Click to preview project details and sandbox"
            >
              <div>
                {/* Top Image Media Container (Always Visible) */}
                <div className="w-full aspect-[16/10] bg-zinc-900 rounded-2xl overflow-hidden relative shadow-sm border border-zinc-100 dark:border-zinc-800/80 mb-4">
                  {primaryImage ? (
                    <img 
                      src={primaryImage} 
                      alt={project.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out" 
                      loading="lazy"
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-zinc-800 via-zinc-900 to-black flex items-center justify-center">
                      <span className="text-zinc-600 font-mono text-xs uppercase tracking-wider">{project.title}</span>
                    </div>
                  )}

                  {/* Photo Count Badge (Top-Left Pill) */}
                  {projectImages.length > 0 && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        openLightbox(getProjectImageData(project), 0, project.title);
                      }}
                      className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/65 hover:bg-black/85 active:scale-95 backdrop-blur-md text-white text-[11px] font-mono font-medium flex items-center gap-1.5 border border-white/15 shadow-sm transition-all hover:scale-105 cursor-pointer select-none"
                      title="Click to view screenshots in big screen"
                    >
                      <svg className="w-3.5 h-3.5 text-brand-orange shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span>{projectImages.length} {projectImages.length === 1 ? 'Photo' : 'Photos'}</span>
                    </button>
                  )}
                </div>

                {/* Metadata Row: Year • Tag and CV status */}
                <div className="flex items-center justify-between gap-2 mb-2 px-0.5">
                  <div className="flex items-center space-x-2 text-xs font-mono text-zinc-400 dark:text-zinc-500 font-semibold uppercase tracking-wider truncate">
                    <span>{project.year}</span>
                    <span>•</span>
                    <span className="truncate">{project.tag}</span>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onToggleCv) onToggleCv(project.id);
                    }}
                    className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full border bento-transition flex items-center space-x-1 shrink-0 ${
                      project.showInCv !== false
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20'
                        : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400 border-zinc-200 dark:border-zinc-700 hover:bg-zinc-200'
                    }`}
                    title={project.showInCv !== false ? "Included in CV (Click to toggle)" : "Excluded from CV (Click to toggle)"}
                  >
                    <span>{project.showInCv !== false ? '✓ IN CV' : '+ ADD TO CV'}</span>
                  </button>
                </div>

                {/* Project Title */}
                <h3 className="font-syne font-bold text-2xl text-zinc-900 dark:text-white group-hover:text-brand-orange transition-colors duration-200 leading-snug px-0.5 mb-2">
                  {project.title}
                </h3>

                {/* Project Description */}
                <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed line-clamp-3 px-0.5 mb-3">
                  {project.desc || project.content}
                </p>
              </div>

              {/* Bottom Action Footer */}
              <div className="pt-3.5 border-t border-zinc-100 dark:border-zinc-800/60 flex justify-between items-center mt-2 px-0.5">
                <span className="text-xs font-mono font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-brand-orange uppercase tracking-wider group-hover:translate-x-1 bento-transition flex items-center gap-1.5">
                  <span>CLICK TO PREVIEW →</span>
                </span>
                
                <div className="flex items-center space-x-2">
                  {cardVideoLink && (
                    <a
                      href={cardVideoLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="flex items-center space-x-1 px-3 py-1.5 rounded-full bg-red-500/10 hover:bg-red-600 hover:text-white text-red-500 text-[10px] font-mono font-bold bento-transition cursor-pointer"
                      title="Watch Demo Video"
                    >
                      <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                      <span>VIDEO</span>
                    </a>
                  )}
                  {cardLaunchUrl ? (
                    <a
                      href={cardLaunchUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="text-[10px] font-mono font-bold px-3 py-1.5 rounded-full bg-zinc-100 dark:bg-zinc-800 hover:bg-brand-orange hover:text-white dark:hover:bg-brand-orange dark:hover:text-white text-zinc-700 dark:text-zinc-300 bento-transition flex items-center gap-1.5 cursor-pointer shadow-sm"
                      title={`Launch ${cardLaunchUrl}`}
                    >
                      <span>LAUNCH</span>
                      <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                      </svg>
                    </a>
                  ) : (
                    <span className="text-[10px] font-mono text-zinc-400 font-medium">
                      CODE
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {/* End Spacer: ensures the final project card can scroll fully into view and snap to the end */}
        <div className="shrink-0 w-8 md:w-16 pointer-events-none" aria-hidden="true" />
      </div>

      {/* Tactile Dot Slider Pagination */}
      <div className="flex items-center justify-center gap-2 pt-2 select-none">
        {projects.map((project, idx) => {
          const isCurrent = idx === activeIndex;
          return (
            <button
              key={project.id || idx}
              onClick={() => scrollToIndex(idx)}
              aria-label={`Go to project ${idx + 1}`}
              className={`h-2.5 rounded-full transition-all duration-300 focus:outline-none cursor-pointer ${
                isCurrent
                  ? 'w-8 bg-brand-orange shadow-[0_0_12px_rgba(255,69,0,0.5)] scale-105'
                  : 'w-2.5 bg-zinc-300 dark:bg-zinc-700 hover:bg-zinc-400 dark:hover:bg-zinc-500 hover:scale-125'
              }`}
            />
          );
        })}
      </div>

      {/* Premium Sandwiched Project View Modal (rendered via createPortal) */}
      {selectedProject && createPortal(
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 md:p-6 bg-black/80 backdrop-blur-md transition-opacity duration-300 antialiased"
          onClick={closeProjectModal}
        >
          <div 
            className="bg-white dark:bg-zinc-900 rounded-[2rem] w-full max-w-[940px] h-[92vh] md:h-[670px] max-h-[700px] shadow-2xl flex flex-col overflow-hidden modal-animate relative border border-gray-100 dark:border-zinc-800"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 1. TOP BUN: Pinned Header */}
            <header className="flex items-center justify-between px-5 sm:px-7 py-3.5 sm:py-4 border-b border-gray-100 dark:border-zinc-800 shrink-0 bg-white dark:bg-zinc-900 z-10 select-none">
              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                <span className="px-3.5 py-1 rounded-full bg-gray-100 dark:bg-zinc-800 text-gray-500 dark:text-zinc-400 text-[10px] font-bold tracking-[0.15em] uppercase">
                  {selectedProject.tag || 'Frontend Engineering / UI Redesign'}
                </span>
                <span className="px-3.5 py-1 rounded-full border border-orange-100 dark:border-orange-500/20 bg-orange-50 dark:bg-orange-500/10 text-orange-500 text-[11px] font-bold tracking-widest">
                  {selectedProject.year || '2026'}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    if (onToggleCv) onToggleCv(selectedProject.id);
                    setSelectedProject(prev => prev ? { ...prev, showInCv: prev.showInCv === false ? true : false } : null);
                  }}
                  className={`px-3.5 py-1 rounded-full border text-[11px] font-bold tracking-widest flex items-center gap-1.5 transition-colors cursor-pointer ${
                    selectedProject.showInCv !== false
                      ? 'border-green-100 dark:border-emerald-500/30 bg-green-50 dark:bg-emerald-500/10 text-green-500 dark:text-emerald-400'
                      : 'border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 text-gray-400 dark:text-zinc-500'
                  }`}
                  title={selectedProject.showInCv !== false ? "Included in CV (Click to toggle)" : "Excluded from CV (Click to toggle)"}
                >
                  {selectedProject.showInCv !== false ? (
                    <>
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                      <span>IN CV</span>
                    </>
                  ) : (
                    <span>+ ADD TO CV</span>
                  )}
                </button>
              </div>

              <button 
                type="button"
                onClick={closeProjectModal}
                className="w-9 h-9 rounded-full bg-gray-50 dark:bg-zinc-800 flex items-center justify-center text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-700 hover:text-gray-800 dark:hover:text-white transition-colors cursor-pointer"
                title="Close (Esc)"
                aria-label="Close modal"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </header>

            {/* 2. UPPER SLICE: Compact Horizontal Cards Track & Controls */}
            <div className="shrink-0 pt-3.5 pb-1 px-5 sm:px-7 flex flex-col bg-white dark:bg-zinc-900 border-b border-gray-50 dark:border-zinc-800/40">
              {/* Cards Scroll Track */}
              <div 
                ref={modalCardsContainerRef}
                onScroll={updateModalSliderProgress}
                className="flex gap-3 overflow-x-auto hide-scrollbar snap-x snap-mandatory pb-2" 
                id="cards-container"
              >
                {(() => {
                  const modalImages = getProjectImageData(selectedProject);
                  if (modalImages.length === 0) {
                    return (
                      <div className="snap-start shrink-0 w-[68%] sm:w-[48%] md:w-[38%] h-36 sm:h-40 md:h-44 bg-gray-900 rounded-2xl overflow-hidden relative group shadow-sm border border-gray-100 dark:border-zinc-800 flex flex-col items-center justify-center text-center p-4 select-none">
                        <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-500 mb-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                        </div>
                        <span className="text-zinc-400 text-[11px] font-mono uppercase tracking-widest">No screenshots uploaded</span>
                      </div>
                    );
                  }

                  const dotColors = ['bg-orange-500', 'bg-blue-500', 'bg-emerald-500', 'bg-purple-500', 'bg-amber-500', 'bg-rose-500'];
                  const defaultLabels = [
                    'Dashboard View',
                    'Orbital Mapping',
                    'Data Systems',
                    'Architecture & Flow',
                    'Module Interface',
                    'Sandbox Live'
                  ];

                  return modalImages.map((item, idx) => {
                    const dotColor = dotColors[idx % dotColors.length];
                    const cardLabel = item.tag || (modalImages.length === 1 
                      ? 'Dashboard View' 
                      : (defaultLabels[idx % defaultLabels.length] || `View 0${idx + 1}`));

                    return (
                      <div 
                        key={idx} 
                        onClick={() => openLightbox(modalImages, idx, selectedProject.title)}
                        className="snap-start shrink-0 w-[72%] sm:w-[48%] md:w-[38%] h-36 sm:h-40 md:h-44 aspect-[16/10] bg-gray-900 rounded-2xl overflow-hidden relative group shadow-sm border border-gray-100 dark:border-zinc-800 select-none cursor-pointer hover:border-brand-orange/60 transition-all hover:shadow-md"
                        title="Click to view in big screen with navigation arrows"
                      >
                        <img 
                          src={item.url} 
                          alt={`${selectedProject.title} ${cardLabel}`}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                          onError={(e) => { e.target.style.display = 'none'; }}
                        />

                        {/* Big Screen Overlay on Hover */}
                        <div className="absolute inset-0 bg-black/35 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center pointer-events-none">
                          <div className="px-3.5 py-1.5 rounded-full bg-black/75 backdrop-blur-md text-white text-[10px] font-mono font-medium flex items-center gap-2 border border-white/25 shadow-xl transform scale-95 group-hover:scale-100 transition-transform">
                            <svg className="w-3.5 h-3.5 text-brand-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
                            </svg>
                            <span>Big Screen ↗</span>
                          </div>
                        </div>

                        <div className="absolute bottom-2.5 left-2.5 bg-black/80 backdrop-blur-md rounded-full px-3 py-1 flex items-center gap-2 text-white text-[9px] font-bold tracking-widest uppercase pointer-events-none max-w-[90%]">
                          <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotColor}`}></div>
                          <span className="truncate">{cardLabel}</span>
                        </div>
                      </div>
                    );
                  });
                })()}
              </div>

              {/* Track Controls: Arrows, Deck Counter, and Progress Bar */}
              <div className="pt-1 pb-2 flex items-center justify-between select-none">
                
                <div className="flex items-center gap-4 sm:gap-6">
                  {/* Navigation Arrows */}
                  <div className="flex gap-1.5">
                    <button 
                      type="button"
                      onClick={() => scrollModalCards(-1)} 
                      className="w-7 h-7 rounded-full bg-gray-50 dark:bg-zinc-800 flex items-center justify-center text-gray-400 hover:bg-gray-200 dark:hover:bg-zinc-700 hover:text-gray-800 dark:hover:text-white transition-colors cursor-pointer"
                      title="Scroll cards left"
                      aria-label="Scroll left"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7"></path></svg>
                    </button>
                    <button 
                      type="button"
                      onClick={() => scrollModalCards(1)} 
                      className="w-7 h-7 rounded-full bg-gray-50 dark:bg-zinc-800 flex items-center justify-center text-gray-400 hover:bg-gray-200 dark:hover:bg-zinc-700 hover:text-gray-800 dark:hover:text-white transition-colors cursor-pointer"
                      title="Scroll cards right"
                      aria-label="Scroll right"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7"></path></svg>
                    </button>
                  </div>

                  {/* Deck Counter with subtle Project Switcher */}
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] font-bold text-gray-400 dark:text-zinc-500 tracking-[0.2em] uppercase">
                      Deck {selectedIndex + 1}/{projects.length}
                    </span>
                    {projects.length > 1 && (
                      <div className="flex items-center gap-0.5 pl-1">
                        <button
                          type="button"
                          onClick={handleModalPrev}
                          className="text-gray-400 hover:text-gray-700 dark:hover:text-zinc-200 p-0.5 rounded cursor-pointer transition-colors"
                          title="Previous Project (ArrowLeft)"
                          aria-label="Previous project"
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7"></path></svg>
                        </button>
                        <button
                          type="button"
                          onClick={handleModalNext}
                          className="text-gray-400 hover:text-gray-700 dark:hover:text-zinc-200 p-0.5 rounded cursor-pointer transition-colors"
                          title="Next Project (ArrowRight)"
                          aria-label="Next project"
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7"></path></svg>
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Custom Visual Progress Bar */}
                <div className="hidden md:block w-40 h-1 bg-gray-100 dark:bg-zinc-800 rounded-full overflow-hidden relative">
                  <div 
                    id="slider-progress" 
                    style={{ transform: `translateX(${modalScrollProgress}%)` }}
                    className="absolute top-0 left-0 h-full w-1/3 bg-orange-500 rounded-full transition-all duration-200 ease-out"
                  ></div>
                </div>

              </div>
            </div>

            {/* 3. MIDDLE FILLING: Project Title & Sandwiched Scrollable Description */}
            <div className="px-5 sm:px-7 pt-3.5 pb-1 shrink-0 select-text">
              <h2 className="text-xl sm:text-2xl md:text-[1.65rem] font-bold font-syne text-gray-900 dark:text-white tracking-tight leading-snug">
                {selectedProject.title}
              </h2>
            </div>

            {/* Sandwiched Scrollable Description (Only this area scrolls down when needed!) */}
            <div className="flex-1 min-h-0 overflow-y-auto px-5 sm:px-7 py-2 text-gray-500 dark:text-zinc-400 leading-relaxed text-xs sm:text-sm space-y-2.5 custom-scrollbar select-text">
              {(() => {
                const desc = (selectedProject.desc || '').trim();
                const content = (selectedProject.content || '').trim();
                
                if (desc && content && desc !== content) {
                  const contentParas = content.split(/\n{2,}|\n/).map(s => s.trim()).filter(Boolean);
                  return (
                    <>
                      <p className="font-medium text-zinc-700 dark:text-zinc-200 text-xs sm:text-sm">{desc}</p>
                      {contentParas.map((para, i) => (
                        <p key={i}>{para}</p>
                      ))}
                    </>
                  );
                }
                
                const text = content || desc || 'No description available for this project.';
                const paragraphs = text.split(/\n{2,}|\n/).map(s => s.trim()).filter(Boolean);
                return paragraphs.map((para, i) => (
                  <p key={i}>{para}</p>
                ));
              })()}
            </div>

            {/* 4. BOTTOM BUN: Pinned Footer with Always-Visible Launch Sandbox */}
            <footer className="flex items-center justify-between px-5 sm:px-7 py-3.5 border-t border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 shrink-0 z-10 select-none">
              <div className="flex flex-wrap items-center gap-2.5">
                {(() => {
                  const modalLaunchUrl = formatExternalUrl(
                    selectedProject.demoUrl || selectedProject.url || selectedProject.link || selectedProject.liveUrl || selectedProject.projectUrl || selectedProject.sandboxUrl
                  );
                  if (modalLaunchUrl) {
                    return (
                      <a 
                        href={modalLaunchUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => showToast(`Launching sandbox: "${selectedProject.title}"`)}
                        className="bg-black hover:bg-gray-800 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-black px-7 py-2.5 rounded-full font-bold text-[10px] sm:text-[11px] tracking-[0.15em] transition-all flex items-center gap-2 shadow-lg shadow-black/10 hover:shadow-black/20 hover:-translate-y-0.5 cursor-pointer uppercase"
                        title={`Open live sandbox in new tab (${modalLaunchUrl})`}
                      >
                        <span>LAUNCH SANDBOX</span>
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                      </a>
                    );
                  }
                  return (
                    <button 
                      type="button"
                      onClick={() => showToast(`No live URL configured for "${selectedProject.title}"`)}
                      className="bg-gray-200 dark:bg-zinc-800 text-gray-400 dark:text-zinc-500 px-7 py-2.5 rounded-full font-bold text-[10px] sm:text-[11px] tracking-[0.15em] cursor-not-allowed flex items-center gap-2 uppercase"
                      title="No live URL configured"
                    >
                      <span>LAUNCH SANDBOX</span>
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                    </button>
                  );
                })()}

                {(() => {
                  const modalVideoLink = formatExternalUrl(
                    selectedProject.videoUrl || selectedProject.video || selectedProject.youtubeUrl || selectedProject.demoVideo
                  );
                  if (modalVideoLink) {
                    return (
                      <a 
                        href={modalVideoLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-full font-bold text-[10px] sm:text-[11px] tracking-[0.15em] transition-all flex items-center gap-2 shadow-lg shadow-red-600/20 hover:-translate-y-0.5 cursor-pointer uppercase"
                        title={`Watch demo video on ${modalVideoLink}`}
                      >
                        <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                        <span>WATCH VIDEO</span>
                      </a>
                    );
                  }
                  return null;
                })()}
              </div>

              <button 
                type="button"
                onClick={closeProjectModal}
                className="text-gray-400 hover:text-gray-800 dark:hover:text-white text-xs sm:text-sm font-semibold underline decoration-gray-300 dark:decoration-zinc-600 underline-offset-4 transition-colors cursor-pointer"
              >
                Close View
              </button>
            </footer>

          </div>
        </div>,
        document.body
      )}

      {/* Fullscreen Big Screen Image Lightbox with Side Navigation Arrows */}
      {lightboxData && createPortal(
        <div 
          className="fixed inset-0 z-[200] flex flex-col items-center justify-between bg-black/95 backdrop-blur-2xl p-4 sm:p-6 md:p-8 select-none modal-animate"
          onClick={closeLightbox}
          role="dialog"
          aria-modal="true"
          aria-label="Image gallery fullscreen preview"
        >
          {/* Top Bar: Title, Active Tag, Counter & Close Button */}
          <div 
            className="w-full max-w-6xl flex items-center justify-between z-20 shrink-0 text-white pb-3 select-none"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3">
              <span className="font-syne font-bold text-base sm:text-lg text-white/95 truncate max-w-[180px] sm:max-w-md">
                {lightboxData.title}
              </span>
              {lightboxData.images[lightboxData.index]?.tag && (
                <span className="px-3 py-1 rounded-full bg-white/10 text-white/90 text-[10px] font-mono font-semibold tracking-wider uppercase border border-white/15">
                  {lightboxData.images[lightboxData.index].tag}
                </span>
              )}
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-mono text-white/60 tracking-widest uppercase">
                {lightboxData.index + 1} / {lightboxData.images.length}
              </span>
              
              {/* Open Image in New Tab */}
              {lightboxData.images[lightboxData.index]?.url && (
                <a
                  href={lightboxData.images[lightboxData.index].url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white flex items-center justify-center transition-colors cursor-pointer border border-white/10"
                  title="Open full-resolution image in new tab"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              )}

              {/* Close Button */}
              <button 
                type="button"
                onClick={closeLightbox}
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/25 active:scale-95 text-white flex items-center justify-center transition-all cursor-pointer border border-white/15 hover:scale-105"
                title="Close Big Screen (Esc)"
                aria-label="Close big screen preview"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Center Image Stage with Floating Side Navigation Arrows */}
          <div 
            className="relative w-full max-w-6xl flex-1 flex items-center justify-center my-auto min-h-0 px-2 sm:px-14"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Previous Arrow Button (<) */}
            {lightboxData.images.length > 1 && (
              <button
                type="button"
                onClick={handleLightboxPrev}
                className="absolute left-1 sm:left-3 md:left-4 z-30 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-black/70 hover:bg-black/90 active:scale-90 text-white flex items-center justify-center border border-white/25 backdrop-blur-md transition-all shadow-2xl cursor-pointer group hover:border-brand-orange"
                title="Previous Image (ArrowLeft)"
                aria-label="Previous image"
              >
                <svg className="w-6 h-6 group-hover:-translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            )}

            {/* High-Resolution Big Screen Image */}
            <div className="relative max-w-full max-h-full flex items-center justify-center overflow-hidden rounded-2xl shadow-2xl border border-white/10 bg-black/40">
              <img 
                key={lightboxData.index}
                src={lightboxData.images[lightboxData.index]?.url}
                alt={`${lightboxData.title} - Screenshot ${lightboxData.index + 1}`}
                className="max-w-[90vw] sm:max-w-[84vw] md:max-w-[78vw] max-h-[66vh] sm:max-h-[72vh] md:max-h-[76vh] object-contain rounded-xl select-none animate-fadeIn"
              />
            </div>

            {/* Next Arrow Button (>) */}
            {lightboxData.images.length > 1 && (
              <button
                type="button"
                onClick={handleLightboxNext}
                className="absolute right-1 sm:right-3 md:right-4 z-30 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-black/70 hover:bg-black/90 active:scale-90 text-white flex items-center justify-center border border-white/25 backdrop-blur-md transition-all shadow-2xl cursor-pointer group hover:border-brand-orange"
                title="Next Image (ArrowRight)"
                aria-label="Next image"
              >
                <svg className="w-6 h-6 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            )}
          </div>

          {/* Bottom Thumbnail Track for Quick Image Selection */}
          {lightboxData.images.length > 1 && (
            <div 
              className="w-full max-w-2xl flex items-center justify-center gap-2 pt-3 shrink-0 overflow-x-auto hide-scrollbar z-20"
              onClick={(e) => e.stopPropagation()}
            >
              {lightboxData.images.map((img, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    setLightboxData(prev => ({ ...prev, index: i }));
                    playTactileClick(850);
                  }}
                  className={`relative w-14 h-10 sm:w-16 sm:h-11 rounded-lg overflow-hidden shrink-0 border transition-all cursor-pointer ${
                    i === lightboxData.index
                      ? 'border-brand-orange ring-2 ring-brand-orange/50 scale-105 opacity-100 shadow-md shadow-brand-orange/20'
                      : 'border-white/20 opacity-50 hover:opacity-90 hover:scale-100'
                  }`}
                  title={img.tag || `View ${i + 1}`}
                >
                  <img src={img.url} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>,
        document.body
      )}

    </div>
  );
}
