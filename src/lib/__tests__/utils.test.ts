import { describe, it, expect } from 'vitest';
import { formatINR, formatPercent, cn } from '@/lib/utils';

describe('formatINR', () => {
  it('formats lakhs in Indian digit grouping', () => {
    expect(formatINR(1234567)).toBe('₹12,34,567');
  });

  it('formats a plain salary', () => {
    expect(formatINR(26000)).toBe('₹26,000');
  });
});

describe('formatPercent', () => {
  it('appends one decimal and the percent sign', () => {
    expect(formatPercent(71.6)).toBe('71.6%');
    expect(formatPercent(91)).toBe('91.0%');
  });
});

describe('cn (class merge)', () => {
  it('merges conditional classes', () => {
    expect(cn('px-2', 'px-4')).toBe('px-4');
    expect(cn('text-sm', false && 'hidden', 'font-bold')).toBe('text-sm font-bold');
  });
});