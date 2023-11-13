import { Alert, Button } from '@mui/material';
import { useRegisterSW } from 'virtual:pwa-register/react';
import { useAppDispatch } from '../store';
import { addSnackbar } from '../store/features/snackbars';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const updatesCheckInterval = 1 * 60 * 1000;

const ReloadPrompt: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const [updating, setUpdating] = useState(false);
  const {
    needRefresh: [updateAvailable],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW: (swUrl, registration) => {
      if (!registration) return;

      setInterval(async () => {
        if (registration.installing || !navigator) return;

        if ('connection' in navigator && !navigator.onLine) return;

        const resp = await fetch(swUrl, {
          cache: 'no-store',
          headers: {
            cache: 'no-store',
            'cache-control': 'no-cache',
          },
        });

        if (resp?.status === 200) {
          await registration.update();
        }
      }, updatesCheckInterval);
    },
    onRegisterError: e => {
      console.error('SW registration error', e);
    },
    onOfflineReady: () => {
      // close updating alert if any
      setUpdating(false);
      dispatch(addSnackbar({ severity: 'success', text: t('App ready to work offline'), timeout: 3000 }));
    },
  });

  const handleUpdateClick = () => {
    setUpdating(true);
    updateServiceWorker(true);
  };

  return (
    updateAvailable &&
    (updating ? (
      <Alert severity='info' variant='outlined' sx={{ my: 1 }}>
        {t('Application is updating')}
      </Alert>
    ) : (
      <Alert
        severity='info'
        variant='outlined'
        sx={{ my: 1 }}
        action={
          <Button variant='contained' color='primary' onClick={handleUpdateClick}>
            {t('Update')}
          </Button>
        }
      >
        {t('New version available, click update button to update app')}
      </Alert>
    ))
  );
};

export default ReloadPrompt;
