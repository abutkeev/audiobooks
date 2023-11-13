import { useMemo, useState } from 'react';
import { FormControlLabel, Switch, TextField } from '@mui/material';
import CustomDialog from '../../components/common/CustomDialog';
import { useAppDispatch } from '../../store';
import { addSnackbar } from '../../store/features/snackbars';
import { useUsersCreateMutation, useUsersGetAllQuery } from '../../api/api';
import LoadingWrapper from '../../components/common/LoadingWrapper';
import CustomPassword from '../../components/common/CustomPassword';
import { useTranslation } from 'react-i18next';

interface AddUserDialogProps {
  open: boolean;
  close(): void;
}

const AddUserDialog: React.FC<AddUserDialogProps> = ({ open, close }) => {
  const { t } = useTranslation();
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [enabled, setEnabled] = useState(true);
  const [admin, setAdmin] = useState(false);
  const dispatch = useAppDispatch();
  const { data = [], isLoading, isError } = useUsersGetAllQuery();
  const [create] = useUsersCreateMutation();

  const duplicateLogin = useMemo(() => !!data.find(entry => entry.login === login), [data, login]);
  const valid = !duplicateLogin && !!login && !!password;

  const handleCreate = () => {
    try {
      create({ createUserDto: { login, password, name, enabled, admin: admin && enabled } }).unwrap();
    } catch (e) {
      const text = e instanceof Error ? e.message : t(`got unknown error while creating user`);
      dispatch(addSnackbar({ severity: 'error', text }));
    }
  };

  const handleClose = () => {
    close();
    setLogin('');
    setPassword('');
    setName('');
    setEnabled(true);
    setAdmin(false);
  };

  return (
    <CustomDialog
      open={!!open}
      title={t(`Add user`)}
      close={handleClose}
      onConfirm={handleCreate}
      confirmButtonText={t('Create')}
      confirmButtonProps={{ disabled: !valid }}
      content={
        <LoadingWrapper loading={isLoading} error={isError}>
          <TextField
            sx={{ mt: 1 }}
            fullWidth
            required
            label={t('Login')}
            value={login}
            onChange={({ target: { value } }) => setLogin(value)}
            onKeyDown={e => e.stopPropagation()}
            error={!login || duplicateLogin}
            helperText={duplicateLogin ? t('Duplicate login') : undefined}
          />
          <CustomPassword
            sx={{ mt: 1 }}
            fullWidth
            required
            label={t('Password')}
            value={password}
            onChange={setPassword}
            onKeyDown={e => e.stopPropagation()}
            error={!password}
          />
          <TextField
            sx={{ mt: 1 }}
            fullWidth
            label={t('Name')}
            value={name}
            onChange={({ target: { value } }) => setName(value)}
            onKeyDown={e => e.stopPropagation()}
          />
          <FormControlLabel
            control={<Switch checked={enabled} onChange={(_, checked) => setEnabled(checked)} />}
            label={t('Enabled')}
          />
          <FormControlLabel
            disabled={!enabled}
            control={<Switch checked={enabled && admin} onChange={(_, checked) => setAdmin(checked)} />}
            label={t('Admin')}
          />
        </LoadingWrapper>
      }
    />
  );
};

export default AddUserDialog;
