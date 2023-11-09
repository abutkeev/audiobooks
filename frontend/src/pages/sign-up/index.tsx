import { FC, useState } from 'react';
import useTitle from '../../hooks/useTitle';
import { Button, Container, FormControl, Paper, Stack, TextField } from '@mui/material';
import CustomPassword from '../../components/common/CustomPassword';
import ProgressButton from '../../components/common/ProgressButton';
import { useSignUpSignUpMutation } from '../../api/api';
import getErrorMessage from '../../utils/getErrorMessage';
import LoginTextField from '../../components/login-text-field/LoginTextField';
import { useAppDispatch } from '../../store';
import { useNavigate } from 'react-router-dom';
import { setAuthToken } from '../../store/features/auth';
import ReCaptcha from './ReCaptcha';
import ErrorAlert from '../../components/common/ErrorAlert';

const SignUp: FC = () => {
  useTitle('Sign up');
  const [login, setLogin] = useState('');
  const [loginValid, setLoginValid] = useState(false);
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [captchaToken, setCaptchaToken] = useState('');
  const [error, setError] = useState<string>();
  const [signUp] = useSignUpSignUpMutation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const valid = loginValid && !!name && !!password && captchaToken;

  const handleSignUp = async () => {
    if (!valid) return;

    setError(undefined);

    const result = await signUp({ signUpDto: { login, password, name, captchaToken } });
    if ('error' in result) {
      setError(getErrorMessage(result.error, 'Sign up failed'));
      return;
    }
    dispatch(setAuthToken(result.data.access_token));
    navigate('/');
  };

  const handleSignUpCancel = () => {
    setLogin('');
    setPassword('');
    setName('');
    setError(undefined);
    setLoginValid(false);
    navigate('/');
  };

  return (
    <Container maxWidth='sm'>
      <Paper sx={{ p: 2 }}>
        <FormControl fullWidth>
          <Stack spacing={2}>
            <ErrorAlert error={error} />{' '}
            <LoginTextField
              login={login}
              setLogin={setLogin}
              valid={loginValid}
              setValid={setLoginValid}
              validType='unused'
            />
            <TextField
              label='Name'
              value={name}
              onChange={({ target: { value } }) => setName(value)}
              required
              error={!name}
            />
            <CustomPassword
              label='Password'
              value={password}
              onChange={({ target: { value } }) => setPassword(value)}
              required
              error={!password}
            />
            <ReCaptcha setToken={setCaptchaToken} />
            <ProgressButton buttonProps={{ fullWidth: true, size: 'large' }} disabled={!valid} onClick={handleSignUp}>
              Sign up
            </ProgressButton>
            <Button fullWidth size='large' variant='contained' onClick={handleSignUpCancel}>
              Cancel
            </Button>
          </Stack>
        </FormControl>
      </Paper>
    </Container>
  );
};

export default SignUp;
