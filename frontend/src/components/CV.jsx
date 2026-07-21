import React, { useRef, useState } from 'react';
import { useTheme } from '../context/ThemeContext';

export default function CV({ data, onClose }) {
  const { theme, accent } = useTheme();
  const [viewMode, setViewMode] = useState('bento'); // 'bento' (default) | 'ats'
  
  // Dynamic accent style mappings based on theme settings
  const textAccent = accent === 'green' ? 'text-brand-green' : 'text-brand-orange';
  const bgAccent = accent === 'green' ? 'bg-brand-green' : 'bg-brand-orange';
  const bgAccentHover = accent === 'green' ? 'hover:bg-brand-green/90' : 'hover:bg-brand-orange/90';
  const borderAccent = accent === 'green' ? 'border-brand-green/30' : 'border-brand-orange/30';
  const ringAccent = accent === 'green' ? 'ring-brand-green/20' : 'ring-brand-orange/20';

  const heroData = data?.hero || {
    name: "Srikar Maddela",
    title: "Data Science & ML Engineer",
    subtitle: "Developer & Designer.",
    bio: "Passionate Data Science & Machine Learning engineering student with a strong foundation in statistical modeling, ML pipelines, data analysis, and modern web application development.",
    cardName: "Srikar",
    cardCourse: "B.Tech Data Science with ML",
    cardEmail: "srikarsensai@gmail.com",
    cardLinkedin: "srikar-maddela",
    cardGithub: "srikar-up"
  };

  const rawProjects = (data?.projects && data.projects.length > 0) ? data.projects : [
    {
      id: 1,
      year: "2026",
      tag: "ARTIFICIAL INTELLIGENCE",
      title: "AI Scholar Literature Finder",
      desc: "An automated agent search tool integrating NCBI PubMed APIs and semantic summaries.",
      content: "AIScholar is an AI assistant that queries literature databases like PubMed and arXiv, extracts key methodology abstracts, and utilizes local language model embeddings to construct comparative research grids.",
      demoUrl: "https://scholar.ai",
      videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      showInCv: true
    },
    {
      id: 2,
      year: "2026",
      tag: "PRODUCT ENGINEERING",
      title: "Aether OS Interactive Spatial Window",
      desc: "An award-winning viewport framework operating custom spatial coordinates using raw JS layouts.",
      content: "Aether OS is an experimental spatial viewport manager designed for modern desktop web applications. It uses hardware-accelerated transform layers to let users snap, scale, and stack multiple windows seamlessly on a virtual desktop canvas.",
      demoUrl: "https://aether.system",
      videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      showInCv: true
    },
    {
      id: 3,
      year: "2025",
      tag: "DESIGN SYSTEM",
      title: "Nova Minimalist Component Core",
      desc: "A hyper-optimized component foundry yielding zero layout jank on standard browser renders.",
      content: "Nova Core is a high-performance design system library built using utility-first styling tokens. It compiles to zero runtime CSS overhead, achieving sub-millisecond layout passes and eliminating layout shifts on dynamic screens.",
      demoUrl: "https://nova.core",
      videoUrl: "",
      showInCv: true
    },
    {
      id: 4,
      year: "2025",
      tag: "WEB3 & FINTECH",
      title: "Decentralized Crypto Vault",
      desc: "A secure crypto dashboard designed to track assets, complete with rich SVG data charting.",
      content: "CryptVault is a student capstone project creating a secure, client-side dashboard for decentralized finance networks. Features offline keys storage, custom SVG path charting for historical prices, and MetaMask integration.",
      demoUrl: "https://vault.crypt",
      videoUrl: "",
      showInCv: false
    }
  ];

  // Only projects with showInCv !== false will be included in CV
  const cvProjects = rawProjects.filter(p => p.showInCv !== false);
  const projects = cvProjects.length > 0 ? cvProjects : rawProjects;

  const rawTimelineItems = data?.timeline?.items || [];
  const cvTimelineItems = rawTimelineItems.filter(item => item.showInCv !== false);
  const timelineItems = cvTimelineItems.length > 0 ? cvTimelineItems : rawTimelineItems;
  const timeline = {
    items: timelineItems,
    footerText: data?.timeline?.footerText || ''
  };
  const skills = data?.skills || [];

  const projectsContainerRef = useRef(null);
  const timelineContainerRef = useRef(null);

  const scrollProjects = (direction) => {
    if (projectsContainerRef.current) {
      const scrollAmount = 200;
      projectsContainerRef.current.scrollBy({
        top: direction === 'down' ? scrollAmount : -scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const scrollTimeline = (direction) => {
    if (timelineContainerRef.current) {
      const scrollAmount = 150;
      timelineContainerRef.current.scrollBy({
        top: direction === 'down' ? scrollAmount : -scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen py-6 px-4 md:px-8 max-w-5xl mx-auto print-container">
      {/* Strict Complete 1-Page A4 ATS & Print Overrides */}
      <style>{`
        @media print {
          @page {
            margin: 0 !important;
            size: A4 portrait;
          }
          html, body, #root, #root > div, main, .print-container {
            width: 100% !important;
            max-width: 100% !important;
            height: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            background: #ffffff !important;
            background-color: #ffffff !important;
            color: #111827 !important;
            font-family: Arial, Helvetica, sans-serif !important;
            box-shadow: none !important;
            border: none !important;
            zoom: 1 !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .no-print, header, footer, nav, #modal-box {
            display: none !important;
          }
          .interactive-bento-view {
            display: none !important;
          }
          .ats-document {
            display: flex !important;
            flex-direction: column !important;
            justify-content: space-between !important;
            min-height: 297mm !important;
            height: 297mm !important;
            padding: 12mm 15mm !important;
            margin: 0 !important;
            width: 100% !important;
            max-width: 100% !important;
            box-shadow: none !important;
            border: none !important;
            border-radius: 0 !important;
            color: #111827 !important;
            background: #ffffff !important;
            background-color: #ffffff !important;
            font-size: 13px !important;
            line-height: 1.75 !important;
            box-sizing: border-box !important;
            zoom: 1 !important;
          }
          .ats-document h1 {
            font-size: 32px !important;
            margin-bottom: 6px !important;
            letter-spacing: -0.02em !important;
          }
          .ats-document .card-course-title {
            font-size: 15px !important;
            margin-bottom: 8px !important;
          }
          .ats-document .contact-info-bar {
            font-size: 12.5px !important;
            padding-top: 4px !important;
          }
          .ats-document h2 {
            font-size: 15px !important;
            margin-top: 18px !important;
            margin-bottom: 10px !important;
            padding-bottom: 4px !important;
            letter-spacing: 0.08em !important;
            border-bottom-width: 2px !important;
          }
          .ats-document h3 {
            font-size: 14px !important;
          }
          .ats-document p, .ats-document span, .ats-document div {
            font-size: 13px !important;
            line-height: 1.7 !important;
          }
          .ats-document section {
            margin-bottom: 20px !important;
            break-inside: avoid !important;
            page-break-inside: avoid !important;
          }
          .ats-document .project-item {
            margin-bottom: 12px !important;
          }
          .ats-document .project-urls {
            font-size: 12px !important;
            margin-top: 3px !important;
          }
        }
      `}</style>

      {/* Header controls (hidden on print) */}
      <div className="no-print flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-4 border-b border-zinc-200/20 dark:border-zinc-800/20">
        <button 
          onClick={onClose} 
          className="flex items-center space-x-2 text-xs font-mono font-semibold uppercase tracking-wider text-zinc-500 hover:text-zinc-900 dark:hover:text-white bento-transition group self-start md:self-auto"
        >
          <svg className="w-4 h-4 transform group-hover:-translate-x-1 bento-transition" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          <span>Back to Portfolio</span>
        </button>

        {/* Right Side Box: View Mode Switcher Slider + Download A4 PDF Button */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 bg-white dark:bg-brand-darkCard p-2 rounded-2xl border border-zinc-200/40 dark:border-zinc-800/40 shadow-soft dark:shadow-soft-dark">
          {/* Mode Switcher Buttons */}
          <div className="flex items-center space-x-1 bg-zinc-100 dark:bg-zinc-900/90 p-1 rounded-xl border border-zinc-200/20 dark:border-zinc-800/20">
            <button
              onClick={() => setViewMode('bento')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-semibold bento-transition ${
                viewMode === 'bento'
                  ? `${bgAccent} text-white shadow-sm`
                  : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
              }`}
            >
              Interactive Bento Mode
            </button>
            <button
              onClick={() => setViewMode('ats')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-semibold bento-transition ${
                viewMode === 'ats'
                  ? `${bgAccent} text-white shadow-sm`
                  : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
              }`}
            >
              1-Page A4 ATS Mode
            </button>
          </div>

          {/* Download PDF Button */}
          <button
            onClick={handlePrint}
            className={`flex items-center justify-center space-x-2 px-4 py-2 rounded-xl font-mono text-xs font-bold uppercase text-white ${bgAccent} ${bgAccentHover} transition-all shadow-md hover:scale-105 active:scale-95 whitespace-nowrap`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
            <span>Download A4 PDF</span>
          </button>
        </div>
      </div>

      {/* 1. ATS Screening Document Format (Single-Page A4 PDF & Internet-Friendly) */}
      <div className={`ats-document ${viewMode === 'ats' ? 'flex flex-col justify-between' : 'hidden print:flex'} bg-white text-zinc-900 font-sans p-8 sm:p-14 rounded-2xl shadow-xl border border-zinc-200 w-full mx-auto text-left min-h-[900px]`}>
        
        {/* ATS Document Header */}
        <div className="border-b-2 border-zinc-900 pb-5 text-center sm:text-left">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 uppercase font-sans mb-2">
            {heroData.name}
          </h1>
          <p className="card-course-title text-base font-bold text-zinc-700 tracking-wide mb-2.5">
            {heroData.cardCourse} | {heroData.title}
          </p>
          <div className="contact-info-bar flex flex-wrap justify-center sm:justify-start items-center gap-x-4 gap-y-1.5 text-xs sm:text-sm text-zinc-700 font-mono">
            <span>Email: {heroData.cardEmail}</span>
            <span>•</span>
            <span>Location: Punjab, India</span>
            <span>•</span>
            <span>LinkedIn: linkedin.com/in/{heroData.cardLinkedin}</span>
            <span>•</span>
            <span>GitHub: github.com/{heroData.cardGithub}</span>
          </div>
        </div>

        {/* PROFESSIONAL SUMMARY */}
        <section className="space-y-2.5">
          <h2 className="text-sm sm:text-base font-bold uppercase tracking-widest text-zinc-900 border-b-2 border-zinc-900 pb-1 mt-4">
            Professional Summary
          </h2>
          <p className="text-xs sm:text-sm text-zinc-800 leading-relaxed font-normal">
            {heroData.bio}
          </p>
        </section>

        {/* TECHNICAL SKILLS */}
        <section className="space-y-2.5">
          <h2 className="text-sm sm:text-base font-bold uppercase tracking-widest text-zinc-900 border-b-2 border-zinc-900 pb-1 mt-4">
            Technical Skills & Competencies
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm leading-relaxed">
            {skills.map((category) => (
              <div key={category.id} className="space-y-1">
                <span className="font-bold text-zinc-900">{category.title}: </span>
                <span className="text-zinc-700">{category.pills.join(', ')}</span>
              </div>
            ))}
          </div>
        </section>

        {/* KEY ENGINEERING PROJECTS (Only Projects marked for CV) */}
        <section className="space-y-3">
          <h2 className="text-sm sm:text-base font-bold uppercase tracking-widest text-zinc-900 border-b-2 border-zinc-900 pb-1 mt-4">
            Key Engineering Projects ({projects.length} Selected)
          </h2>
          <div className="space-y-4">
            {projects.map((proj, idx) => (
              <div key={proj.id || idx} className="project-item space-y-1">
                <div className="flex justify-between items-baseline">
                  <h3 className="text-xs sm:text-sm font-bold text-zinc-900">
                    {proj.title} <span className="font-normal text-zinc-600">({proj.tag})</span>
                  </h3>
                  <span className="text-xs font-mono text-zinc-600">{proj.year}</span>
                </div>
                <p className="text-xs sm:text-sm text-zinc-800 leading-relaxed">
                  • {proj.content || proj.desc}
                </p>
                <div className="project-urls flex flex-wrap gap-x-4 text-xs font-mono text-zinc-600 mt-1">
                  {proj.demoUrl && (
                    <span>URL: <a href={proj.demoUrl} target="_blank" rel="noreferrer" className="underline text-zinc-900">{proj.demoUrl}</a></span>
                  )}
                  {proj.videoUrl && (
                    <span>Video: <a href={proj.videoUrl} target="_blank" rel="noreferrer" className="underline text-zinc-900">{proj.videoUrl}</a></span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* EDUCATION & TIMELINE */}
        <section className="space-y-2.5">
          <h2 className="text-sm sm:text-base font-bold uppercase tracking-widest text-zinc-900 border-b-2 border-zinc-900 pb-1 mt-4">
            Education & Career Timeline
          </h2>
          <div className="space-y-2">
            {timeline.items.map((item, idx) => (
              <div key={item.id || idx} className="flex justify-between items-baseline text-xs sm:text-sm">
                <span className="font-bold text-zinc-900">{item.title}</span>
                <span className="font-mono text-zinc-600">{item.date}</span>
              </div>
            ))}
          </div>
        </section>

      </div>

      {/* 2. Interactive Bento Layout Format (On Screen Visual Mode) */}
      <div className={`interactive-bento-view ${viewMode === 'bento' ? 'block' : 'hidden'} grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch`}>
        
        {/* CV Header Bento Box */}
        <header className="lg:col-span-12 bg-white dark:bg-brand-darkCard rounded-[2rem] p-8 md:p-10 shadow-soft dark:shadow-soft-dark border border-zinc-200/30 dark:border-zinc-800/20 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="absolute right-0 top-0 w-80 h-80 bg-gradient-to-br from-brand-orange/5 to-transparent rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="relative z-10 space-y-4">
            <div className="space-y-1">
              <h1 className="font-syne font-extrabold text-3xl md:text-4xl text-zinc-900 dark:text-white tracking-tight leading-none">
                {heroData.name}
              </h1>
              <p className={`font-mono text-xs uppercase tracking-widest font-semibold ${textAccent}`}>
                {heroData.cardCourse}
              </p>
            </div>
            
            <p className="text-zinc-500 dark:text-zinc-400 text-sm max-w-2xl leading-relaxed">
              {heroData.bio}
            </p>
          </div>

          {/* Contact Details Grid */}
          <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 gap-3 min-w-[280px]">
            {/* Email Contact */}
            <a 
              href={`mailto:${heroData.cardEmail}`}
              className="flex items-center space-x-3 p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200/40 dark:border-zinc-800/40 hover:scale-[1.03] active:scale-[0.97] bento-transition"
            >
              <div className="p-2 rounded-xl bg-white dark:bg-zinc-950 border border-zinc-200/40 dark:border-zinc-800/40 text-zinc-600 dark:text-zinc-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
              </div>
              <div className="truncate">
                <span className="block text-[9px] font-mono text-zinc-400 uppercase tracking-wider">Email</span>
                <span className="text-[11px] font-mono font-medium text-zinc-700 dark:text-zinc-300 truncate">{heroData.cardEmail}</span>
              </div>
            </a>

            {/* LinkedIn */}
            <a 
              href={`https://linkedin.com/in/${heroData.cardLinkedin}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center space-x-3 p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200/40 dark:border-zinc-800/40 hover:scale-[1.03] active:scale-[0.97] bento-transition"
            >
              <div className="p-2 rounded-xl bg-white dark:bg-zinc-950 border border-zinc-200/40 dark:border-zinc-800/40 text-zinc-600 dark:text-zinc-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                  <rect x="2" y="9" width="4" height="12"></rect>
                  <circle cx="4" cy="4" r="2"></circle>
                </svg>
              </div>
              <div className="truncate">
                <span className="block text-[9px] font-mono text-zinc-400 uppercase tracking-wider">LinkedIn</span>
                <span className="text-[11px] font-mono font-medium text-zinc-700 dark:text-zinc-300 truncate">{heroData.cardLinkedin}</span>
              </div>
            </a>

            {/* GitHub */}
            <a 
              href={`https://github.com/${heroData.cardGithub}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center space-x-3 p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200/40 dark:border-zinc-800/40 hover:scale-[1.03] active:scale-[0.97] bento-transition"
            >
              <div className="p-2 rounded-xl bg-white dark:bg-zinc-950 border border-zinc-200/40 dark:border-zinc-800/40 text-zinc-600 dark:text-zinc-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                </svg>
              </div>
              <div className="truncate">
                <span className="block text-[9px] font-mono text-zinc-400 uppercase tracking-wider">GitHub</span>
                <span className="text-[11px] font-mono font-medium text-zinc-700 dark:text-zinc-300 truncate">{heroData.cardGithub}</span>
              </div>
            </a>

            {/* Location */}
            <div className="flex items-center space-x-3 p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200/40 dark:border-zinc-800/40">
              <div className="p-2 rounded-xl bg-white dark:bg-zinc-950 border border-zinc-200/40 dark:border-zinc-800/40 text-zinc-600 dark:text-zinc-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
              </div>
              <div className="truncate">
                <span className="block text-[9px] font-mono text-zinc-400 uppercase tracking-wider">Location</span>
                <span className="text-[11px] font-mono font-medium text-zinc-700 dark:text-zinc-300 truncate">Punjab, India</span>
              </div>
            </div>
          </div>
        </header>

        {/* Left Column: Education Timeline & Skills (4 cols wide) */}
        <div className="lg:col-span-4 space-y-6 flex flex-col justify-between">
          {/* Education timeline card */}
          <section className="bg-white dark:bg-brand-darkCard rounded-[2rem] p-8 shadow-soft dark:shadow-soft-dark border border-zinc-200/30 dark:border-zinc-800/20">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xs font-mono uppercase tracking-widest text-zinc-400 dark:text-zinc-500">Education</h2>
              {/* Scroll controls */}
              <div className="flex space-x-1.5 bg-zinc-100 dark:bg-zinc-850 p-1 rounded-full border border-zinc-200/10">
                <button 
                  onClick={() => scrollTimeline('up')}
                  className="w-6 h-6 rounded-full flex items-center justify-center font-bold text-[10px] text-zinc-650 dark:text-zinc-350 hover:bg-zinc-250 dark:hover:bg-zinc-800 active:scale-90 bento-transition"
                  title="Scroll Up"
                >
                  ↑
                </button>
                <button 
                  onClick={() => scrollTimeline('down')}
                  className="w-6 h-6 rounded-full flex items-center justify-center font-bold text-[10px] text-zinc-650 dark:text-zinc-350 hover:bg-zinc-250 dark:hover:bg-zinc-800 active:scale-90 bento-transition"
                  title="Scroll Down"
                >
                  ↓
                </button>
              </div>
            </div>
            
            <div 
              ref={timelineContainerRef}
              className="max-h-[220px] overflow-y-auto pr-2 scroll-smooth pl-6"
            >
              <div className="space-y-5 relative pl-4 border-l border-zinc-100 dark:border-zinc-800/40">
                {timeline.items.map((item, index) => {
                  const isFirst = index === 0;
                  return (
                    <div key={item.id || index} className="relative">
                      <span 
                        className={`absolute -left-[21px] top-1.5 w-2.5 h-2.5 rounded-full border-2 border-white dark:border-zinc-950 ${
                          isFirst ? `${bgAccent} ring-4 ${ringAccent}` : 'bg-zinc-400 dark:bg-zinc-650'
                        }`}
                      ></span>
                      <h3 className="text-xs font-bold text-zinc-855 dark:text-zinc-200 leading-snug">
                        {item.title}
                      </h3>
                      <p className="text-[10px] font-mono text-zinc-400 dark:text-zinc-500 mt-1">{item.date}</p>
                    </div>
                  );
                })}
              </div>
            </div>
            
            {timeline.footerText && (
              <p className="text-[10px] text-zinc-400 dark:text-zinc-500 font-mono mt-6 pt-4 border-t border-zinc-100 dark:border-zinc-800/40">
                {timeline.footerText}
              </p>
            )}
          </section>

          {/* Skills Set Card */}
          <section className="bg-white dark:bg-brand-darkCard rounded-[2rem] p-8 shadow-soft dark:shadow-soft-dark border border-zinc-200/30 dark:border-zinc-800/20 flex-1 flex flex-col justify-center">
            <h2 className="text-xs font-mono uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-6">Technical Skills</h2>
            <div className="space-y-4">
              {skills.map((category) => (
                <div key={category.id} className="space-y-2">
                  <h3 className="text-[11px] font-bold text-zinc-800 dark:text-zinc-300 uppercase tracking-wider font-mono">
                    {category.title}
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {category.pills.map((pill, idx) => (
                      <span 
                        key={idx}
                        className="text-[9px] font-mono px-2 py-0.5 rounded-full border bg-zinc-50 dark:bg-zinc-900/60 border-zinc-200/40 dark:border-zinc-800/40 text-zinc-600 dark:text-zinc-400"
                      >
                        {pill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right Column: Projects Showcase (8 cols wide) */}
        <div className="lg:col-span-8 flex flex-col">
          <section className="bg-white dark:bg-brand-darkCard rounded-[2rem] p-8 shadow-soft dark:shadow-soft-dark border border-zinc-200/30 dark:border-zinc-800/20 flex-1 flex flex-col justify-between">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xs font-mono uppercase tracking-widest text-zinc-400 dark:text-zinc-500">Key Engineering Projects</h2>
              {/* Scroll controls */}
              <div className="flex space-x-1.5 bg-zinc-100 dark:bg-zinc-850 p-1 rounded-full border border-zinc-200/10">
                <button 
                  onClick={() => scrollProjects('up')}
                  className="w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800 active:scale-90 bento-transition"
                  title="Scroll Up"
                >
                  ↑
                </button>
                <button 
                  onClick={() => scrollProjects('down')}
                  className="w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800 active:scale-90 bento-transition"
                  title="Scroll Down"
                >
                  ↓
                </button>
              </div>
            </div>
            
            <div 
              ref={projectsContainerRef}
              className="flex-1 overflow-y-auto pr-2 scroll-smooth space-y-6 divide-y divide-zinc-100 dark:divide-zinc-800/40"
            >
              {projects.map((proj, idx) => (
                <div key={proj.id || idx} className={`pt-6 ${idx === 0 ? 'pt-0' : ''} space-y-3`}>
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-[10px] font-mono font-semibold px-2 py-0.5 bg-zinc-100 dark:bg-zinc-850 rounded text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                          {proj.tag}
                        </span>
                        <span className="text-[10px] font-mono text-zinc-400 dark:text-zinc-500">
                          {proj.year}
                        </span>
                      </div>
                      <h3 className="font-syne font-bold text-base text-zinc-900 dark:text-white tracking-tight leading-snug">
                        {proj.title}
                      </h3>
                    </div>
                    <div className="flex items-center space-x-3">
                      {proj.videoUrl && (
                        <a 
                          href={proj.videoUrl} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="text-xs font-mono font-semibold text-red-500 flex items-center space-x-1 hover:underline"
                        >
                          <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                          <span>Watch video</span>
                        </a>
                      )}
                      {proj.demoUrl && (
                        <a 
                          href={proj.demoUrl} 
                          target="_blank" 
                          rel="noreferrer" 
                          className={`text-xs font-mono font-semibold ${textAccent} flex items-center space-x-1 hover:underline`}
                        >
                          <span>Visit demo</span>
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                            <polyline points="15 3 21 3 21 9"></polyline>
                            <line x1="10" y1="14" x2="21" y2="3"></line>
                          </svg>
                        </a>
                      )}
                    </div>
                  </div>

                  <p className="text-xs text-zinc-550 dark:text-zinc-455 leading-relaxed">
                    {proj.content || proj.desc}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>

      </div>

      {/* Bottom Action Bar (hidden on print) */}
      <div className="no-print mt-12 mb-6 flex flex-col items-center justify-center space-y-4">
        <p className="text-xs font-mono text-zinc-400 dark:text-zinc-500 text-center max-w-md">
          Export Srikar's resume in high-compatibility, 1-page ATS-screening optimized PDF format.
        </p>

        <button 
          onClick={handlePrint} 
          className={`flex items-center space-x-2.5 px-8 py-4 rounded-full font-sans font-bold text-sm text-white ${bgAccent} ${bgAccentHover} transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg shadow-brand-orange/10 dark:shadow-none`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="7 10 12 15 17 10"></polyline>
            <line x1="12" y1="15" x2="12" y2="3"></line>
          </svg>
          <span>Download 1-Page ATS PDF Resume</span>
        </button>
      </div>
    </div>
  );
}
