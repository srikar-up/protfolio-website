import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';

export default function Dashboard({ data, onSave, onClose }) {
  const { showToast } = useTheme();
  const [activeTab, setActiveTab] = useState('projects');
  
  // Clone data to local state to support editing before saving
  const [localData, setLocalData] = useState(JSON.parse(JSON.stringify(data)));
  const [selectedItemIndex, setSelectedItemIndex] = useState(0);

  const tabs = [
    { id: 'projects', label: 'Projects' },
    { id: 'blogs', label: 'Blogs' },
    { id: 'timeline', label: 'Timeline' },
    { id: 'books', label: 'Books' },
    { id: 'skills', label: 'Skills' }
  ];

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setSelectedItemIndex(0);
  };

  const handleSave = async () => {
    try {
      const response = await fetch('/api/portfolio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(localData)
      });
      if (response.ok) {
        showToast('Portfolio data saved successfully!');
        onSave(localData); // Update main App state
      } else {
        throw new Error('Save failed');
      }
    } catch (err) {
      console.error(err);
      showToast('Error saving data to server.');
    }
  };

  // Generic Field Update
  const updateField = (section, index, field, value) => {
    setLocalData(prev => {
      const updated = { ...prev };
      if (section === 'timeline' && index !== null) {
        // Timeline milestones are nested under timeline.items
        updated.timeline.items[index][field] = value;
      } else if (index === null) {
        // Single object like timeline footerText
        updated[section][field] = value;
      } else {
        updated[section][index][field] = value;
      }
      return updated;
    });
  };

  // Specific nested field helpers
  const updateBookHighlight = (bookIndex, highlightIndex, key, value) => {
    setLocalData(prev => {
      const updated = { ...prev };
      updated.books[bookIndex].highlights[highlightIndex][key] = value;
      return updated;
    });
  };

  const updateSkillsPills = (skillIndex, pillsString) => {
    setLocalData(prev => {
      const updated = { ...prev };
      updated.skills[skillIndex].pills = pillsString.split(',').map(s => s.trim()).filter(Boolean);
      return updated;
    });
  };

  // Add Item Helper
  const handleAddItem = () => {
    setLocalData(prev => {
      const updated = { ...prev };
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
        updated.timeline.items.push(newItem);
        setSelectedItemIndex(updated.timeline.items.length - 1);
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
      }

      showToast(`Added a new item in ${activeTab}`);
      return updated;
    });
  };

  // Delete Item Helper
  const handleDeleteItem = (index) => {
    setLocalData(prev => {
      const updated = { ...prev };
      
      if (activeTab === 'projects') {
        updated.projects.splice(index, 1);
      } else if (activeTab === 'blogs') {
        updated.blogs.splice(index, 1);
      } else if (activeTab === 'timeline') {
        updated.timeline.items.splice(index, 1);
      } else if (activeTab === 'books') {
        updated.books.splice(index, 1);
      } else if (activeTab === 'skills') {
        updated.skills.splice(index, 1);
      }

      showToast(`Deleted item from ${activeTab}`);
      setSelectedItemIndex(0);
      return updated;
    });
  };

  const getActiveList = () => {
    if (activeTab === 'projects') return localData.projects;
    if (activeTab === 'blogs') return localData.blogs;
    if (activeTab === 'timeline') return localData.timeline.items;
    if (activeTab === 'books') return localData.books;
    if (activeTab === 'skills') return localData.skills;
    return [];
  };

  const activeList = getActiveList();
  const currentItem = activeList[selectedItemIndex] || null;

  return (
    <section className="lg:col-span-12 w-full bg-transparent min-h-[85vh] py-6 flex flex-col gap-8 relative select-none">
      
      {/* Dashboard Header Bar */}
      <div className="flex justify-between items-center bg-white dark:bg-brand-darkCard rounded-[2rem] p-6 shadow-soft dark:shadow-soft-dark border border-zinc-200/30 dark:border-zinc-800/20 bento-transition">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-brand-orange font-bold">ADMIN PANEL</span>
          <h1 className="font-syne font-bold text-2xl text-zinc-900 dark:text-white mt-1">Portfolio Control Desk</h1>
        </div>
        <div className="flex items-center space-x-3">
          <button 
            onClick={handleSave} 
            className="px-6 py-2.5 bg-brand-orange text-white rounded-full font-semibold text-xs shadow-md hover:scale-105 active:scale-95 bento-transition"
          >
            Save All Changes
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
              <button 
                onClick={handleAddItem}
                className="text-[10px] font-mono text-brand-orange font-bold hover:underline"
              >
                + ADD NEW
              </button>
            </div>
            
            <div className="space-y-2 max-h-[350px] overflow-y-auto pr-1">
              {activeList.map((item, index) => (
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
                    <h4 className="text-xs font-bold text-zinc-850 dark:text-zinc-200 line-clamp-1">
                      {item.title || item.label || `Record #${index + 1}`}
                    </h4>
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
              ))}
              {activeList.length === 0 && (
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
        <div className="lg:col-span-8 bg-white dark:bg-brand-darkCard rounded-[2rem] p-8 shadow-soft dark:shadow-soft-dark border border-zinc-200/30 dark:border-zinc-800/20 bento-transition">
          <h3 className="text-xs font-mono uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-6">Editor Attributes</h3>
          
          {currentItem ? (
            <div className="space-y-6 text-left">
              
              {/* Form Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* 1. Projects Fields */}
                {activeTab === 'projects' && (
                  <>
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
                    <div className="md:col-span-2">
                      <label className="block text-[10px] font-mono text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-1.5">Demo Link URL</label>
                      <input 
                        type="text" 
                        value={currentItem.demoUrl || ''} 
                        onChange={(e) => updateField('projects', selectedItemIndex, 'demoUrl', e.target.value)}
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
                        className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 focus:border-brand-orange rounded-xl p-3.5 text-xs text-zinc-850 dark:text-zinc-100 outline-none bento-transition font-mono"
                      />
                    </div>
                  </>
                )}

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
