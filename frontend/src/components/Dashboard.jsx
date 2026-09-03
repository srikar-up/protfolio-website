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
    { id: 'projects', label: 'Projects' },
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
          demoUrl: 'https://example.com'
        };
        updated.projects.push(newItem);
        setSelectedItemIndex(updated.projects.length - 1);
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
              {activeTab !== 'hero' && (
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
                    {item.year || item.date || item.subtitle || item.author || "Global Values"}
                  </p>
                </div>
              ))
              )}
              {activeTab !== 'hero' && activeList.length === 0 && (
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
