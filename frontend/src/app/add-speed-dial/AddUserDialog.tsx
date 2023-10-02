import { useMemo, useState } from 'react';
import { FormControlLabel, Switch, TextField } from '@mui/material';
import CustomDialog from '../../components/common/CustomDialog';
import { useAppDispatch } from '../../store';
import { addSnackbar } from '../../store/features/snackbars';
import { useUsersCreateMutation, useUsersGetAllQuery } from '../../api/api';
import LoadingWrapper from '../../components/common/LoadingWrapper';
import CustomPassword from '../../components/common/CustomPassword';

interface AddUserDialogProps {
  open: boolean;
  close(): void;
}

const AddUserDialog: React.FC<AddUserDialogProps> = ({ open, close }) => {
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
      const text = e instanceof Error ? e.message : `got unknown error while creating user`;
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
      title={`Add user`}
      close={handleClose}
      onConfirm={handleCreate}
      confirmButtonText='Create'
      confirmButtonProps={{ disabled: !valid }}
      content={
        <LoadingWrapper loading={isLoading} error={isError}>
          <TextField
            sx={{ mt: 1 }}
            fullWidth
            required
            label='Login'
            value={login}
            onChange={({ target: { value } }) => setLogin(value)}
            onKeyDown={e => e.stopPropagation()}
            error={!login || duplicateLogin}
            helperText={duplicateLogin ? 'Duplicate login' : undefined}
          />
          <CustomPassword
            sx={{ mt: 1 }}
            fullWidth
            required
            label='Password'
            value={password}
            onChange={({ target: { value } }) => setPassword(value)}
            onKeyDown={e => e.stopPropagation()}
            error={!password}
          />
          <TextField
            sx={{ mt: 1 }}
            fullWidth
            label='Name'
            value={name}
            onChange={({ target: { value } }) => setName(value)}
            onKeyDown={e => e.stopPropagation()}
          />
          <FormControlLabel
            control={<Switch checked={enabled} onChange={(_, checked) => setEnabled(checked)} />}
            label='Enabled'
          />
          <FormControlLabel
            disabled={!enabled}
            control={<Switch checked={enabled && admin} onChange={(_, checked) => setAdmin(checked)} />}
            label='Admin'
          />
        </LoadingWrapper>
      }
    />
  );
};

export default AddUserDialog;
