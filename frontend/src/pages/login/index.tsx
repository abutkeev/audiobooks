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
import { useLogWriteMutation, useTgLoginMutation } from '@/api/api';
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
  const [logWrite] = useLogWriteMutation();

  const logTelegramDiagnostic = (stage: string, message: string) => {
    logWrite({ object: { telegramLogin: { stage, message, userAgent: navigator.userAgent } } });
  };

  const handleTelegramAuth: TelegramAuthCallback = async telegramAuthDataDto => {
    if (!telegramAuthDataDto) {
      logTelegramDiagnostic('widget', 'telegram widget returned no auth data');
      setError(t('Telegram login failed'));
      return;
    }
    try {
      const { access_token } = await telegramAuth({ telegramAuthDataDto }).unwrap();
      dispatch(setAuthToken(access_token));
      navigate('/', { replace: true });
    } catch (e) {
      logTelegramDiagnostic('login', getErrorMessage(e, 'telegram login request failed'));
      setError(getErrorMessage(e, 'Telegram login failed'));
    }
  };

  return (
    <LoadingWrapper loading={loading}>
      <Container maxWidth='sm'>
        <Paper sx={{ p: 2 }}>
          <ErrorAlert error={error} />
          <PasswordAuthForm setLoading={setLoading} setError={setError} />
          <Typography align='center' sx={{ my: 1 }}>
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
                onError={reason => logTelegramDiagnostic('widget', reason)}
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
