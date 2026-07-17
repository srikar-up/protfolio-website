import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';

export default function Hero() {
  const { showToast } = useTheme();
  const [apiStatus, setApiStatus] = useState('connecting');
  const [apiMessage, setApiMessage] = useState('Connecting to Express...');
  
  // Parallax cursor coordinates
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [rawCoords, setRawCoords] = useState({ x: 0, y: 0 });
  const canvasRef = useRef(null);

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

  const handleMouseMove = (e) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left; // Raw coordinate relative to canvas bounding box
    const y = e.clientY - rect.top;

    // Center offsets
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const offsetX = x - centerX;
    const offsetY = y - centerY;

    setRawCoords({ x: Math.round(x), y: Math.round(y) });
    setCoords({ x: offsetX, y: offsetY });

    // Set parallax offset css variable on root (optional, for explode mode)
    document.documentElement.style.setProperty('--parallax-offset', `${offsetY}px`);
  };

  const handleMouseLeave = () => {
    // Reset smoothly
    setRawCoords({ x: 0, y: 0 });
    setCoords({ x: 0, y: 0 });
    document.documentElement.style.setProperty('--parallax-offset', '0px');
  };

  const simulateCallBooking = () => {
    showToast("Opening calendar. Scheduling booking simulation...");
  };

  return (
    <section className="lg:col-span-12 bg-white dark:bg-brand-darkCard rounded-[2rem] p-8 md:p-12 shadow-soft dark:shadow-soft-dark border border-zinc-200/30 dark:border-zinc-800/20 bento-transition explode-level-1 relative overflow-hidden flex flex-col lg:flex-row items-stretch justify-between gap-10">
      
      {/* Accent Coordinate Ring overlay */}
      <div className="absolute -right-12 -top-12 w-48 h-48 bg-gradient-to-br from-brand-orange/5 to-transparent rounded-full blur-2xl pointer-events-none" id="hero-gradient"></div>
      
      {/* Left: Narrative Column */}
      <div className="flex-1 flex flex-col justify-between max-w-2xl relative z-10">
        <div>
          {/* Pulsing state badge */}
          <div className={`inline-flex items-center space-x-2 border px-4 py-1.5 rounded-full text-xs font-semibold mb-8 animate-pulse ${
            apiStatus === 'online'
              ? 'bg-emerald-500/15 border-emerald-500/20 text-emerald-600 dark:text-emerald-400'
              : apiStatus === 'offline'
              ? 'bg-orange-500/15 border-orange-500/20 text-orange-600 dark:text-orange-400'
              : 'bg-blue-500/15 border-blue-500/20 text-blue-600 dark:text-blue-400'
          }`}>
            <span className={`w-2 h-2 rounded-full ${
              apiStatus === 'online' ? 'bg-emerald-500' : apiStatus === 'offline' ? 'bg-orange-500' : 'bg-blue-500'
            }`}></span>
            <span id="badge-status-text">
              {apiStatus === 'online' ? 'Express Backend Server Online' : apiMessage}
            </span>
          </div>

          <h1 className="font-syne font-bold text-4xl sm:text-5xl md:text-6xl tracking-tight leading-tight text-zinc-900 dark:text-white mb-6">
            Hi, I’m 
            <span className="inline-flex items-baseline mx-2 relative group cursor-pointer">
              <img 
                src="/avatar.png" 
                onError={(e) => {
                  e.target.src = 'https://placehold.co/150x150/FF4500/FFFFFF?text=Alex';
                }}
                alt="Alex Carter" 
                className="w-12 h-12 md:w-16 md:h-16 rounded-full inline-block align-middle object-cover border-2 border-white dark:border-zinc-900 shadow-md transform -translate-y-1 group-hover:scale-110 group-hover:rotate-6 bento-transition"
              />
            </span>
            Alex Carter!
            <br />
            <span className="font-normal text-zinc-400 dark:text-zinc-500">I’m a</span> Product Lead <span class="font-normal text-zinc-400 dark:text-zinc-500">at</span> 
            <br />
            <span id="accent-text" className="text-brand-orange font-extrabold transition-colors duration-500">Aura Design.</span>
          </h1>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pt-8 border-t border-zinc-100 dark:border-zinc-800/40 mt-8">
          <div className="flex flex-wrap gap-4 items-center">
            <button onClick={simulateCallBooking} className="px-8 py-4 bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 rounded-full font-semibold text-sm shadow-md hover:scale-105 active:scale-95 bento-transition">
              Book a call
            </button>
            <span className="text-zinc-400 dark:text-zinc-500 text-xs font-mono">GMT -5 (MONTREAL)</span>
          </div>
          <p className="max-w-xs text-zinc-500 dark:text-zinc-400 text-xs leading-relaxed">
            Fusing physical depth with tactile layouts. Feel free to preview the system blueprints using the 3D control panel.
          </p>
        </div>
      </div>

      {/* Right: Interactive Parallax Blueprint Layer */}
      <div 
        ref={canvasRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="flex-1 min-h-[300px] bg-zinc-50 dark:bg-zinc-900/40 rounded-2xl p-6 relative overflow-hidden border border-zinc-200/10 dark:border-zinc-800/10 flex items-center justify-center group cursor-crosshair" 
        id="hero-mouse-canvas"
      >
        {/* Background Layer */}
        <div 
          className="absolute inset-4 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl flex items-center justify-center transition-transform duration-300 pointer-events-none select-none" 
          id="parallax-v-back" 
          style={{ transform: `translate(${coords.x * -0.04}px, ${coords.y * -0.04}px)` }}
        >
          <span className="text-[100px] font-bold font-syne text-zinc-200/30 dark:text-zinc-800/10 uppercase select-none">AURA</span>
        </div>

        {/* Mid Layer Card */}
        <div 
          className="absolute w-64 bg-white dark:bg-zinc-950 p-5 rounded-2xl shadow-lg border border-zinc-200/40 dark:border-zinc-800/40 transition-transform duration-300 flex flex-col justify-between h-40 pointer-events-none" 
          id="parallax-v-mid"
          style={{ transform: `translate(${coords.x * 0.08}px, ${coords.y * 0.08}px)` }}
        >
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-mono text-zinc-400">PARALLAX_COORDS</span>
            <span className="w-1.5 h-1.5 rounded-full bg-brand-orange animate-ping" id="hero-mini-dot"></span>
          </div>
          <div>
            <p className="text-xs font-mono text-zinc-500">depth_factor_z: 0.6</p>
            <h4 className="font-syne font-bold text-lg text-zinc-900 dark:text-white mt-1 leading-none">Spatial Layout</h4>
          </div>
        </div>

        {/* Front Floating Accent Layer */}
        <div 
          className="absolute translate-x-12 translate-y-12 bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 py-3 px-5 rounded-xl shadow-2xl transition-transform duration-300 pointer-events-none text-xs font-mono flex items-center space-x-2.5" 
          id="parallax-v-front"
          style={{ transform: `translate(${coords.x * 0.16}px, ${coords.y * 0.16}px)` }}
        >
          <svg className="w-4 h-4 text-brand-orange" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" id="hero-front-icon">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 15l-6 6m0 0l-6-6m6 6V9a6 6 0 0112 0v3"/>
          </svg>
          <span>Z-INDEX: 100</span>
        </div>

        {/* Interactive overlay coordinates */}
        <div className="absolute bottom-4 left-4 font-mono text-[9px] text-zinc-400 dark:text-zinc-500 select-none">
          RELATIVE CURSOR ENGINE: <span id="mouse-coords-readout">X: {rawCoords.x}px, Y: {rawCoords.y}px</span>
        </div>
      </div>
    </section>
  );
}
