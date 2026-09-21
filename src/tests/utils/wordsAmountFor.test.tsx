import { wordsAmountFor } from '@/utils/utils';
import { describe, expect, it } from 'vitest';

describe('wordsAmountFor util', () => {
  it('should return 0 when the string is empty', () => {
    expect(wordsAmountFor('')).toBe(0);
  });

  it('should return 0 when the string consists of whitespaces', () => {
    expect(wordsAmountFor('      ')).toBe(0);
  });

  it('should return 0 when the string consists of invisible characters', () => {
    expect(wordsAmountFor('\t\r\n\r')).toBe(0);
  });

  it('should count words in the string which consists of 1 words', () => {
    expect(wordsAmountFor('hello')).toBe(1);
  });

  it('should count words in the basic sentence', () => {
    expect(wordsAmountFor('Hello world!')).toBe(2);
  });

  it('should count words in the string with whitespaces on bots sides', () => {
    expect(wordsAmountFor(' Hello world! ')).toBe(2);
  });

  it('should count words in the string with multiple whitespaces between words', () => {
    expect(wordsAmountFor('Hello           world!')).toBe(2);
  });

  it('should count words in the string with other whitespaces-delimiters', () => {
    expect(wordsAmountFor('Hello\nworld!')).toBe(2);
    expect(wordsAmountFor('Hello\tworld!')).toBe(2);
  });

  it('should count words in the string with punctuation', () => {
    expect(wordsAmountFor('Hello, world! How. are, you?')).toBe(5);
  });
});
