import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { savePortfolioToFirebase, isFirebaseConfigured, logoutAdmin, subscribeToAuth } from '../firebase';
import AdminLogin from './AdminLogin';

export default function Dashboard({ data, onSave, onClose }) {
  const { showToast } = useTheme();
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('hero');
  
  // Clone data to local state to support editing before saving
  const [localData, setLocalData] = useState(JSON.parse(JSON.stringify(data)));
  const [selectedItemIndex, setSelectedItemIndex] = useState(0);

  // Subscribe to Firebase Authentication
  useEffect(() => {
    const unsubscribe = subscribeToAuth((user) => {
      setCurrentUser(user);
      setIsAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Synchronize localData with incoming data changes (e.g. from backend fetch)
  useEffect(() => {
    if (data) {
      setLocalData(JSON.parse(JSON.stringify(data)));
    }
  }, [data]);

  const tabs = [
    { id: 'hero', label: 'Hero Section' },
    { id: 'about', label: 'About Me' },
    { id: 'location', label: 'Location' },
    { id: 'github', label: 'GitHub KPI' },
    { id: 'projects', label: 'Projects' },
    { id: 'certifications', label: 'Certifications' },
    { id: 'blogs', label: 'Blogs' },
    { id: 'timeline', label: 'Timeline' },
    { id: 'books', label: 'Books' },
    { id: 'skills', label: 'Skills' },
    { id: 'gallery', label: 'Gallery' }
  ];

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setSelectedItemIndex(0);
  };

  const handleSave = async () => {
    let savedSuccessfully = false;

    // 1. Save to Firebase Firestore if configured
    if (isFirebaseConfigured()) {
      const firebaseSuccess = await savePortfolioToFirebase(localData);
      if (firebaseSuccess) {
        savedSuccessfully = true;
      }
    }

    // 2. Try saving to local Express backend server if available
    try {
      const response = await fetch('/api/portfolio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(localData)
      });
      if (response.ok) {
        savedSuccessfully = true;
      }
    } catch (err) {
      console.warn('Local Express server save failed or offline:', err);
    }

    // 3. Update local state & show feedback
    if (savedSuccessfully) {
      showToast('⚡ Successfully synced & saved to Cloud Firestore!');
      onSave(localData); // Update main App state
    } else if (!isFirebaseConfigured()) {
      showToast('Saved to local state (Firebase keys missing)');
      onSave(localData);
    } else {
      showToast('⚠️ Could not write to Firebase. Check Firestore Rules in Firebase Console.');
    }
  };

  // Generic Field Update using deep copy to prevent React state mutation issues
  const updateField = (section, index, field, value) => {
    setLocalData(prev => {
      const updated = JSON.parse(JSON.stringify(prev));
      if (section === 'timeline' && index !== null) {
        // Timeline milestones are nested under timeline.items
        if (updated.timeline && updated.timeline.items && updated.timeline.items[index]) {
          updated.timeline.items[index][field] = value;
        }
      } else if (index === null) {
        // Single object like timeline footerText or hero
        if (updated[section]) {
          updated[section][field] = value;
        }
      } else {
        if (updated[section] && updated[section][index]) {
          updated[section][index][field] = value;
        }
      }
      return updated;
    });
  };

  // Helper to update fields in the Hero object
  const updateHeroField = (field, value) => {
    setLocalData(prev => {
      const updated = JSON.parse(JSON.stringify(prev));
      if (!updated.hero) {
        updated.hero = {};
      }
      updated.hero[field] = value;
      return updated;
    });
  };

  // Helper to update fields in the About Me / Philosophy object
  const updateAboutField = (field, value) => {
    setLocalData(prev => {
      const updated = JSON.parse(JSON.stringify(prev));
      if (!updated.aboutQuote) {
        updated.aboutQuote = {
          badge: "ABOUT ME • PHILOSOPHY •",
          quote: "Design is not just what it looks like and feels like. Design is how it works.",
          author: "Steve Jobs",
          role: "Apple Co-founder",
          reflection: "Building high-performance data systems, machine learning workflows, and intuitive interfaces crafted with precision and purpose."
        };
      }
      updated.aboutQuote[field] = value;
      return updated;
    });
  };

  // Helper to update fields in the Location object
  const updateLocationField = (field, value) => {
    setLocalData(prev => {
      const updated = JSON.parse(JSON.stringify(prev));
      if (!updated.location) {
        updated.location = {};
      }
      updated.location[field] = value;
      return updated;
    });
  };

  // Helper to update fields in GitHub KPI stats
  const updateGithubKpiField = (field, value) => {
    setLocalData(prev => {
      const updated = JSON.parse(JSON.stringify(prev));
      if (!updated.githubKpi) {
        updated.githubKpi = {};
      }
      updated.githubKpi[field] = value;
      return updated;
    });
  };

  // Specific nested field helpers
  const updateBookHighlight = (bookIndex, highlightIndex, key, value) => {
    setLocalData(prev => {
      const updated = JSON.parse(JSON.stringify(prev));
      if (updated.books && updated.books[bookIndex] && updated.books[bookIndex].highlights && updated.books[bookIndex].highlights[highlightIndex]) {
        updated.books[bookIndex].highlights[highlightIndex][key] = value;
      }
      return updated;
    });
  };

  const updateSkillsPills = (skillIndex, pillsString) => {
    setLocalData(prev => {
      const updated = JSON.parse(JSON.stringify(prev));
      if (updated.skills && updated.skills[skillIndex]) {
        updated.skills[skillIndex].pills = pillsString.split(',').map(s => s.trim()).filter(Boolean);
      }
      return updated;
    });
  };

  const updateCertSkills = (certIndex, skillsString) => {
    setLocalData(prev => {
      const updated = JSON.parse(JSON.stringify(prev));
      if (!updated.certifications) {
        updated.certifications = [];
      }
      if (updated.certifications[certIndex]) {
        updated.certifications[certIndex].skills = skillsString.split(',').map(s => s.trim()).filter(Boolean);
      }
      return updated;
    });
  };

  // Helper to add an image URL to a project
  const addProjectImage = (projectIndex) => {
    setLocalData(prev => {
      const updated = JSON.parse(JSON.stringify(prev));
      if (updated.projects && updated.projects[projectIndex]) {
        const proj = updated.projects[projectIndex];
        if (!Array.isArray(proj.images)) {
          proj.images = proj.image ? [proj.image] : [];
        }
        proj.images.push('');
        if (!Array.isArray(proj.imageTags)) {
          proj.imageTags = proj.images.map(() => '');
        } else {
          proj.imageTags.push('');
        }
        proj.image = typeof proj.images[0] === 'object' ? (proj.images[0]?.url || '') : (proj.images[0] || '');
      }
      return updated;
    });
  };

  // Helper to update a specific image URL in a project
  const updateProjectImage = (projectIndex, imageIndex, value) => {
    setLocalData(prev => {
      const updated = JSON.parse(JSON.stringify(prev));
      if (updated.projects && updated.projects[projectIndex]) {
        const proj = updated.projects[projectIndex];
        if (!Array.isArray(proj.images)) {
          proj.images = proj.image ? [proj.image] : [];
        }
        if (typeof proj.images[imageIndex] === 'object' && proj.images[imageIndex] !== null) {
          proj.images[imageIndex].url = value;
        } else {
          proj.images[imageIndex] = value;
        }
        proj.image = typeof proj.images[0] === 'object' ? (proj.images[0]?.url || '') : (proj.images[0] || '');
      }
      return updated;
    });
  };

  // Helper to update a specific image tag/label in a project
  const updateProjectImageTag = (projectIndex, imageIndex, tagValue) => {
    setLocalData(prev => {
      const updated = JSON.parse(JSON.stringify(prev));
      if (updated.projects && updated.projects[projectIndex]) {
        const proj = updated.projects[projectIndex];
        if (!Array.isArray(proj.imageTags)) {
          proj.imageTags = (proj.images || []).map(() => '');
        }
        while (proj.imageTags.length <= imageIndex) {
          proj.imageTags.push('');
        }
        proj.imageTags[imageIndex] = tagValue;

        if (typeof proj.images[imageIndex] === 'object' && proj.images[imageIndex] !== null) {
          proj.images[imageIndex].tag = tagValue;
        }
      }
      return updated;
    });
  };

  // Helper to remove an image URL from a project
  const removeProjectImage = (projectIndex, imageIndex) => {
    setLocalData(prev => {
      const updated = JSON.parse(JSON.stringify(prev));
      if (updated.projects && updated.projects[projectIndex]) {
        const proj = updated.projects[projectIndex];
        if (!Array.isArray(proj.images)) {
          proj.images = proj.image ? [proj.image] : [];
        }
        proj.images.splice(imageIndex, 1);
        if (Array.isArray(proj.imageTags)) {
          proj.imageTags.splice(imageIndex, 1);
        }
        proj.image = typeof proj.images[0] === 'object' ? (proj.images[0]?.url || '') : (proj.images[0] || '');
      }
      return updated;
    });
  };

  // Helper to set an image as cover (moves to first position)
  const setProjectCoverImage = (projectIndex, imageIndex) => {
    setLocalData(prev => {
      const updated = JSON.parse(JSON.stringify(prev));
      if (updated.projects && updated.projects[projectIndex]) {
        const proj = updated.projects[projectIndex];
        if (!Array.isArray(proj.images)) {
          proj.images = proj.image ? [proj.image] : [];
        }
        const [selected] = proj.images.splice(imageIndex, 1);
        proj.images.unshift(selected);

        if (Array.isArray(proj.imageTags)) {
          const [selectedTag] = proj.imageTags.splice(imageIndex, 1);
          proj.imageTags.unshift(selectedTag || '');
        }

        proj.image = typeof proj.images[0] === 'object' ? (proj.images[0]?.url || '') : (proj.images[0] || '');
      }
      return updated;
    });
  };

  // Add Item Helper using deep copy
  const handleAddItem = () => {
    setLocalData(prev => {
      const updated = JSON.parse(JSON.stringify(prev));
      let newItem = {};
      
      if (activeTab === 'projects') {
        newItem = {
          id: Date.now(),
          year: new Date().getFullYear().toString(),
          tag: 'PRODUCT ENGINEERING',
          title: 'New Project',
          desc: 'Brief description of your project.',
          content: 'Detailed explanation of project features and accomplishments.',
          demoUrl: 'https://example.com',
          image: '',
          images: [],
          videoUrl: '',
          showInCv: true
        };
        updated.projects.push(newItem);
        setSelectedItemIndex(updated.projects.length - 1);
      } else if (activeTab === 'certifications') {
        newItem = {
          id: Date.now(),
          title: 'New Certification Title',
          issuer: 'Issuing Organization (e.g. Google, AWS, IBM)',
          platform: 'Coursera / AWS Training / edX',
          year: new Date().getFullYear().toString(),
          credentialId: 'CERT-' + Math.floor(10000 + Math.random() * 90000),
          credentialUrl: 'https://example.com/verify',
          image: '',
          skills: ['Skill 1', 'Skill 2', 'Skill 3'],
          desc: 'Description of what this credential covers and core methodologies mastered.'
        };
        if (!updated.certifications) {
          updated.certifications = [];
        }
        updated.certifications.push(newItem);
        setSelectedItemIndex(updated.certifications.length - 1);
      } else if (activeTab === 'blogs') {
        newItem = {
          id: Date.now(),
          date: new Date().toLocaleString('default', { month: 'long', year: 'numeric' }).toUpperCase(),
          readTime: '5 MIN READ',
          category: 'TECH / DESIGN',
          title: 'New Blog Post',
          desc: 'Brief snippet description.',
          content: 'Full content of the blog post writeup.'
        };
        updated.blogs.push(newItem);
        setSelectedItemIndex(updated.blogs.length - 1);
      } else if (activeTab === 'timeline') {
        newItem = {
          id: Date.now(),
          title: 'New Milestone Item',
          date: 'July 2026 - Present / Company'
        };
        if (!updated.timeline) {
          updated.timeline = { items: [], footerText: '' };
        }
        if (!updated.timeline.items) {
          updated.timeline.items = [];
        }
        updated.timeline.items.unshift(newItem);
        setSelectedItemIndex(0);
      } else if (activeTab === 'books') {
        newItem = {
          id: Date.now(),
          title: 'New Book Title',
          author: 'By Author Name',
          spine: 'spine text',
          color: 'bg-[#FBE3D3] text-[#B85822] dark:bg-[#4E392B] dark:text-[#FBE3D3]',
          accentColor: 'text-brand-orange',
          highlights: [
            { label: '01. Key Concept', detail: 'Explanation of concept.' },
            { label: '02. Dynamic Quote', detail: 'Explanation of quote.' }
          ]
        };
        updated.books.push(newItem);
        setSelectedItemIndex(updated.books.length - 1);
      } else if (activeTab === 'skills') {
        newItem = {
          id: Date.now(),
          title: 'New Skill Category',
          subtitle: 'Category Subtitle',
          bgColor: 'from-orange-500 to-amber-600',
          textGrad: 'text-orange-500',
          pills: ['Skill A', 'Skill B', 'Skill C']
        };
        updated.skills.push(newItem);
        setSelectedItemIndex(updated.skills.length - 1);
      } else if (activeTab === 'gallery') {
        newItem = {
          id: Date.now(),
          category: 'nature',
          date: 'August 2026',
          title: 'New Photo',
          desc: 'Description of photo.',
          location: 'Location details',
          camera: 'Camera specs',
          image: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&q=80&w=800'
        };
        if (!updated.gallery) {
          updated.gallery = [];
        }
        updated.gallery.push(newItem);
        setSelectedItemIndex(updated.gallery.length - 1);
      }

      showToast(`Added a new item in ${activeTab}`);
      return updated;
    });
  };

  // Delete Item Helper using deep copy
  const handleDeleteItem = (index) => {
    setLocalData(prev => {
      const updated = JSON.parse(JSON.stringify(prev));
      
      if (activeTab === 'projects') {
        updated.projects.splice(index, 1);
      } else if (activeTab === 'certifications') {
        if (updated.certifications) {
          updated.certifications.splice(index, 1);
        }
      } else if (activeTab === 'blogs') {
        updated.blogs.splice(index, 1);
      } else if (activeTab === 'timeline') {
        if (updated.timeline && updated.timeline.items) {
          updated.timeline.items.splice(index, 1);
        }
      } else if (activeTab === 'books') {
        updated.books.splice(index, 1);
      } else if (activeTab === 'skills') {
        updated.skills.splice(index, 1);
      } else if (activeTab === 'gallery') {
        if (updated.gallery) {
          updated.gallery.splice(index, 1);
        }
      }

      showToast(`Deleted item from ${activeTab}`);
      setSelectedItemIndex(0);
      return updated;
    });
  };

  const getActiveList = () => {
    if (activeTab === 'projects') return localData.projects || [];
    if (activeTab === 'certifications') return localData.certifications || [];
    if (activeTab === 'blogs') return localData.blogs || [];
    if (activeTab === 'timeline') return localData.timeline?.items || [];
    if (activeTab === 'books') return localData.books || [];
    if (activeTab === 'skills') return localData.skills || [];
    if (activeTab === 'gallery') return localData.gallery || [];
    return [];
  };

  const activeList = getActiveList();
  const currentItem = activeList[selectedItemIndex] || null;

  // 1. Loading state during auth check
  if (isAuthLoading) {
    return (
      <div className="w-full min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <span className="w-8 h-8 border-2 border-brand-orange border-t-transparent rounded-full animate-spin"></span>
        <p className="text-xs font-mono text-zinc-400">Verifying admin access...</p>
      </div>
    );
  }

  // 2. Unauthenticated Gate: Show AdminLogin
  if (!currentUser) {
    return (
      <AdminLogin 
        onLoginSuccess={(user) => setCurrentUser(user)}
        onClose={onClose}
      />
    );
  }

  return (
    <section className="lg:col-span-12 w-full bg-transparent min-h-[85vh] py-6 flex flex-col gap-8 relative select-none">
      
      {/* Dashboard Header Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-brand-darkCard rounded-[2rem] p-6 shadow-soft dark:shadow-soft-dark border border-zinc-200/30 dark:border-zinc-800/20 bento-transition">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-brand-orange font-bold">ADMIN PANEL</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold border border-emerald-500/20">
              VERIFIED: {currentUser.email}
            </span>
          </div>
          <h1 className="font-syne font-bold text-2xl text-zinc-900 dark:text-white mt-1">Portfolio Control Desk</h1>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <button 
            onClick={handleSave} 
            className="px-6 py-2.5 bg-brand-orange text-white rounded-full font-semibold text-xs shadow-md hover:scale-105 active:scale-95 bento-transition"
          >
            Save All Changes
          </button>
          <button 
            onClick={async () => {
              await logoutAdmin();
              setCurrentUser(null);
              showToast('Signed out of Control Desk.');
            }}
            className="px-4 py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 border border-red-500/20 rounded-full font-semibold text-xs hover:scale-105 active:scale-95 bento-transition"
            title="Sign out of editor mode"
          >
            Sign Out
          </button>
          <button 
            onClick={onClose} 
            className="px-5 py-2.5 bg-zinc-150 dark:bg-zinc-850 text-zinc-800 dark:text-zinc-200 border border-zinc-200/30 dark:border-zinc-800/20 rounded-full font-semibold text-xs hover:scale-105 active:scale-95 bento-transition"
          >
            Exit Panel
          </button>
        </div>
      </div>

      {/* Tabs list Bar */}
      <div className="flex flex-wrap gap-2 bg-zinc-200/40 dark:bg-zinc-900/40 p-2 rounded-2xl border border-zinc-200/10 max-w-2xl">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            className={`px-6 py-2 rounded-xl text-xs font-mono font-bold tracking-wider bento-transition ${
              activeTab === tab.id
                ? 'bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 shadow-md'
                : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
            }`}
          >
            {tab.label.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Main Bento Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left Card: Items List Drawer */}
        <div className="lg:col-span-4 bg-white dark:bg-brand-darkCard rounded-[2rem] p-6 shadow-soft dark:shadow-soft-dark border border-zinc-200/30 dark:border-zinc-800/20 min-h-[400px] flex flex-col justify-between bento-transition">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-xs font-mono uppercase tracking-widest text-zinc-400 dark:text-zinc-500">Record List</h3>
              {activeTab !== 'hero' && activeTab !== 'about' && activeTab !== 'location' && activeTab !== 'github' && (
                <button 
                  onClick={handleAddItem}
                  className="text-[10px] font-mono text-brand-orange font-bold hover:underline"
                >
                  + ADD NEW
                </button>
              )}
            </div>
            
            <div className="space-y-2 max-h-[350px] overflow-y-auto pr-1">
              {activeTab === 'hero' ? (
                <div className="p-4 rounded-xl border border-brand-orange/45 bg-brand-orange/5 text-left">
                  <h4 className="text-xs font-bold text-zinc-850 dark:text-zinc-200">Hero Section</h4>
                  <p className="text-[10px] font-mono text-zinc-400 mt-1 leading-relaxed">
                    Updates the primary greeting, titles, bio, and business card details shown on the homepage.
                  </p>
                </div>
              ) : activeTab === 'about' ? (
                <div className="p-4 rounded-xl border border-brand-orange/45 bg-brand-orange/5 text-left">
                  <h4 className="text-xs font-bold text-zinc-850 dark:text-zinc-200">About Me & Philosophy</h4>
                  <p className="text-[10px] font-mono text-zinc-400 mt-1 leading-relaxed">
                    Configure your core philosophy quote statement, author attribution, role, and personal reflection shown on the homepage About Me card.
                  </p>
                </div>
              ) : activeTab === 'location' ? (
                <div className="p-4 rounded-xl border border-brand-orange/45 bg-brand-orange/5 text-left">
                  <h4 className="text-xs font-bold text-zinc-850 dark:text-zinc-200">Location & Coordinates</h4>
                  <p className="text-[10px] font-mono text-zinc-400 mt-1 leading-relaxed">
                    Configure your headquarters city, state, geographic coordinates, and direct contact address displayed on the interactive Map Card and Footer.
                  </p>
                </div>
              ) : activeTab === 'github' ? (
                <div className="p-4 rounded-xl border border-brand-orange/45 bg-brand-orange/5 text-left">
                  <h4 className="text-xs font-bold text-zinc-850 dark:text-zinc-200">GitHub KPI Metrics</h4>
                  <p className="text-[10px] font-mono text-zinc-400 mt-1 leading-relaxed">
                    Override or configure your exact Public Repositories count, Followers, and Active Streak displayed on the live telemetry row.
                  </p>
                </div>
              ) : (
                activeList.map((item, index) => (
                <div
                  key={item.id || index}
                  onClick={() => setSelectedItemIndex(index)}
                  className={`p-4 rounded-xl border cursor-pointer bento-transition text-left ${
                    selectedItemIndex === index
                      ? 'bg-brand-orange/5 border-brand-orange/45 dark:border-brand-orange/45'
                      : 'bg-zinc-50 dark:bg-zinc-900/40 border-zinc-200/40 dark:border-zinc-850/40 hover:border-zinc-350 dark:hover:border-zinc-700'
                  }`}
                >
                  <div className="flex justify-between items-start gap-2">
                    <div className="flex items-center space-x-2">
                      {item.image && (
                        <img 
                          src={item.image} 
                          alt="" 
                          className="w-5 h-5 rounded object-cover shrink-0 border border-zinc-200 dark:border-zinc-700" 
                          onError={(e) => { e.target.style.display = 'none'; }}
                        />
                      )}
                      <h4 className="text-xs font-bold text-zinc-850 dark:text-zinc-200 line-clamp-1">
                        {item.title || item.label || `Record #${index + 1}`}
                      </h4>
                      {(activeTab === 'projects' || activeTab === 'timeline') && item.showInCv !== false && (
                        <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold border border-emerald-500/20">
                          CV
                        </span>
                      )}
                    </div>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteItem(index);
                      }}
                      className="text-[10px] text-zinc-400 hover:text-red-500 font-mono"
                    >
                      Delete
                    </button>
                  </div>
                  <p className="text-[10px] font-mono text-zinc-400 mt-1 truncate">
                    {item.issuer ? `${item.issuer} • ${item.year || ''}` : (item.year || item.date || item.subtitle || item.author || "Global Values")}
                  </p>
                </div>
              ))
              )}
              {activeTab !== 'hero' && activeTab !== 'location' && activeTab !== 'github' && activeList.length === 0 && (
                <p className="text-xs font-mono text-zinc-400 text-center py-8">No records found. Add one!</p>
              )}
            </div>
          </div>

          {activeTab === 'timeline' && (
            <div className="border-t border-zinc-100 dark:border-zinc-800/40 pt-4 mt-4">
              <label className="block text-[10px] font-mono text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-1.5">Timeline Footer Text</label>
              <input 
                type="text" 
                value={localData.timeline.footerText} 
                onChange={(e) => updateField('timeline', null, 'footerText', e.target.value)}
                className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 focus:border-brand-orange focus:ring-1 focus:ring-brand-orange rounded-xl p-3 text-xs text-zinc-800 dark:text-zinc-100 outline-none bento-transition"
              />
            </div>
          )}
        </div>

        {/* Right Card: Editor Form Panel */}
        <div className="lg:col-span-8 bg-white dark:bg-brand-darkCard rounded-[2rem] p-8 shadow-soft dark:shadow-soft-dark border border-zinc-200/30 dark:border-zinc-800/20 bento-transition animate-fade-in">
          <h3 className="text-xs font-mono uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-6">Editor Attributes</h3>
          
          {activeTab === 'hero' ? (
            <div className="space-y-6 text-left">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <h4 className="text-xs font-mono text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-2 border-b pb-1 dark:border-zinc-800/40">Bio Greeting & Text</h4>
                </div>
                <div>
                  <label className="block text-[10px] font-mono text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-1.5">Full Name</label>
                  <input 
                    type="text" 
                    value={localData.hero?.name || ''} 
                    onChange={(e) => updateHeroField('name', e.target.value)}
                    className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 focus:border-brand-orange rounded-xl p-3.5 text-xs text-zinc-850 dark:text-zinc-100 outline-none bento-transition"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-1.5">Primary Title</label>
                  <input 
                    type="text" 
                    value={localData.hero?.title || ''} 
                    onChange={(e) => updateHeroField('title', e.target.value)}
                    className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 focus:border-brand-orange rounded-xl p-3.5 text-xs text-zinc-850 dark:text-zinc-100 outline-none bento-transition"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-[10px] font-mono text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-1.5">Accent Subtitle</label>
                  <input 
                    type="text" 
                    value={localData.hero?.subtitle || ''} 
                    onChange={(e) => updateHeroField('subtitle', e.target.value)}
                    className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 focus:border-brand-orange rounded-xl p-3.5 text-xs text-zinc-850 dark:text-zinc-100 outline-none bento-transition"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-[10px] font-mono text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-1.5">Bio Paragraph</label>
                  <textarea 
                    rows="3"
                    value={localData.hero?.bio || ''} 
                    onChange={(e) => updateHeroField('bio', e.target.value)}
                    className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 focus:border-brand-orange rounded-xl p-3.5 text-xs text-zinc-850 dark:text-zinc-100 outline-none bento-transition resize-none"
                  />
                </div>

                <div className="md:col-span-2 mt-4">
                  <h4 className="text-xs font-mono text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-2 border-b pb-1 dark:border-zinc-800/40">Business Card Metadata</h4>
                </div>
                <div>
                  <label className="block text-[10px] font-mono text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-1.5">Card Display Name</label>
                  <input 
                    type="text" 
                    value={localData.hero?.cardName || ''} 
                    onChange={(e) => updateHeroField('cardName', e.target.value)}
                    className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 focus:border-brand-orange rounded-xl p-3.5 text-xs text-zinc-850 dark:text-zinc-100 outline-none bento-transition"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-1.5">Card Course / Role</label>
                  <input 
                    type="text" 
                    value={localData.hero?.cardCourse || ''} 
                    onChange={(e) => updateHeroField('cardCourse', e.target.value)}
                    className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 focus:border-brand-orange rounded-xl p-3.5 text-xs text-zinc-850 dark:text-zinc-100 outline-none bento-transition"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-1.5">Card Email</label>
                  <input 
                    type="text" 
                    value={localData.hero?.cardEmail || ''} 
                    onChange={(e) => updateHeroField('cardEmail', e.target.value)}
                    className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 focus:border-brand-orange rounded-xl p-3.5 text-xs text-zinc-850 dark:text-zinc-100 outline-none bento-transition"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-1.5">Card LinkedIn Username</label>
                  <input 
                    type="text" 
                    value={localData.hero?.cardLinkedin || ''} 
                    onChange={(e) => updateHeroField('cardLinkedin', e.target.value)}
                    className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 focus:border-brand-orange rounded-xl p-3.5 text-xs text-zinc-850 dark:text-zinc-100 outline-none bento-transition"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-1.5">Card GitHub Username</label>
                  <input 
                    type="text" 
                    value={localData.hero?.cardGithub || ''} 
                    onChange={(e) => updateHeroField('cardGithub', e.target.value)}
                    className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 focus:border-brand-orange rounded-xl p-3.5 text-xs text-zinc-850 dark:text-zinc-100 outline-none bento-transition"
                  />
                </div>
              </div>
            </div>
          ) : activeTab === 'about' ? (
            <div className="space-y-6 text-left">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <h4 className="text-xs font-mono text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-2 border-b pb-1 dark:border-zinc-800/40">Philosophy Statement & Attribution</h4>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-[10px] font-mono text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-1.5">Quote Statement</label>
                  <textarea 
                    rows="3"
                    value={localData.aboutQuote?.quote || ''} 
                    onChange={(e) => updateAboutField('quote', e.target.value)}
                    placeholder="Design is not just what it looks like and feels like. Design is how it works."
                    className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 focus:border-brand-orange rounded-xl p-3.5 text-xs text-zinc-850 dark:text-zinc-100 outline-none bento-transition resize-none"
                  />
                  <p className="text-[9px] font-mono text-zinc-400 mt-1">The primary statement displayed on the About Me card.</p>
                </div>
                <div>
                  <label className="block text-[10px] font-mono text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-1.5">Author (e.g. Steve Jobs)</label>
                  <input 
                    type="text" 
                    value={localData.aboutQuote?.author || ''} 
                    onChange={(e) => updateAboutField('author', e.target.value)}
                    placeholder="Steve Jobs"
                    className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 focus:border-brand-orange rounded-xl p-3.5 text-xs text-zinc-850 dark:text-zinc-100 outline-none bento-transition"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-1.5">Author Role (e.g. Apple Co-founder)</label>
                  <input 
                    type="text" 
                    value={localData.aboutQuote?.role || ''} 
                    onChange={(e) => updateAboutField('role', e.target.value)}
                    placeholder="Apple Co-founder"
                    className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 focus:border-brand-orange rounded-xl p-3.5 text-xs text-zinc-850 dark:text-zinc-100 outline-none bento-transition"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-[10px] font-mono text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-1.5">Personal Reflection / Philosophy Note</label>
                  <textarea 
                    rows="3"
                    value={localData.aboutQuote?.reflection || ''} 
                    onChange={(e) => updateAboutField('reflection', e.target.value)}
                    placeholder="Building high-performance data systems, machine learning workflows, and intuitive interfaces..."
                    className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 focus:border-brand-orange rounded-xl p-3.5 text-xs text-zinc-850 dark:text-zinc-100 outline-none bento-transition resize-none"
                  />
                  <p className="text-[9px] font-mono text-zinc-400 mt-1">Explains your engineering ethos, machine learning craft, and system design approach.</p>
                </div>
                <div>
                  <label className="block text-[10px] font-mono text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-1.5">Badge Header Label</label>
                  <input 
                    type="text" 
                    value={localData.aboutQuote?.badge || ''} 
                    onChange={(e) => updateAboutField('badge', e.target.value)}
                    placeholder="ABOUT ME • PHILOSOPHY •"
                    className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 focus:border-brand-orange rounded-xl p-3.5 text-xs text-zinc-850 dark:text-zinc-100 outline-none bento-transition"
                  />
                </div>
              </div>
            </div>
          ) : activeTab === 'location' ? (
            <div className="space-y-6 text-left">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <h4 className="text-xs font-mono text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-2 border-b pb-1 dark:border-zinc-800/40">Headquarters & Map Card Display</h4>
                </div>
                <div>
                  <label className="block text-[10px] font-mono text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-1.5">State / Region (e.g. Punjab)</label>
                  <input 
                    type="text" 
                    value={localData.location?.state || ''} 
                    onChange={(e) => updateLocationField('state', e.target.value)}
                    placeholder="e.g. Punjab"
                    className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 focus:border-brand-orange rounded-xl p-3.5 text-xs text-zinc-850 dark:text-zinc-100 outline-none bento-transition"
                  />
                  <p className="text-[9px] font-mono text-zinc-400 mt-1">Used on map card header & footer credits line.</p>
                </div>
                <div>
                  <label className="block text-[10px] font-mono text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-1.5">City & Country (e.g. LPU, INDIA)</label>
                  <input 
                    type="text" 
                    value={localData.location?.cityCountry || ''} 
                    onChange={(e) => updateLocationField('cityCountry', e.target.value)}
                    placeholder="e.g. LPU, INDIA"
                    className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 focus:border-brand-orange rounded-xl p-3.5 text-xs text-zinc-850 dark:text-zinc-100 outline-none bento-transition"
                  />
                  <p className="text-[9px] font-mono text-zinc-400 mt-1">Shown in the badge on the interactive Map Card.</p>
                </div>
                <div>
                  <label className="block text-[10px] font-mono text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-1.5">Map Tag Badge (e.g. HQ)</label>
                  <input 
                    type="text" 
                    value={localData.location?.tag || ''} 
                    onChange={(e) => updateLocationField('tag', e.target.value)}
                    placeholder="HQ"
                    className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 focus:border-brand-orange rounded-xl p-3.5 text-xs text-zinc-850 dark:text-zinc-100 outline-none bento-transition"
                  />
                  <p className="text-[9px] font-mono text-zinc-400 mt-1">Small uppercase badge shown next to state name.</p>
                </div>
                <div>
                  <label className="block text-[10px] font-mono text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-1.5">GPS Coordinates (Lat / Long)</label>
                  <input 
                    type="text" 
                    value={localData.location?.coordinates || ''} 
                    onChange={(e) => updateLocationField('coordinates', e.target.value)}
                    placeholder="31.2536° N, 75.7037° E"
                    className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 focus:border-brand-orange rounded-xl p-3.5 text-xs text-zinc-850 dark:text-zinc-100 outline-none bento-transition"
                  />
                  <p className="text-[9px] font-mono text-zinc-400 mt-1">Coordinates displayed in the bottom telemetry line of Map Card.</p>
                </div>
                <div>
                  <label className="block text-[10px] font-mono text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-1.5">Timezone (e.g. GMT +5:30)</label>
                  <input 
                    type="text" 
                    value={localData.location?.timezone || ''} 
                    onChange={(e) => updateLocationField('timezone', e.target.value)}
                    placeholder="GMT +5:30"
                    className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 focus:border-brand-orange rounded-xl p-3.5 text-xs text-zinc-850 dark:text-zinc-100 outline-none bento-transition"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-[10px] font-mono text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-1.5">Full Contact Address (Shown in Footer Direct Contact)</label>
                  <input 
                    type="text" 
                    value={localData.location?.fullAddress || ''} 
                    onChange={(e) => updateLocationField('fullAddress', e.target.value)}
                    placeholder="Lovely Professional University, Punjab, India (GMT +5:30)"
                    className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 focus:border-brand-orange rounded-xl p-3.5 text-xs text-zinc-850 dark:text-zinc-100 outline-none bento-transition"
                  />
                  <p className="text-[9px] font-mono text-zinc-400 mt-1">Appears as the physical location in the Footer Direct Contact column.</p>
                </div>
              </div>
            </div>
          ) : activeTab === 'github' ? (
            <div className="space-y-6 text-left">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <h4 className="text-xs font-mono text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-2 border-b pb-1 dark:border-zinc-800/40">GitHub Telemetry KPI Metrics</h4>
                  <p className="text-[11px] text-zinc-400 font-mono mb-2">
                    Controls the 4 KPI cards shown above the GitHub activity heatmap. Set your exact metrics here.
                  </p>
                </div>
                <div>
                  <label className="block text-[10px] font-mono text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-1.5">Public Repositories Count</label>
                  <input 
                    type="number" 
                    value={localData.githubKpi?.repos ?? 1} 
                    onChange={(e) => updateGithubKpiField('repos', parseInt(e.target.value) || 0)}
                    placeholder="1"
                    min="0"
                    className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 focus:border-brand-orange rounded-xl p-3.5 text-xs text-zinc-850 dark:text-zinc-100 outline-none bento-transition"
                  />
                  <p className="text-[9px] font-mono text-zinc-400 mt-1">Displayed in the "Public Repositories" badge card.</p>
                </div>
                <div>
                  <label className="block text-[10px] font-mono text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-1.5">Followers Count</label>
                  <input 
                    type="number" 
                    value={localData.githubKpi?.followers ?? 1} 
                    onChange={(e) => updateGithubKpiField('followers', parseInt(e.target.value) || 0)}
                    placeholder="1"
                    min="0"
                    className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 focus:border-brand-orange rounded-xl p-3.5 text-xs text-zinc-850 dark:text-zinc-100 outline-none bento-transition"
                  />
                  <p className="text-[9px] font-mono text-zinc-400 mt-1">Displayed in the "Followers & Stars" metric card.</p>
                </div>
                <div>
                  <label className="block text-[10px] font-mono text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-1.5">Active Streak (Days)</label>
                  <input 
                    type="number" 
                    value={localData.githubKpi?.streak ?? 5} 
                    onChange={(e) => updateGithubKpiField('streak', parseInt(e.target.value) || 0)}
                    placeholder="5"
                    min="0"
                    className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 focus:border-brand-orange rounded-xl p-3.5 text-xs text-zinc-850 dark:text-zinc-100 outline-none bento-transition"
                  />
                  <p className="text-[9px] font-mono text-zinc-400 mt-1">Displayed in the "Active Streak" 🔥 metric card.</p>
                </div>
                <div>
                  <label className="block text-[10px] font-mono text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-1.5">Total Contributions Override (Optional)</label>
                  <input 
                    type="number" 
                    value={localData.githubKpi?.totalContributions || ''} 
                    onChange={(e) => updateGithubKpiField('totalContributions', e.target.value ? parseInt(e.target.value) : '')}
                    placeholder="Leave empty to calculate from chart"
                    min="0"
                    className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 focus:border-brand-orange rounded-xl p-3.5 text-xs text-zinc-850 dark:text-zinc-100 outline-none bento-transition"
                  />
                  <p className="text-[9px] font-mono text-zinc-400 mt-1">If blank, dynamically sums up all visible commit cells.</p>
                </div>
              </div>
            </div>
          ) : currentItem ? (
            <div className="space-y-6 text-left">
              
              {/* Form Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* 1. Projects Fields */}
                {activeTab === 'projects' && (
                  <>
                    <div className="md:col-span-2 flex items-center justify-between p-3.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl">
                      <div>
                        <span className="block text-xs font-bold text-zinc-850 dark:text-zinc-100">Include in CV & PDF Export</span>
                        <span className="text-[10px] font-mono text-zinc-400">Only enabled projects will be included when generating your ATS CV document.</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => updateField('projects', selectedItemIndex, 'showInCv', currentItem.showInCv === false ? true : false)}
                        className={`px-4 py-2 rounded-full font-mono text-xs font-bold transition-all ${
                          currentItem.showInCv !== false
                            ? 'bg-emerald-500 text-white shadow'
                            : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-500'
                        }`}
                      >
                        {currentItem.showInCv !== false ? '✓ INCLUDED IN CV' : '✕ EXCLUDED FROM CV'}
                      </button>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-[10px] font-mono text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-1.5">Project Title</label>
                      <input 
                        type="text" 
                        value={currentItem.title || ''} 
                        onChange={(e) => updateField('projects', selectedItemIndex, 'title', e.target.value)}
                        className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 focus:border-brand-orange rounded-xl p-3.5 text-xs text-zinc-850 dark:text-zinc-100 outline-none bento-transition"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-1.5">Tag / Category</label>
                      <input 
                        type="text" 
                        value={currentItem.tag || ''} 
                        onChange={(e) => updateField('projects', selectedItemIndex, 'tag', e.target.value)}
                        className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 focus:border-brand-orange rounded-xl p-3.5 text-xs text-zinc-850 dark:text-zinc-100 outline-none bento-transition"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-1.5">Year</label>
                      <input 
                        type="text" 
                        value={currentItem.year || ''} 
                        onChange={(e) => updateField('projects', selectedItemIndex, 'year', e.target.value)}
                        className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 focus:border-brand-orange rounded-xl p-3.5 text-xs text-zinc-850 dark:text-zinc-100 outline-none bento-transition"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-1.5">Demo Link URL</label>
                      <input 
                        type="text" 
                        value={currentItem.demoUrl || ''} 
                        onChange={(e) => updateField('projects', selectedItemIndex, 'demoUrl', e.target.value)}
                        className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 focus:border-brand-orange rounded-xl p-3.5 text-xs text-zinc-850 dark:text-zinc-100 outline-none bento-transition"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-1.5">Video Demo Link URL (videoUrl)</label>
                      <input 
                        type="text" 
                        placeholder="e.g. https://www.youtube.com/watch?v=..."
                        value={currentItem.videoUrl || ''} 
                        onChange={(e) => updateField('projects', selectedItemIndex, 'videoUrl', e.target.value)}
                        className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 focus:border-brand-orange rounded-xl p-3.5 text-xs text-zinc-850 dark:text-zinc-100 outline-none bento-transition"
                      />
                    </div>
                    {/* Multi-Image Management Section */}
                    <div className="md:col-span-2 p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-200 dark:border-zinc-800/80 pb-3">
                        <div>
                          <label className="block text-[11px] font-mono text-zinc-900 dark:text-zinc-100 uppercase tracking-wider font-bold">
                            Project Images & Screenshots Gallery ({(() => {
                              const list = Array.isArray(currentItem.images) && currentItem.images.length > 0 
                                ? currentItem.images 
                                : (currentItem.image ? [currentItem.image] : []);
                              return list.length;
                            })()})
                          </label>
                          <span className="text-[10px] font-mono text-zinc-400">
                            Add multiple image URLs. The first image (#1) acts as the primary cover photo for the card.
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => addProjectImage(selectedItemIndex)}
                          className="px-3.5 py-1.5 rounded-xl bg-brand-orange hover:bg-brand-orangeHover text-white text-[11px] font-mono font-bold bento-transition flex items-center gap-1.5 shadow-sm shrink-0 self-start sm:self-auto cursor-pointer"
                        >
                          <span>+ Add Image</span>
                        </button>
                      </div>

                      {/* Image List */}
                      <div className="space-y-3">
                        {(() => {
                          const list = Array.isArray(currentItem.images) && currentItem.images.length > 0 
                            ? currentItem.images 
                            : (currentItem.image ? [currentItem.image] : []);

                          if (list.length === 0) {
                            return (
                              <div className="py-8 text-center border border-dashed border-zinc-300 dark:border-zinc-800 rounded-xl bg-white/50 dark:bg-zinc-900/30">
                                <p className="text-xs font-mono text-zinc-400">No project images configured yet.</p>
                                <button
                                  type="button"
                                  onClick={() => addProjectImage(selectedItemIndex)}
                                  className="mt-2 text-xs font-mono text-brand-orange font-bold hover:underline cursor-pointer"
                                >
                                  + Click here to add the first screenshot URL
                                </button>
                              </div>
                            );
                          }

                          return list.map((imgItem, imgIdx) => {
                            const imgUrl = typeof imgItem === 'object' && imgItem !== null ? (imgItem.url || '') : (imgItem || '');
                            const imgTag = (Array.isArray(currentItem.imageTags) ? currentItem.imageTags[imgIdx] : '') || (typeof imgItem === 'object' && imgItem !== null ? imgItem.tag : '') || '';

                            return (
                              <div key={imgIdx} className="flex flex-col sm:flex-row gap-3 items-start sm:items-center p-3.5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 shadow-2xs">
                                {/* Preview Thumbnail */}
                                <div className="shrink-0 w-24 h-16 rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-950 flex items-center justify-center relative">
                                  {imgUrl ? (
                                    <img 
                                      src={imgUrl} 
                                      alt="" 
                                      className="w-full h-full object-cover" 
                                      onError={(e) => { e.target.style.display = 'none'; }}
                                    />
                                  ) : (
                                    <span className="text-[9px] font-mono text-zinc-400 text-center px-1">Empty URL</span>
                                  )}
                                  <span className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-black/75 text-[8px] font-mono text-white font-bold">
                                    #{imgIdx + 1}
                                  </span>
                                  {imgTag && (
                                    <span className="absolute bottom-1 left-1 right-1 px-1 py-0.5 rounded bg-black/85 backdrop-blur-xs text-[8px] font-mono text-brand-orange truncate text-center font-semibold">
                                      {imgTag}
                                    </span>
                                  )}
                                </div>

                                {/* Inputs: URL & Tag */}
                                <div className="flex-1 w-full space-y-2">
                                  <div className="grid grid-cols-1 md:grid-cols-12 gap-2">
                                    <div className="md:col-span-7">
                                      <input
                                        type="text"
                                        placeholder="Image URL: https://... or /assets/..."
                                        value={imgUrl}
                                        onChange={(e) => updateProjectImage(selectedItemIndex, imgIdx, e.target.value)}
                                        className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 focus:border-brand-orange rounded-xl p-2 text-xs text-zinc-850 dark:text-zinc-100 outline-none bento-transition font-mono"
                                      />
                                    </div>
                                    <div className="md:col-span-5">
                                      <input
                                        type="text"
                                        placeholder="Badge Tag (e.g. Dashboard View)"
                                        value={imgTag}
                                        onChange={(e) => updateProjectImageTag(selectedItemIndex, imgIdx, e.target.value)}
                                        className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 focus:border-brand-orange rounded-xl p-2 text-xs text-zinc-850 dark:text-zinc-100 outline-none bento-transition font-mono font-medium"
                                      />
                                    </div>
                                  </div>
                                  {/* Quick Tag Suggestion Chips */}
                                  <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
                                    <span className="text-[9px] font-mono text-zinc-400">Quick Tags:</span>
                                    {['Dashboard View', 'Orbital Mapping', 'Data Systems', 'Architecture', 'UI Components', 'Sandbox Live'].map((preset) => (
                                      <button
                                        key={preset}
                                        type="button"
                                        onClick={() => updateProjectImageTag(selectedItemIndex, imgIdx, preset)}
                                        className={`text-[9px] font-mono px-2 py-0.5 rounded-full border bento-transition cursor-pointer ${
                                          imgTag === preset
                                            ? 'bg-brand-orange text-white border-brand-orange font-bold'
                                            : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 hover:bg-brand-orange/15 hover:text-brand-orange border-zinc-200/60 dark:border-zinc-700/60'
                                        }`}
                                      >
                                        +{preset}
                                      </button>
                                    ))}
                                  </div>
                                </div>

                                {/* Actions: Cover badge & Delete */}
                                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                                  {imgIdx === 0 ? (
                                    <span className="text-[9px] font-mono px-2 py-1 rounded-full bg-brand-orange/15 text-brand-orange font-bold border border-brand-orange/30">
                                      ★ COVER
                                    </span>
                                  ) : (
                                    <button
                                      type="button"
                                      onClick={() => setProjectCoverImage(selectedItemIndex, imgIdx)}
                                      className="text-[9px] font-mono px-2 py-1 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 border border-zinc-200 dark:border-zinc-800 transition-colors cursor-pointer"
                                      title="Set as main card cover photo"
                                    >
                                      Set Cover
                                    </button>
                                  )}
                                  <button
                                    type="button"
                                    onClick={() => removeProjectImage(selectedItemIndex, imgIdx)}
                                    className="text-xs text-zinc-400 hover:text-red-500 p-1.5 rounded-lg hover:bg-red-500/10 font-mono transition-colors cursor-pointer"
                                    title="Remove Image"
                                  >
                                    ✕
                                  </button>
                                </div>
                              </div>
                            );
                          });
                        })()}
                      </div>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-[10px] font-mono text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-1.5">Short Card Description</label>
                      <input 
                        type="text" 
                        value={currentItem.desc || ''} 
                        onChange={(e) => updateField('projects', selectedItemIndex, 'desc', e.target.value)}
                        className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 focus:border-brand-orange rounded-xl p-3.5 text-xs text-zinc-850 dark:text-zinc-100 outline-none bento-transition"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-[10px] font-mono text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-1.5">Full Showcase Content (Modal)</label>
                      <textarea 
                        rows="5"
                        value={currentItem.content || ''} 
                        onChange={(e) => updateField('projects', selectedItemIndex, 'content', e.target.value)}
                        className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 focus:border-brand-orange rounded-xl p-3.5 text-xs text-zinc-850 dark:text-zinc-100 outline-none bento-transition resize-none"
                      />
                    </div>
                  </>
                )}

                {/* 1.5. Certifications Fields */}
                {activeTab === 'certifications' && (
                  <>
                    <div className="md:col-span-2">
                      <label className="block text-[10px] font-mono text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-1.5">Certification Program Title</label>
                      <input 
                        type="text" 
                        value={currentItem.title || ''} 
                        onChange={(e) => updateField('certifications', selectedItemIndex, 'title', e.target.value)}
                        placeholder="e.g. Deep Learning Specialization"
                        className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 focus:border-brand-orange rounded-xl p-3.5 text-xs text-zinc-850 dark:text-zinc-100 outline-none bento-transition font-medium"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-1.5">Issuing Organization</label>
                      <input 
                        type="text" 
                        value={currentItem.issuer || ''} 
                        onChange={(e) => updateField('certifications', selectedItemIndex, 'issuer', e.target.value)}
                        placeholder="e.g. DeepLearning.AI, IBM, Google, Meta"
                        className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 focus:border-brand-orange rounded-xl p-3.5 text-xs text-zinc-850 dark:text-zinc-100 outline-none bento-transition"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-1.5">Host Platform / Authority</label>
                      <input 
                        type="text" 
                        value={currentItem.platform || ''} 
                        onChange={(e) => updateField('certifications', selectedItemIndex, 'platform', e.target.value)}
                        placeholder="e.g. Coursera, AWS Training, edX"
                        className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 focus:border-brand-orange rounded-xl p-3.5 text-xs text-zinc-850 dark:text-zinc-100 outline-none bento-transition"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-1.5">Year of Completion</label>
                      <input 
                        type="text" 
                        value={currentItem.year || ''} 
                        onChange={(e) => updateField('certifications', selectedItemIndex, 'year', e.target.value)}
                        placeholder="e.g. 2026"
                        className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 focus:border-brand-orange rounded-xl p-3.5 text-xs text-zinc-850 dark:text-zinc-100 outline-none bento-transition"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-1.5">Credential ID</label>
                      <input 
                        type="text" 
                        value={currentItem.credentialId || ''} 
                        onChange={(e) => updateField('certifications', selectedItemIndex, 'credentialId', e.target.value)}
                        placeholder="e.g. DLAI-NN-40912"
                        className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 focus:border-brand-orange rounded-xl p-3.5 text-xs text-zinc-850 dark:text-zinc-100 outline-none bento-transition font-mono"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-[10px] font-mono text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-1.5">Verification URL (credentialUrl)</label>
                      <input 
                        type="text" 
                        value={currentItem.credentialUrl || ''} 
                        onChange={(e) => updateField('certifications', selectedItemIndex, 'credentialUrl', e.target.value)}
                        placeholder="https://coursera.org/verify/..."
                        className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 focus:border-brand-orange rounded-xl p-3.5 text-xs text-zinc-850 dark:text-zinc-100 outline-none bento-transition font-mono"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-[10px] font-mono text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-1.5">Certificate Badge / Document Image URL (image)</label>
                      <div className="flex flex-col sm:flex-row gap-3 items-start">
                        <input 
                          type="text" 
                          placeholder="e.g. https://images.unsplash.com/... or certificate image URL"
                          value={currentItem.image || ''} 
                          onChange={(e) => updateField('certifications', selectedItemIndex, 'image', e.target.value)}
                          className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 focus:border-brand-orange rounded-xl p-3.5 text-xs text-zinc-850 dark:text-zinc-100 outline-none bento-transition font-mono"
                        />
                        {currentItem.image && (
                          <div className="shrink-0 w-24 h-16 rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-900 shadow-sm">
                            <img 
                              src={currentItem.image} 
                              alt="Preview" 
                              className="w-full h-full object-cover"
                              onError={(e) => { e.target.style.display = 'none'; }}
                            />
                          </div>
                        )}
                      </div>
                      <p className="text-[9px] font-mono text-zinc-400 mt-1">Image will be showcased on the certificate card and inside the verification modal.</p>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-[10px] font-mono text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-1.5">Covered Skills & Competencies (comma separated)</label>
                      <input 
                        type="text" 
                        value={currentItem.skills ? (Array.isArray(currentItem.skills) ? currentItem.skills.join(', ') : currentItem.skills) : ''} 
                        onChange={(e) => updateCertSkills(selectedItemIndex, e.target.value)}
                        placeholder="e.g. Neural Networks, TensorFlow, Hyperparameter Tuning"
                        className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 focus:border-brand-orange rounded-xl p-3.5 text-xs text-zinc-850 dark:text-zinc-100 outline-none bento-transition font-mono"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-[10px] font-mono text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-1.5">Detailed Summary & Overview</label>
                      <textarea 
                        rows="4"
                        value={currentItem.desc || ''} 
                        onChange={(e) => updateField('certifications', selectedItemIndex, 'desc', e.target.value)}
                        placeholder="Describe the curriculum, technical problems solved, and specialized concepts mastered."
                        className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 focus:border-brand-orange rounded-xl p-3.5 text-xs text-zinc-850 dark:text-zinc-100 outline-none bento-transition resize-none"
                      />
                    </div>
                  </>
                )}

                {/* 2. Blogs Fields */}
                {activeTab === 'blogs' && (
                  <>
                    <div className="md:col-span-2">
                      <label className="block text-[10px] font-mono text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-1.5">Blog Title</label>
                      <input 
                        type="text" 
                        value={currentItem.title || ''} 
                        onChange={(e) => updateField('blogs', selectedItemIndex, 'title', e.target.value)}
                        className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 focus:border-brand-orange rounded-xl p-3.5 text-xs text-zinc-850 dark:text-zinc-100 outline-none bento-transition"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-1.5">Category</label>
                      <input 
                        type="text" 
                        value={currentItem.category || ''} 
                        onChange={(e) => updateField('blogs', selectedItemIndex, 'category', e.target.value)}
                        className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 focus:border-brand-orange rounded-xl p-3.5 text-xs text-zinc-850 dark:text-zinc-100 outline-none bento-transition"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-1.5">Date</label>
                      <input 
                        type="text" 
                        value={currentItem.date || ''} 
                        onChange={(e) => updateField('blogs', selectedItemIndex, 'date', e.target.value)}
                        className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 focus:border-brand-orange rounded-xl p-3.5 text-xs text-zinc-850 dark:text-zinc-100 outline-none bento-transition"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-1.5">Read Time</label>
                      <input 
                        type="text" 
                        value={currentItem.readTime || ''} 
                        onChange={(e) => updateField('blogs', selectedItemIndex, 'readTime', e.target.value)}
                        className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 focus:border-brand-orange rounded-xl p-3.5 text-xs text-zinc-850 dark:text-zinc-100 outline-none bento-transition"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-[10px] font-mono text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-1.5">Blog Description</label>
                      <input 
                        type="text" 
                        value={currentItem.desc || ''} 
                        onChange={(e) => updateField('blogs', selectedItemIndex, 'desc', e.target.value)}
                        className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 focus:border-brand-orange rounded-xl p-3.5 text-xs text-zinc-850 dark:text-zinc-100 outline-none bento-transition"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-[10px] font-mono text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-1.5">Full Blog Article Content</label>
                      <textarea 
                        rows="6"
                        value={currentItem.content || ''} 
                        onChange={(e) => updateField('blogs', selectedItemIndex, 'content', e.target.value)}
                        className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 focus:border-brand-orange rounded-xl p-3.5 text-xs text-zinc-850 dark:text-zinc-100 outline-none bento-transition resize-none"
                      />
                    </div>
                  </>
                )}

                {/* 3. Timeline Fields */}
                {activeTab === 'timeline' && (
                  <>
                    <div className="md:col-span-2 flex items-center justify-between p-3.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl">
                      <div>
                        <span className="block text-xs font-bold text-zinc-850 dark:text-zinc-100">Include in CV & PDF Export</span>
                        <span className="text-[10px] font-mono text-zinc-400">Only enabled milestones will appear in your CV document and downloaded PDF.</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => updateField('timeline', selectedItemIndex, 'showInCv', currentItem.showInCv === false ? true : false)}
                        className={`px-4 py-2 rounded-full font-mono text-xs font-bold transition-all ${
                          currentItem.showInCv !== false
                            ? 'bg-emerald-500 text-white shadow'
                            : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-500'
                        }`}
                      >
                        {currentItem.showInCv !== false ? '✓ INCLUDED IN CV' : '✕ EXCLUDED FROM CV'}
                      </button>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-[10px] font-mono text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-1.5">Milestone title</label>
                      <input 
                        type="text" 
                        value={currentItem.title || ''} 
                        onChange={(e) => updateField('timeline', selectedItemIndex, 'title', e.target.value)}
                        className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 focus:border-brand-orange rounded-xl p-3.5 text-xs text-zinc-850 dark:text-zinc-100 outline-none bento-transition"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-[10px] font-mono text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-1.5">Date & Location Subtitle</label>
                      <input 
                        type="text" 
                        value={currentItem.date || ''} 
                        onChange={(e) => updateField('timeline', selectedItemIndex, 'date', e.target.value)}
                        className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 focus:border-brand-orange rounded-xl p-3.5 text-xs text-zinc-850 dark:text-zinc-100 outline-none bento-transition"
                      />
                    </div>
                  </>
                )}

                {/* 4. Books Fields */}
                {activeTab === 'books' && (
                  <>
                    <div className="md:col-span-2">
                      <label className="block text-[10px] font-mono text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-1.5">Book Title</label>
                      <input 
                        type="text" 
                        value={currentItem.title || ''} 
                        onChange={(e) => updateField('books', selectedItemIndex, 'title', e.target.value)}
                        className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 focus:border-brand-orange rounded-xl p-3.5 text-xs text-zinc-850 dark:text-zinc-100 outline-none bento-transition"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-1.5">Author</label>
                      <input 
                        type="text" 
                        value={currentItem.author || ''} 
                        onChange={(e) => updateField('books', selectedItemIndex, 'author', e.target.value)}
                        className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 focus:border-brand-orange rounded-xl p-3.5 text-xs text-zinc-850 dark:text-zinc-100 outline-none bento-transition"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-1.5">Spine Text</label>
                      <input 
                        type="text" 
                        value={currentItem.spine || ''} 
                        onChange={(e) => updateField('books', selectedItemIndex, 'spine', e.target.value)}
                        className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 focus:border-brand-orange rounded-xl p-3.5 text-xs text-zinc-850 dark:text-zinc-100 outline-none bento-transition"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-[10px] font-mono text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-1.5">CSS Cover color classes (Pastel style)</label>
                      <input 
                        type="text" 
                        value={currentItem.color || ''} 
                        onChange={(e) => updateField('books', selectedItemIndex, 'color', e.target.value)}
                        className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 focus:border-brand-orange rounded-xl p-3.5 text-xs text-zinc-850 dark:text-zinc-100 outline-none bento-transition"
                      />
                    </div>
                    
                    {/* Highlights */}
                    <div className="md:col-span-2 border-t border-zinc-100 dark:border-zinc-800/40 pt-4 mt-2">
                      <h4 className="text-[10px] font-mono text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-4">Highlights and Quotes</h4>
                      
                      {currentItem.highlights && currentItem.highlights.map((hl, hlIdx) => (
                        <div key={hlIdx} className="mb-4 bg-zinc-50/50 dark:bg-zinc-900/20 p-4 rounded-xl border border-zinc-200/10">
                          <div className="mb-2">
                            <label className="block text-[9px] font-mono text-zinc-450 uppercase mb-1">Highlight #{hlIdx + 1} Label</label>
                            <input 
                              type="text" 
                              value={hl.label || ''} 
                              onChange={(e) => updateBookHighlight(selectedItemIndex, hlIdx, 'label', e.target.value)}
                              className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 focus:border-brand-orange rounded-lg p-2 text-xs text-zinc-850 dark:text-zinc-150 outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-[9px] font-mono text-zinc-450 uppercase mb-1">Highlight #{hlIdx + 1} Detail/Quote</label>
                            <textarea 
                              rows="2"
                              value={hl.detail || ''} 
                              onChange={(e) => updateBookHighlight(selectedItemIndex, hlIdx, 'detail', e.target.value)}
                              className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 focus:border-brand-orange rounded-lg p-2 text-xs text-zinc-850 dark:text-zinc-150 outline-none resize-none"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {/* 5. Skills Fields */}
                {activeTab === 'skills' && (
                  <>
                    <div>
                      <label className="block text-[10px] font-mono text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-1.5">Category Title</label>
                      <input 
                        type="text" 
                        value={currentItem.title || ''} 
                        onChange={(e) => updateField('skills', selectedItemIndex, 'title', e.target.value)}
                        className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 focus:border-brand-orange rounded-xl p-3.5 text-xs text-zinc-850 dark:text-zinc-100 outline-none bento-transition"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-1.5">Subtitle description</label>
                      <input 
                        type="text" 
                        value={currentItem.subtitle || ''} 
                        onChange={(e) => updateField('skills', selectedItemIndex, 'subtitle', e.target.value)}
                        className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 focus:border-brand-orange rounded-xl p-3.5 text-xs text-zinc-850 dark:text-zinc-100 outline-none bento-transition"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-1.5">Tailwind gradient bg (e.g. from-blue-500 to-indigo-600)</label>
                      <input 
                        type="text" 
                        value={currentItem.bgColor || ''} 
                        onChange={(e) => updateField('skills', selectedItemIndex, 'bgColor', e.target.value)}
                        className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 focus:border-brand-orange rounded-xl p-3.5 text-xs text-zinc-850 dark:text-zinc-100 outline-none bento-transition"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-1.5">Text gradient color class (e.g. text-indigo-500)</label>
                      <input 
                        type="text" 
                        value={currentItem.textGrad || ''} 
                        onChange={(e) => updateField('skills', selectedItemIndex, 'textGrad', e.target.value)}
                        className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 focus:border-brand-orange rounded-xl p-3.5 text-xs text-zinc-850 dark:text-zinc-100 outline-none bento-transition"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-[10px] font-mono text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-1.5">Skills Pills (separated by comma)</label>
                      <input 
                        type="text" 
                        value={currentItem.pills ? currentItem.pills.join(', ') : ''} 
                        onChange={(e) => updateSkillsPills(selectedItemIndex, e.target.value)}
                        className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 border-zinc-200/30 dark:border-zinc-800/20 focus:border-brand-orange rounded-xl p-3.5 text-xs text-zinc-855 dark:text-zinc-100 outline-none bento-transition font-mono"
                      />
                    </div>
                  </>
                )}

                {/* 6. Gallery Fields */}
                {activeTab === 'gallery' && (() => {
                  const existingCats = Array.from(
                    new Set((localData.gallery || []).map(item => (item.category || '').trim().toLowerCase()))
                  ).filter(Boolean);
                  
                  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
                  const years = ["2024", "2025", "2026", "2027", "2028", "2029", "2030"];
                  
                  const dateParts = (currentItem.date || '').split(' ');
                  const currentMonth = months.includes(dateParts[0]) ? dateParts[0] : "August";
                  const currentYear = years.includes(dateParts[1]) ? dateParts[1] : "2026";
                  
                  return (
                    <>
                      <div className="md:col-span-2">
                        <label className="block text-[10px] font-mono text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-1.5">Photo Title</label>
                        <input 
                          type="text" 
                          value={currentItem.title || ''} 
                          onChange={(e) => updateField('gallery', selectedItemIndex, 'title', e.target.value)}
                          className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200/30 dark:border-zinc-800/20 focus:border-brand-orange rounded-xl p-3.5 text-xs text-zinc-850 dark:text-zinc-100 outline-none bento-transition"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-1.5">Select Existing Category</label>
                        <select 
                          value={existingCats.includes((currentItem.category || '').toLowerCase()) ? (currentItem.category || '').toLowerCase() : ''}
                          onChange={(e) => {
                            if (e.target.value) {
                              updateField('gallery', selectedItemIndex, 'category', e.target.value);
                            }
                          }}
                          className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200/30 dark:border-zinc-800/20 focus:border-brand-orange rounded-xl p-3.5 text-xs text-zinc-850 dark:text-zinc-100 outline-none bento-transition"
                        >
                          <option value="">-- Choose Existing --</option>
                          {existingCats.map(cat => (
                            <option key={cat} value={cat}>{cat.toUpperCase()}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-1.5">Or Type Custom Category</label>
                        <input 
                          type="text" 
                          value={currentItem.category || ''} 
                          onChange={(e) => updateField('gallery', selectedItemIndex, 'category', e.target.value)}
                          placeholder="e.g. macro, street"
                          className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200/30 dark:border-zinc-800/20 focus:border-brand-orange rounded-xl p-3.5 text-xs text-zinc-850 dark:text-zinc-100 outline-none bento-transition"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-1.5">Select Month</label>
                        <select 
                          value={currentMonth}
                          onChange={(e) => {
                            const newDate = `${e.target.value} ${currentYear}`;
                            updateField('gallery', selectedItemIndex, 'date', newDate);
                          }}
                          className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200/30 dark:border-zinc-800/20 focus:border-brand-orange rounded-xl p-3.5 text-xs text-zinc-850 dark:text-zinc-100 outline-none bento-transition"
                        >
                          {months.map(m => (
                            <option key={m} value={m}>{m}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-1.5">Select Year</label>
                        <select 
                          value={currentYear}
                          onChange={(e) => {
                            const newDate = `${currentMonth} ${e.target.value}`;
                            updateField('gallery', selectedItemIndex, 'date', newDate);
                          }}
                          className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200/30 dark:border-zinc-800/20 focus:border-brand-orange rounded-xl p-3.5 text-xs text-zinc-850 dark:text-zinc-100 outline-none bento-transition"
                        >
                          {years.map(y => (
                            <option key={y} value={y}>{y}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-1.5">Location</label>
                        <input 
                          type="text" 
                          value={currentItem.location || ''} 
                          onChange={(e) => updateField('gallery', selectedItemIndex, 'location', e.target.value)}
                          className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200/30 dark:border-zinc-800/20 focus:border-brand-orange rounded-xl p-3.5 text-xs text-zinc-850 dark:text-zinc-100 outline-none bento-transition"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-[10px] font-mono text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-1.5">Camera Details / Settings</label>
                        <input 
                          type="text" 
                          value={currentItem.camera || ''} 
                          onChange={(e) => updateField('gallery', selectedItemIndex, 'camera', e.target.value)}
                          className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200/30 dark:border-zinc-800/20 focus:border-brand-orange rounded-xl p-3.5 text-xs text-zinc-850 dark:text-zinc-100 outline-none bento-transition"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-[10px] font-mono text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-1.5">Online Hosted Image URL</label>
                        <input 
                          type="text" 
                          value={currentItem.image || ''} 
                          onChange={(e) => updateField('gallery', selectedItemIndex, 'image', e.target.value)}
                          className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200/30 dark:border-zinc-800/20 focus:border-brand-orange rounded-xl p-3.5 text-xs text-zinc-850 dark:text-zinc-100 outline-none bento-transition font-mono"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-[10px] font-mono text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-1.5">Photo Description</label>
                        <textarea 
                          rows="3"
                          value={currentItem.desc || ''} 
                          onChange={(e) => updateField('gallery', selectedItemIndex, 'desc', e.target.value)}
                          className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200/30 dark:border-zinc-800/20 focus:border-brand-orange rounded-xl p-3.5 text-xs text-zinc-850 dark:text-zinc-100 outline-none bento-transition resize-none"
                        />
                      </div>
                    </>
                  );
                })()}

              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center py-20 text-zinc-400 text-sm font-mono">
              Select a record from the list to view its properties and edit.
            </div>
          )}
        </div>

      </div>
      
    </section>
  );
}
