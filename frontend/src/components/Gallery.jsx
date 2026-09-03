import React, { useState, useEffect, useMemo } from 'react';
import { useTheme } from '../context/ThemeContext';

const formatGoogleDriveLink = (url) => {
  if (!url) return '';
  if (typeof url !== 'string') return '';
  if (url.includes('drive.google.com') || url.includes('docs.google.com') || url.includes('googleusercontent.com')) {
    let fileId = '';
    const dMatch = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
    if (dMatch && dMatch[1]) {
      fileId = dMatch[1];
    } else {
      const idMatch = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
      if (idMatch && idMatch[1]) {
        fileId = idMatch[1];
      }
    }
    if (fileId) {
      return `https://drive.google.com/thumbnail?id=${fileId}&sz=w1200`;
    }
  }
  return url;
};

export default function Gallery({ data, onClose }) {
  const { theme, accent } = useTheme();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeItem, setActiveItem] = useState(null);
  const [gridWidth, setGridWidth] = useState(3);
  const [imageRatios, setImageRatios] = useState({});

  const handleImageLoad = (id, width, height) => {
    if (!width || !height) return;
    const ratio = width / height;
    setImageRatios((prev) => {
      if (prev[id] === ratio) return prev;
      return { ...prev, [id]: ratio };
    });
  };

  // Dynamic responsive grid width tracking
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setGridWidth(1);
      } else if (window.innerWidth < 1024) {
        setGridWidth(2);
      } else {
        setGridWidth(3);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Dynamic accent style mappings based on theme settings
  const textAccent = accent === 'green' ? 'text-brand-green' : 'text-brand-orange';
  const bgAccent = accent === 'green' ? 'bg-brand-green' : 'bg-brand-orange';
  const borderAccent = accent === 'green' ? 'border-brand-green/30' : 'border-brand-orange/30';
  const ringAccent = accent === 'green' ? 'ring-brand-green/20' : 'ring-brand-orange/20';

  // Gallery items fallback
  const galleryItems = useMemo(() => {
    return data?.gallery || [
      {
        id: 1,
        category: 'college',
        dateStamp: 'JAN 2025',
        sectionTitle: 'sem1 one finish',
        date: 'January 2025',
        title: 'sem1 one finish',
        desc: 'just fineshed the first sem',
        location: 'lpu ,punjab',
        camera: 'i phone 15',
        image: 'https://drive.google.com/file/d/1lQMGUpLwi7WiD7IMlTLh8VNW2ysrbMGW/view?usp=sharing'
      },
      {
        id: 2,
        category: 'architecture',
        dateStamp: 'AUG 2026',
        sectionTitle: 'Brutalist Architecture',
        date: 'August 2026',
        title: 'Concrete Details',
        desc: 'Minimalist brutalist architecture.',
        location: 'London, UK',
        camera: 'Fujifilm X-T4 • 23mm f/2',
        image: 'https://images.unsplash.com/photo-1511818966892-d7d671e67287?auto=format&fit=crop&q=80&w=800'
      },
      {
        id: 3,
        category: 'portraits',
        dateStamp: 'AUG 2026',
        sectionTitle: 'Studio Lights',
        date: 'August 2026',
        title: 'Studio Session',
        desc: 'Experimenting with dramatic lighting.',
        location: 'Brooklyn Studio',
        camera: 'Canon EOS R5 • 85mm f/1.2',
        image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800'
      },
      {
        id: 4,
        category: 'travel',
        dateStamp: 'JUL 2026',
        sectionTitle: 'Japan Stories',
        date: 'July 2026',
        title: 'Kyoto Streets',
        desc: 'Rainy evenings in the historic district.',
        location: 'Kyoto, Japan',
        camera: 'Leica Q2',
        image: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&q=80&w=800'
      },
      {
        id: 5,
        category: 'nature',
        dateStamp: 'JUL 2026',
        sectionTitle: 'Canopy Views',
        date: 'July 2026',
        title: 'Autumn Canopy',
        desc: 'Changing colors from above.',
        location: 'Vermont, USA',
        camera: 'DJI Mavic 3',
        image: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&q=80&w=800'
      },
      {
        id: 6,
        category: 'architecture',
        dateStamp: 'JUL 2026',
        sectionTitle: 'Financial District',
        date: 'July 2026',
        title: 'Glass & Steel',
        desc: 'Looking up at the financial district.',
        location: 'New York City',
        camera: 'Sony A7R IV • 14mm f/1.8',
        image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800'
      }
    ];
  }, [data]);

  // Asynchronously detect natural image aspect ratios automatically
  useEffect(() => {
    (galleryItems || []).forEach((item) => {
      if (!item.image) return;
      const formattedUrl = formatGoogleDriveLink(item.image);
      const img = new Image();
      img.src = formattedUrl;
      img.onload = () => {
        if (img.naturalWidth && img.naturalHeight) {
          handleImageLoad(item.id, img.naturalWidth, img.naturalHeight);
        }
      };
    });
  }, [galleryItems]);

  // Capitalize helper
  const capitalize = (str) => (str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : '');

  // Extract unique categories from items dynamically
  const uniqueCats = useMemo(() => {
    return Array.from(
      new Set((galleryItems || []).map((item) => (item.category || '').trim().toLowerCase()))
    ).filter(Boolean);
  }, [galleryItems]);

  const categoryMeta = {
    nature: 'Outdoors',
    portraits: 'Studio',
    architecture: 'Urban',
    travel: 'Journeys',
    college: 'Campus Log'
  };

  const categories = useMemo(() => {
    return [
      { id: 'all', title: 'All Photos', date: 'Full Feed' },
      ...uniqueCats.map((cat) => ({
        id: cat,
        title: capitalize(cat),
        date: categoryMeta[cat] || 'Category Log'
      }))
    ];
  }, [uniqueCats]);

  const filteredItems = useMemo(() => {
    return selectedCategory === 'all'
      ? galleryItems
      : galleryItems.filter((item) => (item.category || '').trim().toLowerCase() === selectedCategory);
  }, [selectedCategory, galleryItems]);

  // Group by Date for split timeline
  const groupedItems = useMemo(() => {
    return filteredItems.reduce((acc, item) => {
      const dateKey = item.date || 'Older Photos';
      if (!acc[dateKey]) acc[dateKey] = [];
      acc[dateKey].push(item);
      return acc;
    }, {});
  }, [filteredItems]);

  const sortedDates = useMemo(() => Object.keys(groupedItems), [groupedItems]);

  // Anti-Gravity Bi-Directional Collision & Anchor Packing Algorithm (Zero Space Waste)
  const packedNodes = useMemo(() => {
    let occupiedMatrix = [];

    function isSpaceClear(startX, startY, width, height) {
      for (let y = startY; y < startY + height; y++) {
        for (let x = startX; x < startX + width; x++) {
          if (x >= gridWidth) return false;
          if (occupiedMatrix[y] && occupiedMatrix[y][x]) return false;
        }
      }
      return true;
    }

    function claimSpace(startX, startY, width, height) {
      for (let y = startY; y < startY + height; y++) {
        if (!occupiedMatrix[y]) occupiedMatrix[y] = Array(gridWidth).fill(false);
        for (let x = startX; x < startX + width; x++) {
          occupiedMatrix[y][x] = true;
        }
      }
    }

    let currentYCursor = 0;
    const resultNodes = [];

    sortedDates.forEach((dateKey) => {
      const itemsForDate = groupedItems[dateKey] || [];
      const sampleItem = itemsForDate[0] || {};
      const dateStamp = sampleItem.dateStamp || dateKey.toUpperCase();
      const sectionTitle = sampleItem.sectionTitle || sampleItem.title || dateKey;

      // 1. Solid Ceiling Anchor Header Row
      const headerRowStart = currentYCursor + 1;
      resultNodes.push({
        kind: 'header',
        key: `header-${dateKey}`,
        dateStamp,
        sectionTitle,
        style: {
          gridColumnStart: 1,
          gridColumnEnd: gridWidth + 1,
          gridRowStart: headerRowStart,
          gridRowEnd: headerRowStart + 1
        }
      });

      currentYCursor += 1;

      // 2. Pack items upward beneath header ceiling with zero space waste
      itemsForDate.forEach((item, idx) => {
        const ratio = imageRatios[item.id];

        // Candidate footprints: preferred ratio footprint first, then adaptive 1x1 box fallback
        let candidates = [{ w: 1, h: 1 }];
        if (ratio) {
          if (ratio >= 1.35) {
            candidates = [{ w: 2, h: 1 }, { w: 1, h: 1 }];
          } else if (ratio <= 0.82) {
            candidates = [{ w: 1, h: 2 }, { w: 1, h: 1 }];
          } else {
            candidates = [{ w: 1, h: 1 }];
          }
        } else {
          // Fallback footprint pattern while image ratio is loading
          if (idx % 3 === 1) {
            candidates = [{ w: 1, h: 2 }, { w: 1, h: 1 }];
          } else if (idx % 3 === 2) {
            candidates = [{ w: 2, h: 1 }, { w: 1, h: 1 }];
          } else {
            candidates = [{ w: 1, h: 1 }];
          }
        }

        let placed = false;
        let scanY = currentYCursor;

        while (!placed) {
          for (let cand of candidates) {
            let w = Math.min(cand.w, gridWidth);
            let h = cand.h;

            for (let scanX = 0; scanX <= gridWidth - w; scanX++) {
              if (isSpaceClear(scanX, scanY, w, h)) {
                claimSpace(scanX, scanY, w, h);
                resultNodes.push({
                  kind: 'item',
                  key: item.id,
                  item,
                  style: {
                    gridColumnStart: scanX + 1,
                    gridColumnEnd: scanX + 1 + w,
                    gridRowStart: scanY + 1,
                    gridRowEnd: scanY + 1 + h,
                    willChange: 'grid-row-start, grid-column-start'
                  }
                });
                placed = true;
                break;
              }
            }
            if (placed) break;
          }
          if (!placed) scanY++;
        }
      });

      currentYCursor = occupiedMatrix.length;
    });

    return resultNodes;
  }, [sortedDates, groupedItems, gridWidth, imageRatios]);

  const handleDownload = (imageUrl, title) => {
    window.open(formatGoogleDriveLink(imageUrl), '_blank');
  };

  return (
    <div className="min-h-screen py-6 px-4 md:px-8 max-w-6xl mx-auto">
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
          <span className="text-[10px] font-mono text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">Anti-Gravity Packing Engine</span>
        </div>
      </div>

      {/* Mobile Horizontal Category Pills (sticky, stays fixed on screen while scrolling) */}
      <div className="lg:hidden sticky top-16 z-30 bg-brand-lightBg/95 dark:bg-brand-darkBg/95 backdrop-blur-md py-2 flex items-center space-x-2 overflow-x-auto pb-3 scrollbar-none w-full select-none mb-4 border-b border-zinc-200/20 dark:border-zinc-800/20">
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
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative">
        {/* Left Column: Category Timeline Menu (Desktop: sticky top-28, permanently fixed on screen while scrolling) */}
        <div className="hidden lg:block lg:col-span-4 space-y-6 lg:sticky lg:top-28 self-start z-20">
          <section className="bg-white dark:bg-brand-darkCard rounded-[2rem] p-8 shadow-soft dark:shadow-soft-dark border border-zinc-200/30 dark:border-zinc-800/20">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-450 dark:text-zinc-500">Filter Split</span>
              <h2 className="font-syne font-bold text-2xl text-zinc-900 dark:text-white mt-1 mb-8">Creative Timeline</h2>
            </div>

            {/* Timeline Filter items */}
            <div className="space-y-6 relative pl-6 ml-1 border-l border-zinc-100 dark:border-zinc-850">
              {categories.map((cat) => {
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

        {/* Right Column: Anti-Gravity Bento Gallery Grid (8 cols wide) */}
        <div className="lg:col-span-8">
          {sortedDates.length === 0 ? (
            <div className="bg-white dark:bg-brand-darkCard rounded-[2rem] p-12 text-center border border-zinc-200/30 dark:border-zinc-800/20 text-zinc-450 font-mono text-xs">
              No photos found under this category.
            </div>
          ) : (
            <div
              className="grid gap-3 relative auto-rows-[140px] sm:auto-rows-[180px]"
              style={{ gridTemplateColumns: `repeat(${gridWidth}, 1fr)` }}
            >
              {packedNodes.map((node) => {
                if (node.kind === 'header') {
                  return (
                    <div key={node.key} style={node.style} className="anchor-header-block py-4 select-none">
                      <div className="inline-block pb-1 border-b border-zinc-400 dark:border-zinc-600 mb-1">
                        <span className="text-xl md:text-2xl font-light font-syne text-zinc-400 dark:text-zinc-400 tracking-wider">
                          {node.dateStamp}
                        </span>
                      </div>
                      <h3 className="text-2xl md:text-3xl font-normal font-syne text-zinc-900 dark:text-white tracking-tight">
                        {node.sectionTitle}
                      </h3>
                    </div>
                  );
                }

                const { item, style } = node;
                return (
                  <div
                    key={node.key}
                    onClick={() => setActiveItem(item)}
                    style={style}
                    className="relative overflow-hidden rounded-lg cursor-pointer group transform transition-all duration-500 hover:-translate-y-1 hover:shadow-xl bg-zinc-200 dark:bg-zinc-800 border border-zinc-300/40 dark:border-zinc-700/40"
                  >
                    {/* Image Layer */}
                    <img
                      src={formatGoogleDriveLink(item.image)}
                      alt={item.title}
                      onLoad={(e) => {
                        if (e.target.naturalWidth && e.target.naturalHeight) {
                          handleImageLoad(item.id, e.target.naturalWidth, e.target.naturalHeight);
                        }
                      }}
                      onError={(e) => {
                        if (item.image && (item.image.includes('google.com') || item.image.includes('drive'))) {
                          const fileIdMatch = item.image.match(/\/d\/([a-zA-Z0-9_-]+)/) || item.image.match(/[?&]id=([a-zA-Z0-9_-]+)/);
                          if (fileIdMatch && fileIdMatch[1] && !e.target.dataset.retried) {
                            e.target.dataset.retried = 'true';
                            e.target.src = `https://drive.google.com/uc?export=view&id=${fileIdMatch[1]}`;
                          }
                        }
                      }}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                    />

                    {/* Premium Dark Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-65 group-hover:opacity-85 transition-opacity duration-300"></div>

                    {/* Content aligned at the bottom */}
                    <div className="absolute bottom-0 left-0 w-full p-4 flex flex-col justify-end text-left z-10 select-none">
                      <span className={`text-[8px] font-mono font-bold uppercase tracking-widest ${textAccent} opacity-90 mb-1`}>
                        {item.category}
                      </span>
                      <h3 className="font-syne font-bold text-sm text-white leading-tight mb-1">
                        {item.title}
                      </h3>
                      <p className="text-[10px] text-zinc-300 line-clamp-1 opacity-0 group-hover:opacity-100 transform translate-y-1 group-hover:translate-y-0 transition-all duration-350 leading-normal">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Lightbox Details Modal */}
      {activeItem && (() => {
        const activeRatio = imageRatios[activeItem.id];
        const isPortraitModal = activeRatio && activeRatio < 0.95;

        return (
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-zinc-950/90 backdrop-blur-md transition-opacity duration-300 animate-in fade-in"
            onClick={() => setActiveItem(null)}
          >
            {/* Top Bar controls */}
            <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-center z-10 select-none">
              <button
                onClick={() => setActiveItem(null)}
                className="p-2.5 bg-zinc-150/80 hover:bg-zinc-200 dark:bg-zinc-800/80 dark:hover:bg-zinc-700 rounded-full text-zinc-900 dark:text-white transition-all transform active:scale-95 shadow"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </button>
              <div className="text-xs font-mono font-semibold tracking-wider text-zinc-400 dark:text-zinc-500">
                {activeItem.date}
              </div>
            </div>

            {/* Lightbox Content Card container */}
            <div
              className={`w-full ${isPortraitModal ? 'max-w-4xl' : 'max-w-5xl'} max-h-[88vh] overflow-y-auto flex flex-col md:flex-row items-stretch animate-in zoom-in-95 duration-300 shadow-2xl rounded-[2rem] overflow-hidden m-4 bg-white dark:bg-brand-darkCard border border-zinc-200/30 dark:border-zinc-800/20`}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Main Image Display (Adapts dynamically to the photo's true ratio) */}
              <div className={`w-full ${isPortraitModal ? 'md:w-1/2 min-h-[45vh] md:h-[75vh]' : 'md:w-2/3 min-h-[35vh] md:h-[70vh]'} relative bg-zinc-950 flex items-center justify-center p-6 overflow-hidden`}>
                {/* Ambient Soft Blur Background */}
                <img
                  src={formatGoogleDriveLink(activeItem.image)}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover blur-3xl opacity-25 scale-110 pointer-events-none"
                />
                {/* Crisp Uncropped Image adapting to natural aspect ratio */}
                <img
                  src={formatGoogleDriveLink(activeItem.image)}
                  alt={activeItem.title}
                  onLoad={(e) => {
                    if (e.target.naturalWidth && e.target.naturalHeight) {
                      handleImageLoad(activeItem.id, e.target.naturalWidth, e.target.naturalHeight);
                    }
                  }}
                  onError={(e) => {
                    if (activeItem.image && (activeItem.image.includes('google.com') || activeItem.image.includes('drive'))) {
                      const fileIdMatch = activeItem.image.match(/\/d\/([a-zA-Z0-9_-]+)/) || activeItem.image.match(/[?&]id=([a-zA-Z0-9_-]+)/);
                      if (fileIdMatch && fileIdMatch[1] && !e.target.dataset.retried) {
                        e.target.dataset.retried = 'true';
                        e.target.src = `https://drive.google.com/uc?export=view&id=${fileIdMatch[1]}`;
                      }
                    }
                  }}
                  style={{
                    aspectRatio: activeRatio ? `${activeRatio}` : 'auto'
                  }}
                  className="relative max-h-[72vh] max-w-full object-contain z-10 rounded-xl shadow-2xl transition-all duration-300"
                />
              </div>

              {/* Sidebar Details Info Panel */}
              <div className={`w-full ${isPortraitModal ? 'md:w-1/2' : 'md:w-1/3'} p-8 flex flex-col justify-center border-t md:border-t-0 md:border-l border-zinc-100 dark:border-zinc-800/40 text-left`}>
                <span className={`text-[10px] font-mono font-bold uppercase tracking-widest mb-4 ${textAccent}`}>
                  {activeItem.category}
                </span>
                <h2 className="text-2xl font-syne font-extrabold text-zinc-900 dark:text-white mb-3 leading-tight">
                  {activeItem.title}
                </h2>
                <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed mb-8">
                  {activeItem.desc}
                </p>

                <div className="space-y-4 mb-8">
                  <div className="flex items-center space-x-3 text-xs font-mono text-zinc-450 dark:text-zinc-500">
                    <svg className="w-4 h-4 text-zinc-400 dark:text-zinc-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    </svg>
                    <span>{activeItem.location}</span>
                  </div>
                  <div className="flex items-center space-x-3 text-xs font-mono text-zinc-450 dark:text-zinc-500">
                    <svg className="w-4 h-4 text-zinc-400 dark:text-zinc-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    </svg>
                    <span>{activeItem.camera}</span>
                  </div>
                </div>

                <button
                  onClick={() => handleDownload(activeItem.image, activeItem.title)}
                  className={`w-full py-4 rounded-xl text-xs font-mono font-bold uppercase transition-all duration-350 text-white ${bgAccent} hover:bg-zinc-900 dark:hover:bg-white dark:hover:text-zinc-950 transform hover:scale-[1.02] active:scale-[0.98] shadow-md`}
                >
                  Download Original
                </button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
