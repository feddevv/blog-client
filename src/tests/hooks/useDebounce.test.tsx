import useDebounce from '@/hooks/useDebounce';
import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

describe('useDebounce hook', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  const initialValue = 'initial value';

  it('should initialize the custom hook', () => {
    const { result } = renderHook(() => useDebounce(initialValue, 600));

    expect(result.current).toBe(initialValue);
  });

  it('should correctly debounce when values changes', async () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 600),
      {
        initialProps: { value: initialValue },
      }
    );

    rerender({ value: 'changed value' });
    expect(result.current).toBe(initialValue);

    act(() => {
      vi.advanceTimersByTime(600);
    });

    expect(result.current).toBe('changed value');
  });

  it('should correctly reset the timer when value changes rapidly', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 600),
      {
        initialProps: { value: initialValue },
      }
    );

    rerender({ value: 'changed value one' });

    act(() => vi.advanceTimersByTime(200));
    expect(result.current).toBe(initialValue);

    rerender({ value: 'changed value two' });

    act(() => vi.advanceTimersByTime(400));
    expect(result.current).toBe(initialValue);

    act(() => vi.advanceTimersByTime(200));
    expect(result.current).toBe('changed value two');
  });

  it('should clean up the timeout when component unmounts', () => {
    const { result, rerender, unmount } = renderHook(
      ({ value }) => useDebounce(value, 600),
      {
        initialProps: { value: initialValue },
      }
    );

    rerender({ value: 'changed value' });
    act(() => vi.advanceTimersByTime(200));

    unmount();

    act(() => vi.advanceTimersByTime(400));
    expect(result.current).toBe(initialValue);
  });
});
