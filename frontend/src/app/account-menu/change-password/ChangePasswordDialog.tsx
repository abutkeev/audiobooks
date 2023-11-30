import { FC, useState } from 'react';
import CustomDialog, { AbortOperation } from '@/components/common/CustomDialog';
import { Stack } from '@mui/material';
import CustomPassword from '@/components/common/CustomPassword';
import { useProfileChangePasswordMutation } from '@/api/api';
import getErrorMessage from '@/utils/getErrorMessage';
import ErrorAlert from '@/components/common/ErrorAlert';
import { useTranslation } from 'react-i18next';

interface ChangePasswordDialogProps {
  open: boolean;
  close(): void;
}

const ChangePasswordDialog: FC<ChangePasswordDialogProps> = ({ open, close }) => {
  const { t } = useTranslation();
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [change] = useProfileChangePasswordMutation();

  const handleChange = async () => {
    setError('');
    try {
      await change({ newPasswordDto: { old_password: oldPassword, new_password: newPassword } }).unwrap();
    } catch (e) {
      setError(getErrorMessage(e, t('Failed to change password')));
      throw new AbortOperation();
    }
  };

  const handleClose = () => {
    setOldPassword('');
    setNewPassword('');
    setError('');
    close();
  };

  const valid = !!oldPassword && !!newPassword;

  return (
    <CustomDialog
      open={open}
      close={handleClose}
      onConfirm={handleChange}
      confirmButtonText={t('Change')}
      confirmButtonProps={{ disabled: !valid }}
      title={t('Change password')}
      content={
        <Stack spacing={2} mt={1}>
          <ErrorAlert error={error} />
          <CustomPassword
            label={t('Old password')}
            required
            error={!oldPassword}
            value={oldPassword}
            onChange={setOldPassword}
          />
          <CustomPassword
            label={t('New password')}
            required
            error={!newPassword}
            value={newPassword}
            onChange={setNewPassword}
          />
        </Stack>
      }
    />
  );
};

export default ChangePasswordDialog;
