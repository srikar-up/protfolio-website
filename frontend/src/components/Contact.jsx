import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { saveContactMessageToFirebase, isFirebaseConfigured } from '../firebase';
import { handleEmailClick } from '../utils/email';

export default function Contact() {
  const { showToast } = useTheme();
  const [formData, setFormData] = useState({ name: '', email: '', message: '', honeypot: '' });
  const [status, setStatus] = useState('idle'); // idle, sending, success, error
  const [statusMsg, setStatusMsg] = useState('');
  const [lastSubmittedAt, setLastSubmittedAt] = useState(0);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. Anti-Spam Bot Trap: If honeypot filled, silently drop
    if (formData.honeypot) {
      console.warn('Bot detected and blocked.');
      setStatus('success');
      setStatusMsg('Thank you! Your message has been received.');
      return;
    }

    const trimmedName = formData.name.trim().slice(0, 100);
    const trimmedMessage = formData.message.trim().slice(0, 3000);

    // 2. Input presence check
    if (!trimmedName || !trimmedMessage) {
      setStatus('error');
      setStatusMsg('Please enter your name and message.');
      showToast('Please enter your name and message.');
      return;
    }

    const emailSubject = `Inquiry from ${trimmedName} (Portfolio Contact)`;
    const emailBody = `Hi Srikar,\n\n${trimmedMessage}\n\nBest regards,\n${trimmedName}`;

    // Launch email compose immediately
    handleEmailClick(e, 'srikarsensai@gmail.com', emailSubject, emailBody);
    showToast('Redirecting to email compose...');
    setStatus('success');
    setStatusMsg(`Opening email compose for ${trimmedName}...`);

    // Optionally backup copy to Firebase in the background
    if (isFirebaseConfigured()) {
      saveContactMessageToFirebase({
        name: trimmedName,
        email: 'via-email-compose@direct.mail',
        message: trimmedMessage
      }).catch(err => console.warn('Backup write note:', err));
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
            
            <h2 
              onClick={(e) => {
                handleEmailClick(e, 'srikarsensai@gmail.com', 'Let\'s create something exceptional');
                showToast('Opening email composer...');
              }}
              className="font-syne font-bold text-3xl md:text-4xl text-zinc-900 dark:text-white leading-tight mb-6 cursor-pointer group hover:text-brand-orange transition-colors"
              title="Click to send an email"
            >
              Let's create something<br />
              <span className="group-hover:underline underline-offset-8">exceptional.</span>
              <span className="inline-block ml-3 text-base text-brand-orange opacity-0 group-hover:opacity-100 transition-opacity">✉ ↗</span>
            </h2>
            
            <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-sm">
              Have an exciting application idea, need a full-time consultant, or just want to chat about user interface designs? Drop me a line! I will get back to you within 24 hours.
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-zinc-100 dark:border-zinc-800/40 text-xs font-mono text-zinc-400 dark:text-zinc-500 space-y-2">
            <div className="flex justify-between max-w-xs">
              <span>LOCATION:</span>
              <span className="text-zinc-800 dark:text-zinc-200">Punjab, India</span>
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
            {/* Anti-Spam Honeypot Bot Trap */}
            <div className="hidden" aria-hidden="true" style={{ display: 'none' }}>
              <input 
                type="text" 
                name="honeypot" 
                tabIndex={-1} 
                value={formData.honeypot} 
                onChange={handleChange} 
                autoComplete="off" 
              />
            </div>

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
              <label htmlFor="message" className="block text-[10px] font-mono text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-1.5">Your Message</label>
              <textarea 
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange} 
                placeholder="Hi Srikar, I have a project idea..." 
                className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 focus:border-brand-orange focus:ring-1 focus:ring-brand-orange rounded-xl p-3.5 text-xs text-zinc-800 dark:text-zinc-100 outline-none resize-none bento-transition"
                rows="5"
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
              <span>{status === 'sending' ? 'REDIRECTING TO EMAIL...' : 'COMPOSE IN EMAIL ↗'}</span>
            </button>
          </form>
        </div>

      </div>
    </section>
  );
}
