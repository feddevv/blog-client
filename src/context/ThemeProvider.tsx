import { ThemeContext } from './ThemeContext';
import { useState, useEffect, type ReactNode } from 'react';

type Theme = 'light' | 'dark';

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return (
      (localStorage.getItem('theme') as Theme) ??
      (window.matchMedia('(prefers-color-schema: dark)').matches
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
