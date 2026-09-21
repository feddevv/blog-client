import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const formatter = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
  hour: '2-digit',
  minute: 'numeric',
});

export function formatDate(date: string | Date | number, fallback = '-') {
  const dateObj =
    typeof date === 'string' || typeof date === 'number'
      ? new Date(date)
      : date;

  if (isNaN(dateObj.getTime())) return fallback;

  return formatter.format(dateObj);
}

export function blogApi(path: string) {
  return new URL(path, 'https://blog-api-65st.onrender.com').href;
}

export function range(start: number, end: number) {
  const length = end - start + 1;
  return Array.from({ length }, (_, i) => start + i);
}

export function calculateReadingTime(wordsAmount: number) {
  if (wordsAmount < 0) return 0;

  const AVERAGE_WPM = 250;

  return Math.ceil(wordsAmount / AVERAGE_WPM);
}

export function wordsAmountFor(str: string) {
  return str.trim() ? str.trim().split(/\s+/).length : 0;
}

export function linesAmountFor(str: string) {
  return str.trim() ? str.trim().split(/\r\n|\r|\n/).length : 0;
}
