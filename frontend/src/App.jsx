import React from 'react';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import Header from './components/Header';
import Hero from './components/Hero';
import Projects from './components/Projects';
import About from './components/About'; // Represents Card 1 (Experience)
import Playlist from './components/Playlist'; // Represents Card 2 (Music Playlist)
import ReadingList from './components/ReadingList'; // Represents Card 3 (Reading List)
import Blog from './components/Blog'; // Represents Curated Writings
import MapCard from './components/MapCard'; // Represents Card 4 (Montreal Map)
import Process from './components/Process'; // Represents Card 5 (How I Work)
import Contact from './components/Contact'; // Contact Bento Card
import Footer from './components/Footer';

function MainApp() {
  const { explodeMode, toast } = useTheme();

  return (
    <div className="bg-brand-lightBg dark:bg-brand-darkBg text-zinc-800 dark:text-zinc-200 font-sans antialiased transition-colors duration-500 selection:bg-orange-500/10 overflow-x-hidden min-h-screen">
      
      {/* Site Header Controls */}
      <Header />

      {/* 3D Perspective Area */}
      <div className={`perspective-container w-full min-h-screen ${explodeMode ? 'explode-active' : ''}`}>
        <div className="perspective-viewport w-full h-full bento-transition">

          {/* Global Parallax Grid Guide Overlay (only visible in 3D Explode view) */}
          <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden max-w-6xl mx-auto px-6 md:px-12">
            <svg className="spec-grid-line w-full h-full text-zinc-300 dark:text-zinc-700" fill="none" stroke="currentColor" strokeWidth="0.5">
              <defs>
                <pattern id="gridPattern" width="100" height="100" patternUnits="userSpaceOnUse">
                  <path d="M 100 0 L 0 0 0 100" fill="none" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#gridPattern)" />
            </svg>
          </div>

          {/* Main Bento Grid Canvas */}
          <main className="relative z-10 max-w-6xl mx-auto px-6 pt-32 pb-24 md:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Card 0: Hero Block */}
              <Hero />

              {/* Projects Showcase */}
              <Projects />

              {/* Card 1: Experience */}
              <About />

              {/* Card 2: Playlist */}
              <Playlist />

              {/* Card 3: Reading List */}
              <ReadingList />

              {/* Blog writings section */}
              <Blog />

              {/* Card 4: Location Map */}
              <MapCard />

              {/* Card 5: How I Work */}
              <Process />

              {/* Contact / Get in Touch */}
              <Contact />

            </div>
          </main>

          {/* Global Footer */}
          <Footer />

        </div>
      </div>

      {/* Interactive message toast notification module */}
      <div 
        id="modal-box" 
        className={`fixed bottom-6 right-6 z-50 max-w-sm bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 p-4 rounded-2xl shadow-xl bento-transition border border-white/10 dark:border-black/10 flex items-center space-x-3 pointer-events-none ${
          toast.visible ? 'translate-y-0 opacity-100' : 'translate-y-24 opacity-0'
        }`}
      >
        <span className="w-2.5 h-2.5 rounded-full bg-brand-orange animate-ping" id="modal-dot"></span>
        <p className="text-xs font-medium" id="modal-msg">{toast.message}</p>
      </div>

    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <MainApp />
    </ThemeProvider>
  );
}
