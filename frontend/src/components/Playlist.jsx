import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';

export default function Playlist() {
  const { showToast } = useTheme();
  const [isPlaying, setIsPlaying] = useState(false);
  const [song, setSong] = useState({
    title: "Srikar's Playlist",
    artist: 'Slower Ambient Pulses'
  });

  const toggleSimulatedMusic = () => {
    setIsPlaying(prev => !prev);
    if (!isPlaying) {
      showToast("Streaming ambient audio stream...");
      setSong({
        title: 'Proto Pulse',
        artist: 'Ambient Space Lo-Fi'
      });
    } else {
      showToast("Audio stream paused.");
      setSong({
        title: "Srikar's Playlist",
        artist: 'Slower Ambient Pulses'
      });
    }
  };

  return (
    <div id="playlist-card" className="lg:col-span-4 bg-white dark:bg-brand-darkCard rounded-[2rem] p-8 shadow-soft dark:shadow-soft-dark border border-zinc-200/30 dark:border-zinc-800/20 min-h-[420px] flex flex-col justify-between bento-transition explode-level-1">
      <div>
        <h2 className="text-xs font-mono uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-6">My music playlist</h2>
        
        {/* Fan Artwork Assembly */}
        <div className="relative h-40 w-full flex items-center justify-center overflow-hidden mb-6">
          <div className="absolute w-24 h-24 rounded-lg bg-zinc-200 dark:bg-zinc-800 transform -rotate-12 -translate-x-14 opacity-50 shadow-md overflow-hidden bento-transition">
            <img src="https://placehold.co/300x300/222222/FFFFFF?text=TRAVIS" className="w-full h-full object-cover" alt="Travis" />
          </div>

          <div className="absolute w-24 h-24 rounded-lg bg-zinc-200 dark:bg-zinc-800 transform rotate-12 translate-x-14 opacity-50 shadow-md overflow-hidden bento-transition">
            <img src="https://placehold.co/300x300/444444/FFFFFF?text=KANYE" className="w-full h-full object-cover" alt="Kanye" />
          </div>

          <div id="active-album" className="relative z-10 w-28 h-28 rounded-xl shadow-lg border-2 border-white dark:border-zinc-800 overflow-hidden transform hover:scale-105 bento-transition cursor-pointer">
            <img src="https://placehold.co/300x300/FF4500/FFFFFF?text=ASTRO" id="album-cover-img" className="w-full h-full object-cover" alt="Cover" />
            
            {/* Dynamic Live Animating CSS Audio Visualizer overlay */}
            <div id="visualizer-overlay" className={`absolute inset-0 bg-black/60 flex items-end justify-center space-x-1 pb-3 bento-transition ${isPlaying ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
              <span className="w-1 bg-white bar-anim rounded-full"></span>
              <span className="w-1 bg-white bar-anim-delayed-1 rounded-full"></span>
              <span className="w-1 bg-white bar-anim-delayed-2 rounded-full"></span>
              <span className="w-1 bg-white bar-anim-delayed-3 rounded-full"></span>
            </div>
          </div>
        </div>

        <div className="text-center">
          <h3 id="song-title" className="text-sm font-semibold text-zinc-900 dark:text-white">{song.title}</h3>
          <p id="song-artist" class="text-xs text-zinc-400 dark:text-zinc-500 mt-1">{song.artist}</p>
        </div>
      </div>

      <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800/40 flex items-center justify-between">
        <button id="btn-play-music" onClick={toggleSimulatedMusic} className="flex items-center space-x-2 text-xs font-mono font-semibold tracking-wider text-brand-orange uppercase focus:outline-none group">
          {isPlaying ? (
            <>
              <svg className="w-4 h-4 fill-current group-hover:scale-110 bento-transition" viewBox="0 0 24 24">
                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
              </svg>
              <span id="btn-play-text">Pause Music</span>
            </>
          ) : (
            <>
              <svg className="w-4 h-4 fill-current group-hover:scale-110 bento-transition" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
              <span id="btn-play-text">Play on Spotify</span>
            </>
          )}
        </button>
        <span className="w-1.5 h-1.5 rounded-full bg-zinc-300 dark:bg-zinc-700"></span>
      </div>
    </div>
  );
}
