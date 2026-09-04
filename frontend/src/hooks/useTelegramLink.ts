import { useTranslation } from 'react-i18next';
import { useTgSetAuthDataMutation } from '@/api/api';
import { TelegramAuthCallback } from '@/components/TelegramAuthButton';
import { useAppDispatch } from '@/store';
import { addSnackbar } from '@/store/features/snackbars';
import getTelegramAuthError from '@/utils/getTelegramAuthError';

/** Links a telegram account and reports a refusal: the widget itself shows nothing. */
const useTelegramLink = (): TelegramAuthCallback => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const [setTgAuth] = useTgSetAuthDataMutation();

  return async telegramAuthDataDto => {
    if (!telegramAuthDataDto) return;

    try {
      await setTgAuth({ telegramAuthDataDto }).unwrap();
    } catch (e) {
      const text = getTelegramAuthError(e) ?? t('Failed to link the Telegram account');
      dispatch(addSnackbar({ severity: 'error', text }));
    }
  };
};

export default useTelegramLink;
