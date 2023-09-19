import { Alert, Container, Paper } from '@mui/material';
import useTitle from '../../hooks/useTitle';
import { useState } from 'react';
import LoadingWrapper from '../../components/common/LoadingWrapper';
import PasswordAuthForm from './PasswordAuthForm';

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
        </Paper>
      </Container>
    </LoadingWrapper>
  );
};

export default Login;
