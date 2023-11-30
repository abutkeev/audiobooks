import { Alert, Container, Stack } from '@mui/material';
import useTitle from '@/hooks/useTitle';
import { useTgGetAccountInfoQuery, useTgSetAuthDataMutation } from '@/api/api';
import TelegramAuthButton, { TelegramAuthCallback } from '@/components/TelegramAuthButton';
import LoadingWrapper from '@/components/common/LoadingWrapper';
import { Telegram } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

const NotActive: React.FC = () => {
  const { t } = useTranslation();
  useTitle(t('Account is not active'));

  const { data: telegramAccount, isLoading, isError, isFetching } = useTgGetAccountInfoQuery();
  const [setTgAuth] = useTgSetAuthDataMutation();

  const handleTelegramAuth: TelegramAuthCallback = async telegramAuthDataDto => {
    if (!telegramAuthDataDto) return;
    await setTgAuth({ telegramAuthDataDto });
  };
  return (
    <Container maxWidth='sm'>
      <Stack spacing={1}>
        <Alert severity='info'>{t('Account is not active. Contact site administrator to activate it.')}</Alert>
        <LoadingWrapper loading={isLoading} error={isError}>
          {telegramAccount?.info ? (
            <Stack spacing={1}>
              <Alert severity='warning'>
                {t('Automatic activation failed. If you are authorized chat member, please retry.')}
              </Alert>
              <TelegramAuthButton
                onAuth={handleTelegramAuth}
                refreshing={isFetching}
                progressButtonProps={{ buttonProps: { fullWidth: true, startIcon: <Telegram /> } }}
              >
                {t('Retry')}
              </TelegramAuthButton>
            </Stack>
          ) : (
            <Stack spacing={1}>
              <Alert severity='info'>
                {t('Authorized telegram chat members can activate their accounts automatically.')}
              </Alert>
              <TelegramAuthButton
                onAuth={handleTelegramAuth}
                refreshing={isFetching}
                progressButtonProps={{ buttonProps: { fullWidth: true, startIcon: <Telegram /> } }}
              >
                {t('Link telegram account and try to activate')}
              </TelegramAuthButton>
            </Stack>
          )}
        </LoadingWrapper>
      </Stack>
    </Container>
  );
};

export default NotActive;
