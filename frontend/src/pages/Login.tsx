import { Alert, Button, Container, FormControl, Paper, TextField } from '@mui/material';
import useTitle from '../hooks/useTitle';
import CustomPassword from '../components/common/CustomPassword';
import { useState } from 'react';
import { useAuthLoginMutation } from '../api/api';
import LoadingWrapper from '../components/common/LoadingWrapper';
import { useAppDispatch } from '../store';
import { setAuthToken } from '../store/features/auth';
import { useNavigate, useLocation } from 'react-router-dom';

const Login: React.FC = () => {
  useTitle('Login');
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useAppDispatch();
  const [auth, { isLoading, isError }] = useAuthLoginMutation();

  const handleLogin = async () => {
    const { access_token } = await auth({ loginBodyDto: { login, password } }).unwrap();
    dispatch(setAuthToken(access_token));
    navigate(pathname, { replace: true });
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
          <FormControl fullWidth>
            <TextField
              label='Login'
              value={login}
              onChange={({ target: { value } }) => setLogin(value)}
              required
              error={!login}
            />
            <CustomPassword
              label='Password'
              value={password}
              onChange={({ target: { value } }) => setPassword(value)}
              required
              error={!password}
            />
            <Button
              size='large'
              variant='contained'
              sx={{ mt: 1 }}
              disabled={!login || !password}
              onClick={handleLogin}
            >
              Login
            </Button>
          </FormControl>
        </Paper>
      </Container>
    </LoadingWrapper>
  );
};

export default Login;
