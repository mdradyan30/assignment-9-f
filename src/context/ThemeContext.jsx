'use client';

import { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext(null);

const LIGHT = 'ideavaultlight';
const DARK = 'ideavaultdark';

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(LIGHT);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('ideavault_theme');
    const initial = stored === DARK ? DARK : LIGHT;
    setTheme(initial);
    document.documentElement.setAttribute('data-theme', initial);
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => {
      const next = prev === LIGHT ? DARK : LIGHT;
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('ideavault_theme', next);
      return next;
    });
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, mounted, isDark: theme === DARK }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
