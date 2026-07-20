'use client';

import React, { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { motion } from 'framer-motion';

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const [theme, setThemeState] = useState<'light' | 'dark' | 'system'>('system');
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    setMounted(true);
    
    // Get stored preference
    const stored = localStorage.getItem('theme') as 'light' | 'dark' | 'system' | null;
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    const newTheme = stored || 'system';
    setThemeState(newTheme);
    
    const resolved = newTheme === 'system' ? (prefersDark ? 'dark' : 'light') : newTheme;
    setResolvedTheme(resolved);
  }, []);

  const handleCycle = () => {
    const themes: Array<'light' | 'dark' | 'system'> = ['light', 'dark', 'system'];
    const currentIndex = themes.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    const newTheme = themes[nextIndex];
    
    setThemeState(newTheme);
    localStorage.setItem('theme', newTheme);
    
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const resolved = newTheme === 'system' ? (prefersDark ? 'dark' : 'light') : newTheme;
    
    setResolvedTheme(resolved);
    
    const html = document.documentElement;
    if (resolved === 'dark') {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
  };

  if (!mounted) {
    return <div className="w-10 h-10" />;
  }

  const isDark = resolvedTheme === 'dark';

  const iconVariants = {
    initial: { scale: 0, rotate: -180, opacity: 0 },
    animate: { scale: 1, rotate: 0, opacity: 1 },
    exit: { scale: 0, rotate: 180, opacity: 0 },
  };

  return (
    <button
      onClick={handleCycle}
      className="relative inline-flex items-center justify-center w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-950"
      aria-label={`Toggle theme (current: ${theme})`}
      title={`Current theme: ${theme}`}
      type="button"
    >
      <div className="relative w-5 h-5">
        {isDark ? (
          <motion.div
            key="dark"
            variants={iconVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.3, type: 'spring', stiffness: 200, damping: 20 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <Moon className="w-5 h-5 text-slate-50" strokeWidth={2} />
          </motion.div>
        ) : (
          <motion.div
            key="light"
            variants={iconVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.3, type: 'spring', stiffness: 200, damping: 20 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <Sun className="w-5 h-5 text-yellow-500" strokeWidth={2} />
          </motion.div>
        )}
      </div>
    </button>
  );
}
