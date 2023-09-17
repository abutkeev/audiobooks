import { Alert, Button, Container, Paper, TextField } from '@mui/material';
import useTitle from '../hooks/useTitle';
import CustomPassword from '../components/common/CustomPassword';
import { useState } from 'react';
import { useAuthLoginMutation } from '../api/api';
import LoadingWrapper from '../components/common/LoadingWrapper';
import { useAppDispatch } from '../store';
import { setAuthToken } from '../store/features/auth';

const Login: React.FC = () => {
  useTitle('Login');

  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useAppDispatch();
  const [auth, { isLoading, isError }] = useAuthLoginMutation();

  const handleLogin = async () => {
    const { access_token } = await auth({ loginBodyDto: { login, password } }).unwrap();
    dispatch(setAuthToken(access_token));
  };

  return (
    <LoadingWrapper loading={isLoading}>
      <Container maxWidth='sm'>
        <Paper sx={{ p: 2 }}>
          {isError && (
            <Alert severity='error' variant='outlined' sx={{ mb: 2 }}>
              Authorization failed
            </Alert>
          )}
          <TextField
            fullWidth
            label='Login'
            value={login}
            onChange={({ target: { value } }) => setLogin(value)}
            required
            error={!login}
          />
          <CustomPassword
            fullWidth
            label='Password'
            value={password}
            onChange={({ target: { value } }) => setPassword(value)}
            required
            error={!password}
          />
          <Button
            size='large'
            variant='contained'
            fullWidth
            sx={{ mt: 1 }}
            disabled={!login || !password}
            onClick={handleLogin}
          >
            Login
          </Button>
        </Paper>
      </Container>
    </LoadingWrapper>
  );
};

export default Login;
