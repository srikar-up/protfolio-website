import React, { useState, useEffect } from 'react';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import Header from './components/Header';
import Hero from './components/Hero';
import Projects from './components/Projects';
import About from './components/About'; // Represents Card 1 (Experience)
import SkillsCard from './components/SkillsCard'; // Represents Card 2 (Skills Set)
import ReadingList from './components/ReadingList'; // Represents Card 3 (Reading List)
import Blog from './components/Blog'; // Represents Curated Writings (Blog Notebook)
import MapCard from './components/MapCard'; // Represents Card 4 (Punjab Map)
import Process from './components/Process'; // Represents Card 5 (How I Work)
import Contact from './components/Contact'; // Contact Bento Card
import Footer from './components/Footer';
import Dashboard from './components/Dashboard';
import CV from './components/CV';
import Gallery from './components/Gallery';
import BlogsPage from './components/BlogsPage';


const fallbackData = {
  projects: [
    {
      id: 1,
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
      id: 2,
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
      id: 3,
      year: "2025",
      tag: "WEB3 & FINTECH",
      title: "Decentralized Crypto Vault",
      desc: "A secure crypto dashboard designed to track assets, complete with rich SVG data charting.",
      content: "CryptVault is a student capstone project creating a secure, client-side dashboard for decentralized finance networks. Features offline keys storage, custom SVG path charting for historical prices, and MetaMask integration.",
      demoUrl: "https://vault.crypt",
      videoUrl: "",
      showInCv: false
    },
    {
      id: 4,
      year: "2026",
      tag: "ARTIFICIAL INTELLIGENCE",
      title: "AI Scholar Literature Finder",
      desc: "An automated agent search tool integrating NCBI PubMed APIs and semantic summaries.",
      content: "AIScholar is an AI assistant that queries literature databases like PubMed and arXiv, extracts key methodology abstracts, and utilizes local language model embeddings to construct comparative research grids.",
      demoUrl: "https://scholar.ai",
      videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      showInCv: true
    }
  ],
  blogs: [
    {
      id: 1,
      date: "JULY 2026",
      readTime: "5 MIN READ",
      category: "TYPOGRAPHY / ARCHITECTURE",
      title: "The Typography of Silence: Why whitespace dictates SaaS visual identity",
      desc: "An investigation into how high-fashion typography parameters dictate standard interface conversion rates and mental cognitive load.",
      content: "Whitespace is not empty space; it is a structural element. In high-converting SaaS interfaces, whitespace guides the user’s eye, establishes visual hierarchy, and reduces cognitive overload. By studying high-fashion typography variables, we can apply editorial padding parameters to layout structures to elevate brand identity and drive conversion."
    },
    {
      "id": 2,
      "date": "MAY 2026",
      "readTime": "7 MIN READ",
      "category": "GRAPHICS / ENGINEERING",
      "title": "Designing for the GPU: Shifting the rendering load away from JS cycles",
      "desc": "A technical look at transform layers, viewport matrices, and compositing variables that result in smooth scroll architectures.",
      "content": "Smooth scrolling is achieved when the browser runs at 60fps (or 120fps). Standard JavaScript animations block the main thread. By shifting layout transformations to CSS compositor variables (using transform3d, will-change, and translateZ), we utilize the GPU directly, ensuring a lag-free layout scroll experience even with heavy coordinate grids."
    },
    {
      "id": 3,
      "date": "APRIL 2026",
      "readTime": "4 MIN READ",
      "category": "UX / INTERACTION",
      "title": "The Tactile Web: Fusing physical textures with digital layout layers",
      "desc": "Exploring how micro-interactions, spring physics, and subtle gradients create depth in modern interfaces.",
      "content": "We experience the physical world through touch and material weight. The digital interface can simulate this weight using spring animations and coordinate depths. Designing with layers that slightly overlap and translate based on scroll speed mimics physical parallax, making the interface feel alive and tactile."
    },
    {
      "id": 4,
      "date": "FEB 2026",
      "readTime": "6 MIN READ",
      "category": "CSS / PERFORMANCE",
      "title": "CSS Subgrid & Container Queries: Reimagining grid dependencies",
      "desc": "A detailed look at modular card rendering systems that scale dynamically to layout grids.",
      "content": "CSS container queries allow components to own their responsive styling based on their parent container width rather than the screen viewport. Together with CSS Subgrid, cards inside nested grids align perfectly to the master layout grid, preventing layout shifts and creating highly modular component foundries."
    }
  ],
  timeline: {
    items: [
      {
        id: 1,
        title: "3rd Year B.Tech (Data Science & ML)",
        date: "July 2026 - Present / LPU",
        showInCv: true
      },
      {
        id: 2,
        title: "2nd Year B.Tech (Data Science)",
        date: "July 2025 - June 2026 / LPU",
        showInCv: true
      },
      {
        id: 3,
        title: "Started B.Tech CSE at LPU",
        date: "August 2024 - June 2025 / LPU",
        showInCv: true
      }
    ],
    footerText: "Focusing on statistical modeling, machine learning pipelines, and building clean web systems."
  },
  books: [
    {
      id: 1,
      title: "Dieter Rams: Complete Works",
      author: "By Klaus Klemp",
      spine: "rams dieter",
      color: "bg-[#FBE3D3] text-[#B85822] dark:bg-[#4E392B] dark:text-[#FBE3D3]",
      accentColor: "text-brand-orange",
      highlights: [
        {
          label: "01. Good design is unobtrusive",
          detail: "Products fulfilling a purpose are like tools. They are neither decorative objects nor works of art."
        },
        {
          label: "02. As little design as possible",
          detail: "Less, but better – because it concentrates on the essential aspects of the product."
        }
      ]
    },
    {
      id: 2,
      title: "Refactoring UI",
      author: "By Wathan & Schoger",
      spine: "refactoring ui",
      color: "bg-[#E3E8FC] text-[#3B4E8C] dark:bg-[#222B4E] dark:text-[#E3E8FC]",
      accentColor: "text-blue-500",
      highlights: [
        {
          label: "01. Establish visual hierarchy",
          detail: "Contrast is key. Don't just make elements bigger; use weight, scale, and color to guide the eye."
        },
        {
          label: "02. Design with real content",
          detail: "Placeholders can mask layout flaws. Real data forces you to solve actual constraints early."
        }
      ]
    },
    {
      id: 3,
      title: "Don't Make Me Think",
      author: "By Steve Krug",
      spine: "krug think",
      color: "bg-[#FDF2B5] text-[#7C6B1B] dark:bg-[#3E381A] dark:text-[#FDF2B5]",
      accentColor: "text-amber-500",
      highlights: [
        {
          label: "01. Eliminate needless choices",
          detail: "If something requires a user to pause and think about how to use it, the design has failed."
        },
        {
          label: "02. Optimize for scanning",
          detail: "We don't read web pages line-by-line; we scan them looking for landmarks that match our goals."
        }
      ]
    }
  ],
  skills: [
    {
      id: 0,
      title: "Web Dev",
      subtitle: "Frontend & Backend Systems",
      bgColor: "from-orange-500 to-amber-600",
      textGrad: "text-orange-500",
      pills: ["React.js", "HTML5", "CSS3", "JavaScript", "Vite", "Node.js", "Express.js", "Tailwind CSS"]
    },
    {
      id: 1,
      title: "Figma UI UX",
      subtitle: "Interface Design & Prototyping",
      bgColor: "from-blue-500 to-indigo-600",
      textGrad: "text-indigo-500",
      pills: ["Figma", "Wireframing", "Prototyping", "Design Systems", "User Research", "Information Architecture"]
    },
    {
      id: 2,
      title: "Python",
      subtitle: "Programming & Automation",
      bgColor: "from-emerald-500 to-teal-600",
      textGrad: "text-emerald-500",
      pills: ["Python", "Django", "Flask", "FastAPI", "APIs", "BeautifulSoup", "Automation Scripts"]
    },
    {
      id: 3,
      title: "Data Science",
      subtitle: "Data Wrangling & ML Models",
      bgColor: "from-violet-500 to-purple-600",
      textGrad: "text-violet-500",
      pills: ["Pandas", "NumPy", "Scikit-Learn", "TensorFlow", "Matplotlib", "SQL", "Data Visualization"]
    }
  ],
  hero: {
    name: "Srikar Maddela",
    title: "Data Science & ML",
    subtitle: "Developer & Designer.",
    bio: "Fusing analytical ML pipelines with tactile, interactive layouts. Click my interactive business card on the right to revolve/reveal its setup!",
    cardName: "Srikar",
    cardCourse: "B.Tech Data Science with ML",
    cardEmail: "srikarsensai@gmail.com",
    cardLinkedin: "srikar-maddela",
    cardGithub: "srikar-up"
  },
  gallery: [
    {
      id: 1,
      category: 'college',
      date: 'August 2026',
      title: 'sem1 one finish',
      desc: 'just fineshed the first sem',
      location: 'lpu ,punjab',
      camera: 'i phone 15',
      image: 'https://drive.google.com/file/d/1lQMGUpLwi7WiD7IMlTLh8VNW2ysrbMGW/view?usp=sharing'
    },
    {
      id: 2,
      category: 'architecture',
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
      date: 'August 2026',
      title: 'Kyoto Streets',
      desc: 'Rainy evenings in the historic district.',
      location: 'Kyoto, Japan',
      camera: 'Leica Q2',
      image: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&q=80&w=800'
    },
    {
      id: 5,
      category: 'nature',
      date: 'August 2026',
      title: 'Autumn Canopy',
      desc: 'Changing colors from above.',
      location: 'Vermont, USA',
      camera: 'DJI Mavic 3',
      image: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&q=80&w=800'
    },
    {
      id: 6,
      category: 'architecture',
      date: 'August 2026',
      title: 'Glass & Steel',
      desc: 'Looking up at the financial district.',
      location: 'New York City',
      camera: 'Sony A7R IV • 14mm f/1.8',
      image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800'
    },
    {
      id: 7,
      category: 'nature',
      date: 'August 2026',
      title: 'Alpine Horizon',
      desc: 'Sunset reflection over glacial waters.',
      location: 'Banff National Park, Canada',
      camera: 'Nikon Z7 II • 24-70mm f/2.8',
      image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=800'
    },
    {
      id: 8,
      category: 'portraits',
      date: 'August 2026',
      title: 'Neon Shadows',
      desc: 'Cyberpunk aesthetic portrait photography.',
      location: 'Tokyo, Japan',
      camera: 'Sony A7S III • 50mm f/1.2',
      image: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80&w=800'
    },
    {
      id: 9,
      category: 'travel',
      date: 'August 2026',
      title: 'Desert Gold',
      desc: 'Sand dunes stretching into the horizon.',
      location: 'Sahara Desert, Morocco',
      camera: 'Fujifilm GFX 100S • 45mm',
      image: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&q=80&w=800'
    },
    {
      id: 10,
      category: 'architecture',
      date: 'August 2026',
      title: 'Spiral Symmetry',
      desc: 'Architectural geometry from beneath.',
      location: 'Vatican Museum, Italy',
      camera: 'Canon R6 • 16-35mm f/2.8',
      image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=800'
    },
    {
      id: 11,
      category: 'college',
      date: 'August 2026',
      title: 'Campus Night Lights',
      desc: 'Late night coding session at the lab.',
      location: 'LPU Campus, Punjab',
      camera: 'iPhone 15 Pro',
      image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=800'
    },
    {
      id: 12,
      category: 'nature',
      date: 'August 2026',
      title: 'Nordic Lights',
      desc: 'Aurora Borealis dancing over snow fields.',
      location: 'Tromsø, Norway',
      camera: 'Sony A1 • 24mm f/1.4',
      image: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?auto=format&fit=crop&q=80&w=800'
    }
  ]
};

function MainApp() {
  const { toast } = useTheme();
  const [portfolioData, setPortfolioData] = useState(fallbackData);
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, []);

  const navigateTo = (path) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
    window.scrollTo(0, 0);
  };

  useEffect(() => {
    fetch('/api/portfolio')
      .then(res => {
        if (!res.ok) throw new Error('API error');
        return res.json();
      })
      .then(data => {
        if (data) setPortfolioData(data);
      })
      .catch(err => {
        console.warn('Backend portfolio API offline, using fallback frontend data:', err);
      });
  }, []);

  const handleToggleCvProject = (projectId) => {
    setPortfolioData(prev => {
      const updated = JSON.parse(JSON.stringify(prev));
      const proj = updated.projects?.find(p => p.id === projectId);
      if (proj) {
        proj.showInCv = proj.showInCv === false ? true : false;
      }
      fetch('/api/portfolio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      }).catch(err => console.warn('Could not sync CV toggle with server:', err));
      return updated;
    });
  };

  const isDashboard = currentPath === '/dashboard';
  const isCV = currentPath === '/cv';
  const isGallery = currentPath === '/gallery';
  const isBlogs = currentPath === '/blogs';

  return (
    <div className="bg-brand-lightBg dark:bg-brand-darkBg text-zinc-800 dark:text-zinc-200 font-sans antialiased transition-colors duration-500 selection:bg-orange-500/10 overflow-x-hidden min-h-screen">
      
      {/* Site Header Controls - Only show on home or CV page */}
      {!isDashboard && <Header navigateTo={navigateTo} isCV={isCV || isGallery || isBlogs} />}

      {/* Main Layout Container */}
      <main className="relative z-10 max-w-6xl mx-auto px-6 pt-32 pb-24 md:px-12">
        {isDashboard ? (
          <Dashboard 
            data={portfolioData}
            onSave={(updated) => setPortfolioData(updated)}
            onClose={() => navigateTo('/')}
          />
        ) : isCV ? (
          <CV 
            data={portfolioData}
            onClose={() => navigateTo('/')}
          />
        ) : isGallery ? (
          <Gallery 
            data={portfolioData}
            onClose={() => navigateTo('/')}
          />
        ) : isBlogs ? (
          <BlogsPage 
            data={portfolioData}
            onClose={() => navigateTo('/')}
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            
            {/* Hero Block (Transparent, occupies full screen width/height) */}
            <Hero data={portfolioData.hero} navigateTo={navigateTo} />

            {/* Projects Showcase (with scroll scatter-assemble effect) */}
            <Projects items={portfolioData.projects} onToggleCv={handleToggleCvProject} />

            {/* Card 1: Experience */}
            <About timeline={portfolioData.timeline} />

            {/* Card 2: Skills Set */}
            <SkillsCard skills={portfolioData.skills} />

            {/* Card 3: Reading List */}
            <ReadingList books={portfolioData.books} />

            {/* Blog writings section (Carousel slider + Modal popups) */}
            <Blog blogs={portfolioData.blogs} />

            {/* Card 4: Location Map */}
            <MapCard />

            {/* Card 5: How I Work */}
            <Process />

            {/* Contact / Get in Touch */}
            <Contact />

          </div>
        )}
      </main>

      {/* Global Footer - Only show on home page */}
      {!isDashboard && !isCV && !isGallery && !isBlogs && <Footer onToggleDashboard={() => navigateTo('/dashboard')} navigateTo={navigateTo} />}

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
