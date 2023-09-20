import { Alert, Container, Paper, Typography } from '@mui/material';
import useTitle from '../../hooks/useTitle';
import { useState } from 'react';
import LoadingWrapper from '../../components/common/LoadingWrapper';
import PasswordAuthForm from './PasswordAuthForm';
import { webauthnAvailable } from '../../utils/webautn';
import SecurityKeyAuthButton from './SecurityKeyAuthButton';

export interface CommonAuthProps {
  setLoading(v: boolean): void;
  setError(v?: string): void;
}

const Login: React.FC = () => {
  useTitle('Login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();

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
          {webauthnAvailable && (
            <>
              <Typography align='center' my={1}>
                or
              </Typography>
              <SecurityKeyAuthButton setLoading={setLoading} setError={setError} />
            </>
          )}
        </Paper>
      </Container>
    </LoadingWrapper>
  );
};

export default Login;
