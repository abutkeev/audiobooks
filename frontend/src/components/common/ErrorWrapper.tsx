import { Alert, Button } from '@mui/material';
import { useTranslation } from 'react-i18next';

export interface ErrorWrapperProps {
  error?: boolean;
}

const ErrorWrapper: React.FC<React.PropsWithChildren<ErrorWrapperProps>> = ({ children, error }) => {
  const { t } = useTranslation();

  if (!error) return children;

  return (
    <Alert
      severity='error'
      variant='outlined'
      action={
        <Button variant='contained' color='primary' onClick={() => document.location.reload()}>
          {t('Reload page')}
        </Button>
      }
    >
      {t('An error occurred')}
    </Alert>
  );
};

export default ErrorWrapper;
