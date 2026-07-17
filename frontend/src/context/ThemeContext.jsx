import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  // Dark/Light Theme State
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('theme');
    if (saved) return saved;
    const preference = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    return preference;
  });

  // Accent Color State ('orange' | 'green')
  const [accent, setAccent] = useState(() => {
    return localStorage.getItem('theme-accent') || 'orange';
  });

  // 3D Explode Mode State
  const [explodeMode, setExplodeMode] = useState(false);

  // Toast Notification State
  const [toast, setToast] = useState({ visible: false, message: '' });
  const [toastTimeout, setToastTimeout] = useState(null);

  // Sync theme with document class (for Tailwind)
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Sync accent with document class
  useEffect(() => {
    const root = document.documentElement;
    if (accent === 'green') {
      root.classList.add('accent-green');
      root.classList.remove('accent-orange');
    } else {
      root.classList.add('accent-orange');
      root.classList.remove('accent-green');
    }
    localStorage.setItem('theme-accent', accent);
  }, [accent]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const toggleExplodeMode = () => {
    setExplodeMode(prev => !prev);
  };

  const showToast = (message) => {
    if (toastTimeout) {
      clearTimeout(toastTimeout);
    }
    setToast({ visible: true, message });
    const timeout = setTimeout(() => {
      setToast({ visible: false, message: '' });
    }, 3000);
    setToastTimeout(timeout);
  };

  return (
    <ThemeContext.Provider value={{ 
      theme, 
      toggleTheme, 
      accent, 
      setAccent, 
      explodeMode, 
      toggleExplodeMode,
      toast,
      showToast
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within a ThemeProvider');
  return context;
};
