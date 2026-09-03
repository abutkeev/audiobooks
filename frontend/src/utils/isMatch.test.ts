import { describe, expect, it } from 'vitest';
import isMatch from './isMatch';

describe('isMatch', () => {
  it('ignores case', () => {
    expect(isMatch({ searchString: 'лес', value: 'Тёмный ЛЕС' })).toBe(true);
  });

  it('treats е and ё as the same letter', () => {
    expect(isMatch({ searchString: 'елка', value: 'Ёлка на площади' })).toBe(true);
    expect(isMatch({ searchString: 'ёлка', value: 'Елка на площади' })).toBe(true);
    expect(isMatch({ searchString: 'Ёжик', value: 'ежик в тумане' })).toBe(true);
  });

  it('matches a query typed in the english layout', () => {
    expect(isMatch({ searchString: 'ktc', value: 'Лес' })).toBe(true);
    expect(isMatch({ searchString: 'rjkmwj', value: 'Кольцо' })).toBe(true);
  });

  it('matches a layout conversion that yields ё', () => {
    expect(isMatch({ searchString: '`;br', value: 'Ёжик в тумане' })).toBe(true);
    expect(isMatch({ searchString: '~;br', value: 'Ежик в тумане' })).toBe(true);
  });

  it('does not match an unrelated value', () => {
    expect(isMatch({ searchString: 'елка', value: 'Ёжик' })).toBe(false);
  });
});
