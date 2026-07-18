import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';

export default function Hero() {
  const { showToast } = useTheme();
  const [apiStatus, setApiStatus] = useState('connecting');
  const [apiMessage, setApiMessage] = useState('Connecting to Express...');

  useEffect(() => {
    fetch('/api/status')
      .then((res) => {
        if (!res.ok) throw new Error('Server error');
        return res.json();
      })
      .then((data) => {
        setApiStatus('online');
        setApiMessage(data.message || 'Express Active');
      })
      .catch(() => {
        setApiStatus('offline');
        setApiMessage('Express Offline');
      });
  }, []);

  const [isFlipped, setIsFlipped] = useState(false);

  const handleDownloadCV = () => {
    showToast("Downloading Srikar's CV...");
    window.open('/cv.pdf', '_blank');
  };

  const scrollToProjects = () => {
    const projectsSection = document.getElementById('projects');
    if (projectsSection) {
      projectsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleCardFlip = () => {
    setIsFlipped(prev => !prev);
    showToast(isFlipped ? "Flipped to Business Card" : "Viewing business_card.json");
  };

  return (
    <section className="lg:col-span-12 w-full flex flex-col items-center justify-between min-h-[92vh] py-8 lg:py-12 relative overflow-hidden select-none">
      
      {/* Ambient background glows */}
      <div className="absolute right-0 top-0 w-[40rem] h-[40rem] bg-gradient-to-br from-brand-orange/5 to-transparent rounded-full blur-3xl pointer-events-none" id="hero-gradient-right"></div>
      <div className="absolute left-0 bottom-0 w-[40rem] h-[40rem] bg-gradient-to-br from-brand-orange/5 to-transparent rounded-full blur-3xl pointer-events-none" id="hero-gradient-left"></div>
      
      {/* Main Narrative & Card split container */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center relative z-10 my-auto pt-6">
        {/* Left Column: Bio / Pitch */}
        <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left">
          {/* Pulsing state badge */}
          <div className={`inline-flex items-center space-x-2 border px-4 py-1.5 rounded-full text-xs font-semibold mb-8 animate-pulse ${
            apiStatus === 'online'
              ? 'bg-emerald-500/15 border-emerald-500/20 text-emerald-600 dark:text-emerald-400'
              : apiStatus === 'offline'
              ? 'bg-orange-500/15 border-orange-500/20 text-orange-600 dark:text-orange-400'
              : 'bg-blue-500/15 border-blue-500/20 text-blue-600 dark:text-blue-400'
          }`}>
            <span className={`w-2.5 h-2.5 rounded-full ${
              apiStatus === 'online' ? 'bg-emerald-500' : apiStatus === 'offline' ? 'bg-orange-500' : 'bg-blue-500'
            }`}></span>
            <span id="badge-status-text">
              {apiStatus === 'online' ? 'Express Backend Server Online' : apiMessage}
            </span>
          </div>

          <h1 className="font-sans font-extrabold text-2xl sm:text-3xl lg:text-4xl tracking-tight leading-[1.15] text-zinc-900 dark:text-white mb-6">
            Hi, I’m Srikar Maddela!
            <br />
            <span className="font-normal text-zinc-400 dark:text-zinc-500">I’m a </span>
            <span className="font-extrabold text-zinc-800 dark:text-zinc-200">Data Science & ML</span>
            <br />
            <span id="accent-text" className="text-brand-orange font-extrabold transition-colors duration-500">Developer & Designer.</span>
          </h1>

          <p className="max-w-xl text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed mb-8">
            Fusing analytical ML pipelines with tactile, interactive layouts. Click my interactive business card on the right to revolve/reveal its setup!
          </p>

          <div className="flex flex-row items-center gap-4">
            <button onClick={handleDownloadCV} className="px-8 py-4 bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 rounded-full font-semibold text-sm shadow-md hover:scale-105 active:scale-95 bento-transition">
              Get CV
            </button>
            
            {/* Clickable Profile Avatar Button */}
            <div 
              onClick={handleCardFlip}
              className="w-12 h-12 rounded-full overflow-hidden border-2 border-zinc-200 dark:border-zinc-800 shadow-md cursor-pointer transform hover:scale-105 active:scale-95 bento-transition flex-shrink-0 group relative"
              title="Click to revolve card"
            >
              <img 
                src="/avatar.png" 
                onError={(e) => {
                  e.target.src = 'https://placehold.co/150x150/FF4500/FFFFFF?text=Srikar';
                }}
                alt="Srikar Maddela" 
                className="w-full h-full object-cover group-hover:scale-110 group-hover:rotate-3 bento-transition"
              />
              <div className="absolute inset-0 bg-black/45 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-[8px] font-semibold tracking-wider transition-opacity duration-300">
                Flip ↺
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: 3D Flip Card */}
        <div className="lg:col-span-5 flex justify-center items-center py-6 w-full">
          <div 
            className="w-full max-w-[360px] aspect-[1.586] flip-card-container group select-none cursor-pointer"
            onClick={handleCardFlip}
          >
            <div 
              className={`flip-card-inner rounded-[2rem] border border-zinc-200/30 dark:border-zinc-800/20 ${isFlipped ? 'flipped' : ''}`}
            >
              {/* Front side (Graphical Business Card) */}
              <div className="flip-card-front bg-white dark:bg-brand-darkCard p-6 flex flex-col justify-between overflow-hidden text-zinc-800 dark:text-zinc-200 shadow-soft dark:shadow-soft-dark border border-zinc-200/30 dark:border-zinc-800/20">
                {/* Background glow visual */}
                <div className="absolute -right-10 -bottom-10 w-44 h-44 bg-brand-orange/5 dark:bg-brand-orange/10 rounded-full blur-3xl group-hover:bg-brand-orange/15 bento-transition"></div>
                
                <div className="flex justify-between items-start z-10">
                  <span className="text-[10px] font-mono tracking-widest text-brand-orange font-bold uppercase">SRIKAR MADDELA</span>
                  {/* Decorative card chip */}
                  <div className="w-8 h-6 bg-orange-500/10 border border-orange-500/20 rounded-md relative flex items-center justify-center overflow-hidden">
                    <div className="absolute inset-x-2.5 top-0.5 bottom-0.5 border-r border-orange-500/20"></div>
                    <div className="absolute inset-y-1 left-2.5 right-2.5 border-b border-orange-500/20"></div>
                  </div>
                </div>
                
                <div className="z-10 mt-2">
                  <h3 className="font-sans font-extrabold text-2xl text-zinc-900 dark:text-white tracking-tight leading-none">Srikar Maddela</h3>
                  <p className="text-[9px] text-zinc-400 dark:text-zinc-500 font-mono mt-2 tracking-widest uppercase">Data Science & Machine Learning</p>
                </div>

                <div className="flex justify-between items-end z-10 mt-2 pt-3 border-t border-zinc-100 dark:border-zinc-800/40">
                  <span className="text-[8px] text-zinc-400 dark:text-zinc-500 font-mono uppercase tracking-widest">Interactive Edition</span>
                  <span className="text-[9px] text-brand-orange font-mono font-semibold tracking-wider flex items-center gap-1 group-hover:translate-x-1 bento-transition">
                    Click to Flip ↺
                  </span>
                </div>
              </div>

              {/* Back side (business_card.json Editor View) */}
              <div className="flip-card-back bg-white dark:bg-brand-darkCard p-5 flex flex-col justify-between overflow-hidden shadow-soft dark:shadow-soft-dark border border-zinc-200/30 dark:border-zinc-800/20 text-zinc-800 dark:text-zinc-200">
                {/* macOS top bar style */}
                <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800/40 pb-2">
                  <div className="flex space-x-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f]"></span>
                  </div>
                  <span className="text-[9px] font-mono text-zinc-400 dark:text-zinc-500">business_card.json</span>
                  <div className="w-4 h-4 rounded bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/40 dark:border-zinc-800/40 flex items-center justify-center text-[7px] text-zinc-400 dark:text-zinc-500 font-mono">
                    {"{ }"}
                  </div>
                </div>

                {/* Editor Content Area */}
                <div className="flex-1 font-mono text-[9px] sm:text-[10px] leading-relaxed pt-3 text-zinc-700 dark:text-zinc-300 overflow-y-auto whitespace-pre">
                  <div className="flex">
                    <span className="text-zinc-400 dark:text-zinc-600 select-none w-5 text-right pr-2">1</span>
                    <span><span className="text-orange-500 dark:text-orange-400 font-medium">"business_card"</span>: {"{"}</span>
                  </div>
                  <div className="flex">
                    <span className="text-zinc-400 dark:text-zinc-600 select-none w-5 text-right pr-2">2</span>
                    <span>  <span className="text-orange-500 dark:text-orange-400 font-medium">"name"</span>: <span className="text-emerald-600 dark:text-emerald-400">"Srikar"</span>,</span>
                  </div>
                  <div className="flex">
                    <span className="text-zinc-400 dark:text-zinc-600 select-none w-5 text-right pr-2">3</span>
                    <span>  <span className="text-orange-500 dark:text-orange-400 font-medium">"course"</span>: <span className="text-emerald-600 dark:text-emerald-400">"B.Tech Data Science with ML"</span>,</span>
                  </div>
                  <div className="flex">
                    <span className="text-zinc-400 dark:text-zinc-600 select-none w-5 text-right pr-2">4</span>
                    <span>  <span className="text-orange-500 dark:text-orange-400 font-medium">"email"</span>: <span className="text-emerald-600 dark:text-emerald-400">"srikarsensai@gmail.com"</span>,</span>
                  </div>
                  <div className="flex">
                    <span className="text-zinc-400 dark:text-zinc-600 select-none w-5 text-right pr-2">5</span>
                    <span>  <span className="text-orange-500 dark:text-orange-400 font-medium">"linkedin"</span>: <span className="text-emerald-600 dark:text-emerald-400">"srikar-maddela"</span>,</span>
                  </div>
                  <div className="flex">
                    <span className="text-zinc-400 dark:text-zinc-600 select-none w-5 text-right pr-2">6</span>
                    <span>  <span className="text-orange-500 dark:text-orange-400 font-medium">"github"</span>: <span className="text-emerald-600 dark:text-emerald-400">"srikar-up"</span></span>
                  </div>
                  <div className="flex">
                    <span className="text-zinc-400 dark:text-zinc-600 select-none w-5 text-right pr-2">7</span>
                    <span>{"}"}</span>
                  </div>
                </div>

                {/* Editor footer */}
                <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800/40 flex justify-between items-center text-[7px] text-zinc-400 dark:text-zinc-500 font-mono">
                  <span>UTF-8</span>
                  <span>JSON</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Down Button at bottom center */}
      <div className="w-full flex justify-center pt-6 relative z-10">
        <button 
          onClick={scrollToProjects} 
          className="flex flex-col items-center text-zinc-400 hover:text-brand-orange bento-transition focus:outline-none group"
          aria-label="Scroll to Projects"
        >
          <span className="text-[10px] font-mono uppercase tracking-widest mb-2 opacity-65 group-hover:opacity-100 bento-transition">Explore Projects</span>
          <div className="w-8 h-12 rounded-full border-2 border-zinc-300 dark:border-zinc-700 flex items-start justify-center p-1.5 group-hover:border-brand-orange bento-transition">
            <div className="w-1.5 h-3 bg-zinc-400 dark:bg-zinc-600 rounded-full animate-bounce group-hover:bg-brand-orange bento-transition"></div>
          </div>
        </button>
      </div>

    </section>
  );
}
