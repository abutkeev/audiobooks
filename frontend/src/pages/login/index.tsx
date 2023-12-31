import { Button, Container, Paper, Stack, Typography } from '@mui/material';
import useTitle from '@/hooks/useTitle';
import { useState } from 'react';
import LoadingWrapper from '@/components/common/LoadingWrapper';
import PasswordAuthForm from './PasswordAuthForm';
import { webauthnAvailable } from '@/utils/webautn';
import SecurityKeyAuthButton from './SecurityKeyAuthButton';
import { useNavigate } from 'react-router-dom';
import TelegramAuthButton, { TelegramAuthCallback } from '@/components/TelegramAuthButton';
import { Telegram } from '@mui/icons-material';
import { useAppDispatch } from '@/store';
import { useTgLoginMutation } from '@/api/api';
import { setAuthToken } from '@/store/features/auth';
import getErrorMessage from '@/utils/getErrorMessage';
import ErrorAlert from '@/components/common/ErrorAlert';
import { useTranslation } from 'react-i18next';

export interface CommonAuthProps {
  setLoading(v: boolean): void;
  setError(v?: string): void;
}

const Login: React.FC = () => {
  const { t } = useTranslation();
  useTitle(t('Login.title', 'Login'));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [telegramAuth] = useTgLoginMutation();

  const handleTelegramAuth: TelegramAuthCallback = async telegramAuthDataDto => {
    if (!telegramAuthDataDto) return;
    try {
      const { access_token } = await telegramAuth({ telegramAuthDataDto }).unwrap();
      dispatch(setAuthToken(access_token));
    } catch (e) {
      setError(getErrorMessage(e, 'Telegram login failed'));
    }
  };

  return (
    <LoadingWrapper loading={loading}>
      <Container maxWidth='sm'>
        <Paper sx={{ p: 2 }}>
          <ErrorAlert error={error} />
          <PasswordAuthForm setLoading={setLoading} setError={setError} />
          <Typography align='center' my={1}>
            {t('or')}
          </Typography>
          <Stack spacing={1}>
            <Button fullWidth variant='contained' onClick={() => navigate('/sign-up')}>
              {t('Sign up')}
            </Button>
            {webauthnAvailable && <SecurityKeyAuthButton setLoading={setLoading} setError={setError} />}
            {TELEGRAM_BOT_ID && (
              <TelegramAuthButton
                progressButtonProps={{ buttonProps: { fullWidth: true, startIcon: <Telegram /> } }}
                onAuth={handleTelegramAuth}
              >
                {t('Login with telegram')}
              </TelegramAuthButton>
            )}
          </Stack>
        </Paper>
      </Container>
    </LoadingWrapper>
  );
};

export default Login;
