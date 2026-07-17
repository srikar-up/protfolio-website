import React from 'react';
import { ExternalLink, Github, Layers, ShieldCheck, ShoppingCart } from 'lucide-react';

export default function Projects() {
  const projects = [
    {
      title: 'Neumorph UI Kit',
      description: 'A premium, highly-accessible component library built on soft-UI principles for sleek web designs.',
      icon: <Layers size={24} className="gradient-text" />,
      tags: ['React', 'CSS Variables', 'Storybook'],
      github: 'https://github.com',
      demo: 'https://example.com',
    },
    {
      title: 'Decentralized Vault',
      description: 'A secure crypto dashboard designed to track assets, complete with rich SVG data charting.',
      icon: <ShieldCheck size={24} className="gradient-text" />,
      tags: ['React', 'Node.js', 'Web3.js'],
      github: 'https://github.com',
      demo: 'https://example.com',
    },
    {
      title: 'Aether Commerce',
      description: 'A lightning-fast headless e-commerce store with glassmorphic modals and seamless animations.',
      icon: <ShoppingCart size={24} className="gradient-text" />,
      tags: ['Vite', 'Express', 'MongoDB'],
      github: 'https://github.com',
      demo: 'https://example.com',
    }
  ];

  return (
    <section id="projects" style={styles.section}>
      <div className="container">
        <h2 style={styles.sectionTitle}>
          <span className="gradient-text">03. </span>Featured Projects
        </h2>

        <div className="grid-3" style={styles.grid}>
          {projects.map((project, index) => (
            <div 
              key={index} 
              className="nm-flat" 
              style={styles.card}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-6px)';
                e.currentTarget.style.boxShadow = '12px 12px 24px var(--shadow-dark), -12px -12px 24px var(--shadow-light)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'var(--nm-flat-md)';
              }}
            >
              <div style={styles.cardHeader}>
                <div className="nm-inset-sm" style={styles.iconContainer}>
                  {project.icon}
                </div>
                <div style={styles.links}>
                  <a href={project.github} className="nm-button nm-button-circle" style={styles.linkBtn} aria-label="GitHub Repository">
                    <Github size={16} />
                  </a>
                  <a href={project.demo} className="nm-button nm-button-circle" style={styles.linkBtn} aria-label="Live Demo">
                    <ExternalLink size={16} />
                  </a>
                </div>
              </div>

              <h3 style={styles.title}>{project.title}</h3>
              <p style={styles.description}>{project.description}</p>

              <div style={styles.tagsContainer}>
                {project.tags.map((tag, idx) => (
                  <span key={idx} className="nm-inset-sm" style={styles.tag}>
                    {tag}
                  </span>
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
    alignItems: 'stretch',
  },
  card: {
    padding: '32px',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px',
  },
  iconContainer: {
    width: '52px',
    height: '52px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '14px',
  },
  links: {
    display: 'flex',
    gap: '12px',
  },
  linkBtn: {
    width: '36px',
    height: '36px',
  },
  title: {
    fontSize: '1.35rem',
    fontWeight: 700,
  },
  description: {
    fontSize: '0.98rem',
    lineHeight: 1.6,
    color: 'var(--text-secondary)',
    flexGrow: 1,
  },
  tagsContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '10px',
    marginTop: '12px',
  },
  tag: {
    fontSize: '0.78rem',
    fontWeight: 700,
    padding: '5px 12px',
    borderRadius: '12px',
    color: 'var(--text-secondary)',
  }
};
