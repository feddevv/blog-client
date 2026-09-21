import { linesAmountFor } from "@/utils/utils";
import { describe, expect, it } from "vitest";

describe('linesAmountFor util', () => {
  it('should return 0 for an empty string', () => {
    expect(linesAmountFor('')).toBe(0);
  });

  it('should return 0 for a string with only spaces', () => {
    expect(linesAmountFor('    ')).toBe(0);
  });

  it('should return 0 for a string containing only newlines and whitespace', () => {
    expect(linesAmountFor('\n\r\n  \t\n')).toBe(0);
  });

  it('should return 1 for a single line of text', () => {
    expect(linesAmountFor('Hello world')).toBe(1);
  });

  it('should count lines separated by standard newline (\\n - Unix/Linux/macOS)', () => {
    const input = 'First line\nSecond line\nThird line';
    expect(linesAmountFor(input)).toBe(3);
  });

  it('should handle Windows line endings (\\r\\n - CRLF)', () => {
    const input = 'Line 1\r\nLine 2\r\nLine 3';
    expect(linesAmountFor(input)).toBe(3);
  });

  it('should handle legacy Mac line endings (\\r - CR)', () => {
    const input = 'Line 1\rLine 2\rLine 3';
    expect(linesAmountFor(input)).toBe(3);
  });

  it('should handle mixed line endings in the same text', () => {
    const input = 'Line 1\r\nLine 2\nLine 3\rLine 4';
    expect(linesAmountFor(input)).toBe(4);
  });

  it('should count empty lines in the middle of text', () => {
    const input = 'Header\n\n\nFooter';
    expect(linesAmountFor(input)).toBe(4);
  });

  it('should ignore leading and trailing empty lines due to trim', () => {
    const input = '\n\nFirst line\nSecond line\n\n';
    expect(linesAmountFor(input)).toBe(2);
  });

  it('should ignore leading and trailing spaces around lines', () => {
    const input = '  First line  \n  Second line  ';
    expect(linesAmountFor(input)).toBe(2);
  });
});