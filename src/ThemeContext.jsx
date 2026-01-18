import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

const getInitialTheme = () => {
  try {
    if (typeof window === 'undefined') return 'dark';

    const saved = localStorage.getItem('theme');
    if (saved === 'dark' || saved === 'light') return saved;

    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
  } catch (e) {
    // ignore (private mode / storage errors)
  }
  return 'dark'; // final fallback
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => getInitialTheme());

  // Apply theme class and data attribute on document.documentElement
  useEffect(() => {
    if (typeof document === 'undefined') return;

    const root = document.documentElement;

    // remove any previous theme classes, then add the active one
    root.classList.remove('dark', 'light');
    root.classList.add(theme);

    // helpful attribute for CSS targeting or debugging
    root.setAttribute('data-theme', theme);

    try {
      localStorage.setItem('theme', theme);
    } catch (e) {
      // ignore localStorage errors
    }
  }, [theme]);

  // If the user hasn't explicitly saved a theme, follow OS changes.
  useEffect(() => {
    if (typeof window === 'undefined') return;

    let mql;
    let savedPreference;
    try {
      savedPreference = localStorage.getItem('theme');
    } catch (e) {
      savedPreference = null;
    }

    // only attach listener if user didn't save a preference
    if (!savedPreference && window.matchMedia) {
      mql = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = (e) => {
        setTheme(e.matches ? 'dark' : 'light');
      };
      // some browsers use addEventListener, some support addListener
      if (mql.addEventListener) {
        mql.addEventListener('change', handleChange);
      } else if (mql.addListener) {
        mql.addListener(handleChange);
      }

      return () => {
        if (!mql) return;
        if (mql.removeEventListener) {
          mql.removeEventListener('change', handleChange);
        } else if (mql.removeListener) {
          mql.removeListener(handleChange);
        }
      };
    }
    // no cleanup necessary if we didn't attach anything
    return undefined;
  }, []);

  const toggleTheme = () => {
    setTheme((t) => {
      const next = t === 'dark' ? 'light' : 'dark';
      try {
        localStorage.setItem('theme', next);
      } catch (e) {
        // ignore
      }
      return next;
    });
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
