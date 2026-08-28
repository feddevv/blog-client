import { ThemeProvider } from '@/context/Theme/ThemeProvider';
import { useTheme } from '@/hooks/useTheme';
import { renderHook } from '@testing-library/react';
import { act } from 'react';
import { beforeEach, expect, it, vi } from 'vitest';
import { describe } from 'vitest';

const setupMatchMediaMock = (isMatches: boolean) => {
  vi.stubGlobal(
    'matchMedia',
    vi.fn().mockImplementation((query: string) => ({
      matches: isMatches,
      media: query,
    }))
  );
};

describe('useTheme hook', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("should initialize theme as light when user's default theme is light", () => {
    setupMatchMediaMock(false);
    const { result } = renderHook(() => useTheme(), {
      wrapper: ThemeProvider,
    });

    expect(result.current.theme).toBe('light');
  });

  it("should initialize theme as dark when user's default theme is dark", () => {
    setupMatchMediaMock(true);
    const { result } = renderHook(() => useTheme(), {
      wrapper: ThemeProvider,
    });

    expect(result.current.theme).toBe('dark');
  });

  it('should toggle theme correctly', () => {
    setupMatchMediaMock(true);
    const { result } = renderHook(() => useTheme(), {
      wrapper: ThemeProvider,
    });

    act(() => {
      result.current.setTheme('light');
    });
    expect(result.current.theme).toBe('light');

    act(() => {
      result.current.setTheme('dark');
    });
    expect(result.current.theme).toBe('dark');
  });

  it("should take the theme from the localStorage when it's stored in there", () => {
    localStorage.setItem('theme', 'light');
    setupMatchMediaMock(true);
    const { result } = renderHook(() => useTheme(), {
      wrapper: ThemeProvider,
    });

    expect(result.current.theme).toBe('light');
  });
});
