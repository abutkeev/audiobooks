import { t } from 'i18next';

// a map, not an object: the code comes from the response, and a plain object would answer to
// names it inherited. Codes and their meaning: docs/ai/backend/auth.md
const messages = new Map<string, () => string>([
  ['tg_data_expired', () => t('Telegram login data expired, authorize again')],
  ['tg_hash_invalid', () => t('Telegram did not confirm this login')],
  ['tg_account_unknown', () => t('This Telegram account is not linked to any user')],
]);

const getTelegramAuthError = (e: unknown): string | undefined => {
  if (!e || typeof e !== 'object' || !('data' in e)) return undefined;

  const { data } = e;
  if (!data || typeof data !== 'object' || !('code' in data) || typeof data.code !== 'string') return undefined;

  return messages.get(data.code)?.();
};

export default getTelegramAuthError;
