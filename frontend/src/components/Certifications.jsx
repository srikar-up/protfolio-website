import React, { useState, useRef, useEffect } from 'react';
import { playTactileClick } from '../utils/sound';

const defaultCertifications = [
  {
    id: 1,
    title: "Deep Learning Specialization",
    issuer: "DeepLearning.AI",
    platform: "Coursera",
    year: "2026",
    credentialId: "DLAI-NN-40912",
    credentialUrl: "https://coursera.org/verify/specialization/DLAI",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=1000&auto=format&fit=crop",
    skills: ["Neural Networks", "TensorFlow", "CNNs", "Transformers", "Hyperparameter Tuning"],
    desc: "Mastering foundational deep learning architectures, convolutional neural networks for computer vision, and sequence models using TensorFlow."
  },
  {
    id: 2,
    title: "IBM Data Science Professional",
    issuer: "IBM",
    platform: "Coursera",
    year: "2025",
    credentialId: "IBM-DS-98214",
    credentialUrl: "https://coursera.org/verify/professional-cert/IBM-DS",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1000&auto=format&fit=crop",
    skills: ["Python", "SQL", "Data Analysis", "Machine Learning", "Data Visualization"],
    desc: "Comprehensive 10-course professional curriculum covering statistical modeling, Python data pipelines, machine learning algorithms, and database querying."
  },
  {
    id: 3,
    title: "Google Advanced Data Analytics",
    issuer: "Google",
    platform: "Google Career Certificates",
    year: "2025",
    credentialId: "GOOG-ADA-8711",
    credentialUrl: "https://coursera.org/verify/professional-cert/GOOGLE-ADA",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1000&auto=format&fit=crop",
    skills: ["Predictive Modeling", "Statistics", "EDA", "Python", "Tableau"],
    desc: "End-to-end data analytics lifecycle, exploratory data analysis, hypothesis testing, and production regression modeling."
  },
  {
    id: 4,
    title: "Meta Front-End Developer Professional",
    issuer: "Meta",
    platform: "Coursera",
    year: "2025",
    credentialId: "META-FED-3329",
    credentialUrl: "https://coursera.org/verify/professional-cert/META-FED",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1000&auto=format&fit=crop",
    skills: ["React.js", "Modern JavaScript", "UI/UX Design", "CSS Architecture"],
    desc: "Core frontend systems architecture, component lifecycle optimization, accessible UI development, and responsive bento layouts."
  },
  {
    id: 5,
    title: "AWS Machine Learning Foundations",
    issuer: "Amazon Web Services",
    platform: "AWS Training",
    year: "2026",
    credentialId: "AWS-MLS-6610",
    credentialUrl: "https://aws.amazon.com/verification",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1000&auto=format&fit=crop",
    skills: ["AWS SageMaker", "Cloud ML Pipelines", "Model Deployment", "Feature Stores"],
    desc: "Architecting and deploying production-grade machine learning workflows, automated ETL pipelines, and feature stores on AWS cloud infrastructure."
  }
];

export default function Certifications({ items }) {
  const certifications = items && items.length > 0 ? items : defaultCertifications;
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedCert, setSelectedCert] = useState(null);
  const sliderRef = useRef(null);
  const activeIndexRef = useRef(0);

  // Wheel listener: translate vertical scroll over slider into horizontal scrolling
  useEffect(() => {
    const el = sliderRef.current;
    if (!el) return;

    const onWheel = (e) => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX) && Math.abs(e.deltaY) > 8) {
        const atStart = el.scrollLeft <= 0;
        const atEnd = el.scrollLeft >= el.scrollWidth - el.clientWidth - 10;
        if ((e.deltaY > 0 && !atEnd) || (e.deltaY < 0 && !atStart)) {
          e.preventDefault();
          el.scrollLeft += e.deltaY * 1.2;
        }
      }
    };

    el.addEventListener('wheel', onWheel, { passive: false });
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
      newIndex = certifications.length - 1;
    } else {
      newIndex = Math.min(certifications.length - 1, Math.max(0, Math.round(container.scrollLeft / cardWidth)));
    }

    if (newIndex !== activeIndexRef.current) {
      activeIndexRef.current = newIndex;
      setActiveIndex(newIndex);
      playTactileClick(850);
    }
  };

  const scrollToIndex = (index) => {
    if (!sliderRef.current) return;
    const clamped = Math.max(0, Math.min(certifications.length - 1, index));
    const container = sliderRef.current;
    const targetCard = container.children[clamped];
    if (targetCard) {
      playTactileClick(950);
      if (clamped === certifications.length - 1) {
        container.scrollTo({ left: container.scrollWidth, behavior: 'smooth' });
      } else {
        const targetLeft = targetCard.offsetLeft - container.offsetLeft;
        container.scrollTo({ left: targetLeft, behavior: 'smooth' });
      }
      setActiveIndex(clamped);
      activeIndexRef.current = clamped;
    }
  };

  const handlePrev = () => scrollToIndex(activeIndex - 1);
  const handleNext = () => scrollToIndex(activeIndex + 1);

  return (
    <div id="certifications" className="lg:col-span-12 bg-transparent rounded-[2rem] pt-6 flex flex-col gap-6 explode-level-0">
      
      {/* Header section with controls */}
      <div className="flex flex-col md:flex-row md:items-end justify-between px-2 gap-4">
        <div>
          <div className="flex items-center space-x-2.5 mb-2">
            <span className="text-xs font-mono font-bold tracking-widest uppercase text-brand-orange">
              Verified Credentials
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-brand-orange animate-pulse"></span>
          </div>
          <h2 className="font-sans font-extrabold text-3xl md:text-4xl text-zinc-950 dark:text-white tracking-tight">
            Certifications
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2 max-w-xl leading-relaxed">
            Industry accreditations across Machine Learning, Data Analytics pipelines, and Modern Web Systems.
          </p>
        </div>

        {/* Carousel Navigation Arrow Controls */}
        <div className="flex items-center space-x-2 shrink-0">
          <button 
            onClick={handlePrev}
            disabled={activeIndex === 0}
            className={`w-10 h-10 rounded-full border border-zinc-200 dark:border-zinc-800 flex items-center justify-center text-zinc-600 dark:text-zinc-300 bento-transition ${
              activeIndex === 0 
                ? 'opacity-40 cursor-not-allowed' 
                : 'hover:border-brand-orange hover:text-brand-orange active:scale-95 bg-white dark:bg-brand-darkCard shadow-sm'
            }`}
            aria-label="Previous Certificate"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button 
            onClick={handleNext}
            disabled={activeIndex === certifications.length - 1}
            className={`w-10 h-10 rounded-full border border-zinc-200 dark:border-zinc-800 flex items-center justify-center text-zinc-600 dark:text-zinc-300 bento-transition ${
              activeIndex === certifications.length - 1 
                ? 'opacity-40 cursor-not-allowed' 
                : 'hover:border-brand-orange hover:text-brand-orange active:scale-95 bg-white dark:bg-brand-darkCard shadow-sm'
            }`}
            aria-label="Next Certificate"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Horizontal Trackpad-Scrollable Cards Track */}
      <div 
        ref={sliderRef}
        onScroll={handleSliderScroll}
        className="flex gap-6 overflow-x-auto snap-x snap-mandatory py-4 no-scrollbar scroll-smooth cursor-grab active:cursor-grabbing select-none"
      >
        {certifications.map((cert, index) => {
          return (
            <div
              key={cert.id || index}
              onClick={() => setSelectedCert(cert)}
              className="snap-start shrink-0 w-[310px] sm:w-[350px] md:w-[390px] bg-white dark:bg-brand-darkCard rounded-[2rem] p-7 flex flex-col justify-between shadow-soft dark:shadow-soft-dark border border-zinc-200/30 dark:border-zinc-800/20 hover:border-brand-orange/40 hover:-translate-y-1.5 bento-transition group cursor-pointer min-h-[380px]"
            >
              <div>
                {/* Top row: Issuer badge & Year */}
                <div className="flex justify-between items-center mb-4">
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-mono font-semibold px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800/80 text-zinc-700 dark:text-zinc-300 border border-zinc-200/60 dark:border-zinc-700/60">
                    <svg className="w-3 h-3 text-brand-orange" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    {cert.issuer}
                  </span>
                  <span className="text-xs font-mono font-bold text-brand-orange">
                    {cert.year}
                  </span>
                </div>

                {/* Certificate Badge / Document Image Banner */}
                {cert.image && (
                  <div className="w-full h-36 sm:h-40 rounded-2xl overflow-hidden mb-4 relative bg-zinc-100 dark:bg-zinc-850 border border-zinc-200/40 dark:border-zinc-800/40 shrink-0">
                    <img 
                      src={cert.image} 
                      alt={cert.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out" 
                      loading="lazy"
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                  </div>
                )}

                {/* Certificate Title */}
                <h3 className="font-sans font-bold text-xl text-zinc-900 dark:text-white group-hover:text-brand-orange bento-transition tracking-tight leading-snug">
                  {cert.title}
                </h3>

                {/* Certificate Description */}
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-3 line-clamp-3 leading-relaxed">
                  {cert.desc}
                </p>

                {/* Skills tags */}
                <div className="flex flex-wrap gap-1.5 mt-5">
                  {cert.skills?.slice(0, 4).map((skill, idx) => (
                    <span 
                      key={idx} 
                      className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-zinc-50 dark:bg-zinc-900/60 text-zinc-600 dark:text-zinc-400 border border-zinc-200/50 dark:border-zinc-800/50"
                    >
                      {skill}
                    </span>
                  ))}
                  {cert.skills?.length > 4 && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full text-zinc-400 dark:text-zinc-500">
                      +{cert.skills.length - 4}
                    </span>
                  )}
                </div>
              </div>

              {/* Bottom footer: Credential ID and View Action */}
              <div className="border-t border-zinc-100 dark:border-zinc-800/40 pt-4 mt-6 flex justify-between items-center text-xs">
                <span className="text-[10px] font-mono text-zinc-400 dark:text-zinc-500 tracking-wider">
                  ID: {cert.credentialId}
                </span>
                <span className="text-xs font-mono font-semibold text-brand-orange flex items-center gap-1 group-hover:translate-x-1 bento-transition">
                  View Credential ↗
                </span>
              </div>
            </div>
          );
        })}

        {/* End Spacer: ensures the final certificate card can scroll fully into view and snap to the end */}
        <div className="shrink-0 w-8 md:w-16 pointer-events-none" aria-hidden="true" />
      </div>

      {/* Pagination Dot Slider */}
      <div className="flex items-center justify-center space-x-2 py-2">
        {certifications.map((_, index) => (
          <button
            key={index}
            onClick={() => scrollToIndex(index)}
            aria-label={`Go to certificate ${index + 1}`}
            className={`h-2.5 rounded-full transition-all duration-300 focus:outline-none cursor-pointer ${
              activeIndex === index 
                ? 'w-8 bg-brand-orange shadow-[0_0_10px_rgba(255,69,0,0.7)]' 
                : 'w-2.5 bg-zinc-300 dark:bg-zinc-700 hover:bg-zinc-400 dark:hover:bg-zinc-600'
            }`}
          />
        ))}
      </div>

      {/* Certificate Detail Modal */}
      {selectedCert && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm select-none"
          onClick={() => setSelectedCert(null)}
        >
          <div 
            className="bg-white dark:bg-brand-darkCard max-w-lg w-full rounded-[2.5rem] p-8 shadow-2xl border border-zinc-200 dark:border-zinc-800 bento-transition animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex justify-between items-start mb-6">
              <div>
                <div className="inline-flex items-center gap-2 text-xs font-mono font-semibold px-3 py-1 rounded-full bg-orange-500/10 text-brand-orange border border-orange-500/20 mb-3">
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Verified Industry Certificate
                </div>
                <h3 className="font-sans font-bold text-2xl text-zinc-900 dark:text-white leading-tight">
                  {selectedCert.title}
                </h3>
                <p className="text-xs font-mono text-zinc-400 dark:text-zinc-500 mt-1">
                  Issued by {selectedCert.issuer} • {selectedCert.year}
                </p>
              </div>
              <button 
                onClick={() => setSelectedCert(null)}
                className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 text-2xl leading-none p-1"
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            {selectedCert.image && (
              <div className="mb-6 w-full h-44 sm:h-52 rounded-2xl overflow-hidden relative border border-zinc-200/40 dark:border-zinc-800/40 bg-zinc-100 dark:bg-zinc-900 shrink-0">
                <img 
                  src={selectedCert.image} 
                  alt={selectedCert.title} 
                  className="w-full h-full object-cover"
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
                <div className="absolute bottom-2.5 left-3 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-[9px] font-mono text-white/90 border border-white/10">
                  CREDENTIAL PREVIEW
                </div>
              </div>
            )}

            <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed mb-6">
              {selectedCert.desc}
            </p>

            {/* Competencies Mastered */}
            <div className="mb-6">
              <span className="text-xs font-mono uppercase tracking-widest text-zinc-400 dark:text-zinc-500 block mb-2.5">
                Skills & Technologies Mastered
              </span>
              <div className="flex flex-wrap gap-2">
                {selectedCert.skills?.map((skill, i) => (
                  <span 
                    key={i} 
                    className="text-xs font-mono px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-200/60 dark:border-zinc-700/60"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Credential ID metadata */}
            <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900/80 border border-zinc-200/50 dark:border-zinc-800/50 mb-6 flex justify-between items-center">
              <div>
                <span className="text-[10px] font-mono uppercase text-zinc-400 dark:text-zinc-500 block">Credential ID</span>
                <span className="font-mono text-xs font-semibold text-zinc-800 dark:text-zinc-200">{selectedCert.credentialId}</span>
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase text-zinc-400 dark:text-zinc-500 block">Platform</span>
                <span className="font-mono text-xs font-semibold text-brand-orange">{selectedCert.platform || selectedCert.issuer}</span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-3">
              <a 
                href={selectedCert.credentialUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex-1 text-center bg-brand-orange hover:bg-brand-orangeHover text-white py-3 rounded-xl font-semibold text-xs shadow-soft hover:shadow-orange-glow active:scale-95 bento-transition"
              >
                Verify Credential Online ↗
              </a>
              <button 
                onClick={() => setSelectedCert(null)}
                className="px-5 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 text-xs font-semibold text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900 bento-transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
