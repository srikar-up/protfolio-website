import React, { useState, useEffect } from 'react';
import { Github, Linkedin, Mail, Server, ArrowDown } from 'lucide-react';

export default function Hero() {
  const [apiStatus, setApiStatus] = useState('connecting');
  const [apiMessage, setApiMessage] = useState('');

  useEffect(() => {
    fetch('/api/status')
      .then((res) => {
        if (!res.ok) throw new Error('Server error');
        return res.json();
      })
      .then((data) => {
        setApiStatus('online');
        setApiMessage(data.message || 'Express Active');
      })
      .catch(() => {
        setApiStatus('offline');
        setApiMessage('Express Offline');
      });
  }, []);

  return (
    <section id="hero" style={styles.section}>
      <div className="container grid-2" style={styles.container}>
        <div style={styles.left}>
          <div className="nm-flat-sm" style={styles.badge}>
            <span style={styles.badgeDot(apiStatus)}></span>
            <span style={styles.badgeText}>{apiMessage || 'Connecting to Node.js Backend...'}</span>
          </div>

          <h1 style={styles.title}>
            Hi, I'm <span className="gradient-text">Alex Rivera</span>
          </h1>
          <h2 style={styles.subtitle}>Full-Stack Engineer & UI Designer</h2>
          <p style={styles.description}>
            Crafting premium digital experiences where cutting-edge code meets breathtaking interface designs. Specialize in React, Node.js, and sleek, custom-designed neumorphic user interfaces.
          </p>

          <div style={styles.buttonGroup}>
            <a href="#projects" className="nm-button" style={{ ...styles.btn, background: 'var(--bg-primary)' }}>
              View My Work
            </a>
            <a href="#contact" className="nm-button" style={{ ...styles.btn, color: 'var(--accent-color)' }}>
              Let's Connect
            </a>
          </div>

          <div style={styles.socials}>
            <a href="https://github.com" className="nm-button nm-button-circle" style={styles.socialBtn}>
              <Github size={20} />
            </a>
            <a href="https://linkedin.com" className="nm-button nm-button-circle" style={styles.socialBtn}>
              <Linkedin size={20} />
            </a>
            <a href="mailto:alex@example.com" className="nm-button nm-button-circle" style={styles.socialBtn}>
              <Mail size={20} />
            </a>
          </div>
        </div>

        <div style={styles.right}>
          <div className="nm-flat float-animation" style={styles.imageOuter}>
            <div className="nm-inset" style={styles.imageInner}>
              <img 
                src="/avatar.png" 
                alt="Alex Rivera Portrait" 
                style={styles.image}
                onError={(e) => {
                  // Fallback to high-quality SVG if the image copy didn't complete
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'block';
                }}
              />
              <svg 
                viewBox="0 0 100 100" 
                style={{ ...styles.image, display: 'none', padding: '15px' }}
              >
                <defs>
                  <linearGradient id="avatarGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="var(--accent-color)" />
                    <stop offset="100%" stopColor="var(--accent-light)" />
                  </linearGradient>
                </defs>
                <circle cx="50" cy="50" r="45" fill="none" stroke="url(#avatarGrad)" strokeWidth="2" strokeDasharray="5,5" />
                <circle cx="50" cy="40" r="18" fill="url(#avatarGrad)" opacity="0.85" />
                <path d="M22,78 C22,60 34,58 50,58 C66,58 78,60 78,78" fill="url(#avatarGrad)" opacity="0.85" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const styles = {
  section: {
    padding: '80px 0 120px 0',
    minHeight: 'calc(100vh - 80px)',
    display: 'flex',
    alignItems: 'center',
  },
  container: {
    alignItems: 'center',
  },
  left: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: '6px 14px',
    borderRadius: '20px',
    width: 'fit-content',
  },
  badgeDot: (status) => ({
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    backgroundColor: status === 'online' ? '#10b981' : status === 'offline' ? '#f59e0b' : '#3b82f6',
    boxShadow: status === 'online' ? '0 0 8px #10b981' : status === 'offline' ? '0 0 8px #f59e0b' : '0 0 8px #3b82f6',
    transition: 'all 0.3s ease',
  }),
  badgeText: {
    fontSize: '0.8rem',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  title: {
    fontSize: '3.5rem',
    lineHeight: 1.1,
  },
  subtitle: {
    fontSize: '1.75rem',
    color: 'var(--text-secondary)',
    fontWeight: 500,
  },
  description: {
    fontSize: '1.1rem',
    lineHeight: 1.6,
    color: 'var(--text-secondary)',
    maxWidth: '540px',
  },
  buttonGroup: {
    display: 'flex',
    gap: '20px',
    marginTop: '12px',
  },
  btn: {
    textDecoration: 'none',
  },
  socials: {
    display: 'flex',
    gap: '16px',
    marginTop: '8px',
  },
  socialBtn: {
    width: '44px',
    height: '44px',
  },
  right: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageOuter: {
    width: '320px',
    height: '320px',
    borderRadius: '50%',
    padding: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageInner: {
    width: '100%',
    height: '100%',
    borderRadius: '50%',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  }
};
