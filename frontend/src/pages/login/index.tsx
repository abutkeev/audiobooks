import { Alert, Button, Container, Paper, Stack, Typography } from '@mui/material';
import useTitle from '../../hooks/useTitle';
import { useState } from 'react';
import LoadingWrapper from '../../components/common/LoadingWrapper';
import PasswordAuthForm from './PasswordAuthForm';
import { webauthnAvailable } from '../../utils/webautn';
import SecurityKeyAuthButton from './SecurityKeyAuthButton';
import { useNavigate } from 'react-router-dom';

export interface CommonAuthProps {
  setLoading(v: boolean): void;
  setError(v?: string): void;
}

const Login: React.FC = () => {
  useTitle('Login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();
  const navigate = useNavigate();

  return (
    <LoadingWrapper loading={loading}>
      <Container maxWidth='sm'>
        <Paper sx={{ p: 2 }}>
          {error && (
            <Alert severity='error' variant='outlined' sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <PasswordAuthForm setLoading={setLoading} setError={setError} />
          <Typography align='center' my={1}>
            or
          </Typography>
          <Stack spacing={1}>
            <Button fullWidth variant='contained' onClick={() => navigate('/sign-up')}>
              Sign up
            </Button>
            {webauthnAvailable && <SecurityKeyAuthButton setLoading={setLoading} setError={setError} />}
          </Stack>
        </Paper>
      </Container>
    </LoadingWrapper>
  );
};

export default Login;
