import { ThemeContext } from './ThemeContext';
import { useState, useEffect, type ReactNode } from 'react';
import type { Theme } from './ThemeContext.types';

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    return (
      (localStorage.getItem('theme') as Theme) ??
      (window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light')
    );
  });

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else document.documentElement.classList.remove('dark');

    localStorage.setItem('theme', theme);
  }, [theme]);

  return <ThemeContext value={{ theme, setTheme }}>{children}</ThemeContext>;
}
