import React from 'react';
import { Code, Server, PenTool } from 'lucide-react';

export default function Skills() {
  const skillCategories = [
    {
      title: 'Frontend Development',
      icon: <Code size={20} className="gradient-text" />,
      skills: [
        { name: 'React.js / Next.js', level: 90 },
        { name: 'JavaScript (ES6+) / TS', level: 85 },
        { name: 'CSS3 / Modern Layouts', level: 95 },
      ]
    },
    {
      title: 'Backend Engineering',
      icon: <Server size={20} className="gradient-text" />,
      skills: [
        { name: 'Node.js / Express', level: 85 },
        { name: 'REST & GraphQL APIs', level: 80 },
        { name: 'MongoDB / PostgreSQL', level: 75 },
      ]
    },
    {
      title: 'Design & Tooling',
      icon: <PenTool size={20} className="gradient-text" />,
      skills: [
        { name: 'UI/UX Design', level: 90 },
        { name: 'Figma & Soft UI Systems', level: 85 },
        { name: 'Git / CI/CD Pipelines', level: 80 },
      ]
    }
  ];

  return (
    <section id="skills" style={styles.section}>
      <div className="container">
        <h2 style={styles.sectionTitle}>
          <span className="gradient-text">02. </span>My Skills
        </h2>

        <div className="grid-3" style={styles.grid}>
          {skillCategories.map((category, index) => (
            <div key={index} className="nm-flat" style={styles.card}>
              <div style={styles.header}>
                <div className="nm-inset-sm" style={styles.iconContainer}>
                  {category.icon}
                </div>
                <h3 style={styles.cardTitle}>{category.title}</h3>
              </div>

              <div style={styles.skillsList}>
                {category.skills.map((skill, idx) => (
                  <div key={idx} style={styles.skillItem}>
                    <div style={styles.skillInfo}>
                      <span style={styles.skillName}>{skill.name}</span>
                      <span style={styles.skillLevel}>{skill.level}%</span>
                    </div>
                    {/* Inset track */}
                    <div className="nm-inset-sm" style={styles.progressTrack}>
                      {/* Outset progress thumb */}
                      <div 
                        style={{
                          ...styles.progressFill,
                          width: `${skill.level}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
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
    alignItems: 'start',
  },
  card: {
    padding: '32px 24px',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    marginBottom: '32px',
  },
  iconContainer: {
    width: '44px',
    height: '44px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '12px',
  },
  cardTitle: {
    fontSize: '1.25rem',
    fontWeight: 700,
  },
  skillsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  skillItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  skillInfo: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.95rem',
    fontWeight: 600,
  },
  skillName: {
    color: 'var(--text-primary)',
  },
  skillLevel: {
    color: 'var(--text-secondary)',
  },
  progressTrack: {
    height: '14px',
    borderRadius: '8px',
    width: '100%',
    position: 'relative',
    overflow: 'hidden',
    padding: '2px',
  },
  progressFill: {
    height: '100%',
    borderRadius: '6px',
    background: 'var(--accent-gradient)',
    boxShadow: '1px 1px 3px rgba(0,0,0,0.15)',
    transition: 'width 1s cubic-bezier(0.25, 0.8, 0.25, 1)',
  }
};
