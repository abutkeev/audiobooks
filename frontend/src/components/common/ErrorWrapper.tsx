import { Alert, Button } from '@mui/material';

export interface ErrorWrapperProps {
  error?: boolean;
}

const ErrorWrapper: React.FC<React.PropsWithChildren<ErrorWrapperProps>> = ({ children, error }) =>
  error ? (
    <Alert
      severity='error'
      variant='outlined'
      action={
        <Button variant='contained' color='primary' onClick={() => document.location.reload()}>
          Reload page
        </Button>
      }
    >
      An error occurred
    </Alert>
  ) : (
    children
  );

export default ErrorWrapper;
