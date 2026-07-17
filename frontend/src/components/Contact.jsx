import React, { useState } from 'react';
import { Send, CheckCircle, AlertCircle } from 'lucide-react';

export default function Contact() {
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
      setFormData({ name: '', email: '', message: '' });
    } catch (err) {
      setStatus('error');
      setStatusMsg(err.message || 'Something went wrong. Please try again.');
    }
  };

  return (
    <section id="contact" style={styles.section}>
      <div className="container">
        <h2 style={styles.sectionTitle}>
          <span className="gradient-text">04. </span>Get In Touch
        </h2>

        <div className="grid-2" style={styles.grid}>
          <div style={styles.infoCol}>
            <h3 style={styles.infoHeading}>Let's start a project together</h3>
            <p style={styles.infoText}>
              Have an exciting application idea, need a full-time consultant, or just want to chat about user interface designs? Drop me a line! I will get back to you within 24 hours.
            </p>
            <div className="nm-flat" style={styles.detailsCard}>
              <div style={styles.detailRow}>
                <span style={styles.detailLabel}>Email:</span>
                <span style={styles.detailValue}>alex@example.com</span>
              </div>
              <div style={styles.detailRow}>
                <span style={styles.detailLabel}>Location:</span>
                <span style={styles.detailValue}>San Francisco, CA</span>
              </div>
              <div style={styles.detailRow}>
                <span style={styles.detailLabel}>Availability:</span>
                <span className="gradient-text" style={{ ...styles.detailValue, fontWeight: 700 }}>Open for Contracts</span>
              </div>
            </div>
          </div>

          <div className="nm-flat" style={styles.formCard}>
            <form onSubmit={handleSubmit} style={styles.form}>
              <div style={styles.inputGroup}>
                <label htmlFor="name" style={styles.label}>Your Name</label>
                <input 
                  type="text" 
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe" 
                  className="nm-input"
                  disabled={status === 'sending'}
                />
              </div>

              <div style={styles.inputGroup}>
                <label htmlFor="email" style={styles.label}>Your Email</label>
                <input 
                  type="email" 
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john@example.com" 
                  className="nm-input"
                  disabled={status === 'sending'}
                />
              </div>

              <div style={styles.inputGroup}>
                <label htmlFor="message" style={styles.label}>Your Message</label>
                <textarea 
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Hi Alex, I have an app idea..." 
                  className="nm-input"
                  rows="5"
                  style={styles.textarea}
                  disabled={status === 'sending'}
                ></textarea>
              </div>

              {status !== 'idle' && (
                <div 
                  className="nm-flat-sm" 
                  style={{
                    ...styles.feedback,
                    borderColor: status === 'success' ? '#10b981' : status === 'error' ? '#ef4444' : 'transparent'
                  }}
                >
                  {status === 'success' && <CheckCircle size={18} color="#10b981" />}
                  {status === 'error' && <AlertCircle size={18} color="#ef4444" />}
                  <span style={styles.feedbackText}>{statusMsg || 'Sending message...'}</span>
                </div>
              )}

              <button 
                type="submit" 
                className="nm-button" 
                style={styles.submitBtn}
                disabled={status === 'sending'}
              >
                <Send size={16} />
                {status === 'sending' ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

const styles = {
  section: {
    padding: '100px 0',
    background: 'var(--bg-primary)',
    borderBottom: 'var(--border-glow)',
  },
  sectionTitle: {
    fontSize: '2.25rem',
    marginBottom: '48px',
  },
  grid: {
    alignItems: 'center',
  },
  infoCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
    paddingRight: '20px',
  },
  infoHeading: {
    fontSize: '1.75rem',
    lineHeight: 1.25,
  },
  infoText: {
    fontSize: '1.05rem',
    lineHeight: 1.6,
    color: 'var(--text-secondary)',
  },
  detailsCard: {
    padding: '24px 32px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    marginTop: '12px',
  },
  detailRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '1rem',
  },
  detailLabel: {
    fontWeight: 600,
    color: 'var(--text-secondary)',
  },
  detailValue: {
    fontWeight: 600,
  },
  formCard: {
    padding: '40px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  label: {
    fontSize: '0.9rem',
    fontWeight: 700,
    color: 'var(--text-secondary)',
    paddingLeft: '4px',
  },
  textarea: {
    resize: 'none',
    fontFamily: 'inherit',
  },
  submitBtn: {
    justifyContent: 'center',
    marginTop: '8px',
    width: '100%',
  },
  feedback: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '12px 16px',
    borderRadius: '12px',
    borderLeft: '4px solid',
  },
  feedbackText: {
    fontSize: '0.9rem',
    fontWeight: 600,
  }
};
