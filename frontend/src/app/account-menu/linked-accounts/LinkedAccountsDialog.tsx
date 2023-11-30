import { Paper, Stack, Typography } from '@mui/material';
import CustomDialog from '@/components/common/CustomDialog';
import LoadingWrapper from '@/components/common/LoadingWrapper';
import { Telegram } from '@mui/icons-material';
import TelegramAuthButton, { TelegramAuthCallback } from '@/components/TelegramAuthButton';
import { useTgGetAccountInfoQuery, useTgRemoveAuthDataMutation, useTgSetAuthDataMutation } from '@/api/api';
import ProgressButton from '@/components/common/ProgressButton';
import { useTranslation } from 'react-i18next';

interface LinkedAccountsDialogProps {
  open: boolean;
  close(): void;
}

const LinkedAccountsDialog: React.FC<LinkedAccountsDialogProps> = ({ open, close }) => {
  const { t } = useTranslation();
  const { data: telegramAccount, isLoading, isError, isFetching } = useTgGetAccountInfoQuery();
  const [setTgAuth] = useTgSetAuthDataMutation();
  const [removeTgAuth] = useTgRemoveAuthDataMutation();

  const handleTelegramAuth: TelegramAuthCallback = async telegramAuthDataDto => {
    if (!telegramAuthDataDto) return;
    await setTgAuth({ telegramAuthDataDto });
  };

  const handleTelergamRemove = async () => {
    await removeTgAuth();
  };

  const formatTelegramAccountInfo = () => {
    const { info } = telegramAccount || {};
    const { first_name, last_name, username } = info || {};
    return [first_name, last_name, username && `(${username})`].join(' ');
  };

  if (!open) return null;

  return (
    <CustomDialog
      open={open}
      close={close}
      title={t('Linked accounts')}
      content={
        <LoadingWrapper loading={isLoading} error={isError}>
          <Stack spacing={1}>
            <Paper sx={{ p: 1 }}>
              <Stack direction='row' spacing={1} alignItems='center'>
                <Telegram />
                {telegramAccount?.info ? (
                  <>
                    <Typography flexGrow={1}>{formatTelegramAccountInfo()}</Typography>
                    <TelegramAuthButton onAuth={handleTelegramAuth} refreshing={isFetching}>
                      {t('Refresh')}
                    </TelegramAuthButton>
                    <ProgressButton
                      buttonProps={{ color: 'error' }}
                      refreshing={isFetching}
                      onClick={handleTelergamRemove}
                    >
                      {t('Unlink')}
                    </ProgressButton>
                  </>
                ) : (
                  <>
                    <Typography flexGrow={1}>{t('Not linked')}</Typography>
                    <TelegramAuthButton onAuth={handleTelegramAuth} refreshing={isFetching}>
                      {t('Link')}
                    </TelegramAuthButton>
                  </>
                )}
              </Stack>
            </Paper>
          </Stack>
        </LoadingWrapper>
      }
    />
  );
};

export default LinkedAccountsDialog;
