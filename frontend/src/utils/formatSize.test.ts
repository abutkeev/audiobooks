import i18next from 'i18next';
import { beforeAll, describe, expect, it } from 'vitest';
import formatSize from './formatSize';

describe('formatSize', () => {
  // units come from translations, an uninitialized i18next returns nothing for them
  beforeAll(async () => {
    await i18next.init({ lng: 'en', resources: {} });
  });

  it('keeps small sizes in bytes', () => {
    expect(formatSize(0)).toBe('0 B');
    expect(formatSize(512)).toBe('512 B');
  });

  it('switches to bigger units', () => {
    expect(formatSize(1536)).toBe('1.5 KB');
    expect(formatSize(5 * 1024 * 1024)).toBe('5.0 MB');
    expect(formatSize(3 * 1024 * 1024 * 1024)).toBe('3.0 GB');
  });

  it('drops the fraction for large values', () => {
    expect(formatSize(150 * 1024 * 1024)).toBe('150 MB');
  });
});
