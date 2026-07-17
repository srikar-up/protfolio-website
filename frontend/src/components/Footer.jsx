import React from 'react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer style={styles.footer}>
      <div className="container" style={styles.container}>
        <p style={styles.copy}>
          &copy; {currentYear} Aura Portfolio. Made with ❤️ and Neumorphism.
        </p>
        <div style={styles.links}>
          <a href="#hero" style={styles.link}>Back to Top</a>
        </div>
      </div>
    </footer>
  );
}

const styles = {
  footer: {
    padding: '40px 0',
    background: 'var(--bg-primary)',
    borderTop: 'var(--border-glow)',
  },
  container: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '16px',
  },
  copy: {
    fontSize: '0.9rem',
    color: 'var(--text-secondary)',
    fontWeight: 500,
  },
  links: {
    display: 'flex',
    gap: '24px',
  },
  link: {
    textDecoration: 'none',
    fontSize: '0.9rem',
    color: 'var(--text-secondary)',
    fontWeight: 600,
    transition: 'color 0.2s ease',
  }
};
