import { calculateReadingTime } from '@/utils/utils';
import { describe, expect, it } from 'vitest';

describe('calculateReadingTime util', () => {
  it('should calculate the reading time based on words count', () => {
    const wordsCount = 1000;

    expect(calculateReadingTime(wordsCount)).toEqual(4);
  });

  it('should round the reading time up', () => {
    const wordsCount = 890;

    expect(calculateReadingTime(wordsCount)).toEqual(4);
  });

  it('should return 1 if the amount of words is equal to average WPM', () => {
    const wordsCount = 250;

    expect(calculateReadingTime(wordsCount)).toEqual(1);
  });

  it('should return 0 if the amount of words is negative', () => {
    const wordsCount = -1;

    expect(calculateReadingTime(wordsCount)).toEqual(0);
  });

  it('should return correctly calculate when the amount of words is less then average WPM', () => {
    const wordsCount = 200;

    expect(calculateReadingTime(wordsCount)).toEqual(1);
  });

  it('should return 0 when the amount of words is 0', () => {
    const wordsCount = 0;

    expect(calculateReadingTime(wordsCount)).toEqual(wordsCount);
  });
});
