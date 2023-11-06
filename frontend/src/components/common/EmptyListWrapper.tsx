import React from 'react';
import { Box } from '@mui/material';
import Alert from '@mui/material/Alert';

export interface EmptyListWrapperProps {
  message: React.ReactNode;
  wrap: boolean;
  fullWidth?: boolean;
  action?: React.ReactNode;
}

const EmptyListWrapper: React.FC<React.PropsWithChildren<EmptyListWrapperProps>> = ({
  children,
  wrap,
  message,
  fullWidth,
  action,
}) =>
  wrap ? (
    <Box mt={1} width={fullWidth ? '100%' : undefined}>
      <Alert severity='info' variant='outlined' action={action}>
        {message}
      </Alert>
    </Box>
  ) : (
    <>{children}</>
  );

export default EmptyListWrapper;
