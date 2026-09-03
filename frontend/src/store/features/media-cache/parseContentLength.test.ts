import { describe, expect, it } from 'vitest';
import parseContentLength from './parseContentLength';

describe('parseContentLength', () => {
  it('reads a size', () => {
    expect(parseContentLength('1024')).toBe(1024);
  });

  it('reports an unknown size for a missing header', () => {
    expect(parseContentLength(null)).toBeUndefined();
    expect(parseContentLength(undefined)).toBeUndefined();
  });

  it('reports an unknown size for a value that is not a positive number', () => {
    expect(parseContentLength('0')).toBeUndefined();
    expect(parseContentLength('-1')).toBeUndefined();
    expect(parseContentLength('unknown')).toBeUndefined();
  });
});
