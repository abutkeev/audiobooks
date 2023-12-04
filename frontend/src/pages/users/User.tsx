import { FormControl, Link, Stack, TextField, Typography } from '@mui/material';
import { UserDto, useUsersRemoveMutation, useUsersUpdateMutation } from '@/api/api';
import CustomPassword from '@/components/common/CustomPassword';
import useAuthData from '@/hooks/useAuthData';
import UserDisableSwitch from './UserDisableSwitch';
import AdminSwitch from './AdminSwitch';
import DeleteButton from '@/components/common/DeleteButton';
import { useState } from 'react';
import useUpdatingState from '@/hooks/useUpdatingState';
import { useAppDispatch } from '@/store';
import { addSnackbar } from '@/store/features/snackbars';
import getErrorMessage from '@/utils/getErrorMessage';
import LoginTextField from '@/components/login-text-field/LoginTextField';
import { useTranslation } from 'react-i18next';
import CustomAccordion from '@/components/common/CustomAccordion';
import UserOnlineIndicator from '@/components/UserOnlineIndicator';

const User: React.FC<UserDto> = ({ id, login, name, enabled, admin, telegram, online }) => {
  const { t } = useTranslation();
  const auth = useAuthData();
  const dispatch = useAppDispatch();
  const [newLogin, setNewLogin] = useUpdatingState(login);
  const [loginValid, setLoginValid] = useState(true);
  const [newName, setNewName] = useUpdatingState(name);
  const [password, setPassword] = useState('');
  const [update] = useUsersUpdateMutation();
  const [remove] = useUsersRemoveMutation();

  const thisUser = auth?.id === id;

  const modified = newLogin !== login || newName !== name || !!password;

  const handleUpdate = async () => {
    try {
      await update({ id, updateUserDto: { login: newLogin, name: newName, password } }).unwrap();
      setPassword('');
    } catch (e) {
      dispatch(addSnackbar({ severity: 'error', text: getErrorMessage(e, t('User edit failed')) }));
    }
  };

  const handleCancel = () => {
    setNewLogin(login);
    setNewName(name);
    setPassword('');
  };

  const handleRemove = async () => {
    try {
      await remove({ id }).unwrap();
    } catch (e) {
      dispatch(addSnackbar({ severity: 'error', text: getErrorMessage(e, t('User remove failed')) }));
    }
  };

  const formatUser = () => `${login} ${name && ` (${name})`}`;

  return (
    <CustomAccordion
      summary={
        <Stack direction='row' flexGrow={1} alignItems='center'>
          <Typography flexGrow={1} noWrap>
            <UserOnlineIndicator online={online} />
            {formatUser()}
          </Typography>
          <UserDisableSwitch id={id} thisUser={thisUser} admin={admin} enabled={enabled} />
          {!thisUser && (
            <DeleteButton
              confirmationTitle={t('Remove user?')}
              confirmationBody={`${t('Remove user')} ${formatUser()}`}
              onConfirm={handleRemove}
            />
          )}
        </Stack>
      }
      details={
        <FormControl fullWidth>
          <Stack spacing={2}>
            <Typography variant='body2'>ID: {id}</Typography>
            {telegram && (
              <Typography variant='body2'>
                Telegram: {telegram.first_name} {telegram.last_name}{' '}
                {telegram.username && (
                  <>
                    (
                    <Link href={`https://t.me/${telegram.username}`} target='_blank'>
                      {telegram.username}
                    </Link>
                    )
                  </>
                )}
              </Typography>
            )}
            <TextField label={t('Name')} value={newName} onChange={({ target: { value } }) => setNewName(value)} />
            <LoginTextField
              login={newLogin}
              setLogin={setNewLogin}
              valid={loginValid}
              setValid={setLoginValid}
              validType='unused'
              allowSelf
              selfLogin={login}
            />
            <CustomPassword label={t('Password')} value={password} onChange={setPassword} />
            <AdminSwitch id={id} thisUser={thisUser} admin={admin} enabled={enabled} />
          </Stack>
        </FormControl>
      }
      modified={modified}
      valid={loginValid}
      handleCancel={handleCancel}
      handleUpdate={handleUpdate}
    />
  );
};

export default User;
