import { Alert } from '@mui/material';
import useTitle from '../hooks/useTitle';
import { useTranslation } from 'react-i18next';

const NotFound: React.FC = () => {
  const { t } = useTranslation();
  useTitle(t('Page not found'));

  return (
    <Alert severity='error' sx={{ maxWidth: 'md', mx: 'auto' }}>
      {t('Page not found')}
    </Alert>
  );
};

export default NotFound;
