import { Button } from '@mui/material';
import { CommonAuthProps } from '.';
import { Fingerprint } from '@mui/icons-material';
import { useWebauthnGenerateChallengeMutation, useWebauthnLoginMutation } from '@/api/api';
import { authenticateSecurityKey } from '@/utils/webautn';
import { useAppDispatch } from '@/store';
import { setAuthToken } from '@/store/features/auth';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const SecurityKeyAuthButton: React.FC<CommonAuthProps> = ({ setLoading, setError }) => {
  const { t } = useTranslation();
  const [getChallenge] = useWebauthnGenerateChallengeMutation();
  const [login] = useWebauthnLoginMutation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogin = async () => {
    setLoading(true);
    setError();
    try {
      const { challenge } = await getChallenge().unwrap();

      const authenticationDto = await authenticateSecurityKey(challenge);

      const { access_token } = await login({ authenticationDto }).unwrap();
      dispatch(setAuthToken(access_token));
      navigate('/', { replace: true });
    } catch (e) {
      setError(e instanceof Error ? e.message : t('Authorization failed'));
    }
    setLoading(false);
  };
  return (
    <Button fullWidth variant='contained' startIcon={<Fingerprint />} onClick={handleLogin}>
      {t('Login with security key')}
    </Button>
  );
};

export default SecurityKeyAuthButton;
