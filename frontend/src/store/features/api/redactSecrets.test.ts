import { describe, expect, it } from 'vitest';
import redactSecrets from './redactSecrets';

describe('redactSecrets', () => {
  it('hides a password wherever it sits', () => {
    const args = { loginBodyDto: { login: 'user', password: 'secret' } };

    expect(redactSecrets(args)).toEqual({ loginBodyDto: { login: 'user', password: '[redacted]' } });
  });

  it('hides tokens, secrets and signatures under any name', () => {
    const args = { captchaToken: 'a', old_password: 'b', apiSecret: 'c', hash: 'd', name: 'kept' };

    expect(redactSecrets(args)).toEqual({
      captchaToken: '[redacted]',
      old_password: '[redacted]',
      apiSecret: '[redacted]',
      hash: '[redacted]',
      name: 'kept',
    });
  });

  it('walks through arrays', () => {
    expect(redactSecrets([{ password: 'x' }, { id: 1 }])).toEqual([{ password: '[redacted]' }, { id: 1 }]);
  });

  it('leaves alone what is not a plain object', () => {
    const date = new Date('2026-09-05T00:00:00.000Z');

    expect(redactSecrets({ date })).toEqual({ date });
    expect(JSON.stringify(redactSecrets({ date }))).toBe(JSON.stringify({ date }));
  });

  it('leaves values that carry nothing to hide', () => {
    expect(redactSecrets({ id: 1, nested: { flag: true } })).toEqual({ id: 1, nested: { flag: true } });
    expect(redactSecrets('plain')).toBe('plain');
    expect(redactSecrets(undefined)).toBeUndefined();
  });
});
