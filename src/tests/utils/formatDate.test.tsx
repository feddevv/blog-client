import { formatDate } from '@/utils/utils';
import { describe, expect, it } from 'vitest';

describe('formatDate util', () => {
  const fallback = 'N/A';
  const expectedResult = 'Aug 8, 2026';

  it('should format date when string is passed', () => {
    const validDateString = '2026-08-08T14:37:09.000Z';

    expect(formatDate(validDateString)).toBe(expectedResult);
  });

  it('should format date when number is passed', () => {
    const validDateNumber = 1786190229000;

    expect(formatDate(validDateNumber)).toBe(expectedResult);
  });

  it('should format date when the date object is passed', () => {
    const validDateObject = new Date(2026, 7, 8);

    expect(formatDate(validDateObject)).toBe(expectedResult);
  });

  it('should return a fallback value for the invalid string', () => {
    const invalidString = 'hello world';

    expect(formatDate(invalidString, fallback)).toBe(fallback);
  });

  it('should return a fallback value for the invalid number', () => {
    const invalidNumber = Infinity;

    expect(formatDate(invalidNumber, fallback)).toBe(fallback);
  });

  it('should return a fallback value for the invalid date object', () => {
    const invalidDateObject = new Date('invalid string');

    expect(formatDate(invalidDateObject, fallback)).toBe(fallback);
  });
});
