import { Alert } from '@mui/material';
import useTitle from '../hooks/useTitle';

const NotFound: React.FC = () => {
  useTitle('Page not found');

  return (
    <Alert severity='error' sx={{ maxWidth: 'md', mx: 'auto' }}>
      Page not found
    </Alert>
  );
};

export default NotFound;
