import { FC, useState } from 'react';
import CustomDialog, { AbortOperation } from '@/components/common/CustomDialog';
import { Stack, TextField } from '@mui/material';
import { useProfileEditMutation } from '@/api/api';
import getErrorMessage from '@/utils/getErrorMessage';
import ErrorAlert from '@/components/common/ErrorAlert';
import useAuthData from '@/hooks/useAuthData';
import LoginTextField from '@/components/login-text-field/LoginTextField';
import useUpdatingState from '@/hooks/useUpdatingState';
import { useTranslation } from 'react-i18next';

interface ProfileDialogProps {
  open: boolean;
  close(): void;
}

const ProfileDialog: FC<ProfileDialogProps> = ({ open, close }) => {
  const { t } = useTranslation();
  const { login, name } = useAuthData()!;
  const [newLogin, setNewLogin] = useUpdatingState(login);
  const [newName, setNewName] = useUpdatingState(name);
  const [loginValid, setLoginValid] = useState(true);
  const [error, setError] = useState('');
  const [edit] = useProfileEditMutation();

  const handleEdit = async () => {
    setError('');
    try {
      await edit({ profileDto: { login: newLogin, name: newName } }).unwrap();
    } catch (e) {
      setError(getErrorMessage(e, t('Failed to change profile')));
      throw new AbortOperation();
    }
  };

  const handleClose = () => {
    close();
    // reset valuse to default after dialog closed to prevent blinking values
    setTimeout(() => {
      setNewLogin(login);
      setNewName(name);
      setLoginValid(true);
      setError('');
    }, 500);
  };

  const valid = loginValid && !!name;

  return (
    <CustomDialog
      open={open}
      close={handleClose}
      onConfirm={handleEdit}
      confirmButtonText={t('Edit')}
      confirmButtonProps={{ disabled: !valid }}
      title={t('Change profile')}
      content={
        <Stack spacing={2} mt={1}>
          <ErrorAlert error={error} />
          <LoginTextField
            login={newLogin}
            setLogin={setNewLogin}
            valid={loginValid}
            setValid={setLoginValid}
            validType='unused'
            allowSelf
          />
          <TextField
            label={t('Name')}
            required
            error={!newName}
            value={newName}
            onChange={({ target: { value } }) => setNewName(value)}
          />
        </Stack>
      }
    />
  );
};

export default ProfileDialog;
