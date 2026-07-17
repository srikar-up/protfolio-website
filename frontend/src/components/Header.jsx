import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon, Terminal } from 'lucide-react';

export default function Header() {
  const { theme, toggleTheme } = useTheme();

  return (
    <header style={styles.header}>
      <div className="container" style={styles.container}>
        <div style={styles.logo}>
          <div className="nm-flat-sm" style={styles.logoIcon}>
            <Terminal size={20} className="gradient-text" />
          </div>
          <span style={styles.logoText}>AURA<span className="gradient-text">.</span></span>
        </div>

        <nav style={styles.nav}>
          <a href="#about" style={styles.navLink}>About</a>
          <a href="#skills" style={styles.navLink}>Skills</a>
          <a href="#projects" style={styles.navLink}>Projects</a>
          <a href="#contact" className="nm-button" style={styles.contactBtn}>
            Let's Talk
          </a>
          <button 
            onClick={toggleTheme} 
            className="nm-button nm-button-circle" 
            style={styles.themeToggle}
            aria-label="Toggle Theme"
          >
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </button>
        </nav>
      </div>
    </header>
  );
}

const styles = {
  header: {
    position: 'sticky',
    top: 0,
    zIndex: 1000,
    background: 'var(--bg-primary)',
    backdropFilter: 'blur(8px)',
    borderBottom: 'var(--border-glow)',
    padding: '16px 0',
  },
  container: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  logoIcon: {
    width: '40px',
    height: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '12px',
  },
  logoText: {
    fontSize: '1.25rem',
    fontWeight: 800,
    letterSpacing: '1px',
  },
  nav: {
    display: 'flex',
    alignItems: 'center',
    gap: '24px',
  },
  navLink: {
    textDecoration: 'none',
    color: 'var(--text-primary)',
    fontWeight: 600,
    fontSize: '0.95rem',
    transition: 'color 0.2s ease',
  },
  contactBtn: {
    padding: '8px 18px',
    fontSize: '0.9rem',
    textDecoration: 'none',
  },
  themeToggle: {
    width: '40px',
    height: '40px',
  }
};
