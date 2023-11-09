import { Alert } from '@mui/material';
import { FC } from 'react';

const ErrorAlert: FC<{ error?: string }> = ({ error }) => {
  if (!error) return;

  return (
    <Alert
      severity='error'
      variant='outlined'
      sx={{
        mb: 2,
        '& > :first-letter': {
          textTransform: 'capitalize',
        },
      }}
    >
      {error}
    </Alert>
  );
};

export default ErrorAlert;
