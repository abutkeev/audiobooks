import { Alert, Paper } from '@mui/material';
import { useWebauthnGetQuery } from '@/api/api';
import CustomDialog from '@/components/common/CustomDialog';
import LoadingWrapper from '@/components/common/LoadingWrapper';
import AddSecurityKey from './AddSecurityKey';
import SecurityKey from './SecurityKey';
import { useTranslation } from 'react-i18next';

interface SecurityKeysDialogProps {
  open: boolean;
  close(): void;
}

const SecurityKeysDialog: React.FC<SecurityKeysDialogProps> = ({ open, close }) => {
  const { t } = useTranslation();
  const { data = [], isLoading, isError } = useWebauthnGetQuery();

  return (
    <CustomDialog
      open={open}
      close={close}
      title={t('Security keys')}
      content={
        <LoadingWrapper loading={isLoading} error={isError}>
          <Paper sx={{ mb: 1 }}>
            {data.length === 0 ? (
              <Alert severity='info' variant='outlined'>
                {t('No security keys registred')}
              </Alert>
            ) : (
              data.map(({ id, name }) => <SecurityKey key={id} id={id} name={name} />)
            )}
          </Paper>
          <AddSecurityKey />
        </LoadingWrapper>
      }
    />
  );
};

export default SecurityKeysDialog;
