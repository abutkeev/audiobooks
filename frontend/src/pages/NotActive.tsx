import { Alert } from '@mui/material';
import useTitle from '../hooks/useTitle';

const NotActive: React.FC = () => {
  useTitle('Account is not active');
  return (
    <Alert severity='info' sx={{ maxWidth: 'md', mx: 'auto' }}>
      Account is not active
    </Alert>
  );
};

export default NotActive;
