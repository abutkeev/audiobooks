import i18next from 'i18next';
import { beforeAll, describe, expect, it } from 'vitest';
import getTelegramAuthError from './getTelegramAuthError';
import translation from '@/locales/ru/translation.json';

// against the real locale: a key renamed on either side has to break the test
describe('getTelegramAuthError', () => {
  beforeAll(async () => {
    await i18next.init({ lng: 'ru', resources: { ru: { translation } } });
  });

  it.each([
    ['tg_data_expired', 'Данные входа через Telegram устарели, авторизуйтесь заново'],
    ['tg_hash_invalid', 'Telegram не подтвердил этот вход'],
    ['tg_account_unknown', 'Этот аккаунт Telegram ни к кому не привязан'],
  ])('translates %s', (code, expected) => {
    expect(getTelegramAuthError({ data: { code } })).toBe(expected);
  });

  it.each([
    ['a code it does not know', { data: { code: 'something else' } }],
    ['a name borrowed from the prototype', { data: { code: 'toString' } }],
    ['a refusal that names no code', { data: { message: 'hash check failed' } }],
    ['a body that is not an object', { data: 'hash check failed' }],
    ['a code that is not a string', { data: { code: 7 } }],
    ['an error of its own', new Error('network')],
    ['nothing at all', undefined],
  ])('says nothing about %s', (_, error) => {
    expect(getTelegramAuthError(error)).toBeUndefined();
  });
});
