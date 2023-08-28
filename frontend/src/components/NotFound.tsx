import { Alert } from '@mui/material';

const NotFound: React.FC = () => (
  <Alert severity='error' sx={{ maxWidth: 'md', mx: 'auto' }}>
    Page not found
  </Alert>
);

export default NotFound;
