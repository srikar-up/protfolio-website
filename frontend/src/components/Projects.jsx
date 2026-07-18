import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';

const originalMockups = {
  1: {
    mockup1: (
      <div className="flex flex-col justify-between w-full h-full p-4 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl font-mono text-[9px] text-zinc-400">
        <div className="flex justify-between items-center border-b border-zinc-200 dark:border-zinc-800 pb-1.5">
          <span>AETHER_VIEWPORT_ENGINE</span>
          <span className="w-1.5 h-1.5 rounded-full bg-brand-orange animate-ping"></span>
        </div>
        <div className="flex-1 flex flex-col justify-center space-y-1 my-2">
          <div className="h-2 w-3/4 bg-zinc-300 dark:bg-zinc-800 rounded-full"></div>
          <div className="h-2 w-1/2 bg-zinc-300 dark:bg-zinc-800 rounded-full"></div>
          <div className="h-2 w-5/6 bg-zinc-300 dark:bg-zinc-800 rounded-full"></div>
        </div>
        <div className="text-[8px] text-zinc-500">MATRIX: translate3d(24px, -12px, 50px)</div>
      </div>
    ),
    mockup2: (
      <div className="flex flex-col justify-center items-center w-full h-full p-4 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl relative overflow-hidden select-none">
        <svg className="w-full h-full text-zinc-300 dark:text-zinc-850" fill="none" stroke="currentColor" strokeWidth="0.75">
          <line x1="0" y1="50%" x2="100%" y2="50%" strokeDasharray="3"/>
          <line x1="50%" y1="0" x2="50%" y2="100%" strokeDasharray="3"/>
          <circle cx="50%" cy="50%" r="20" className="stroke-brand-orange/45" strokeDasharray="2"/>
          <circle cx="50%" cy="50%" r="40" strokeDasharray="4"/>
        </svg>
        <span className="absolute bottom-2 right-3 font-mono text-[8px] text-zinc-500">Z-DEPTH: SCALE(1.15)</span>
      </div>
    )
  },
  2: {
    mockup1: (
      <div className="flex flex-col justify-between w-full h-full p-4 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl font-mono text-[9px] text-zinc-400">
        <div className="flex justify-between items-center">
          <span>NOVA_FOUNDRY_LOGS</span>
          <span className="text-zinc-500">V1.2.0</span>
        </div>
        <div className="space-y-1.5 my-2">
          <div className="flex justify-between"><span>[COMPILE] tokens.json</span><span className="text-emerald-500">OK</span></div>
          <div className="flex justify-between"><span>[COMPILE] utilities.css</span><span className="text-emerald-500">0.4ms</span></div>
          <div className="flex justify-between"><span>[OPTIMIZE] layout shifts</span><span className="text-emerald-500">0.00%</span></div>
        </div>
        <div className="text-[8px] text-zinc-500">COMPILER_STATUS: READY</div>
      </div>
    ),
    mockup2: (
      <div className="flex flex-col justify-center items-center w-full h-full p-4 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl font-mono text-[9px] text-zinc-500">
        <div className="border border-dashed border-zinc-300 dark:border-zinc-800 p-2.5 rounded-lg w-5/6 text-center select-none bg-white dark:bg-zinc-950">
          <span className="text-[14px] font-syne font-bold tracking-widest text-zinc-850 dark:text-zinc-300">SYSTEMA</span>
          <div className="text-[8px] mt-1 text-zinc-400">padding: 1.5rem / gap: 2rem</div>
        </div>
      </div>
    )
  },
  3: {
    mockup1: (
      <div className="flex flex-col justify-between w-full h-full p-4 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl font-mono text-[9px] text-zinc-400">
        <div className="flex justify-between items-center border-b border-zinc-200 dark:border-zinc-800 pb-1.5">
          <span>SECURE_WALLET_SESSION</span>
          <span className="text-emerald-500">CONNECTED</span>
        </div>
        <div className="my-2 space-y-1">
          <div className="flex justify-between"><span>ADDR:</span><span className="text-zinc-900 dark:text-zinc-200">0x71C...3972</span></div>
          <div className="flex justify-between"><span>BALANCE:</span><span className="text-brand-orange font-bold">12.45 ETH</span></div>
        </div>
        <div className="text-[8px] text-zinc-500">VAULT: AES-256 ENCRYPTED</div>
      </div>
    ),
    mockup2: (
      <div className="flex flex-col justify-between w-full h-full p-4 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl select-none">
        <div className="flex justify-between items-center font-mono text-[9px] text-zinc-450">
          <span>CHART_ENGINE</span>
          <span className="text-brand-orange">+8.42%</span>
        </div>
        <div className="flex-1 flex items-end justify-between space-x-1.5 h-16 pt-2">
          <span className="w-full bg-zinc-300 dark:bg-zinc-800 h-6 rounded-sm"></span>
          <span className="w-full bg-zinc-300 dark:bg-zinc-800 h-10 rounded-sm"></span>
          <span className="w-full bg-zinc-300 dark:bg-zinc-800 h-14 rounded-sm"></span>
          <span className="w-full bg-brand-orange/85 h-20 rounded-sm"></span>
        </div>
      </div>
    )
  },
  4: {
    mockup1: (
      <div className="flex flex-col justify-between w-full h-full p-4 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl font-mono text-[9px] text-zinc-400">
        <div className="flex justify-between items-center border-b border-zinc-200 dark:border-zinc-800 pb-1.5">
          <span>AGENT_COGNITION_LOGGER</span>
          <span className="w-2 h-2 rounded-full bg-brand-orange animate-pulse"></span>
        </div>
        <div className="my-1.5 space-y-1">
          <div>&gt; querying NCBI PubMed... done</div>
          <div>&gt; extracting abstracts... done</div>
          <div>&gt; embedding nodes... active</div>
        </div>
        <div className="text-[8px] text-zinc-500">THREADS: 8 WORKERS ONER</div>
      </div>
    ),
    mockup2: (
      <div className="flex flex-col justify-between w-full h-full p-4 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl select-none font-mono text-[8px] text-zinc-500">
        <span className="text-[9px] font-semibold text-zinc-400">ABSTRACTS_RANKING</span>
        <div className="space-y-1 mt-2">
          <div className="h-3 w-full bg-brand-orange/15 rounded flex items-center px-1.5 justify-between"><span className="truncate">Alpha Genome Variant...</span><span>98%</span></div>
          <div className="h-3 w-full bg-zinc-250 dark:bg-zinc-800 rounded flex items-center px-1.5 justify-between"><span className="truncate">CRISPR Editing Mod...</span><span>84%</span></div>
        </div>
      </div>
    )
  }
};

export default function Projects({ items = [] }) {
  const { showToast } = useTheme();
  const [scrollProgress, setScrollProgress] = useState(0);
  const [startIndex, setStartIndex] = useState(0);
  const [selectedProject, setSelectedProject] = useState(null);
  const containerRef = useRef(null);

  const projects = items;

  const getMockup1 = (project) => {
    if (originalMockups[project.id]) {
      return originalMockups[project.id].mockup1;
    }
    // Dynamic Fallback 1
    return (
      <div className="flex flex-col justify-between w-full h-full p-4 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl font-mono text-[9px] text-zinc-400">
        <div className="flex justify-between items-center border-b border-zinc-200 dark:border-zinc-800 pb-1.5">
          <span>{project.tag || 'SYSTEM_MODULE'}</span>
          <span className="w-1.5 h-1.5 rounded-full bg-brand-orange animate-ping"></span>
        </div>
        <div className="flex-1 flex flex-col justify-center space-y-1 my-2">
          <div className="text-[10px] font-bold text-zinc-800 dark:text-zinc-200 truncate">{project.title}</div>
          <div className="h-1.5 w-5/6 bg-zinc-300 dark:bg-zinc-800 rounded-full"></div>
          <div className="h-1.5 w-2/3 bg-zinc-300 dark:bg-zinc-800 rounded-full"></div>
        </div>
        <div className="text-[8px] text-zinc-500">ID: {project.id} // STATUS: DYNAMIC</div>
      </div>
    );
  };

  const getMockup2 = (project) => {
    if (originalMockups[project.id]) {
      return originalMockups[project.id].mockup2;
    }
    // Dynamic Fallback 2
    return (
      <div className="flex flex-col justify-center items-center w-full h-full p-4 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl relative overflow-hidden select-none">
        <svg className="w-full h-full text-zinc-350 dark:text-zinc-850" fill="none" stroke="currentColor" strokeWidth="0.75">
          <line x1="0" y1="50%" x2="100%" y2="50%" strokeDasharray="3"/>
          <line x1="50%" y1="0" x2="50%" y2="100%" strokeDasharray="3"/>
          <circle cx="50%" cy="50%" r="20" className="stroke-brand-orange/45" strokeDasharray="2"/>
          <circle cx="50%" cy="50%" r="35" strokeDasharray="4"/>
          <path d="M 10,60 Q 40,30 80,50 T 150,20" className="stroke-brand-orange/60" strokeWidth="1.5" />
        </svg>
        <span className="absolute bottom-2 right-3 font-mono text-[8px] text-zinc-500">MATRIX_GRID: ACTIVE</span>
      </div>
    );
  };

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

  const handleNext = () => {
    if (startIndex + 2 < projects.length) {
      setStartIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (startIndex > 0) {
      setStartIndex(prev => prev - 1);
    }
  };

  const openProjectModal = (project) => {
    setSelectedProject(project);
  };

  const closeProjectModal = () => {
    setSelectedProject(null);
  };

  const handleLaunchProject = (title) => {
    showToast(`Launching preview sandbox for: "${title}"`);
    closeProjectModal();
  };

  const handleModalNext = () => {
    if (selectedProject) {
      const currentIndex = projects.findIndex(p => p.id === selectedProject.id);
      const nextIndex = (currentIndex + 1) % projects.length;
      setSelectedProject(projects[nextIndex]);
    }
  };

  const handleModalPrev = () => {
    if (selectedProject) {
      const currentIndex = projects.findIndex(p => p.id === selectedProject.id);
      const prevIndex = (currentIndex - 1 + projects.length) % projects.length;
      setSelectedProject(projects[prevIndex]);
    }
  };

  // Interpolate entry scroll progress
  const scatterFactor = 1 - scrollProgress;

  // Left card transform: moves left and down, rotates slightly counter-clockwise
  const leftTransformStyle = {
    transform: `translate3d(${scatterFactor * -120}px, ${scatterFactor * 80}px, 0) rotate(${scatterFactor * -8}deg)`,
    opacity: 0.3 + scrollProgress * 0.7,
    transition: 'transform 0.1s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.1s ease-out'
  };

  // Right card transform: moves right and up, rotates slightly clockwise
  const rightTransformStyle = {
    transform: `translate3d(${scatterFactor * 120}px, ${scatterFactor * -80}px, 0) rotate(${scatterFactor * 8}deg)`,
    opacity: 0.3 + scrollProgress * 0.7,
    transition: 'transform 0.1s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.1s ease-out'
  };

  const visibleProjects = projects.slice(startIndex, startIndex + 2);

  // Find selected project details for rendering indicators in the modal
  const selectedIndex = selectedProject ? projects.findIndex(p => p.id === selectedProject.id) : 0;

  return (
    <div 
      ref={containerRef}
      id="projects" 
      className="lg:col-span-12 bg-transparent rounded-[2rem] pt-12 pb-6 flex flex-col gap-6 explode-level-0 overflow-hidden"
    >
      
      {/* Section Header with Carousel Navigation */}
      <div className="flex justify-between items-end px-2 select-none">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-zinc-400 dark:text-zinc-500">Selected Masterpieces</span>
          <h2 className="font-syne font-bold text-3xl text-zinc-900 dark:text-white mt-1">Projects Engine</h2>
        </div>
        
        {/* Navigation Arrows & Counter */}
        <div className="flex items-center space-x-4">
          <span className="hidden sm:inline text-xs font-mono text-zinc-400">
            {startIndex + 1}-{Math.min(startIndex + 2, projects.length)} OF {projects.length}
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
              title="Previous Projects"
            >
              &lt;
            </button>
            <button 
              onClick={handleNext}
              disabled={startIndex + 2 >= projects.length}
              className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold bento-transition ${
                startIndex + 2 >= projects.length 
                  ? 'text-zinc-300 dark:text-zinc-600 cursor-not-allowed' 
                  : 'text-zinc-800 dark:text-zinc-200 hover:bg-zinc-300 dark:hover:bg-zinc-700 active:scale-95'
              }`}
              title="Next Projects"
            >
              &gt;
            </button>
          </div>
        </div>
      </div>

      {/* 2-Column Sliding Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
        {visibleProjects.map((project, idx) => {
          const style = idx % 2 === 0 ? leftTransformStyle : rightTransformStyle;
          return (
            <div 
              key={project.id}
              onClick={() => openProjectModal(project)}
              style={style}
              className="bg-white dark:bg-brand-darkCard rounded-[2rem] p-8 shadow-soft dark:shadow-soft-dark border border-zinc-200/30 dark:border-zinc-800/20 flex flex-col justify-between min-h-[280px] group hover:-translate-y-1.5 cursor-pointer will-change-transform"
            >
              <div className="space-y-4">
                <div className="flex items-center space-x-3 text-xs font-mono text-zinc-400">
                  <span>{project.year}</span>
                  <span className="w-1 h-1 rounded-full bg-zinc-300 dark:bg-zinc-700"></span>
                  <span>{project.tag}</span>
                </div>
                <h3 className="font-syne font-bold text-2xl text-zinc-900 dark:text-white group-hover:text-brand-orange bento-transition leading-snug">
                  {project.title}
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                  {project.desc}
                </p>
              </div>
              <div className="pt-6 border-t border-zinc-100 dark:border-zinc-800/40 flex justify-between items-center mt-6">
                <span className="text-xs font-mono font-semibold text-zinc-900 dark:text-white uppercase group-hover:translate-x-1 bento-transition">Open Sandbox →</span>
                <span className="text-[10px] font-mono text-zinc-400">LAUNCH CODE</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Large Premium Project Details Modal (based on Figma re-edit) */}
      {selectedProject && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm transition-opacity duration-300">
          <div 
            className="bg-white dark:bg-brand-darkCard border border-zinc-200/60 dark:border-zinc-800/60 rounded-3xl w-full max-w-4xl p-8 md:p-10 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200 flex flex-col justify-between"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Bar: Tags & Close Icon */}
            <div className="flex justify-between items-center mb-6 w-full select-none">
              <div className="flex items-center space-x-3">
                <span className="bg-zinc-100 dark:bg-zinc-800 text-[10px] font-mono font-semibold px-4 py-1.5 rounded-full text-zinc-500 dark:text-zinc-300 uppercase tracking-widest border border-zinc-200/20 dark:border-zinc-700/20">
                  {selectedProject.tag}
                </span>
                <span className="bg-orange-500/10 text-[10px] font-mono font-semibold px-4 py-1.5 rounded-full text-brand-orange tracking-widest border border-brand-orange/10">
                  {selectedProject.year}
                </span>
              </div>
              
              <button 
                onClick={closeProjectModal}
                className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 hover:text-zinc-800 dark:hover:text-white bento-transition"
                aria-label="Close view modal"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Graphics Gallery Mockups (Two boxes side-by-side) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200/20 dark:border-zinc-800/20 rounded-2xl h-48 relative overflow-hidden flex items-center justify-center p-4">
                {getMockup1(selectedProject)}
              </div>
              <div className="bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200/20 dark:border-zinc-800/20 rounded-2xl h-48 relative overflow-hidden flex items-center justify-center p-4">
                {getMockup2(selectedProject)}
              </div>
            </div>

            {/* Inner Slider Navigation arrows & indicator */}
            <div className="flex items-center justify-start space-x-4 mb-6 select-none">
              <div className="flex bg-zinc-100 dark:bg-zinc-800 p-0.5 rounded-full border border-zinc-200/10">
                <button 
                  onClick={handleModalPrev}
                  className="w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 active:scale-95 bento-transition"
                  title="Previous Project in modal"
                >
                  &lt;
                </button>
                <button 
                  onClick={handleModalNext}
                  className="w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 active:scale-95 bento-transition"
                  title="Next Project in modal"
                >
                  &gt;
                </button>
              </div>
              <span className="text-[10px] font-mono text-zinc-400 dark:text-zinc-500 uppercase tracking-widest font-semibold">
                DECK {selectedIndex + 1}/{projects.length}
              </span>
            </div>

            {/* Description Details */}
            <div className="space-y-4 mb-8">
              {/* Title */}
              <h3 className="font-syne font-bold text-3xl md:text-4xl text-zinc-950 dark:text-white leading-tight">
                {selectedProject.title}
              </h3>
              {/* Content Body */}
              <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed font-sans max-w-3xl">
                {selectedProject.content}
              </p>
            </div>

            {/* Action Bar (Launch Sandbox left, Close View link right) */}
            <div className="pt-6 border-t border-zinc-100 dark:border-zinc-800/40 flex items-center justify-between">
              <button 
                onClick={() => handleLaunchProject(selectedProject.title)}
                className="px-8 py-4 bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 hover:bg-brand-orange dark:hover:bg-brand-orange dark:hover:text-white rounded-full font-semibold text-xs shadow-md hover:scale-105 active:scale-95 bento-transition uppercase tracking-wider"
              >
                Launch Sandbox
              </button>
              <button 
                onClick={closeProjectModal}
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
