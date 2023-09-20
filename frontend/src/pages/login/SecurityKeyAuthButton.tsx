import { Button } from '@mui/material';
import { CommonAuthProps } from '.';
import { Fingerprint } from '@mui/icons-material';
import { useWebauthnGenerateChallengeMutation, useWebauthnLoginMutation } from '../../api/api';
import { client } from '@passwordless-id/webauthn';
import { useAppDispatch } from '../../store';
import { setAuthToken } from '../../store/features/auth';

const SecurityKeyAuthButton: React.FC<CommonAuthProps> = ({ setLoading, setError }) => {
  const [getChallenge] = useWebauthnGenerateChallengeMutation();
  const [login] = useWebauthnLoginMutation();
  const dispatch = useAppDispatch();

  const handleLogin = async () => {
    setLoading(true);
    setError();
    try {
      const { challenge } = await getChallenge().unwrap();

      const authenticationDto = await client.authenticate([], challenge);

      const { access_token } = await login({ authenticationDto }).unwrap();
      dispatch(setAuthToken(access_token));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Authorization failed');
    }
    setLoading(false);
  };
  return (
    <Button fullWidth variant='contained' startIcon={<Fingerprint />} onClick={handleLogin}>
      Login with security key
    </Button>
  );
};

export default SecurityKeyAuthButton;
