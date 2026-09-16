import { describe, it, expect } from 'vitest';
import { formatVerifiedDate } from './dateUtils';

describe('formatVerifiedDate', () => {
  it('formats Aug 20th 2026 correctly as requested by user', () => {
    const d = new Date(2026, 7, 20); // August is month index 7
    expect(formatVerifiedDate(d)).toBe('Aug 20th 2026');
  });

  it('formats 1st, 2nd, 3rd and 11th, 12th, 13th correctly', () => {
    expect(formatVerifiedDate(new Date(2026, 0, 1))).toBe('Jan 1st 2026');
    expect(formatVerifiedDate(new Date(2026, 0, 2))).toBe('Jan 2nd 2026');
    expect(formatVerifiedDate(new Date(2026, 0, 3))).toBe('Jan 3rd 2026');
    expect(formatVerifiedDate(new Date(2026, 0, 11))).toBe('Jan 11th 2026');
    expect(formatVerifiedDate(new Date(2026, 0, 12))).toBe('Jan 12th 2026');
    expect(formatVerifiedDate(new Date(2026, 0, 13))).toBe('Jan 13th 2026');
    expect(formatVerifiedDate(new Date(2026, 0, 21))).toBe('Jan 21st 2026');
    expect(formatVerifiedDate(new Date(2026, 0, 22))).toBe('Jan 22nd 2026');
    expect(formatVerifiedDate(new Date(2026, 0, 23))).toBe('Jan 23rd 2026');
    expect(formatVerifiedDate(new Date(2026, 0, 31))).toBe('Jan 31st 2026');
  });
});
