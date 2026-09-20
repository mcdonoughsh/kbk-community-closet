import { describe, expect, it } from 'vitest';
import {
  formatSizeRange,
  nextSizeRangeFromFrom,
  nextSizeRangeFromTo,
} from './sizes';

describe('formatSizeRange', () => {
  it('returns null when from is null', () => {
    expect(formatSizeRange(null, null)).toBeNull();
    expect(formatSizeRange(null, '2T')).toBeNull();
  });

  it('returns a single size when from and to match', () => {
    expect(formatSizeRange('2T', '2T')).toBe('2T');
    expect(formatSizeRange('Newborn', null)).toBe('Newborn');
  });

  it('formats an inclusive range with an en dash', () => {
    expect(formatSizeRange('2T', '3T')).toBe('2T–3T');
    expect(formatSizeRange('4T-5T/XS', 'L')).toBe('4T-5T/XS–L');
  });

  it('normalizes reversed ranges', () => {
    expect(formatSizeRange('3T', '2T')).toBe('2T–3T');
  });
});

describe('nextSizeRangeFromFrom', () => {
  it('clears both when from is cleared', () => {
    expect(nextSizeRangeFromFrom(null, '3T')).toEqual({
      sizeFrom: null,
      sizeTo: null,
    });
  });

  it('sets to = from when to is empty or below from', () => {
    expect(nextSizeRangeFromFrom('2T', null)).toEqual({
      sizeFrom: '2T',
      sizeTo: '2T',
    });
    expect(nextSizeRangeFromFrom('3T', '2T')).toEqual({
      sizeFrom: '3T',
      sizeTo: '3T',
    });
  });

  it('keeps to when it is at or after from', () => {
    expect(nextSizeRangeFromFrom('2T', '3T')).toEqual({
      sizeFrom: '2T',
      sizeTo: '3T',
    });
  });
});

describe('nextSizeRangeFromTo', () => {
  it('sets from = to when from is empty or above to', () => {
    expect(nextSizeRangeFromTo(null, '2T')).toEqual({
      sizeFrom: '2T',
      sizeTo: '2T',
    });
    expect(nextSizeRangeFromTo('3T', '2T')).toEqual({
      sizeFrom: '2T',
      sizeTo: '2T',
    });
  });

  it('keeps from when it is at or before to', () => {
    expect(nextSizeRangeFromTo('2T', '3T')).toEqual({
      sizeFrom: '2T',
      sizeTo: '3T',
    });
  });
});
