'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

export type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  resolvedTheme: 'light' | 'dark';
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('system');
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light');
  const [isClient, setIsClient] = useState(false);

  // Initialize theme on client-side only
  useEffect(() => {
    setIsClient(true);
    
    // Get stored preference or use system preference
    const stored = localStorage.getItem('theme') as Theme | null;
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    let newTheme: Theme = stored || 'system';
    setThemeState(newTheme);
    
    // Determine resolved theme
    const resolved = newTheme === 'system' ? (prefersDark ? 'dark' : 'light') : newTheme;
    setResolvedTheme(resolved);
    
    // Apply theme to document
    applyTheme(resolved);
  }, []);

  // Listen to system preference changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      if (theme === 'system') {
        const newResolved = e.matches ? 'dark' : 'light';
        setResolvedTheme(newResolved);
        applyTheme(newResolved);
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem('theme', newTheme);
    
    // Determine resolved theme
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const resolved = newTheme === 'system' ? (prefersDark ? 'dark' : 'light') : newTheme;
    
    setResolvedTheme(resolved);
    applyTheme(resolved);
  };

  const applyTheme = (themeValue: 'light' | 'dark') => {
    const html = document.documentElement;
    
    if (themeValue === 'dark') {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
  };

  if (!isClient) {
    return <>{children}</>;
  }

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
