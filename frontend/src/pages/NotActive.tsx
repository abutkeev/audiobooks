import { Alert } from '@mui/material';

const NotActive: React.FC = () => (
  <Alert severity='info' sx={{ maxWidth: 'md', mx: 'auto' }}>
    Account is not active
  </Alert>
);

export default NotActive;
