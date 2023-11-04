import { FC, useState } from 'react';
import useTitle from '../../hooks/useTitle';
import { Alert, Container, FormControl, Paper, Stack, TextField } from '@mui/material';
import CustomPassword from '../../components/common/CustomPassword';
import ProgressButton from '../../components/common/ProgressButton';
import { useSignUpSignUpMutation } from '../../api/api';
import getErrorMessage from '../../utils/getErrorMessage';

const SignUp: FC = () => {
  useTitle('Sign up');
  const [login, setLogin] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string>();
  const [signUp] = useSignUpSignUpMutation();

  const valid = !!login && !!name && !!password;

  const handleSignUp = async () => {
    if (!valid) return;

    setError(undefined);

    const result = await signUp({ signUpDto: { login, password, name } });
    if ('error' in result) {
      console.log(result);
      setError(getErrorMessage(result.error, 'Sign up failed'));
    }
  };

  return (
    <Container maxWidth='sm'>
      <Paper sx={{ p: 2 }}>
        <FormControl fullWidth>
          <Stack spacing={2}>
            {error && (
              <Alert severity='error' variant='outlined' sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            <TextField
              autoFocus
              label='Login'
              value={login}
              onChange={({ target: { value } }) => setLogin(value)}
              required
              error={!login}
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
            <ProgressButton fullWidth size='large' variant='contained' disabled={!valid} onClick={handleSignUp}>
              Sign up
            </ProgressButton>
          </Stack>
        </FormControl>
      </Paper>
    </Container>
  );
};

export default SignUp;
