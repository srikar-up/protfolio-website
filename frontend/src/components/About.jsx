import React from 'react';
import { User, Award, CheckCircle, Coffee } from 'lucide-react';

export default function About() {
  const stats = [
    { icon: <Award className="gradient-text" />, value: '5+', label: 'Years Experience' },
    { icon: <CheckCircle className="gradient-text" />, value: '40+', label: 'Projects Completed' },
    { icon: <Coffee className="gradient-text" />, value: '250k+', label: 'Lines of Code' },
  ];

  return (
    <section id="about" style={styles.section}>
      <div className="container">
        <h2 style={styles.sectionTitle}>
          <span className="gradient-text">01. </span>About Me
        </h2>
        
        <div className="grid-2" style={styles.grid}>
          <div className="nm-flat" style={styles.bioCard}>
            <div style={styles.iconHeader}>
              <User size={24} style={{ color: 'var(--accent-color)' }} />
              <h3 style={styles.bioTitle}>My Story</h3>
            </div>
            <p style={styles.bioText}>
              I am a passionate Full-Stack Engineer based in San Francisco, dedicated to crafting software that bridges the gap between powerful performance and human-centric design. Over the last five years, I have worked with startups and enterprises alike to architect, build, and deploy clean web solutions.
            </p>
            <p style={styles.bioText}>
              I believe that design is not just what it looks like and feels like, but how it works. That is why I love combining modern component architectures with custom CSS systems to create delightful UX details.
            </p>
          </div>

          <div style={styles.statsContainer}>
            {stats.map((stat, i) => (
              <div key={i} className="nm-flat" style={styles.statCard}>
                <div className="nm-inset-sm" style={styles.statIconContainer}>
                  {stat.icon}
                </div>
                <div>
                  <h4 style={styles.statValue}>{stat.value}</h4>
                  <p style={styles.statLabel}>{stat.label}</p>
                </div>
              </div>
            ))}
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
    alignItems: 'stretch',
  },
  bioCard: {
    padding: '40px',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  iconHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  bioTitle: {
    fontSize: '1.5rem',
  },
  bioText: {
    fontSize: '1.05rem',
    lineHeight: 1.7,
    color: 'var(--text-secondary)',
  },
  statsContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    gap: '24px',
  },
  statCard: {
    padding: '24px 32px',
    display: 'flex',
    alignItems: 'center',
    gap: '24px',
    flex: 1,
  },
  statIconContainer: {
    width: '56px',
    height: '56px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '16px',
  },
  statValue: {
    fontSize: '1.75rem',
    fontWeight: 800,
  },
  statLabel: {
    fontSize: '0.95rem',
    color: 'var(--text-secondary)',
    fontWeight: 500,
  }
};
