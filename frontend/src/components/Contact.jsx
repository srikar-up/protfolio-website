import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';

export default function Contact() {
  const { showToast } = useTheme();
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('idle'); // idle, sending, success, error
  const [statusMsg, setStatusMsg] = useState('');

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      setStatus('error');
      setStatusMsg('Please fill in all fields.');
      showToast('Please fill in all fields.');
      return;
    }

    setStatus('sending');
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Submission failed');

      setStatus('success');
      setStatusMsg(data.message || 'Message sent successfully!');
      showToast(`Thank you, ${formData.name}! Message sent.`);
      setFormData({ name: '', email: '', message: '' });
    } catch (err) {
      setStatus('error');
      setStatusMsg(err.message || 'Something went wrong. Please try again.');
      showToast('Submission failed. Check backend.');
    }
  };

  return (
    <section id="contact" className="lg:col-span-12 mt-6 explode-level-0">
      <div className="bg-white dark:bg-brand-darkCard rounded-[2rem] p-8 md:p-12 shadow-soft dark:shadow-soft-dark border border-zinc-200/30 dark:border-zinc-800/20 bento-transition explode-level-1 flex flex-col md:flex-row gap-10">
        
        {/* Left Column: Contact details */}
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <div className="inline-flex items-center space-x-2 bg-brand-orange/10 border border-brand-orange/20 px-4 py-1.5 rounded-full text-xs font-semibold text-brand-orange mb-8">
              <span className="w-2 h-2 rounded-full bg-brand-orange animate-ping"></span>
              <span>GET IN TOUCH</span>
            </div>
            
            <h2 className="font-syne font-bold text-3xl md:text-4xl text-zinc-900 dark:text-white leading-tight mb-6">
              Let's create something<br />exceptional.
            </h2>
            
            <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-sm">
              Have an exciting application idea, need a full-time consultant, or just want to chat about user interface designs? Drop me a line! I will get back to you within 24 hours.
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-zinc-100 dark:border-zinc-800/40 text-xs font-mono text-zinc-400 dark:text-zinc-500 space-y-2">
            <div className="flex justify-between max-w-xs">
              <span>EMAIL:</span>
              <span className="text-zinc-800 dark:text-zinc-200 hover:text-brand-orange bento-transition cursor-pointer">hey.@aura-design.com</span>
            </div>
            <div className="flex justify-between max-w-xs">
              <span>LOCATION:</span>
              <span className="text-zinc-800 dark:text-zinc-200">Montreal, Canada</span>
            </div>
            <div className="flex justify-between max-w-xs">
              <span>AVAILABILITY:</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Open for Q3 projects</span>
            </div>
          </div>
        </div>

        {/* Right Column: Contact form */}
        <div className="flex-1 bg-zinc-50 dark:bg-zinc-900/40 rounded-2xl p-6 md:p-8 border border-zinc-200/10 dark:border-zinc-800/10">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-[10px] font-mono text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-1.5">Your Name</label>
              <input 
                type="text" 
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe" 
                className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 focus:border-brand-orange focus:ring-1 focus:ring-brand-orange rounded-xl p-3.5 text-xs text-zinc-800 dark:text-zinc-100 outline-none bento-transition"
                disabled={status === 'sending'}
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-[10px] font-mono text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-1.5">Your Email</label>
              <input 
                type="email" 
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="john@example.com" 
                className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 focus:border-brand-orange focus:ring-1 focus:ring-brand-orange rounded-xl p-3.5 text-xs text-zinc-800 dark:text-zinc-100 outline-none bento-transition"
                disabled={status === 'sending'}
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-[10px] font-mono text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-1.5">Your Message</label>
              <textarea 
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Hi Alex, I have a project idea..." 
                className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 focus:border-brand-orange focus:ring-1 focus:ring-brand-orange rounded-xl p-3.5 text-xs text-zinc-800 dark:text-zinc-100 outline-none resize-none bento-transition"
                rows="4"
                disabled={status === 'sending'}
              ></textarea>
            </div>

            {statusMsg && (
              <div className={`p-3.5 rounded-xl text-xs font-semibold flex items-center space-x-2 border ${
                status === 'success' 
                  ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-600 dark:text-emerald-400' 
                  : 'bg-red-500/10 border-red-500/25 text-red-600 dark:text-red-400'
              }`}>
                <span>{statusMsg}</span>
              </div>
            )}

            <button 
              type="submit" 
              className="w-full py-4 bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 hover:bg-zinc-900 dark:hover:bg-zinc-100 rounded-full font-semibold text-xs shadow-md hover:scale-[1.02] active:scale-95 bento-transition flex items-center justify-center space-x-2"
              disabled={status === 'sending'}
            >
              <span>{status === 'sending' ? 'TRANSMITTING...' : 'SEND INQUIRY'}</span>
            </button>
          </form>
        </div>

      </div>
    </section>
  );
}
